import sys

# 1. Patch src/app/jesus/jesus.module.ts
with open('src/app/jesus/jesus.module.ts', 'r', encoding='utf-8') as f:
    jm_text = f.read()

if 'EntrepreneurregisterComponent' not in jm_text:
    import_anchor = "import { DoctorregisterComponent } from './doctorregister/doctorregister.component';"
    new_imports = """import { DoctorregisterComponent } from './doctorregister/doctorregister.component';
import { EntrepreneurregisterComponent } from './entrepreneurregister/entrepreneurregister.component';
import { InvestorregisterComponent } from './investorregister/investorregister.component';"""
    jm_text = jm_text.replace(import_anchor, new_imports)

    decl_anchor = "DoctorregisterComponent"
    new_decls = """DoctorregisterComponent,
    EntrepreneurregisterComponent,
    InvestorregisterComponent"""
    jm_text = jm_text.replace(decl_anchor, new_decls)

    with open('src/app/jesus/jesus.module.ts', 'w', encoding='utf-8') as f:
        f.write(jm_text)
    print("Updated jesus.module.ts with Entrepreneur & Investor components!")

# 2. Patch src/app/app-routing.module.ts
with open('src/app/app-routing.module.ts', 'r', encoding='utf-8') as f:
    rt_text = f.read()

if 'EntrepreneurregisterComponent' not in rt_text:
    rt_import_anchor = "import { DoctorregisterComponent } from './jesus/doctorregister/doctorregister.component';"
    new_rt_imports = """import { DoctorregisterComponent } from './jesus/doctorregister/doctorregister.component';
import { EntrepreneurregisterComponent } from './jesus/entrepreneurregister/entrepreneurregister.component';
import { InvestorregisterComponent } from './jesus/investorregister/investorregister.component';"""
    rt_text = rt_text.replace(rt_import_anchor, new_rt_imports)

    route_anchor = "{ path: 'doctor-register', component: DoctorregisterComponent },"
    new_routes = """{ path: 'doctor-register', component: DoctorregisterComponent },
  { path: 'entrepreneurregister', component: EntrepreneurregisterComponent },
  { path: 'entrepreneur', component: EntrepreneurregisterComponent },
  { path: 'investorregister', component: InvestorregisterComponent },
  { path: 'investor', component: InvestorregisterComponent },"""
    rt_text = rt_text.replace(route_anchor, new_routes)

    with open('src/app/app-routing.module.ts', 'w', encoding='utf-8') as f:
        f.write(rt_text)
    print("Updated app-routing.module.ts with routes!")
