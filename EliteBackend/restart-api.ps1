# Stops whatever is on port 5193, then starts the API in the foreground.
# Usage:  .\restart-api.ps1
# Hot-reload:  .\restart-api.ps1 -Watch

param([switch]$Watch)

$port  = 5193
$owner = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue).OwningProcess |
         Select-Object -First 1

if ($owner) {
    $name = (Get-Process -Id $owner -ErrorAction SilentlyContinue).ProcessName
    Write-Host "Stopping PID $owner ($name) on :$port ..." -ForegroundColor Yellow
    Stop-Process -Id $owner -Force
    Start-Sleep -Milliseconds 600   # wait for OS to release the socket
}

Set-Location $PSScriptRoot
if ($Watch) {
    dotnet watch run --project EliteFit.Api
} else {
    dotnet run --project EliteFit.Api
}
