import subprocess

test_js = r"C:\Users\rajes\Documents\jbac_web\scripts\test_str_newline.js"

# 1. With raw newline
with open(test_js, "w", encoding="utf-8") as f:
    f.write("var str = 'hello\nworld';\nWScript.Echo('str with raw newline: ' + str);")

res1 = subprocess.run(["cscript", "//nologo", test_js], capture_output=True, text=True)
print("With raw newline -> Stderr:", res1.stderr.strip(), "| ReturnCode:", res1.returncode)

# 2. With escaped \n
with open(test_js, "w", encoding="utf-8") as f:
    f.write(r"var str = 'hello\nworld';\nWScript.Echo('str with escaped \n: ' + str);")

res2 = subprocess.run(["cscript", "//nologo", test_js], capture_output=True, text=True)
print("With escaped \\n -> Stdout:", res2.stdout.strip(), "| ReturnCode:", res2.returncode)
