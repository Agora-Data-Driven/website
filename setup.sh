#!/usr/bin/env bash
# =============================================================================
#  Agora Data Driven — one-shot machine setup (macOS / Linux)
#
#  Run this once on any machine after `git clone`:
#      bash ./setup.sh
#
#  It will:
#    1. Install Node.js LTS    (if missing)
#    2. Install the gcloud CLI (if missing)
#    3. Log you into Google Cloud + select the project/region
#    4. Enable the required GCP APIs
#    5. Install project dependencies (npm install -> node_modules/)
#
#  NOTE: this is a Node project — there is no Python "venv". The local
#  dependency environment is node_modules/, created by `npm install`.
# =============================================================================
set -euo pipefail

# --- Project config ----------------------------------------------------------
PROJECT_ID="agora-data-driven"
ACCOUNT="info@agoradatadriven.com"
REGION="australia-southeast1"
# -----------------------------------------------------------------------------

have() { command -v "$1" >/dev/null 2>&1; }
step() { printf '\n==> %s\n' "$1"; }

# Sanity: run from the repo root
if [ ! -f ./package.json ]; then
  echo "ERROR: run this from the project root (where package.json lives)." >&2
  exit 1
fi

# --- 1. Node.js --------------------------------------------------------------
step "Checking Node.js"
if have node; then
  echo "   Node already installed: $(node -v)"
else
  echo "   Node.js not found — installing..."
  if have brew; then
    brew install node
  elif have apt-get; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif have dnf; then
    sudo dnf install -y nodejs
  else
    echo "   Could not auto-install Node. Install Node.js >= 20 from https://nodejs.org and re-run." >&2
    exit 1
  fi
  echo "   Installed Node $(node -v)"
fi

# --- 2. gcloud CLI -----------------------------------------------------------
step "Checking Google Cloud SDK"
if have gcloud; then
  echo "   gcloud already installed."
else
  echo "   gcloud not found — installing..."
  if have brew; then
    brew install --cask google-cloud-sdk
  else
    echo "   Installing via the official script..."
    curl -fsSL https://sdk.cloud.google.com | bash
    # shellcheck disable=SC1090
    exec "$SHELL" -lc "cd '$(pwd)' && bash ./setup.sh"
  fi
fi

# --- 3. Auth + project -------------------------------------------------------
step "Logging in to Google Cloud (a browser window will open)"
gcloud auth login "$ACCOUNT"
gcloud config set project "$PROJECT_ID"
gcloud config set run/region "$REGION"

# --- 4. Enable APIs ----------------------------------------------------------
step "Enabling required GCP APIs"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# --- 5. Project dependencies -------------------------------------------------
step "Installing project dependencies (npm install)"
npm install

# --- Done --------------------------------------------------------------------
step "Setup complete"
echo "   Node:   $(node -v)"
echo "   npm:    $(npm -v)"
echo "   gcloud: project=$PROJECT_ID region=$REGION"
echo ""
echo "Next:"
echo "   npm run dev      # local dev server at http://localhost:4321"
echo "   npm run deploy   # build remotely + deploy to Cloud Run (live URL)"
