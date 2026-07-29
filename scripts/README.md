# scripts/ — repo tooling

> ⚠️ The `*-bypass-mode.*` launchers are **mirrored into this repo from
> [`../agora-devtools`](../../agora-devtools)** by `agora-push` — **never edit a launcher here**;
> your change is silently overwritten on the next mirror refresh. Edit the canonical copy in
> agora-devtools.

| Script                          | What it does                                                                                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup.ps1` / `setup.sh`        | One-time new-machine bootstrap: installs Node/gcloud/gh if missing, browser sign-ins, `npm install`, launches the dev server.                                                                      |
| `startday.ps1` / `startday.sh`  | Daily start: refresh gcloud + GitHub auth, pull latest `main`, install new deps, start the dev server.                                                                                             |
| `push-branch.ps1`               | Commit ALL local work and push it to this machine's own dev branch (so two developers never share a branch).                                                                                       |
| `merge-branches.ps1`            | Integrate the dev branches and land on `main` — for THIS repo landing on main **is the release**: pushing main triggers `.github/workflows/deploy.yml` → Cloud Run. Skips `wip/*` parked branches. |
| `kimi-bypass-mode.ps1` / `.cmd` | Launch Claude Code on Moonshot Kimi via the shared org key (**mirrored** — edit in agora-devtools).                                                                                                |
| `glm-bypass-mode.ps1` / `.cmd`  | Launch Claude Code on Z.ai GLM (**mirrored** — edit in agora-devtools).                                                                                                                            |
