import subprocess
import shutil
import os

s3_bucket = "jbac-web-production-298363284024"
cf_dist_id = "EOBBU8SU7H3BI"
region = "ap-southeast-2"

# 1. Copy public.html
print("[Step 1] Copying public.html to dist/churchwebsite...")
shutil.copyfile("public.html", "dist/churchwebsite/public.html")
os.makedirs("dist/churchwebsite/assets", exist_ok=True)
shutil.copyfile("public.html", "dist/churchwebsite/assets/public.html")

# 2. Sync to S3
print(f"[Step 2] Syncing dist/churchwebsite to s3://{s3_bucket}...")
cmd_sync = [
    "aws", "s3", "sync", "dist/churchwebsite", f"s3://{s3_bucket}",
    "--delete",
    "--cache-control", "public, max-age=31536000, immutable",
    "--exclude", "index.html",
    "--exclude", "public.html",
    "--region", region
]
res1 = subprocess.run(cmd_sync, capture_output=True, text=True)
print("Sync output:", res1.stdout[:300])

# Upload index.html and public.html with no-cache
for html_file in ["index.html", "public.html"]:
    cmd_cp = [
        "aws", "s3", "cp", f"dist/churchwebsite/{html_file}", f"s3://{s3_bucket}/{html_file}",
        "--cache-control", "no-cache, no-store, must-revalidate",
        "--content-type", "text/html",
        "--region", region
    ]
    subprocess.run(cmd_cp, capture_output=True, text=True)

print("[Step 3] Invalidating CloudFront cache...")
cmd_inv = [
    "aws", "cloudfront", "create-invalidation",
    "--distribution-id", cf_dist_id,
    "--paths", "/*"
]
res_inv = subprocess.run(cmd_inv, capture_output=True, text=True)
print("CloudFront Invalidation:", res_inv.stdout[:200])
print("[SUCCESS] All web frontend files deployed!")

