import json
import subprocess
import sys
import time

CERT_ARN = "arn:aws:acm:us-east-1:298363284024:certificate/afc4eb7f-c265-4fd1-b33d-a80692c82db9"
BUCKET_NAME = "jbac-web-production-298363284024"
REGION = "ap-southeast-2"
ORIGIN_DOMAIN = f"{BUCKET_NAME}.s3-website-{REGION}.amazonaws.com"

def get_cert_status():
    cmd = [
        "aws", "acm", "describe-certificate",
        "--certificate-arn", CERT_ARN,
        "--region", "us-east-1",
        "--output", "json"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error describing certificate:", res.stderr)
        return None
    data = json.loads(res.stdout)
    return data["Certificate"]["Status"]

def create_cloudfront_distribution():
    print(f"Creating CloudFront distribution for {ORIGIN_DOMAIN} with custom SSL certificate...")
    cf_config = {
        "CallerReference": f"cf-jbac-custom-{int(time.time())}",
        "Aliases": {
            "Quantity": 2,
            "Items": ["jbac.in", "www.jbac.in"]
        },
        "DefaultRootObject": "index.html",
        "Origins": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": f"S3-{BUCKET_NAME}",
                    "DomainName": ORIGIN_DOMAIN,
                    "OriginPath": "",
                    "CustomHeaders": {"Quantity": 0},
                    "CustomOriginConfig": {
                        "HTTPPort": 80,
                        "HTTPSPort": 443,
                        "OriginProtocolPolicy": "http-only",
                        "OriginSslProtocols": {
                            "Quantity": 3,
                            "Items": ["TLSv1", "TLSv1.1", "TLSv1.2"]
                        },
                        "OriginReadTimeout": 30,
                        "OriginKeepaliveTimeout": 5
                    }
                }
            ]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": f"S3-{BUCKET_NAME}",
            "ViewerProtocolPolicy": "redirect-to-https",
            "AllowedMethods": {
                "Quantity": 3,
                "Items": ["GET", "HEAD", "OPTIONS"],
                "CachedMethods": {
                    "Quantity": 2,
                    "Items": ["GET", "HEAD"]
                }
            },
            "ForwardedValues": {
                "QueryString": False,
                "Cookies": {"Forward": "none"},
                "Headers": {"Quantity": 0},
                "QueryStringCacheKeys": {"Quantity": 0}
            },
            "TrustedSigners": {
                "Enabled": False,
                "Quantity": 0
            },
            "MinTTL": 0,
            "DefaultTTL": 86400,
            "MaxTTL": 31536000,
            "Compress": True,
            "SmoothStreaming": False
        },
        "CacheBehaviors": {"Quantity": 0},
        "CustomErrorResponses": {
            "Quantity": 2,
            "Items": [
                {
                    "ErrorCode": 403,
                    "ResponsePagePath": "/index.html",
                    "ResponseCode": "200",
                    "ErrorCachingMinTTL": 10
                },
                {
                    "ErrorCode": 404,
                    "ResponsePagePath": "/index.html",
                    "ResponseCode": "200",
                    "ErrorCachingMinTTL": 10
                }
            ]
        },
        "Comment": "Direct CloudFront CDN for jbac.in",
        "PriceClass": "PriceClass_All",
        "Enabled": True,
        "ViewerCertificate": {
            "ACMCertificateArn": CERT_ARN,
            "SSLSupportMethod": "sni-only",
            "MinimumProtocolVersion": "TLSv1.2_2021"
        },
        "Restrictions": {
            "GeoRestriction": {
                "RestrictionType": "none",
                "Quantity": 0
            }
        }
    }

    config_json_path = "cf_distribution_config.json"
    with open(config_json_path, "w") as f:
        json.dump(cf_config, f, indent=2)

    cmd = [
        "aws", "cloudfront", "create-distribution",
        "--distribution-config", f"file://{config_json_path}",
        "--output", "json"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error creating CloudFront distribution:", res.stderr)
        return None
    data = json.loads(res.stdout)
    dist_id = data["Distribution"]["Id"]
    dist_domain = data["Distribution"]["DomainName"]
    print(f"SUCCESS! CloudFront Distribution ID: {dist_id}")
    print(f"CloudFront Domain: {dist_domain}")
    return dist_domain

if __name__ == "__main__":
    status = get_cert_status()
    print("Current ACM Certificate Status:", status)
    if status == "ISSUED":
        create_cloudfront_distribution()
    else:
        print("Waiting for DNS validation records to be added in GoDaddy DNS.")
