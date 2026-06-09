param(
    [string]$SshHost = "124.221.107.126",
    [string]$SshUser = "ubuntu",
    [string]$SshKeyFile = "C:\home\work_space\myself\miniapp\miniapp-backend\tmp\ssh-user\miniapp-prod-db-ed25519",
    [string]$KnownHostsFile = "C:\home\work_space\myself\miniapp\miniapp-backend\tmp\ssh\known_hosts",
    [string]$RemoteRoot = "/data/cekaitech-admin",
    [string]$RemoteStage = "/tmp/cekaitech-admin-dist",
    [string]$ProductionApiBaseUrl = "https://api.cekaitech.cn",
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$distDir = Join-Path $repoRoot "dist"
$archivePath = Join-Path ([System.IO.Path]::GetTempPath()) ("cekaitech-admin-dist-{0}.tar.gz" -f (Get-Date -Format "yyyyMMdd-HHmmss"))
$sshTarget = "$SshUser@$SshHost"
$sshOptions = @(
    "-i", $SshKeyFile,
    "-o", "UserKnownHostsFile=$KnownHostsFile",
    "-o", "StrictHostKeyChecking=accept-new"
)

Write-Host "[admin-deploy] repo: $repoRoot"
Write-Host ("[admin-deploy] target: {0}:{1}" -f $sshTarget, $RemoteRoot)
Write-Host "[admin-deploy] stage: $RemoteStage"
Write-Host "[admin-deploy] api: $ProductionApiBaseUrl"

if (-not $SkipBuild) {
    Push-Location $repoRoot
    try {
        $previousApiBaseUrl = $env:VITE_API_BASE_URL
        $env:VITE_API_BASE_URL = $ProductionApiBaseUrl
        npm.cmd run build
    } finally {
        if ($null -eq $previousApiBaseUrl) {
            Remove-Item Env:\VITE_API_BASE_URL -ErrorAction SilentlyContinue
        } else {
            $env:VITE_API_BASE_URL = $previousApiBaseUrl
        }
        Pop-Location
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $distDir "index.html"))) {
    throw "dist/index.html not found. Run npm.cmd run build first."
}

if (-not $SkipBuild) {
    $apiBaseFound = Select-String -Path (Join-Path $distDir "assets\*.js") -Pattern $ProductionApiBaseUrl -SimpleMatch -Quiet
    if (-not $apiBaseFound) {
        throw "Production API base URL was not found in built assets: $ProductionApiBaseUrl"
    }
}

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}

Push-Location $distDir
try {
    & tar.exe -czf $archivePath .
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to package dist files."
    }
} finally {
    Pop-Location
}

if ($DryRun) {
    Write-Host "[admin-deploy] archive: $archivePath"
    Write-Host "[admin-deploy] dry-run only; build and archive were checked but files were not uploaded."
    exit 0
}

& ssh.exe @sshOptions $sshTarget "rm -rf '$RemoteStage' && mkdir -p '$RemoteStage' '$RemoteRoot'"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to prepare remote staging directory."
}

& scp.exe @sshOptions $archivePath "$sshTarget`:$RemoteStage/dist.tar.gz"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to upload dist archive."
}

& ssh.exe @sshOptions $sshTarget "tar -xzf '$RemoteStage/dist.tar.gz' -C '$RemoteStage' && rm -f '$RemoteStage/dist.tar.gz' && if [ -d '$RemoteRoot' ]; then rm -rf '$RemoteStage.previous' && mkdir -p '$RemoteStage.previous' && rsync -a --delete --exclude='.previous/' '$RemoteRoot/' '$RemoteStage.previous/'; fi && rsync -a --delete --exclude='.previous/' '$RemoteStage/' '$RemoteRoot/' && if [ -d '$RemoteStage.previous' ]; then rm -rf '$RemoteRoot/.previous' && mkdir -p '$RemoteRoot/.previous' && rsync -a --delete '$RemoteStage.previous/' '$RemoteRoot/.previous/'; fi && find '$RemoteRoot' -maxdepth 2 -type f | sed 's#^#[admin-deploy] deployed #' | head -20"
if ($LASTEXITCODE -ne 0) {
    throw "Failed to sync staged files to remote root."
}

Remove-Item -LiteralPath $archivePath -Force
Write-Host "[admin-deploy] done."
