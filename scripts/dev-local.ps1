$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$CondaEnv = if ($env:CONDA_ENV) { $env:CONDA_ENV } else { "task-flow" }
$BackendPort = if ($env:BACKEND_PORT) { $env:BACKEND_PORT } else { "8000" }
$FrontendPort = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { "3000" }

function Require-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Host "Missing required command: $Name"
    exit 1
  }
}

Require-Command docker
Require-Command conda
Require-Command node
Require-Command npm

$envExists = conda env list | Select-String -Pattern "^\s*$CondaEnv\s"
if (-not $envExists) {
  Write-Host "Creating conda environment '$CondaEnv'..."
  conda env create -f environment.yml
} else {
  Write-Host "Conda environment '$CondaEnv' already exists."
}

Write-Host "Installing backend dependencies..."
conda run -n $CondaEnv pip install -e ./backend

if (-not (Test-Path frontend/node_modules)) {
  Write-Host "Installing frontend dependencies..."
  Push-Location frontend
  npm install
  Pop-Location
} else {
  Write-Host "Frontend dependencies already installed."
}

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
}

Write-Host "Starting PostgreSQL (Docker)..."
docker compose up db -d

Write-Host "Waiting for database..."
do {
  Start-Sleep -Seconds 1
  docker compose exec -T db pg_isready -U taskflow -d taskflow 2>$null
  $ready = $LASTEXITCODE -eq 0
} while (-not $ready)

Write-Host "Running migrations..."
Push-Location backend
conda run -n $CondaEnv alembic upgrade head
Pop-Location

Write-Host "Starting backend on http://localhost:${BackendPort} ..."
$backendJob = Start-Job {
  param($Root, $CondaEnv, $BackendPort)
  Set-Location "$Root\backend"
  conda run -n $CondaEnv uvicorn app.main:app --reload --host 0.0.0.0 --port $BackendPort
} -ArgumentList $Root, $CondaEnv, $BackendPort

Write-Host "Starting frontend on http://localhost:${FrontendPort} ..."
$frontendJob = Start-Job {
  param($Root, $FrontendPort)
  Set-Location "$Root\frontend"
  npm run dev -- --port $FrontendPort
} -ArgumentList $Root, $FrontendPort

Write-Host ""
Write-Host "TaskFlow is running locally."
Write-Host "  Frontend:  http://localhost:${FrontendPort}"
Write-Host "  API docs:  http://localhost:${BackendPort}/docs"
Write-Host "Press Ctrl+C to stop backend and frontend."
Write-Host ""

try {
  while ($true) {
    if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
      Receive-Job $backendJob, $frontendJob
      throw "A local service failed."
    }
    Start-Sleep -Seconds 2
  }
}
finally {
  Write-Host ""
  Write-Host "Stopping local services..."
  Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
  Remove-Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
  Write-Host "Done. Database container is still running (docker compose stop db to stop it)."
}
