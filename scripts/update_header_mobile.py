import re

with open('src/app/shared/header/header.component.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update menu_button
content = content.replace(
    '<div class="menu_button icon-menu"></div>',
    '<div class="menu_button icon-menu" (click)="toggleMobileMenu()" title="Open Navigation"></div>'
)

# 2. Update side_wrap
content = content.replace(
    '<div class="side_wrap" >',
    '<div class="side_wrap" [class.open]="mobileMenuOpen">'
)
content = content.replace(
    '<div class="side_wrap">',
    '<div class="side_wrap" [class.open]="mobileMenuOpen">'
)

# 3. Update close button
content = content.replace(
    '<div class="close">Close</div>',
    '<div class="close" (click)="closeMobileMenu()">✕ Close</div>'
)

# 4. Update mask
content = content.replace(
    '<div class="mask"></div>',
    '<div class="mask" [class.show]="mobileMenuOpen" (click)="closeMobileMenu()"></div>'
)

# 5. Add closeMobileMenu() on router links inside menu_main_mobile
# Replace <a routerLink= with <a (click)="closeMobileMenu()" routerLink= inside the mobile nav
mobile_nav_start = content.find('id="menu_main_mobile"')
if mobile_nav_start != -1:
    before_nav = content[:mobile_nav_start]
    after_nav = content[mobile_nav_start:]
    # Replace routerLink in after_nav
    after_nav = re.sub(r'<a\s+routerLink=', r'<a (click)="closeMobileMenu()" routerLink=', after_nav)
    content = before_nav + after_nav

with open('src/app/shared/header/header.component.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated header.component.html successfully")

