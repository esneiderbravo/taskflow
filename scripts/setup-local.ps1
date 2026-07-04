$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker is required for the database. Install it from https://docs.docker.com/get-docker/"
  exit 1
}

if (-not (Get-Command conda -ErrorAction SilentlyContinue)) {
  Write-Host "Miniconda is required. Install it from https://www.anaconda.com/download/success"
  exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is required for the frontend. Install it from https://nodejs.org/"
  exit 1
}

$envExists = conda env list | Select-String -Pattern "^\s*task-flow\s"
if (-not $envExists) {
  conda env create -f environment.yml
} else {
  Write-Host "Conda environment 'task-flow' already exists."
}

conda run -n task-flow pip install -e ./backend

Set-Location frontend
npm install
Set-Location $Root

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
}

Write-Host ""
Write-Host "Local setup complete."
Write-Host "Next: make dev   (or .\scripts\dev-local.ps1 on Windows without Make)"
