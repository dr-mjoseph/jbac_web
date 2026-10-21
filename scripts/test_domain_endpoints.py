import urllib.request
import ssl

ctx = ssl.create_default_context()

mobile_user_agents = [
    ('iPhone Safari', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'),
    ('Android Chrome', 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36')
]

endpoints = [
    'https://jbac.in/admin',
    'https://www.jbac.in/admin',
    'https://www.jbac.in/public.html',
    'https://jbac.in/public.html',
    'https://jbac.in/',
    'https://www.jbac.in/'
]

for device, ua in mobile_user_agents:
    print(f"\n==========================================")
    print(f"Testing on {device}")
    print(f"==========================================")
    for url in endpoints:
        req = urllib.request.Request(url, headers={'User-Agent': ua})
        try:
            res = urllib.request.urlopen(req, context=ctx, timeout=12)
            content = res.read().decode('utf-8', errors='ignore')
            has_auth = 'adminAuthOverlay' in content
            title = ''
            if '<title>' in content:
                title = content.split('<title>')[1].split('</title>')[0]
            print(f"[{res.status}] {url}")
            print(f"      Title: {title[:50]} | Length: {len(content):,} bytes | Admin Auth Overlay: {has_auth}")
        except Exception as e:
            print(f"[FAIL] {url} -> {e}")

print("\nDomain & Mobile Endpoint Verification Completed!")
