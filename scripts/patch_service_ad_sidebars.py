import re

files = [
    'src/app/jesus/institute/institute.component.html',
    'src/app/jesus/marriages/marriages.component.html',
    'src/app/jesus/jobs/jobs.component.html',
    'src/app/jesus/help/help.component.html',
    'src/app/jesus/business/business.component.html',
    'src/app/jesus/organization/organization.component.html'
]

modern_ad_sidebar = """<div class="news-sidebar-card shadow-sm p-3">
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
                    </div>"""

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the position of 'direction="up"'
    up_idx = content.find('direction="up"')
    if up_idx == -1:
        print(f"direction='up' not found in {fpath}")
        continue
    
    # Find the <marquee tag that contains this direction="up"
    marquee_start = content.rfind('<marquee', 0, up_idx)
    marquee_end = content.find('</marquee>', up_idx) + len('</marquee>')
    
    # Replace ONLY that marquee
    content = content[:marquee_start] + modern_ad_sidebar + content[marquee_end:]
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully patched {fpath}")
