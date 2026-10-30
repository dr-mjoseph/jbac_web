import os

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

# 1. addbusiness
f_ab = os.path.join(base, "addbusiness", "addbusiness.component.ts")
with open(f_ab, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
'''  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {''',
'''  getconstency(event: any) {
    var id = event.target.value;
    this.addingbusiness.patchValue({ constituencyname: '', mandals: '', village_name: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {'''
)

c = c.replace(
'''  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {''',
'''  getmandals(event: any) {
    var id = event.target.value;
    this.addingbusiness.patchValue({ mandals: '', village_name: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {'''
)

c = c.replace(
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {''',
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.addingbusiness.patchValue({ village_name: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {'''
)

with open(f_ab, 'w', encoding='utf-8') as f:
    f.write(c)
print("Patched addbusiness.component.ts")

# 2. addmarriages
f_am = os.path.join(base, "addmarriages", "addmarriages.component.ts")
with open(f_am, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
'''  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {''',
'''  getconstency(event: any) {
    var id = event.target.value;
    this.addingmarriages.patchValue({ constituencyname: '', mandals: '', village_name: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {'''
)

c = c.replace(
'''  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals(id).subscribe(res => {''',
'''  getmandals(event: any) {
    var id = event.target.value;
    this.addingmarriages.patchValue({ mandals: '', village_name: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals(id).subscribe(res => {'''
)

c = c.replace(
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis(id).subscribe(res => {''',
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.addingmarriages.patchValue({ village_name: '' });
    this.panchayati = [];
    this.service.gepanchayatis(id).subscribe(res => {'''
)

with open(f_am, 'w', encoding='utf-8') as f:
    f.write(c)
print("Patched addmarriages.component.ts")

# 3. addjobs
f_aj = os.path.join(base, "addjobs", "addjobs.component.ts")
with open(f_aj, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
'''  getconstency(event: any) {
    var id = event.target.value;
    this.service.getconsistencys().subscribe(res => {''',
'''  getconstency(event: any) {
    var id = event.target.value;
    this.jobsadding.patchValue({ constituencyname: '', mandals: '', village_name: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.service.getconsistencys().subscribe(res => {'''
)

c = c.replace(
'''  getmandals(event: any) {
    var id = event.target.value;
    this.service.getmandals().subscribe(res => {''',
'''  getmandals(event: any) {
    var id = event.target.value;
    this.jobsadding.patchValue({ mandals: '', village_name: '' });
    this.mandals = [];
    this.panchayati = [];
    this.service.getmandals().subscribe(res => {'''
)

c = c.replace(
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.service.gepanchayatis().subscribe(res => {''',
'''  gepanchayati(event: any) {
    var id = event.target.value;
    this.jobsadding.patchValue({ village_name: '' });
    this.panchayati = [];
    this.service.gepanchayatis().subscribe(res => {'''
)

with open(f_aj, 'w', encoding='utf-8') as f:
    f.write(c)
print("Patched addjobs.component.ts")
