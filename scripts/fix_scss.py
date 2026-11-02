path = r'C:\Users\rajes\StudioProjects\jbac_app\node_modules\ionic-angular\themes\ionic.functions.scss'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_color_error = False
for i, line in enumerate(lines):
    if '@function color-error(' in line:
        in_color_error = True
        new_lines.append('@function color-error($color-value, $color-name: null) {\n')
        new_lines.append('  $error-msg: "The value #{$color-value} must be a color.";\n')
        new_lines.append('  @if ($color-name) {\n')
        new_lines.append('    $error-msg: "The map color #{$color-name} is not defined.";\n')
        new_lines.append('  }\n')
        new_lines.append('  @error $error-msg;\n')
        new_lines.append('  @return null;\n')
        new_lines.append('}\n')
        continue
    if in_color_error:
        if line.strip() == '@function color-brightness($color-value) {':
            in_color_error = False
            new_lines.append('\n' + line)
        continue
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully replaced color-error function in ionic.functions.scss')

