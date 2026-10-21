import os
import re

server_js_path = 'backend/server.js'
with open(server_js_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update dynamicInsert in server.js
new_dynamic_insert = """async function dynamicInsert(tableName, data) {
    try {
        const [cols] = await db.query(`DESCRIBE \\`${tableName}\\``);
        const colMap = new Map();
        const colMetaMap = new Map();
        for (const c of cols) {
            const lk = c.Field.toLowerCase();
            colMap.set(lk, c.Field);
            colMetaMap.set(lk, {
                type: String(c.Type || '').toLowerCase(),
                nullable: String(c.Null || '').toUpperCase() === 'YES',
                defaultVal: c.Default
            });
        }
        if (colMap.has('image') && (!data.image || typeof data.image === 'object' || Array.isArray(data.image))) {
            const extracted = extractUploadedImage(data);
            if (extracted) {
                data.image = extracted;
            }
        }
        if (colMap.has('photo') && (!data.photo || typeof data.photo === 'object' || Array.isArray(data.photo))) {
            const extracted = extractUploadedImage(data);
            if (extracted) {
                data.photo = extracted;
            }
        }
        if (colMap.has('email') && (data.email === undefined || data.email === null)) {
            data.email = '';
        }
        const fields = [];
        const placeholders = [];
        const values = [];
        for (const [k, v] of Object.entries(data)) {
            const lk = k.toLowerCase();
            if (lk !== 'id' && colMap.has(lk)) {
                const actualCol = colMap.get(lk);
                const meta = colMetaMap.get(lk);
                fields.push(`\\`${actualCol}\\``);
                placeholders.push('?');
                let val = typeof v === 'object' && v !== null ? JSON.stringify(v) : (v === undefined ? null : v);
                const isNumericCol = meta && (
                    meta.type.startsWith('int') ||
                    meta.type.startsWith('bigint') ||
                    meta.type.startsWith('smallint') ||
                    meta.type.startsWith('tinyint') ||
                    meta.type.startsWith('decimal') ||
                    meta.type.startsWith('float') ||
                    meta.type.startsWith('double') ||
                    meta.type.startsWith('numeric')
                );
                if (typeof val === 'string' && val.trim() === '') {
                    if (meta && meta.nullable) {
                        val = null;
                    } else if (isNumericCol || lk.endsWith('_id') || lk === 'constituencyname' || lk === 'districts' || lk === 'mandals' || lk === 'districtname' || lk === 'panchaiti') {
                        val = (meta && meta.defaultVal !== null && !isNaN(Number(meta.defaultVal))) ? Number(meta.defaultVal) : 0;
                    } else {
                        val = (meta && meta.defaultVal !== null) ? meta.defaultVal : '';
                    }
                } else if (typeof val === 'string' && val.trim().toUpperCase() === 'NULL') {
                    val = meta && meta.nullable ? null : '';
                } else if ((lk.endsWith('_id') || lk === 'pastor_id' || lk === 'believer_id' || lk === 'student_id') && (val === 0 || val === '0')) {
                    if (meta && meta.nullable) {
                        val = null;
                    }
                } else if (isNumericCol && val !== null && val !== undefined) {
                    if (!isNaN(Number(val))) {
                        val = Number(val);
                    }
                }
                values.push(val);
            }
        }
        if (fields.length === 0)
            return null;
        const sql = `INSERT INTO \\`${tableName}\\` (${fields.join(',')}) VALUES (${placeholders.join(',')})`;
        const conn = await db.getConnection();
        try {
            await conn.query('SET FOREIGN_KEY_CHECKS = 0');
            const [res] = await conn.query(sql, values);
            return res;
        } finally {
            await conn.query('SET FOREIGN_KEY_CHECKS = 1');
            conn.release();
        }
    }
    catch (e) {
        console.error(`dynamicInsert error in ${tableName}:`, e.message);
        throw e;
    }
}"""

# 2. Update dynamicUpdateById in server.js
new_dynamic_update = """async function dynamicUpdateById(tableName, id, data) {
    try {
        const [cols] = await db.query(`DESCRIBE \\`${tableName}\\``);
        const colMap = new Map();
        const colMetaMap = new Map();
        for (const c of cols) {
            const lk = c.Field.toLowerCase();
            colMap.set(lk, c.Field);
            colMetaMap.set(lk, {
                type: String(c.Type || '').toLowerCase(),
                nullable: String(c.Null || '').toUpperCase() === 'YES',
                defaultVal: c.Default
            });
        }
        const updates = [];
        const values = [];
        for (const [k, v] of Object.entries(data)) {
            const lk = k.toLowerCase();
            if (lk !== 'id' && colMap.has(lk)) {
                const actualCol = colMap.get(lk);
                const meta = colMetaMap.get(lk);
                updates.push(`\\`${actualCol}\\` = ?`);
                let val = typeof v === 'object' && v !== null ? JSON.stringify(v) : (v === undefined ? null : v);
                const isNumericCol = meta && (
                    meta.type.startsWith('int') ||
                    meta.type.startsWith('bigint') ||
                    meta.type.startsWith('smallint') ||
                    meta.type.startsWith('tinyint') ||
                    meta.type.startsWith('decimal') ||
                    meta.type.startsWith('float') ||
                    meta.type.startsWith('double') ||
                    meta.type.startsWith('numeric')
                );
                if (typeof val === 'string' && val.trim() === '') {
                    if (meta && meta.nullable) {
                        val = null;
                    } else if (isNumericCol || lk.endsWith('_id')) {
                        val = (meta && meta.defaultVal !== null && !isNaN(Number(meta.defaultVal))) ? Number(meta.defaultVal) : 0;
                    } else {
                        val = (meta && meta.defaultVal !== null) ? meta.defaultVal : '';
                    }
                } else if (typeof val === 'string' && val.trim().toUpperCase() === 'NULL') {
                    val = meta && meta.nullable ? null : '';
                } else if ((lk.endsWith('_id') || lk === 'pastor_id' || lk === 'believer_id' || lk === 'student_id') && (val === 0 || val === '0')) {
                    if (meta && meta.nullable) {
                        val = null;
                    }
                } else if (isNumericCol && val !== null && val !== undefined) {
                    if (!isNaN(Number(val))) {
                        val = Number(val);
                    }
                }
                values.push(val);
            }
        }
        if (updates.length === 0)
            return { affectedRows: 0, changedRows: 0 };
        values.push(id);
        const sql = `UPDATE \\`${tableName}\\` SET ${updates.join(', ')} WHERE \\`id\\` = ?`;
        const conn = await db.getConnection();
        try {
            await conn.query('SET FOREIGN_KEY_CHECKS = 0');
            const [res] = await conn.query(sql, values);
            return res;
        } finally {
            await conn.query('SET FOREIGN_KEY_CHECKS = 1');
            conn.release();
        }
    }
    catch (e) {
        console.error(`dynamicUpdateById error in ${tableName}:`, e.message);
        throw e;
    }
}"""

# 3. Update app.delete in server.js
new_app_delete = """app.delete(['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'], async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    if (!isValidTable(table)) {
        return res.status(400).json({ success: false, status: 400, error: `Invalid table: ${table}` });
    }
    try {
        const conn = await db.getConnection();
        let delRes;
        try {
            await conn.query('SET FOREIGN_KEY_CHECKS = 0');
            [delRes] = await conn.query(`DELETE FROM \\`${table}\\` WHERE \\`id\\` = ?`, [id]);
        } finally {
            await conn.query('SET FOREIGN_KEY_CHECKS = 1');
            conn.release();
        }
        res.json({
            success: true,
            status: 200,
            table,
            id,
            affectedRows: delRes ? delRes.affectedRows : 0,
            message: 'Record deleted successfully'
        });
    }
    catch (err) {
        res.status(500).json({ success: false, status: 500, error: err.message });
    }
});"""

# Perform replacements using regex
insert_pattern = re.compile(r'async function dynamicInsert\(tableName, data\) \{[\s\S]*?catch \(e\) \{\s*console\.error\(`dynamicInsert error in \$\{tableName\}:`, e\.message\);\s*throw e;\s*\}\s*\}', re.MULTILINE)
update_pattern = re.compile(r'async function dynamicUpdateById\(tableName, id, data\) \{[\s\S]*?catch \(e\) \{\s*console\.error\(`dynamicUpdateById error in \$\{tableName\}:`, e\.message\);\s*throw e;\s*\}\s*\}', re.MULTILINE)
delete_pattern = re.compile(r"app\.delete\(\['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'\], async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ success: false, status: 500, error: err\.message \}\);\s*\}\s*\}\);", re.MULTILINE)

code, n_ins = insert_pattern.subn(new_dynamic_insert, code)
code, n_upd = update_pattern.subn(new_dynamic_update, code)
code, n_del = delete_pattern.subn(new_app_delete, code)

print(f"Replacements in backend/server.js: dynamicInsert={n_ins}, dynamicUpdateById={n_upd}, app.delete={n_del}")

with open(server_js_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("backend/server.js successfully patched!")
