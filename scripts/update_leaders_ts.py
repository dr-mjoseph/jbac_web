with open('src/app/jesus/leaders/leaders.component.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update line 98
old_line = '          this.wingtypes = res.data[0].wingtypes'
new_line = '          this.wingtypes = res.data[0].wing_name || res.data[0].wingtypes || "";'
if old_line in c:
    c = c.replace(old_line, new_line, 1)
    print("Updated this.wingtypes")

# 2. Add leadertype & wingtypes to data in general leader branch
old_data = """          var data = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,"""

new_data = """          var data = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "leadertype": res.data[0].leadertype,
            "wingtypes": res.data[0].wingtypes,
            "generaltype": res.data[0].generaltype,"""
if old_data in c:
    c = c.replace(old_data, new_data, 1)
    print("Updated data payload")

# 3. Add leadertype & wingtypes to data4 in wing leader branch
old_data4 = """          var data4 = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "generaltype": res.data[0].generaltype,
            wingtype: res.data[0].wingtype,"""

new_data4 = """          var data4 = {
            "usr_id": sessionStorage.getItem("usr_id"),
            "category_id": sessionStorage.getItem("category_id"),
            "leadertype": res.data[0].leadertype,
            "wingtypes": res.data[0].wingtypes,
            "generaltype": res.data[0].generaltype,
            wingtype: res.data[0].wingtype,"""
if old_data4 in c:
    c = c.replace(old_data4, new_data4, 1)
    print("Updated data4 payload")

with open('src/app/jesus/leaders/leaders.component.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated leaders.component.ts successfully')

