import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
for f in os.listdir(loc):
    if f.endswith(".js"):
        p = os.path.join(loc, f)
        with open(p, "rb") as file:
            b = file.read()
        if b.startswith(b"\xef\xbb\xbf"):
            b = b[3:]
            with open(p, "wb") as file:
                file.write(b)
            print(f"Stripped BOM from {f}")
print("BOM check and strip complete!")
