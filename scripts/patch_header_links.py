import sys

with open('src/app/shared/header/header.component.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Desktop primary navbar
anchor1 = '''                                    <li class="menu-item">
                                        <a routerLink="/pastorassociationregister" routerLinkActive="active"
                                            [routerLinkActiveOptions]="{exact: true}">పాస్టర్ అసోసియేషన్ రిజిస్ట్రేషన్</a>
                                    </li>'''

new1 = '''                                    <li class="menu-item">
                                        <a routerLink="/pastorassociationregister" routerLinkActive="active"
                                            [routerLinkActiveOptions]="{exact: true}">పాస్టర్ అసోసియేషన్ రిజిస్ట్రేషన్</a>
                                    </li>
                                    <li class="menu-item">
                                        <a routerLink="/entrepreneurregister" routerLinkActive="active"
                                            [routerLinkActiveOptions]="{exact: true}">ఎంటర్‌ప్రెన్యూర్ రిజిస్ట్రేషన్ (Entrepreneur)</a>
                                    </li>
                                    <li class="menu-item">
                                        <a routerLink="/investorregister" routerLinkActive="active"
                                            [routerLinkActiveOptions]="{exact: true}">ఇన్వెస్టర్ రిజిస్ట్రేషన్ (Investor)</a>
                                    </li>'''

if anchor1 in text and '/entrepreneurregister' not in text:
    text = text.replace(anchor1, new1)

# 2. Sticky / Second desktop menu
anchor2 = '''                                <a href="/pastorassociationregister" routerLinkActive="active"
                                    [routerLinkActiveOptions]="{exact: true}">PASTORS ASSOCIATION REGISTER</a>
                            </li>'''

new2 = '''                                <a href="/pastorassociationregister" routerLinkActive="active"
                                    [routerLinkActiveOptions]="{exact: true}">PASTORS ASSOCIATION REGISTER</a>
                            </li>
                            <li class="menu-item">
                                <a routerLink="/entrepreneurregister" routerLinkActive="active"
                                    [routerLinkActiveOptions]="{exact: true}">ENTREPRENEUR REGISTER (ఎంటర్‌ప్రెన్యూర్)</a>
                            </li>
                            <li class="menu-item">
                                <a routerLink="/investorregister" routerLinkActive="active"
                                    [routerLinkActiveOptions]="{exact: true}">INVESTOR REGISTER (ఇన్వెస్టర్)</a>
                            </li>'''

if anchor2 in text:
    text = text.replace(anchor2, new2)

# 3. Mobile drawer menu
anchor3 = '''                        <li class="menu-item">
                            <a (click)="closeMobileMenu()" routerLink="/pastorassociationregister" routerLinkActive="active"
                                [routerLinkActiveOptions]="{exact: true}">PASTORS ASSOCIATION REGISTER</a>
                        </li>'''

new3 = '''                        <li class="menu-item">
                            <a (click)="closeMobileMenu()" routerLink="/pastorassociationregister" routerLinkActive="active"
                                [routerLinkActiveOptions]="{exact: true}">PASTORS ASSOCIATION REGISTER</a>
                        </li>
                        <li class="menu-item">
                            <a (click)="closeMobileMenu()" routerLink="/entrepreneurregister" routerLinkActive="active"
                                [routerLinkActiveOptions]="{exact: true}">🚀 ENTREPRENEUR (ఎంటర్‌ప్రెన్యూర్)</a>
                        </li>
                        <li class="menu-item">
                            <a (click)="closeMobileMenu()" routerLink="/investorregister" routerLinkActive="active"
                                [routerLinkActiveOptions]="{exact: true}">💰 INVESTOR (ఇన్వెస్టర్)</a>
                        </li>'''

if anchor3 in text:
    text = text.replace(anchor3, new3)

with open('src/app/shared/header/header.component.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully patched header.component.html!")

