import os
import sys
import zipfile
import subprocess
import shutil

app_dir = r"C:\Users\rajes\StudioProjects\jbac_app"
src_build_dir = os.path.join(app_dir, r"www\build")
temp_dir = os.path.join(app_dir, r"build_temp")
os.makedirs(temp_dir, exist_ok=True)

base_apk = os.path.join(app_dir, "jbacApp-0.0.24.apk")
unsigned_apk = os.path.join(temp_dir, "app-unsigned.apk")
aligned_apk = os.path.join(temp_dir, "app-aligned.apk")
final_apk = os.path.join(app_dir, "jbacApp-0.0.24.apk")

zipalign_exe = r"C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign.exe"
apksigner_jar = r"C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\lib\apksigner.jar"
keystore = os.path.join(app_dir, "Jbac.keystore")

print("=== Step 1: Reading original APK and replacing updated web assets ===")

# Map of updated files
replacement_files = {}
for root, dirs, files in os.walk(src_build_dir):
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, src_build_dir).replace("\\", "/")
        archive_path = f"assets/www/build/{rel_path}"
        with open(full_path, "rb") as fp:
            replacement_files[archive_path] = fp.read()

print(f"Loaded {len(replacement_files)} replacement files from www/build.")

# Backup original APK if not already backed up
backup_apk = os.path.join(temp_dir, "jbacApp-0.0.24.original.apk")
if not os.path.exists(backup_apk):
    shutil.copyfile(base_apk, backup_apk)
    print("Created backup of original APK at:", backup_apk)

with zipfile.ZipFile(backup_apk, "r") as zin:
    with zipfile.ZipFile(unsigned_apk, "w") as zout:
        seen = set()
        for item in zin.infolist():
            name = item.filename
            # Skip old signature files
            if name.startswith("META-INF/") and (name.endswith(".SF") or name.endswith(".RSA") or name.endswith(".MF") or name.endswith(".DSA")):
                continue
            
            seen.add(name)
            if name in replacement_files:
                # Write updated file
                zout.writestr(item, replacement_files[name], compress_type=zipfile.ZIP_DEFLATED)
                print(f"Updated in APK: {name}")
            else:
                # Copy original file preserving compression type
                data = zin.read(name)
                zout.writestr(item, data, compress_type=item.compress_type)

        # Add any new files that were not in the original APK
        for name, data in replacement_files.items():
            if name not in seen:
                zout.writestr(name, data, compress_type=zipfile.ZIP_DEFLATED)
                print(f"Added NEW file to APK: {name}")

print("Unsigned APK written successfully to:", unsigned_apk)

print("=== Step 2: Running zipalign ===")
align_cmd = [zipalign_exe, "-f", "-p", "4", unsigned_apk, aligned_apk]
res = subprocess.run(align_cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Zipalign error:", res.stderr, res.stdout)
    sys.exit(1)
print("Zipalign completed successfully.")

# Verify alignment
check_cmd = [zipalign_exe, "-c", "4", aligned_apk]
check_res = subprocess.run(check_cmd, capture_output=True, text=True)
if check_res.returncode == 0:
    print("Verification: APK is 4-byte aligned!")
else:
    print("Verification warning:", check_res.stderr)

print("=== Step 3: Signing APK with apksigner ===")
sign_cmd = [
    "java", "-jar", apksigner_jar, "sign",
    "--ks", keystore,
    "--ks-pass", "pass:123456",
    "--ks-key-alias", "jbac",
    "--key-pass", "pass:123456",
    "--out", final_apk,
    aligned_apk
]
sign_res = subprocess.run(sign_cmd, capture_output=True, text=True)
print(sign_res.stdout)
if sign_res.returncode != 0:
    print("Apksigner error:", sign_res.stderr)
    sys.exit(1)
print("Apksigner sign completed successfully.")

print("=== Step 4: Verifying signature ===")
verify_cmd = ["java", "-jar", apksigner_jar, "verify", "-v", final_apk]
verify_res = subprocess.run(verify_cmd, capture_output=True, text=True)
lines = [l for l in verify_res.stdout.splitlines() if "Verif" in l or "Number" in l]
print("\n".join(lines))

if "Verifies" in verify_res.stdout and "Verified using v1 scheme (JAR signing): true" in verify_res.stdout:
    stat = os.stat(final_apk)
    print(f"\nSUCCESS! Updated APK ready at:\n{final_apk} ({stat.st_size:,} bytes)")
else:
    print("Failed signature verification!")
    sys.exit(1)
