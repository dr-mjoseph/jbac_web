with open('src/app/jesus/studentregister/studentregister.component.html', 'r', encoding='utf-8') as f:
    c = f.read()

old_select = """                                                    <option value="">Select Leadership Level you want</option>
                                                    <option value="State Level">State Level</option>
                                                    <option value="District Level">District Level</option>
                                                    <option value="Constituency Level">Constituency Level</option>
                                                    <option value="Municipality / Mandal Level">Municipality / Mandal
                                                        Level</option>
                                                    <option value="Ward / Panchayati Level">Ward / Panchayati Level
                                                    </option>
                                                    <option value="Constituency Level">Church Level</option>
                                                    <option value="Constituency Level">College Level</option>
                                                    <option value="Constituency Level">Branch Level</option>
                                                    <option value="Constituency Level">Branch / Group Level</option>
                                                    <option value="Constituency Level">Branch / Group Year Level</option>
                                                    <option value="Constituency Level">Section / Class Level</option>"""

new_select = """                                                    <option value="">Select Leadership Level you want</option>
                                                    <option value="State Level">State Level</option>
                                                    <option value="District Level">District Level</option>
                                                    <option value="Constituency Level">Constituency Level</option>
                                                    <option value="Municipality / Mandal Level">Municipality / Mandal Level</option>
                                                    <option value="Ward / Panchayati Level">Ward / Panchayati Level</option>
                                                    <option value="Church Level">Church Level</option>
                                                    <option value="College Level">College Level</option>
                                                    <option value="Branch Level">Branch Level</option>
                                                    <option value="Branch / Group Level">Branch / Group Level</option>
                                                    <option value="Branch / Group Year Level">Branch / Group Year Level</option>
                                                    <option value="Section / Class Level">Section / Class Level</option>"""

if old_select in c:
    c = c.replace(old_select, new_select)
    with open('src/app/jesus/studentregister/studentregister.component.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated studentregister.component.html leadership levels successfully")
else:
    print("Warning: old_select not found in studentregister.component.html")

