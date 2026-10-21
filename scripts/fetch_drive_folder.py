import requests
import json
import os
import sys

KEY = 'AIzaSyAWGrfCCr7albM3lmCc937gx4uIphbpeKQ'

def list_folder(folder_id, path=''):
    url = f"https://www.googleapis.com/drive/v3/files?q='{folder_id}'+in+parents+and+trashed=false&key={KEY}&fields=files(id,name,mimeType,size)&pageSize=1000"
    res = requests.get(url, timeout=15).json()
    files = res.get('files', [])
    items = []
    for f in files:
        name = f['name']
        if name == 'node_modules':
            print(f"Skipping directory: {path}/{name}", flush=True)
            continue
        cur_path = f"{path}/{name}" if path else name
        size = f.get('size', '-')
        print(f"{f['mimeType']:35} {str(size):>10}  {cur_path}  (id: {f['id']})", flush=True)
        item = {
            'id': f['id'],
            'name': name,
            'path': cur_path,
            'mimeType': f['mimeType'],
            'size': size
        }
        if f['mimeType'] == 'application/vnd.google-apps.folder':
            sub_items = list_folder(f['id'], cur_path)
            item['children'] = sub_items
        items.append(item)
    return items

if __name__ == '__main__':
    print("Listing files in Drive folder 'Api' excluding node_modules...", flush=True)
    all_files = list_folder('1TooGHj5zC_RIHERCmQSxb3wdIJL_5Du9')
    with open('scripts/drive_files_filtered.json', 'w', encoding='utf-8') as out:
        json.dump(all_files, out, indent=2)
    print("Done! Saved to scripts/drive_files_filtered.json", flush=True)
