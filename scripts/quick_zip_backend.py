import os
import zipfile
import time

t0 = time.time()
zip_path = os.path.join("backend", "backend-deploy.zip")
backend_dir = "backend"

print(f"Creating {zip_path}...")
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    # Add server.js, package.json
    zf.write(os.path.join(backend_dir, "server.js"), "server.js")
    zf.write(os.path.join(backend_dir, "package.json"), "package.json")
    
    # Add node_modules
    nm_dir = os.path.join(backend_dir, "node_modules")
    for root, dirs, files in os.walk(nm_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, backend_dir)
            zf.write(full_path, rel_path)

size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"[SUCCESS] Zip created in {time.time() - t0:.2f}s, size: {size_mb:.2f} MB")

