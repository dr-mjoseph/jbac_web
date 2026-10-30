import os

path = r'c:\Users\rajes\Documents\jbac_web\src\app\jesus\studentregister\studentregister.component.ts'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("state_id: ['1'],", "state_id: ['', [Validators.required]],")

c = c.replace(
'''  getconstency(event: any) {
    const id = event.target.value?.trim();''',
'''  getconstency(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ constituency_id: '', mandal_id: '', village_id: '' });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];'''
)

c = c.replace(
'''  getconstency1(event: any) {
    const id = event.target.value?.trim();''',
'''  getconstency1(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ resconstituencyname: '', resmandals: '', respanchayati: '' });
    this.constituency1 = [];
    this.mandals1 = [];
    this.panchayati1 = [];'''
)

c = c.replace(
'''  getmandals(event: any) {
    const id = event.target.value?.trim();''',
'''  getmandals(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ mandal_id: '', village_id: '' });
    this.mandals = [];
    this.panchayati = [];'''
)

c = c.replace(
'''  getmandals1(event: any) {
    const id = event.target.value?.trim();''',
'''  getmandals1(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ resmandals: '', respanchayati: '' });
    this.mandals1 = [];
    this.panchayati1 = [];'''
)

c = c.replace(
'''  gepanchayati(event: any) {
    const id = event.target.value?.trim();''',
'''  gepanchayati(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ village_id: '' });
    this.panchayati = [];'''
)

c = c.replace(
'''  gepanchayati1(event: any) {
    const id = event.target.value?.trim();''',
'''  gepanchayati1(event: any) {
    const id = event.target.value?.trim();
    this.studentform.patchValue({ respanchayati: '' });
    this.panchayati1 = [];'''
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('Successfully patched studentregister.component.ts')
