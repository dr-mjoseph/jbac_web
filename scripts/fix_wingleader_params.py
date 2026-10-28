with open('backend/server.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_query = "const [wRows]: any = await db.query('SELECT * FROM wingleader WHERE (user_id = ? OR pastor_id = ? OR believer_id = ?) AND d_in = 0', [usrId, usrId]);"
new_query = "const [wRows]: any = await db.query('SELECT * FROM wingleader WHERE (user_id = ? OR pastor_id = ? OR believer_id = ?) AND d_in = 0', [usrId, usrId, usrId]);"

if old_query in text:
    text = text.replace(old_query, new_query, 1)
    print("Replaced old_query with new_query")
else:
    print("old_query not found!")

with open('backend/server.ts', 'w', encoding='utf-8') as f:
    f.write(text)

