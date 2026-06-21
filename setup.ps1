# =============================================================================
#  Agora Data Driven — one-shot machine setup (Windows / PowerShell)
#
#  Run this once on any Windows machine after `git clone`:
#      powershell -ExecutionPolicy Bypass -File .\setup.ps1
#
#  It will:
#    1. Install Node.js LTS   (if missing — expect a Windows UAC prompt: click Yes)
#    2. Install the gcloud CLI (if missing)
#    3. Log you into Google Cloud + select the project/region
#    4. Enable the required GCP APIs
#    5. Install project dependencies (npm install  ->  node_modules/)
#
#  NOTE: this is a Node project — there is no Python "venv". The local
#  dependency environment is node_modules/, created by `npm install`.
# =============================================================================

$ErrorActionPreference = 'Stop'

# --- Project config ----------------------------------------------------------
$ProjectId = 'agora-data-driven'
$Account   = 'info@agoradatadriven.com'
$Region    = 'australia-southeast1'
# -----------------------------------------------------------------------------

function Have([string]$cmd) {
  return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Refresh-Path {
  $machine = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
  $user    = [System.Environment]::GetEnvironmentVariable('Path', 'User')
  $env:Path = "$machine;$user"
}

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Green }

# Sanity: run from the repo root
if (-not (Test-Path '.\package.json')) {
  Write-Host "ERROR: run this from the project root (where package.json lives)." -ForegroundColor Red
  exit 1
}

if (-not (Have winget)) {
  Write-Host "ERROR: 'winget' not found. Update Windows / install App Installer from the Microsoft Store, then re-run." -ForegroundColor Red
  exit 1
}

# --- 1. Node.js --------------------------------------------------------------
Step "Checking Node.js"
if (Have node) {
  Write-Host "   Node already installed: $(node -v)"
} else {
  Write-Host "   Installing Node.js LTS (a UAC prompt will appear — click Yes)..."
  winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
  Refresh-Path
  if (-not (Have node)) {
    Write-Host "   Node installed but not on PATH yet. Close and reopen this terminal, then re-run setup.ps1." -ForegroundColor Yellow
    exit 1
  }
  Write-Host "   Installed Node $(node -v)"
}

# --- 2. gcloud CLI -----------------------------------------------------------
Step "Checking Google Cloud SDK"
if (Have gcloud) {
  Write-Host "   gcloud already installed."
} else {
  Write-Host "   Installing Google Cloud SDK..."
  winget install --id Google.CloudSDK -e --accept-source-agreements --accept-package-agreements
  Refresh-Path
  if (-not (Have gcloud)) {
    Write-Host "   gcloud installed but not on PATH yet. Close and reopen this terminal, then re-run setup.ps1." -ForegroundColor Yellow
    exit 1
  }
}

# --- 3. Auth + project -------------------------------------------------------
Step "Logging in to Google Cloud (a browser window will open)"
gcloud auth login $Account
gcloud config set project $ProjectId
gcloud config set run/region $Region

# --- 4. Enable APIs ----------------------------------------------------------
Step "Enabling required GCP APIs"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# --- 5. Project dependencies -------------------------------------------------
Step "Installing project dependencies (npm install)"
npm install

# --- Done --------------------------------------------------------------------
Step "Setup complete"
Write-Host "   Node:   $(node -v)"
Write-Host "   npm:    $(npm -v)"
Write-Host "   gcloud: project=$ProjectId region=$Region"
Write-Host ""
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "   npm run dev      # local dev server at http://localhost:4321"
Write-Host "   npm run deploy   # build remotely + deploy to Cloud Run (live URL)"
