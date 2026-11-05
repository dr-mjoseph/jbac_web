import sys

with open('src/app/jesus/jesus.module.ts', 'r', encoding='utf-8') as f:
    text = f.read()

bad_import = """import { DoctorregisterComponent,
    EntrepreneurregisterComponent,
    InvestorregisterComponent } from './doctorregister/doctorregister.component';
import { EntrepreneurregisterComponent } from './entrepreneurregister/entrepreneurregister.component';
import { InvestorregisterComponent } from './investorregister/investorregister.component';"""

correct_import = """import { DoctorregisterComponent } from './doctorregister/doctorregister.component';
import { EntrepreneurregisterComponent } from './entrepreneurregister/entrepreneurregister.component';
import { InvestorregisterComponent } from './investorregister/investorregister.component';"""

text = text.replace(bad_import, correct_import)

with open('src/app/jesus/jesus.module.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed imports in jesus.module.ts!")
