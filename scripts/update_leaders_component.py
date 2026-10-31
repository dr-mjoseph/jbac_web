with open('src/app/jesus/leaders/leaders.component.ts', 'r', encoding='utf-8') as f:
    code = f.read()

old_block = """        if (res.data[0].leadertype == 1) {
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District ";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency ";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal ";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal ";
            this.general = "Village ";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village ";
            this.general = "";
          }"""

new_block = """        if (res.data[0].leadertype == 1) {
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District ";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency ";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal ";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal ";
            this.general = "Panchayat ";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Panchayat ";
            this.general = "Ward ";
          } else if (res.data[0].generaltype == 5 || res.data[0].generaltype == 6) {
            this.generals = "Ward ";
            this.general = "";
          }"""

old_wing_block = """        } else if (res.data[0].leadertype == 2) {
          this.wingtypes = res.data[0].wing_name || res.data[0].wingtypes || "";
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal";
            this.general = "Village";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Village";
            this.general = "";
          }"""

new_wing_block = """        } else if (res.data[0].leadertype == 2) {
          this.wingtypes = res.data[0].wing_name || res.data[0].wingtypes || "";
          if (res.data[0].generaltype == 0) {
            this.generals = "State";
            this.general = "District";
          } else if (res.data[0].generaltype == 1) {
            this.generals = "District";
            this.general = "Constituency";
          } else if (res.data[0].generaltype == 2) {
            this.generals = "Constituency";
            this.general = "Mandal";
          } else if (res.data[0].generaltype == 3) {
            this.generals = "Mandal";
            this.general = "Panchayat";
          } else if (res.data[0].generaltype == 4) {
            this.generals = "Panchayat";
            this.general = "Ward";
          } else if (res.data[0].generaltype == 5 || res.data[0].generaltype == 6) {
            this.generals = "Ward";
            this.general = "";
          }"""

old_sub_block = """  getSubordinateSubtitle(): string {
    if (this.myresdata == 0) {
      return 'జిల్లాల వారిగా (District-wise)';
    } else if (this.myresdata == 1) {
      return 'నియోజకవర్గాల వారిగా (Constituency-wise)';
    } else if (this.myresdata == 2) {
      return 'మండలాల వారిగా (Mandal-wise)';
    } else if (this.myresdata == 3) {
      return 'గ్రామ / వార్డు వారిగా (Village / Ward-wise)';
    }
    return 'మండల / పంచాయితీ వారిగా';
  }"""

new_sub_block = """  getSubordinateSubtitle(): string {
    if (this.myresdata == 0) {
      return 'జిల్లాల వారిగా (District-wise)';
    } else if (this.myresdata == 1) {
      return 'నియోజకవర్గాల వారిగా (Constituency-wise)';
    } else if (this.myresdata == 2) {
      return 'మండలాల వారిగా (Mandal-wise)';
    } else if (this.myresdata == 3) {
      return 'పంచాయితీల వారిగా (Panchayat-wise)';
    } else if (this.myresdata == 4) {
      return 'వార్డుల వారిగా (Ward-wise)';
    }
    return 'సబార్డినేట్స్ వారిగా';
  }"""

assert old_block in code, "old_block not found"
assert old_wing_block in code, "old_wing_block not found"
assert old_sub_block in code, "old_sub_block not found"

code = code.replace(old_block, new_block)
code = code.replace(old_wing_block, new_wing_block)
code = code.replace(old_sub_block, new_sub_block)

with open('src/app/jesus/leaders/leaders.component.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated leaders.component.ts successfully")
