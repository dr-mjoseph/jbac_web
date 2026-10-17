$env:PATH = "C:\Users\rajes\AppData\Local\OpenAI\Codex\runtimes\cua_node\cfb32733c877621e\bin;" + $env:PATH
Set-Location -Path "c:\Users\rajes\Documents\jbac_web"
node node_modules/@angular/cli/bin/ng build --configuration production --no-progress
