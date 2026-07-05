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
    [switch]$Resume
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
