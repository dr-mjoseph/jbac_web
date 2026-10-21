import zipfile
import os
import shutil

src_zip = 'backend/backend-deploy.zip'
tmp_zip = 'backend/backend-deploy-new.zip'

files_to_update = {
    'server.js': 'backend/server.js',
    'public.html': 'public.html',
    'admin_db.html': 'backend/admin_db.html',
    'package.json': 'backend/package.json'
}

print(f"Reading existing archive {src_zip}...")
with zipfile.ZipFile(src_zip, 'r') as zin:
    with zipfile.ZipFile(tmp_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            if item.filename not in files_to_update:
                zout.writestr(item, zin.read(item.filename))
        
        for arcname, localpath in files_to_update.items():
            if os.path.exists(localpath):
                print(f"Adding updated {arcname} from {localpath} ({os.path.getsize(localpath)} bytes)...")
                zout.write(localpath, arcname)

shutil.move(tmp_zip, src_zip)
print(f"Successfully updated {src_zip}! New size: {os.path.getsize(src_zip):,} bytes")
