import json
import subprocess
import sys

HOSTED_ZONE_ID = "Z04439382BRRO1T3Y6B16"
CF_DOMAIN = "d2wtiz94oy03oy.cloudfront.net."
CF_ZONE_ID = "Z2FDTNDATAQYW2" # Fixed AWS HostedZoneId for all CloudFront distributions

changes = [
    # 1. Apex jbac.in A & AAAA Alias to CloudFront
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "jbac.in.",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": CF_ZONE_ID,
                "DNSName": CF_DOMAIN,
                "EvaluateTargetHealth": False
            }
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "jbac.in.",
            "Type": "AAAA",
            "AliasTarget": {
                "HostedZoneId": CF_ZONE_ID,
                "DNSName": CF_DOMAIN,
                "EvaluateTargetHealth": False
            }
        }
    },
    # 2. www.jbac.in A & AAAA Alias to CloudFront
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "www.jbac.in.",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": CF_ZONE_ID,
                "DNSName": CF_DOMAIN,
                "EvaluateTargetHealth": False
            }
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "www.jbac.in.",
            "Type": "AAAA",
            "AliasTarget": {
                "HostedZoneId": CF_ZONE_ID,
                "DNSName": CF_DOMAIN,
                "EvaluateTargetHealth": False
            }
        }
    },
    # 3. Subdomain save-jbac-contact
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "save-jbac-contact.jbac.in.",
            "Type": "A",
            "TTL": 600,
            "ResourceRecords": [{"Value": "165.232.181.150"}]
        }
    },
    # 4. ACM Certificate DNS Validations
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "_74c3f6934e813bdd0d3a9afcfed54fd3.jbac.in.",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [{"Value": "_1808a492f2fb9f88d0cebf7de9fba31b.wzccmgtwzk.acm-validations.aws."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "_79650f0814a2011e612d8061cedaf2b8.www.jbac.in.",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [{"Value": "_8d2e2e81669348215b1b80ecfa436ec0.wzccmgtwzk.acm-validations.aws."}]
        }
    },
    # 5. Microsoft 365 / Office CNAMEs
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "autodiscover.jbac.in.",
            "Type": "CNAME",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "autodiscover.outlook.com."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "email.jbac.in.",
            "Type": "CNAME",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "email.secureserver.net."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "lyncdiscover.jbac.in.",
            "Type": "CNAME",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "webdir.online.lync.com."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "msoid.jbac.in.",
            "Type": "CNAME",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "clientconfig.microsoftonline-p.net."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "sip.jbac.in.",
            "Type": "CNAME",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "sipdir.online.lync.com."}]
        }
    },
    # 6. Email MX Record
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "jbac.in.",
            "Type": "MX",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "0 jbac-in.mail.protection.outlook.com."}]
        }
    },
    # 7. TXT Records (MS verification + SPF)
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "jbac.in.",
            "Type": "TXT",
            "TTL": 3600,
            "ResourceRecords": [
                {"Value": "\"MS=ms30563901\""},
                {"Value": "\"v=spf1 include:secureserver.net -all\""}
            ]
        }
    },
    # 8. SRV Records
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "_sip._tls.jbac.in.",
            "Type": "SRV",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "100 1 443 sipdir.online.lync.com."}]
        }
    },
    {
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "_sipfederationtls._tcp.jbac.in.",
            "Type": "SRV",
            "TTL": 3600,
            "ResourceRecords": [{"Value": "100 1 5061 sipfed.online.lync.com."}]
        }
    }
]

batch = {
    "Comment": "Initial import of all active jbac.in DNS records into Route 53",
    "Changes": changes
}

batch_path = "route53_change_batch.json"
with open(batch_path, "w") as f:
    json.dump(batch, f, indent=2)

cmd = [
    "aws", "route53", "change-resource-record-sets",
    "--hosted-zone-id", HOSTED_ZONE_ID,
    "--change-batch", f"file://{batch_path}",
    "--output", "json"
]

print("Applying DNS record batch to Route 53...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Error:", res.stderr)
    sys.exit(1)
print("SUCCESS!")
print(res.stdout)
