with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\29.js", "r", encoding="utf-8") as f:
    c = f.read()

print("29.js length:", len(c))
idx = c.find("gotopage")
print("gotopage in 29.js:")
print(c[idx:idx+800])
