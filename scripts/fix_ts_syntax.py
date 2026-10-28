# Fix leaders.component.ts
with open('src/app/jesus/leaders/leaders.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

bad_str = """        this.  getLevelName(level: any): string {
    if (level == '1') return 'జిల్లా లీడర్';
    if (level == '2') return 'నియోజకవర్గ లీడర్';
    if (level == '3') return 'మండల లీడర్';
    if (level == '4') return 'గ్రామ / పంచాయితీ లీడర్';
    return 'నాయకుడు (Leader)';
  }

  conformleader(id, index);"""

good_str = """        this.conformleader(id, index);"""

level_method = """
  getLevelName(level: any): string {
    if (level == '1') return 'జిల్లా లీడర్';
    if (level == '2') return 'నియోజకవర్గ లీడర్';
    if (level == '3') return 'మండల లీడర్';
    if (level == '4') return 'గ్రామ / పంచాయితీ లీడర్';
    return 'నాయకుడు (Leader)';
  }
"""

if bad_str in text:
    text = text.replace(bad_str, good_str, 1)
elif bad_str.replace('\n', '\r\n') in text:
    text = text.replace(bad_str.replace('\n', '\r\n'), good_str.replace('\n', '\r\n'), 1)

if 'conformleader(id: any, index: any)' in text and 'getLevelName(' not in text:
    text = text.replace('conformleader(id: any, index: any)', level_method + '\n  conformleader(id: any, index: any)', 1)

with open('src/app/jesus/leaders/leaders.component.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Fixed leaders.component.ts")

# Fix signup.component.ts
with open('src/app/jesus/signup/signup.component.ts', 'r', encoding='utf-8') as f:
    stext = f.read()

old_signup = """    this.subward = false;
    this.father = false;
  }
    if (this.existingUserData) { setTimeout(() => { this.applyAutofillToActiveForm(); }, 100); }"""

new_signup = """    this.subward = false;
    this.father = false;
    if (this.existingUserData) {
      setTimeout(() => { this.applyAutofillToActiveForm(); }, 100);
    }
  }"""

if old_signup in stext:
    stext = stext.replace(old_signup, new_signup, 1)
elif old_signup.replace('\n', '\r\n') in stext:
    stext = stext.replace(old_signup.replace('\n', '\r\n'), new_signup.replace('\n', '\r\n'), 1)

with open('src/app/jesus/signup/signup.component.ts', 'w', encoding='utf-8') as f:
    f.write(stext)
print("Fixed signup.component.ts")

