import subprocess
import sys

def check_propagation():
    print("Checking authoritative .in registry nameservers...")
    cmd = ["nslookup", "-type=NS", "jbac.in", "ns1.registry.in"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout
    print(out)
    if "awsdns" in out.lower():
        print("--> SUCCESS! .in registry has updated delegation to AWS Route 53!")
        return True
    else:
        print("--> Pending: Registry is still delegating to GoDaddy nameservers.")
        return False

if __name__ == "__main__":
    check_propagation()
