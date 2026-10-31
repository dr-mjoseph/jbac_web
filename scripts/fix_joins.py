def fix_joins(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    old1 = """            LEFT JOIN wings w ON s.wingtype = w.id OR s.wingtypes = w.id
            WHERE ${bFullWhere}
            ORDER BY s.id DESC"""

    new1 = """            LEFT JOIN wings w ON w.id = COALESCE(NULLIF(s.wingtypes, ''), s.wingtype)
            WHERE ${bFullWhere}
            GROUP BY s.id
            ORDER BY s.id DESC"""

    old2 = """            LEFT JOIN wings w ON pr.wingtype = w.id OR pr.wingtypes = w.id
            WHERE ${pFullWhere}
            ORDER BY pr.id DESC"""

    new2 = """            LEFT JOIN wings w ON w.id = COALESCE(NULLIF(pr.wingtypes, ''), pr.wingtype)
            WHERE ${pFullWhere}
            GROUP BY pr.id
            ORDER BY pr.id DESC"""

    if old1 in text:
        text = text.replace(old1, new1)
    if old2 in text:
        text = text.replace(old2, new2)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Updated {file_path}")

fix_joins('backend/server.js')
fix_joins('backend/server.ts')

