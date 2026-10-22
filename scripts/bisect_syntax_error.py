import subprocess
import os

with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", "r", encoding="utf-8") as f:
    content = f.read()

# We want to find the exact character range causing the error.
# Let's write a script that tests parsing prefixes of content
test_js_path = r"C:\Users\rajes\Documents\jbac_web\scripts\temp_test.js"

# Find which module inside 18.js causes it
# 18.js is webpackJsonp([18], { ... })
# Let's inspect the keys inside webpackJsonp
prefix = "var webpackJsonp = function(a, b) { WScript.Echo('keys: ' + Object.keys(b).length); };\n"
with open(test_js_path, "w", encoding="utf-8") as f:
    f.write(prefix + content)

res = subprocess.run(["cscript", "//nologo", test_js_path], capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
