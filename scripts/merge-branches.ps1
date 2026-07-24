# =============================================================================
# merge-branches.ps1 -- integrate the per-developer branches and LAND them on main.
#                       For THIS repo, landing on main is the whole release: pushing
#                       main triggers .github/workflows/deploy.yml, which builds the
#                       container and deploys to Cloud Run automatically. So this
#                       script does NOT run gcloud -- it integrates, BUILD-GATES
#                       (because a bad push auto-deploys), lands, and lets CI ship.
#
# == AGENT RUNBOOK (drop this file into Claude Code and ask to "merge + deploy") =======
#   1. Run it:   .\scripts\merge-branches.ps1   (or -DryRun first to preview)
#   2. On a MERGE CONFLICT it LEAVES the conflict in the tree and STOPS. Resolve each
#      file semantically (preserve BOTH devs' intent), then:
#          git add -A; git commit --no-edit
#          .\scripts\merge-branches.ps1 -Resume
#   3. On a GATE failure (leftover conflict markers or a broken `npm run build`): fix it
#      on the integrated tree, commit, and re-run with -Resume. NEVER land a red tree --
#      it would auto-deploy.
#   4. On success it has landed integration/merge onto main and pushed. GitHub Actions
#      then deploys. Tell the developer to watch it:  gh run watch   (or the Actions tab).
#
# FLAGS:
#   -DryRun        integrate + gate locally, print the plan, change nothing on origin.
#   -NoPush        integrate + gate, then STOP before landing (review-first).
#   -SkipBuild     skip the `npm run build` gate (faster; use only if you just built).
#   -Exclude a,b   skip specific dev branches (comma-separated).
#   -Resume        continue an integration after resolving a conflict/gate failure.
#   -DeleteMerged  standalone: ONLY prune remote branches already contained in main.
#   -AllowReverts  bypass the SECONDARY reversion net only (after confirming a mass deletion is
#                  intentional). It does NOT bypass the staleness gate -- sync the branch instead.
#
# GUARDS (fail-safe, never silent):
#   * STALENESS (PRIMARY, hard gate, no bypass) -- a dev branch that does NOT contain origin/main was
#                  built on old main and could revert newer work. This is an EXACT ancestry fact, so it
#                  is the load-bearing guard: the run STOPS before integrating any such branch. The fix
#                  is always to sync the branch onto origin/main (push-branch.ps1 auto-merges it in) --
#                  there is deliberately no flag to force a stale branch through.
#   * REVERSION (SECONDARY net, -AllowReverts) -- catches the one case staleness can't see: main WAS
#                  merged in, but newer work got discarded during manual conflict resolution. If the
#                  integrated tree deletes files present on main or is heavily net-negative, the land
#                  STOPS unless -AllowReverts confirms the removal is intentional.
#
# USAGE
#   .\scripts\merge-branches.ps1                # integrate -> gate -> land -> CI deploys
#   .\scripts\merge-branches.ps1 -DryRun        # preview, change nothing
#   .\scripts\merge-branches.ps1 -NoPush        # integrate + gate, stop for review
# =============================================================================

param(
    [string]$Exclude = "",
    [switch]$DeleteMerged,
    [switch]$NoPush,
    [switch]$SkipBuild,
    [switch]$DryRun,
    [switch]$Resume,
    [switch]$AllowReverts   # bypass the SECONDARY reversion net only (deletes files on main / large
                            # net-negative). Does NOT bypass the staleness gate -- sync the branch instead.
)

$ErrorActionPreference = "Continue"
function Die([string]$m) { Write-Host "[ERROR] $m" -ForegroundColor Red; exit 1 }
function Must([string]$w) { if ($LASTEXITCODE -ne 0) { Die "$w (exit $LASTEXITCODE)" } }

$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path   # scripts/ -> repo root
Set-Location $repo

$origBranch = (git rev-parse --abbrev-ref HEAD 2>$null)

# A merge left in progress from a previous conflict run: don't silently stomp it.
git rev-parse -q --verify MERGE_HEAD *>$null
if ($LASTEXITCODE -eq 0 -and -not $Resume) {
    Die "a merge is in progress (unresolved conflict). Resolve it then 'git add -A; git commit --no-edit' and re-run with -Resume, or 'git merge --abort' to discard it."
}
if ($DryRun -and -not [string]::IsNullOrWhiteSpace((git status --porcelain))) {
    Die "-DryRun needs a clean working tree (it won't commit your changes). Commit/stash first, or run without -DryRun (the live flow commits your WIP to your dev branch automatically)."
}

# ---- SANITY GATE: reject a tree that would break the auto-deploy. ------------
# 1. leftover conflict markers in changed files; 2. `npm run build` succeeds.
function Invoke-SanityGate {
    param([string[]]$Changed, [string]$RepoRoot, [bool]$DoBuild)
    $ok = $true
    $present = $Changed | Where-Object { $_ -and (Test-Path (Join-Path $RepoRoot $_)) }

    $conflicted = @()
    foreach ($rel in $present) {
        if (Select-String -Path (Join-Path $RepoRoot $rel) -Pattern '^(<{7}|>{7}) ' -List -ErrorAction SilentlyContinue) { $conflicted += $rel }
    }
    if ($conflicted.Count -gt 0) {
        Write-Host "    [FAIL] leftover merge-conflict markers in:" -ForegroundColor Red
        $conflicted | ForEach-Object { Write-Host "           $_" -ForegroundColor Red }
        $ok = $false
    }

    if ($DoBuild) {
        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
            Write-Host "    [warn] npm not on PATH -- skipping the build gate (run scripts\setup.ps1)" -ForegroundColor Yellow
        } else {
            if (-not (Test-Path (Join-Path $RepoRoot 'node_modules'))) { Write-Host "    [..] node_modules missing -- npm ci first" -ForegroundColor Yellow; npm ci }
            Write-Host "    [..] npm run build (gate -- a bad main auto-deploys)" -ForegroundColor Cyan
            npm run build
            if ($LASTEXITCODE -ne 0) { Write-Host "    [FAIL] npm run build failed -- do NOT land." -ForegroundColor Red; $ok = $false }
        }
    }
    return $ok
}

# ---- REVERSION NET (SECONDARY): does the integrated tree REMOVE work that's on origin/main? ------
# The staleness gate below makes it impossible to integrate a branch that doesn't contain origin/main,
# so the classic stale-revert can't reach here. This is the backstop for what ancestry CAN'T see: main
# WAS merged in, but newer work got discarded during manual conflict resolution. It's a heuristic
# (files deleted vs main + a large net-negative delta), so unlike the staleness gate it CAN false-
# positive on an intentional big cleanup -- hence the -AllowReverts escape.
function Test-ReversionRisk([string]$mainRef, [string]$intgRef) {
    $deleted = @(git diff --diff-filter=D --name-only $mainRef $intgRef |
        ForEach-Object { $_.Trim() } | Where-Object { $_ })
    $short = (git diff --shortstat $mainRef $intgRef 2>$null)
    $ins = 0; $del = 0
    if ($short -match '(\d+) insertion')  { $ins = [int]$Matches[1] }
    if ($short -match '(\d+) deletion')   { $del = [int]$Matches[1] }
    return [pscustomobject]@{ Deleted = $deleted; Insertions = $ins; Deletions = $del; NetRemoved = ($del - $ins) }
}

function Get-MergedDevBranches([string[]]$Skip) {
    git branch -r --merged origin/main --format='%(refname:short)' |
        Where-Object { $_ -and $_ -ne 'origin/HEAD' -and $_ -ne 'origin' -and $_ -notlike '*->*' } |
        ForEach-Object { ($_ -replace '^origin/', '').Trim() } |
        Where-Object { $_ -and ($Skip -notcontains $_) -and ($_ -notlike 'integration/*') }
}
function Remove-RemoteBranches([string[]]$Branches) {
    foreach ($b in $Branches) {
        git -c http.version=HTTP/1.1 push origin --delete $b 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) { Write-Host "    deleted origin/$b" -ForegroundColor Yellow }
        else { Write-Host "    [warn] could not delete origin/$b (already gone?)" -ForegroundColor Yellow }
    }
}
function Sync-LocalMain {
    Write-Host "[..] Aligning local main with origin/main" -ForegroundColor Cyan
    git -c http.version=HTTP/1.1 fetch origin *>$null
    git switch main 2>$null
    if ($LASTEXITCODE -ne 0) { Write-Host "    [warn] could not switch to local main -- skipping" -ForegroundColor Yellow; return }
    git merge --ff-only origin/main 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "[OK] local main aligned ($(git rev-parse --short HEAD))" -ForegroundColor Green }
    else { Write-Host "    [warn] local main diverged -- NOT fast-forwarding (resolve manually)" -ForegroundColor Yellow }
}

$skip = @("main", "HEAD") + (($Exclude -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ })

# ---- -DeleteMerged: standalone prune -----------------------------------------
if ($DeleteMerged) {
    git -c http.version=HTTP/1.1 fetch origin --prune; Must "git fetch"
    $m = @(Get-MergedDevBranches $skip)
    if (-not $m) { Write-Host "    (nothing fully merged into main to delete)" -ForegroundColor Yellow; exit 0 }
    Remove-RemoteBranches $m
    Write-Host "[OK] pruned: $($m -join ', ')" -ForegroundColor Green
    exit 0
}

# ---- 0. Commit + push local WIP to your dev branch first (skipped under -DryRun) ----
if ($DryRun) {
    if (-not [string]::IsNullOrWhiteSpace((git status --porcelain))) { Write-Host "[dry-run] you have uncommitted changes; commit/push them to see them in the plan." -ForegroundColor Yellow }
} elseif (-not [string]::IsNullOrWhiteSpace((git status --porcelain))) {
    Write-Host "[..] Local changes -- committing + pushing them to your branch first" -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot "push-branch.ps1"); Must "push-branch"
}

# ---- 1-3. Build the integration branch and merge each dev branch -------------
$intg = "integration/merge"
if ($Resume) {
    $cur = "$(git rev-parse --abbrev-ref HEAD 2>$null)".Trim()
    if ($cur -ne $intg) { Die "-Resume expects to be on '$intg' but HEAD is '$cur'. Re-run WITHOUT -Resume for a fresh integration." }
    if (-not [string]::IsNullOrWhiteSpace((git status --porcelain))) { Die "-Resume needs a clean tree. Finish the resolution: git add -A; git commit --no-edit" }
    git -c http.version=HTTP/1.1 fetch origin --prune; Must "git fetch"
    $baseMain = "$(git merge-base origin/main $intg 2>$null)".Trim()
    if (-not $baseMain) { Die "could not find the base of $intg -- re-run WITHOUT -Resume." }
} else {
    git -c http.version=HTTP/1.1 fetch origin --prune; Must "git fetch"
    $baseMain = "$(git rev-parse origin/main)".Trim(); Must "resolve origin/main"
}

$branches = git branch -r --format='%(refname:short)' |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ -like 'origin/*' } |
    ForEach-Object { $_ -replace '^origin/', '' } |
    Where-Object { $_ -and ($skip -notcontains $_) -and ($_ -notlike 'integration/*') -and ($_ -ne 'HEAD') }

if (-not $branches) {
    Write-Host "[OK] no dev branches to merge -- origin/main is already current." -ForegroundColor Green
    Sync-LocalMain; exit 0
}
Write-Host "[OK] branches to integrate: $($branches -join ', ')"

# ---- PRIMARY GATE: staleness (each branch MUST contain origin/main) ---------
# The load-bearing guard. A dev branch that does not contain origin/main was built on an OLD main;
# integrating it can silently revert newer work. This is an EXACT ancestry fact (not the heuristic the
# reversion net uses), so a clean branch here means a stale revert is structurally impossible -- not
# merely unlikely. The fix is ALWAYS to sync the branch onto origin/main (push-branch.ps1 auto-merges
# it in), so there is deliberately no bypass flag. Skipped on -Resume (the prior run already gated).
if (-not $Resume) {
    $stale = @()
    foreach ($b in $branches) {
        git merge-base --is-ancestor origin/main "origin/$b" 2>$null
        if ($LASTEXITCODE -ne 0) {
            $bBehind = "$(git rev-list --count origin/$b..origin/main 2>$null)".Trim()
            $stale += [pscustomobject]@{ Branch = $b; Behind = $bBehind }
        }
    }
    if ($stale.Count -gt 0) {
        Write-Host "[STALENESS GATE] these branches do NOT contain origin/main (built on stale main):" -ForegroundColor Red
        $stale | ForEach-Object { Write-Host "      origin/$($_.Branch) -- $($_.Behind) commit(s) behind origin/main" -ForegroundColor Yellow }
        Write-Host "    Landing them could revert newer work already on main. Sync each stale branch FIRST:" -ForegroundColor Yellow
        Write-Host "      git switch <branch>; git merge --no-edit origin/main   (or just re-run its push-branch.ps1)" -ForegroundColor Yellow
        Write-Host "      resolve any conflicts keeping BOTH sides, push, then re-run this script." -ForegroundColor Yellow
        Die "staleness gate tripped -- NOT integrating a stale branch. Syncing is the fix; there is no bypass."
    }
    Write-Host "[OK] staleness gate passed -- every branch contains origin/main." -ForegroundColor Green
}

if (-not $Resume) { Write-Host "[..] Creating $intg off origin/main" -ForegroundColor Cyan; git switch -C $intg origin/main; Must "create $intg" }

$merged = @()
foreach ($b in $branches) {
    git merge-base --is-ancestor "origin/$b" HEAD 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "    [skip] $b already integrated" -ForegroundColor DarkGray; $merged += $b; continue }
    Write-Host "[..] Merging $b" -ForegroundColor Cyan
    git merge --no-ff -m "Merge $b into $intg" "origin/$b"
    if ($LASTEXITCODE -ne 0) {
        if ($DryRun) {
            git merge --abort *>$null
            Write-Host "[dry-run] $b conflicts with the integration -- can't preview past it." -ForegroundColor Yellow
            if ($origBranch -and $origBranch -ne 'HEAD' -and $origBranch -ne $intg) { git switch $origBranch *>$null } else { git switch main *>$null }
            git branch -D $intg *>$null; exit 1
        }
        $unmerged = @(git diff --name-only --diff-filter=U | ForEach-Object { $_.Trim() } | Where-Object { $_ })
        Write-Host "`n[CONFLICT] $b does not merge cleanly -- left in the tree for you to resolve." -ForegroundColor Red
        $unmerged | ForEach-Object { Write-Host "      $_" -ForegroundColor Yellow }
        Write-Host "  AGENT: resolve each file (preserve BOTH devs' intent), then:" -ForegroundColor Yellow
        Write-Host "         git add -A; git commit --no-edit" -ForegroundColor Yellow
        Write-Host "         .\scripts\merge-branches.ps1 -Resume" -ForegroundColor Yellow
        exit 1
    }
    $merged += $b
}
Write-Host "[OK] all branches integrated: $($merged -join ', ')" -ForegroundColor Green

# ---- 4. gate --------------------------------------------------------------
$changed = git diff --name-only $baseMain $intg | ForEach-Object { $_.Trim() } | Where-Object { $_ }
Write-Host "[..] Sanity gate (conflict markers$(if (-not $SkipBuild) { ' + npm run build' }))" -ForegroundColor Cyan
if (-not (Invoke-SanityGate -Changed $changed -RepoRoot $repo -DoBuild (-not $SkipBuild))) {
    Die "sanity gate FAILED -- do NOT land (a bad main auto-deploys). Fix on $intg, then re-run with -Resume."
}
Write-Host "[OK] sanity gate passed" -ForegroundColor Green

# ---- 4b. reversion net (secondary backstop) -------------------------------
# The staleness gate already blocks stale branches, so this catches only what ancestry can't see:
# main merged in, then newer work discarded while resolving a conflict. Heuristic -> can false-
# positive on an intentional big cleanup, so -AllowReverts is the escape.
Write-Host "[..] Reversion net (did manual conflict resolution discard newer work?)" -ForegroundColor Cyan
$rev = Test-ReversionRisk origin/main $intg
$NET_REMOVE_LIMIT = 300
if (($rev.Deleted.Count -gt 0 -or $rev.NetRemoved -ge $NET_REMOVE_LIMIT) -and -not $AllowReverts) {
    Write-Host "[REVERSION GUARD] the integrated tree removes work that exists on origin/main:" -ForegroundColor Red
    if ($rev.Deleted.Count -gt 0) {
        Write-Host "    deletes $($rev.Deleted.Count) file(s) present on main:" -ForegroundColor Red
        $rev.Deleted | Select-Object -First 25 | ForEach-Object { Write-Host "      $_" -ForegroundColor Yellow }
        if ($rev.Deleted.Count -gt 25) { Write-Host "      ... and $($rev.Deleted.Count - 25) more" -ForegroundColor Yellow }
    }
    Write-Host "    net lines: +$($rev.Insertions) / -$($rev.Deletions)  (net $($rev.NetRemoved) removed)" -ForegroundColor Red
    Write-Host "    If a conflict resolution dropped newer work: redo it keeping BOTH sides, then re-run with -Resume." -ForegroundColor Yellow
    Write-Host "    If the removal is genuinely intended: re-run with -AllowReverts." -ForegroundColor Yellow
    Die "reversion net tripped -- NOT landing."
}
Write-Host "[OK] reversion net passed (+$($rev.Insertions) / -$($rev.Deletions))" -ForegroundColor Green

# ---- -NoPush / -DryRun: stop here -----------------------------------------
if ($NoPush -or $DryRun) {
    $tag = if ($DryRun) { "[dry-run]" } else { "[no-push]" }
    Write-Host "`n$tag $intg is clean + gated. NOT landed." -ForegroundColor Green
    Write-Host "$tag would LAND:   git switch main; git merge --ff-only $intg; git -c http.version=HTTP/1.1 push origin main"
    Write-Host "$tag would DEPLOY: automatically via GitHub Actions (deploy.yml) once main is pushed."
    if ($DryRun) {
        if ($origBranch -and $origBranch -ne 'HEAD' -and $origBranch -ne $intg) { git switch $origBranch *>$null } else { git switch main *>$null }
        git branch -D $intg *>$null
    }
    exit 0
}

# ---- 5. LAND (this triggers the auto-deploy) ------------------------------
Write-Host "[..] Landing $intg into main" -ForegroundColor Cyan
git switch main;                 Must "switch to main"
git merge --ff-only origin/main; Must "sync local main to origin/main"
git merge --ff-only $intg;       Must "fast-forward main to $intg"
git -c http.version=HTTP/1.1 push origin main; Must "push origin main"
Write-Host "[OK] landed -- main is now $(git rev-parse --short HEAD)" -ForegroundColor Green
Write-Host "[OK] GitHub Actions (deploy.yml) will now build + deploy to Cloud Run." -ForegroundColor Green
if (Get-Command gh -ErrorAction SilentlyContinue) { Write-Host "     Watch it:  gh run watch   (or the repo's Actions tab)" -ForegroundColor DarkGray }

# ---- 6. prune merged dev branches -----------------------------------------
git -c http.version=HTTP/1.1 fetch origin --prune *>$null
$m = @(Get-MergedDevBranches $skip)
if ($m.Count -gt 0) { Write-Host "[..] Pruning merged dev branches: $($m -join ', ')" -ForegroundColor Cyan; Remove-RemoteBranches $m }

Write-Host "`n[OK] DONE -- integrated, landed on main; CI is deploying." -ForegroundColor Green
