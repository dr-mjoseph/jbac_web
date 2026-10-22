import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js", "main.js"]

for f in chunks:
    path = os.path.join(loc, f)
    with open(path, "rb") as file:
        header = file.read(20)
    print(f"{f:10} header bytes: {list(header[:6])} -> {repr(header[:15])}")
