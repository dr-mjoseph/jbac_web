import sys

file_path = r'C:\Users\rajes\StudioProjects\jbac_app\src\providers\service\service.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

if 'getBusinessTypes' not in text:
    idx = text.rfind('}')
    methods = """
  // Entrepreneur & Investor API methods
  getBusinessTypes() {
    return this.http.post(this.testApi + 'business-types', {});
  }

  registerEntrepreneur(data: any) {
    return this.http.post(this.testApi + 'entrepreneur-register', data);
  }

  registerInvestor(data: any) {
    return this.http.post(this.testApi + 'investor-register', data);
  }
}
"""
    text = text[:idx] + methods + text[idx+1:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully patched mobile service.ts!")

