"""Python 3 standard library. Anonymous JSON extraction, explicitly controlled test."""
import json
import urllib.request

request = urllib.request.Request(
    "https://attractor-observatory-demo.vercel.app/api/v2/agent-tools/extract_json",
    data=json.dumps({"text": 'Result: {"count":3}'}).encode(),
    headers={"Content-Type": "application/json", "X-Attractor-Test": "controlled"},
    method="POST",
)
with urllib.request.urlopen(request, timeout=15) as response:
    print(json.loads(response.read())["result"]["value"])
