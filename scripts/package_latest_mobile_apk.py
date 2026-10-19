import os
import sys
import zipfile
import subprocess
import shutil

app_dir = r"C:\Users\rajes\StudioProjects\jbac_app"
src_build_dir = os.path.join(app_dir, r"www\build")
temp_dir = os.path.join(app_dir, r"build_temp")
os.makedirs(temp_dir, exist_ok=True)

base_apk = os.path.join(app_dir, "jbacApp-0.0.32.apk")
unsigned_apk = os.path.join(temp_dir, "app-unsigned.apk")
aligned_apk = os.path.join(temp_dir, "app-aligned.apk")
final_apk = os.path.join(app_dir, "jbacApp-0.0.33.apk")

zipalign_exe = r"C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign.exe"
apksigner_jar = r"C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\lib\apksigner.jar"
keystore = os.path.join(app_dir, "Jbac.keystore")

print("=== Step 1: Loading updated assets from www/build ===")
replacement_files = {}
for root, dirs, files in os.walk(src_build_dir):
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, src_build_dir).replace("\\", "/")
        archive_path = f"assets/www/build/{rel_path}"
        with open(full_path, "rb") as fp:
            replacement_files[archive_path] = fp.read()

print(f"Loaded {len(replacement_files)} files from {src_build_dir}")

print(f"=== Step 2: Injecting into base APK {os.path.basename(base_apk)} ===")
if os.path.exists(unsigned_apk):
    os.remove(unsigned_apk)

with zipfile.ZipFile(base_apk, "r") as zin:
    with zipfile.ZipFile(unsigned_apk, "w") as zout:
        seen = set()
        for item in zin.infolist():
            name = item.filename
            # Skip old signature files
            if name.startswith("META-INF/") and (name.endswith(".SF") or name.endswith(".RSA") or name.endswith(".MF") or name.endswith(".DSA")):
                continue
            
            seen.add(name)
            if name in replacement_files:
                zout.writestr(item, replacement_files[name], compress_type=zipfile.ZIP_DEFLATED)
                print(f"  Updated in APK: {name}")
            else:
                data = zin.read(name)
                zout.writestr(item, data, compress_type=item.compress_type)

        for name, data in replacement_files.items():
            if name not in seen:
                zout.writestr(name, data, compress_type=zipfile.ZIP_DEFLATED)
                print(f"  Added NEW to APK: {name}")

print(f"Unsigned APK created: {unsigned_apk}")

print("=== Step 3: Zipalign APK ===")
if os.path.exists(aligned_apk):
    os.remove(aligned_apk)

align_cmd = [zipalign_exe, "-f", "-p", "4", unsigned_apk, aligned_apk]
res = subprocess.run(align_cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Zipalign error:", res.stderr, res.stdout)
    sys.exit(1)
print("Zipalign completed successfully.")

print("=== Step 4: Signing APK with official Jbac.keystore ===")
if os.path.exists(final_apk):
    os.remove(final_apk)

sign_cmd = [
    "java", "-jar", apksigner_jar, "sign",
    "--ks", keystore,
    "--ks-pass", "pass:123456",
    "--ks-key-alias", "jbac",
    "--key-pass", "pass:123456",
    "--v1-signing-enabled", "true",
    "--v2-signing-enabled", "true",
    "--out", final_apk,
    aligned_apk
]
sign_res = subprocess.run(sign_cmd, capture_output=True, text=True)
if sign_res.returncode != 0:
    print("Apksigner error:", sign_res.stderr)
    sys.exit(1)
print("Signed successfully.")

print("=== Step 5: Verifying signed APK ===")
verify_cmd = ["java", "-jar", apksigner_jar, "verify", "-v", final_apk]
verify_res = subprocess.run(verify_cmd, capture_output=True, text=True)
lines = [l for l in verify_res.stdout.splitlines() if "Verif" in l or "Number" in l]
print("\n".join(lines))

if "Verifies" in verify_res.stdout:
    stat = os.stat(final_apk)
    print(f"\nSUCCESS! New official APK ready at:\n{final_apk} ({stat.st_size:,} bytes)")
else:
    print("Signature verification failed!")
    sys.exit(1)
