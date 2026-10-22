$node = "C:\Users\rajes\AppData\Local\OpenAI\Codex\runtimes\cua_node\a708e72b10c27b59\bin\node.exe"
if (Test-Path $node) {
    Write-Host "Node found at $node"
    & $node -v
} else {
    Write-Host "Node not found at $node"
}
