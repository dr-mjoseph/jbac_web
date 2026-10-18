import zipfile
import os
import shutil

zip_path = 'backend/backend-deploy.zip'
new_server_js = 'backend/server.js'
temp_zip = 'backend/backend-deploy-temp.zip'

print(f"Updating {zip_path} with {new_server_js}...")

with zipfile.ZipFile(zip_path, 'r') as zin:
    with zipfile.ZipFile(temp_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            if item.filename != 'server.js':
                zout.writestr(item, zin.read(item.filename))
        zout.write(new_server_js, 'server.js')

os.replace(temp_zip, zip_path)
print("Updated backend-deploy.zip successfully! Size:", os.path.getsize(zip_path))
