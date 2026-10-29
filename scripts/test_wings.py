import urllib.request
import json

url = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getwing"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=5) as resp:
    data = json.loads(resp.read().decode())
    print("Items count:", len(data.get("data", [])))
    for item in data.get("data", []):
        print(item)

