import zipfile
import os

zip_path = 'backend/backend-deploy.zip'
backup_path = 'backend/backend-deploy.zip.bak'

if not os.path.exists(backup_path) and os.path.exists(zip_path):
    import shutil
    shutil.copyfile(zip_path, backup_path)
    print("Created backup of backend-deploy.zip")

# We want to replace server.js and public.html inside backend-deploy.zip
temp_zip = 'backend/backend-deploy-new.zip'

with zipfile.ZipFile(zip_path, 'r') as zin, zipfile.ZipFile(temp_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename == 'server.js':
            print("Writing updated server.js...")
            with open('backend/server.js', 'rb') as f:
                zout.writestr(item, f.read())
        elif item.filename == 'public.html':
            print("Writing updated public.html...")
            with open('backend/public.html', 'rb') as f:
                zout.writestr(item, f.read())
        else:
            zout.writestr(item, zin.read(item.filename))

os.replace(temp_zip, zip_path)
print("Successfully updated backend/backend-deploy.zip with new server.js and public.html!")

