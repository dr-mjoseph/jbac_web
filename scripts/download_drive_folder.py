import os
import time
import requests

KEY = 'AIzaSyAWGrfCCr7albM3lmCc937gx4uIphbpeKQ'
TARGET_DIR = r'c:\Users\rajes\Documents\jbac_web\Api'

session = requests.Session()
adapter = requests.adapters.HTTPAdapter(max_retries=5)
session.mount('https://', adapter)

def download_file(file_id, dest_path):
    url = f'https://www.googleapis.com/drive/v3/files/{file_id}?alt=media&key={KEY}'
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    for attempt in range(5):
        try:
            r = session.get(url, timeout=60)
            if r.status_code == 200:
                with open(dest_path, 'wb') as f:
                    f.write(r.content)
                print(f"  [DOWNLOADED] {dest_path} ({len(r.content)} bytes)", flush=True)
                return True
            else:
                print(f"  [ERROR] {dest_path}: status {r.status_code} ({r.text[:100]})", flush=True)
        except Exception as e:
            print(f"  [RETRY {attempt+1}] {dest_path}: {e}", flush=True)
            time.sleep(2)
    return False

def sync_folder(folder_id, local_dir):
    os.makedirs(local_dir, exist_ok=True)
    url = f"https://www.googleapis.com/drive/v3/files?q='{folder_id}'+in+parents+and+trashed=false&key={KEY}&fields=files(id,name,mimeType,size)&pageSize=1000"
    
    for attempt in range(5):
        try:
            res = session.get(url, timeout=60).json()
            break
        except Exception as e:
            print(f"Failed to list folder {folder_id} (attempt {attempt+1}): {e}", flush=True)
            time.sleep(3)
    else:
        print(f"Could not list folder {folder_id}", flush=True)
        return

    files = res.get('files', [])
    for f in files:
        name = f['name']
        if name == 'node_modules':
            print(f"Skipping node_modules in {local_dir}", flush=True)
            continue
        dest_path = os.path.join(local_dir, name)
        if f['mimeType'] == 'application/vnd.google-apps.folder':
            print(f"[FOLDER] {dest_path}", flush=True)
            sync_folder(f['id'], dest_path)
        else:
            print(f"[FILE] {dest_path} (size: {f.get('size', '-')})", flush=True)
            download_file(f['id'], dest_path)

if __name__ == '__main__':
    print(f"Starting download from Drive folder 'Api' to {TARGET_DIR}...", flush=True)
    sync_folder('1TooGHj5zC_RIHERCmQSxb3wdIJL_5Du9', TARGET_DIR)
    print("Download completed successfully!", flush=True)
