import re

def update_marriages():
    print("--- Updating Marriages ---")
    with open('src/app/jesus/marriages/marriages.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    if 'showFilters' not in ts:
        ts = ts.replace('export class MarriagesComponent {', 'export class MarriagesComponent {\n  showFilters: boolean = false;\n  showSpinner: boolean = false;')
    
    # Add spinner to defaultdata and search
    ts = ts.replace('  defaultdata() {\n    var data = { df: 0 };\n    this.service.searchmarriages(data).subscribe((res: any) => {',
                    '  defaultdata() {\n    var data = { df: 0 };\n    this.showSpinner = true;\n    this.service.searchmarriages(data).subscribe((res: any) => {\n      this.showSpinner = false;')
    ts = ts.replace('  search() {\n    const vals = this.serachMeetingform.value || {};\n    this.service.searchmarriages(vals).subscribe((res: any) => {',
                    '  search() {\n    const vals = this.serachMeetingform.value || {};\n    this.showSpinner = true;\n    this.service.searchmarriages(vals).subscribe((res: any) => {\n      this.showSpinner = false;')

    with open('src/app/jesus/marriages/marriages.component.ts', 'w', encoding='utf-8') as f:
        f.write(ts)

    with open('src/app/jesus/marriages/marriages.component.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_m_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <h3>Marriages</h3>
        <div class="container mt-3" style="padding-bottom: 28px;">'''
    new_m_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="m-0"><b>వివాహాలు / Marriages</b></h3>
            <button type="button" class="default-btn user-all-btn events-filter-toggle"
                (click)="showFilters = !showFilters" [attr.aria-expanded]="showFilters">
                <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter Search)
            </button>
        </div>
        <div class="filter-panel-wrapper" *ngIf="showFilters">
        <div class="container mt-2" style="padding-bottom: 28px;">'''
    if old_m_hdr in html:
        html = html.replace(old_m_hdr, new_m_hdr, 1)
        old_m_close = '        </div>\n        <br>\n\n        <div class="row">\n            <div class="col-lg-8">'
        new_m_close = '        </div>\n        </div>\n        <br>\n\n        <div class="row">\n            <div class="col-lg-8">'
        html = html.replace(old_m_close, new_m_close, 1)

    if 'my-overlay' not in html:
        html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''
    with open('src/app/jesus/marriages/marriages.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Marriages component")


def update_jobs():
    print("--- Updating Jobs ---")
    with open('src/app/jesus/jobs/jobs.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    if 'showFilters' not in ts:
        ts = ts.replace('export class JobsComponent {', 'export class JobsComponent {\n  showFilters: boolean = false;')
        with open('src/app/jesus/jobs/jobs.component.ts', 'w', encoding='utf-8') as f:
            f.write(ts)

    with open('src/app/jesus/jobs/jobs.component.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_j_hdr = '''        <div class="container mt-3" style="padding-bottom: 28px;">
        <h3 class="filter-title"><i class="fa fa-briefcase text-primary me-2"></i> Jobs Searching (ఉద్యోగాల అన్వేషణ)</h3>
        <div class="card filter-card p-4 shadow-sm mb-4">'''

    new_j_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px;">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="filter-title m-0"><i class="fa fa-briefcase text-primary me-2"></i> Jobs Searching (ఉద్యోగాల అన్వేషణ)</h3>
            <button type="button" class="default-btn user-all-btn events-filter-toggle"
                (click)="showFilters = !showFilters" [attr.aria-expanded]="showFilters">
                <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter Search)
            </button>
        </div>
        <div class="card filter-card p-4 shadow-sm mb-4" *ngIf="showFilters">'''
    if old_j_hdr in html:
        html = html.replace(old_j_hdr, new_j_hdr, 1)

    if 'my-overlay' not in html:
        html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''
    with open('src/app/jesus/jobs/jobs.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Jobs component")


def update_help():
    print("--- Updating Help ---")
    with open('src/app/jesus/help/help.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    if 'showFilters' not in ts:
        ts = ts.replace('export class HelpComponent {', 'export class HelpComponent {\n  showFilters: boolean = false;')
        with open('src/app/jesus/help/help.component.ts', 'w', encoding='utf-8') as f:
            f.write(ts)

    with open('src/app/jesus/help/help.component.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_h_hdr = '''                    <div class="card" style="border-radius: 15px;">
                        <div class="card-body">
                            <h3 class="mb-4">Looking For Help</h3>
                            <form [formGroup]="addinghelp">'''

    new_h_hdr = '''                    <div class="card shadow-sm border-0" style="border-radius: 15px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <h3 class="m-0"><b>సహాయం కోరండి / Looking For Help</b></h3>
                                <button type="button" class="default-btn user-all-btn events-filter-toggle"
                                    (click)="showFilters = !showFilters" [attr.aria-expanded]="showFilters">
                                    <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter / Post)
                                </button>
                            </div>
                            <form [formGroup]="addinghelp" *ngIf="showFilters">'''
    if old_h_hdr in html:
        html = html.replace(old_h_hdr, new_h_hdr, 1)

    if 'my-overlay' not in html:
        html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''
    with open('src/app/jesus/help/help.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Help component")


def update_business():
    print("--- Updating Business ---")
    with open('src/app/jesus/business/business.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    if 'showFilters' not in ts:
        ts = ts.replace('export class BusinessComponent {', 'export class BusinessComponent {\n  showFilters: boolean = false;')
        with open('src/app/jesus/business/business.component.ts', 'w', encoding='utf-8') as f:
            f.write(ts)

    with open('src/app/jesus/business/business.component.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_b_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <h2>Business</h2>

        <div class="row">
            <div class="card" class="max-w-sm rounded overflow-hidden shadow-lg" style="padding:10px">'''

    new_b_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 class="m-0"><b>వ్యాపారాలు / Business</b></h2>
            <button type="button" class="default-btn user-all-btn events-filter-toggle"
                (click)="showFilters = !showFilters" [attr.aria-expanded]="showFilters">
                <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter Search)
            </button>
        </div>

        <div class="filter-panel-wrapper" *ngIf="showFilters">
        <div class="row">
            <div class="card p-3 shadow-sm border-0 filter-card">'''

    if old_b_hdr in html:
        html = html.replace(old_b_hdr, new_b_hdr, 1)
        old_b_close = '        </div>\n        <br><br>\n        <input type="text" [(ngModel)]="searchTerm"'
        new_b_close = '        </div>\n        </div>\n        <br><br>\n        <input type="text" [(ngModel)]="searchTerm"'
        html = html.replace(old_b_close, new_b_close, 1)

    if 'my-overlay' not in html:
        html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''
    with open('src/app/jesus/business/business.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Business component")


def update_organization():
    print("--- Updating Organization ---")
    with open('src/app/jesus/organization/organization.component.ts', 'r', encoding='utf-8') as f:
        ts = f.read()
    if 'showFilters' not in ts:
        ts = ts.replace('export class OrganizationComponent {', 'export class OrganizationComponent {\n  showFilters: boolean = false;')
        with open('src/app/jesus/organization/organization.component.ts', 'w', encoding='utf-8') as f:
            f.write(ts)

    with open('src/app/jesus/organization/organization.component.html', 'r', encoding='utf-8') as f:
        html = f.read()

    old_org_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <h3>Organisation</h3>
        <div class="container mt-3" style="padding-bottom: 28px;">

            <div class="row">
                <div class="card" class="max-w-sm rounded overflow-hidden shadow-lg" style="padding:10px">'''

    new_org_hdr = '''    <div class="container mt-3" style="padding-bottom: 28px">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="m-0"><b>సంస్థలు / Organisation</b></h3>
            <button type="button" class="default-btn user-all-btn events-filter-toggle"
                (click)="showFilters = !showFilters" [attr.aria-expanded]="showFilters">
                <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter Search)
            </button>
        </div>

        <div class="filter-panel-wrapper mb-4" *ngIf="showFilters">
            <div class="card p-3 shadow-sm border-0 filter-card">'''

    if old_org_hdr in html:
        html = html.replace(old_org_hdr, new_org_hdr, 1)
        old_org_close = '''                    </form>
                </div>
            </div>
        </div>
        <br>

        <div class="row">
            <div class="col-lg-7">'''

        new_org_close = '''                    </form>
            </div>
        </div>
        <br>

        <div class="row">
            <div class="col-lg-8 col-md-7">'''
        html = html.replace(old_org_close, new_org_close, 1)

    # Change col-lg-5 to col-lg-4 col-md-5 with clean vertical scrolling sidebar
    old_sidebar = '''            <div class="col-lg-5">
                <div class="news-sidebar-card shadow-sm p-3">
                        <h5 class="fw-bold text-center text-primary mb-3 border-bottom pb-2">
                            <i class="fa fa-bullhorn me-1"></i> ప్రకటనలు / సమాచారం
                        </h5>
                        <marquee onmouseover="this.stop();" onmouseout="this.start();" direction="up"
                            style="height: 550px; scroll-behavior: smooth;">
                            <div class="sidebar-ad-card mb-3 p-3 text-center border rounded bg-white">
                                <h5 class="fw-bold text-success mb-1">Welcome To JBAC.IN</h5>
                                <p class="small text-muted mb-0">ఆంధ్ర & తెలంగాణ క్రైస్తవ సేవా సమాచారం</p>
                            </div>
                            <div *ngFor="let item of adds" class="sidebar-ad-card mb-3 p-2 border rounded shadow-sm bg-white">
                                <img [src]="item.image || 'assets/images/user.jpg'" (error)="$any($event.target).src = 'assets/images/user.jpg'"
                                    (click)="openimg(item.image, openmodel)"
                                    class="img-fluid rounded mb-2 ad-img cursor-pointer"
                                    style="width: 100%; max-height: 220px; object-fit: cover;"
                                    alt="Advertisement">
                                <p class="small text-dark mb-0 fw-semibold px-1">
                                    {{item.description}}
                                </p>
                            </div>
                        </marquee>
                    </div>
            </div>'''

    new_sidebar = '''            <div class="col-lg-4 col-md-5">
                <div class="news-sidebar-card shadow-sm p-3 bg-white" style="border-radius: 12px; border: 1px solid #e2e8f0; height: 100%; margin-top: 0;">
                    <h5 class="fw-bold text-center text-primary mb-3 border-bottom pb-2">
                        <i class="fa fa-bullhorn me-1"></i> ప్రకటనలు / సమాచారం
                    </h5>
                    <marquee onmouseover="this.stop();" onmouseout="this.start();" direction="up" scrollamount="2" scrolldelay="35"
                        style="height: 580px; scroll-behavior: smooth;">
                        <div class="sidebar-ad-card mb-3 p-3 text-center border rounded bg-light">
                            <h5 class="fw-bold text-success mb-1">Welcome To JBAC.IN</h5>
                            <p class="small text-muted mb-0">ఆంధ్ర & తెలంగాణ క్రైస్తవ సేవా సమాచారం</p>
                        </div>
                        <div *ngFor="let item of adds" class="sidebar-ad-card mb-3 p-2 border rounded shadow-sm bg-white">
                            <img [src]="item.image || 'assets/images/user.jpg'" (error)="$any($event.target).src = 'assets/images/user.jpg'"
                                (click)="openimg(item.image, openmodel)"
                                class="img-fluid rounded mb-2 ad-img cursor-pointer"
                                style="width: 100%; max-height: 220px; object-fit: cover;"
                                alt="Advertisement">
                            <p class="small text-dark mb-0 fw-semibold px-1">
                                {{item.description}}
                            </p>
                        </div>
                    </marquee>
                </div>
            </div>'''

    if old_sidebar in html:
        html = html.replace(old_sidebar, new_sidebar, 1)

    # Remove h-screen from cards row
    html = html.replace('class="flex justify-center items-center h-screen"', 'class="d-flex justify-content-center items-center"')

    if 'my-overlay' not in html:
        html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''
    with open('src/app/jesus/organization/organization.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Organization component HTML")

    # Clean up organization.component.css
    with open('src/app/jesus/organization/organization.component.css', 'r', encoding='utf-8') as f:
        css = f.read()
    css = css.replace('border-radius: 5px 25px 5px 50px;', 'border-radius: 12px;')
    css = css.replace('background-color: var(--purple);', 'background-color: #ffffff;')
    css = css.replace('background-color: var(--black);', '/* background-color: var(--black); */')
    with open('src/app/jesus/organization/organization.component.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated Organization component CSS")

update_marriages()
update_jobs()
update_help()
update_business()
update_organization()
print("All 5 components updated successfully!")
