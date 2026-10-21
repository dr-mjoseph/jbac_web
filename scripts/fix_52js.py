import re

paths = [
    'C:/Users/rajes/StudioProjects/jbac_app/www/build/52.js',
    'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/52.js'
]

replacement = (
    r'<button ion-button block color=\"primary\" type=\"submit\" [disabled]=\"showSpinner\" style=\"border-radius: 8px; font-weight: bold; height: 44px;\">\n'
    r'          <ion-spinner *ngIf=\"showSpinner\" name=\"crescent\" style=\"margin-right: 8px;\"></ion-spinner>\n'
    r'          <span *ngIf=\"showSpinner\">దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...</span>\n'
    r'          <span *ngIf=\"!showSpinner\">డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి (Submit)</span>\n'
    r'        </button>'
)

for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    c = re.sub(
        r'<button\s+ion-button\s+block\s+color=\\"primary\\"[^>]*>[\s\S]*?<\/button>',
        lambda m: replacement,
        c
    )
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'Successfully fixed {p}')
