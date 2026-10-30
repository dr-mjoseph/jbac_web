with open('src/app/jesus/signup/signup.component.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'mobile_number' in line or 'formControlName="number"' in line or 'phonenumber' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print context
        for j in range(max(0, i-2), min(len(lines), i+4)):
            print(f"  {j+1}: {lines[j].rstrip()}")
        print("---")

