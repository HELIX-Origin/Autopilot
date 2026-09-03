$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetJs = Join-Path $ScriptDir "..\lib\cli.js"
if (-not (Test-Path $TargetJs)) {
    $TargetJs = "D:\\Projects\\_repositories\\GitHub\\HELIX Origin\\Autopilot\\lib\\cli.js"
}
if (Get-Command node -ErrorAction SilentlyContinue) {
    & node $TargetJs $args
} else {
    & "C:\\nvm4w\\nodejs\\node.exe" $TargetJs $args
}
