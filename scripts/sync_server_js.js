const fs = require('fs');

const serverPath = 'backend/server.js';
let code = fs.readFileSync(serverPath, 'utf8');

// 1. In dynamicInsert, handle state_id and state auto-population
if (!code.includes('Auto-populate state_id and state')) {
    const target = 'if (colMap.has(\'email\') && (data.email === undefined || data.email === null)) {';
    const addition = `        // Auto-populate state_id and state
        if (colMap.has('state_id')) {
            if (data.state_id !== undefined && data.state_id !== null && data.state_id !== '') {
                data.state_id = Number(data.state_id);
                if (colMap.has('state') && (!data.state || String(data.state).trim() === '')) {
                    data.state = data.state_id === 2 ? 'Telangana' : 'Andhra Pradesh';
                }
            } else if (data.state_id === undefined || data.state_id === null || data.state_id === '') {
                data.state_id = 1;
                if (colMap.has('state') && (!data.state || String(data.state).trim() === '')) {
                    data.state = 'Andhra Pradesh';
                }
            }
        }
        `;
    code = code.replace(target, addition + '\n        ' + target);
    console.log('Added auto-populate state_id and state in dynamicInsert (server.js)');
}

// 2. In dynamicUpdate, handle state_id and state
if (!code.includes('validColNames.has(\'state_id\')')) {
    const target = 'const setChunks = [];';
    const addition = `        if (validColNames.has('state_id') && data.state_id !== undefined && data.state_id !== null && data.state_id !== '') {
            data.state_id = Number(data.state_id);
            if (validColNames.has('state') && (!data.state || String(data.state).trim() === '')) {
                data.state = data.state_id === 2 ? 'Telangana' : 'Andhra Pradesh';
            }
        }
        `;
    code = code.replace(target, addition + '\n        ' + target);
    console.log('Added state_id handling in dynamicUpdate (server.js)');
}

// 3. Search Pastors Handler
if (!code.includes('pastor_reg WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    const target = `let sql = 'SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address FROM pastor_reg WHERE d_in = 0';\n        const params = [];`;
    const replacement = `let sql = 'SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address FROM pastor_reg WHERE d_in = 0';\n        const params = [];\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`;
    code = code.replace(target, replacement);
    console.log('Updated searchPastorsHandler for state_id (server.js)');
}

// 4. Search Churches Handler
if (!code.includes('AND (ct.state_id = ? OR cr.state_id = ?')) {
    const target = `if (district) { sql += ' AND (ct.district_id = ? OR cr.district_id = ?)`;
    const addition = `if (body.state_id) { sql += ' AND (ct.state_id = ? OR cr.state_id = ? OR (ct.state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id), Number(body.state_id)); }\n        `;
    code = code.replace(target, addition + target);
    console.log('Updated searchChurchesHandler for state_id (server.js)');
}

// 5. Search Organizations
const orgTarget = `let sql = 'SELECT * FROM independentorganisation_reg WHERE d_in = 0';\n        const params = [];`;
if (!code.includes('independentorganisation_reg WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    code = code.replace(orgTarget, orgTarget + `\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`);
    console.log('Updated search organizations for state_id (server.js)');
}

// 6. Search Jobs
const jobTarget = `let sql = 'SELECT * FROM jobs WHERE d_in = 0';\n        const params = [];`;
if (!code.includes('jobs WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    code = code.replace(jobTarget, jobTarget + `\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`);
    console.log('Updated search jobs for state_id (server.js)');
}

// 7. Search Marriages
const marTarget = `let sql = 'SELECT * FROM marriages WHERE d_in = 0';\n        const params = [];`;
if (!code.includes('marriages WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    code = code.replace(marTarget, marTarget + `\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`);
    console.log('Updated search marriages for state_id (server.js)');
}

// 8. Search Business
const busTarget = `let sql = 'SELECT * FROM business_table WHERE d_in = 0';\n        const params = [];`;
if (!code.includes('business_table WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    code = code.replace(busTarget, busTarget + `\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`);
    console.log('Updated search business for state_id (server.js)');
}

// 9. Search Institutes
const instTarget = `let sql = 'SELECT * FROM institutes WHERE d_in = 0';\n        const params = [];`;
if (!code.includes('institutes WHERE d_in = 0\';\n        const params = [];\n        if (body.state_id)')) {
    code = code.replace(instTarget, instTarget + `\n        if (body.state_id) { sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))'; params.push(Number(body.state_id), Number(body.state_id)); }`);
    console.log('Updated search institutes for state_id (server.js)');
}

// 10. Attacks (getatt)
if (!code.includes('attacks WHERE d_in = 0\';\n        const params = [];\n        if (stateId')) {
    code = code.replace(
        `app.all(['/dashboardapi/getatt', '/api/getatt'], async (_req, res) => {\n    try {\n        const [rows] = await db.query('SELECT * FROM attacks WHERE d_in = 0 ORDER BY id DESC');`,
        `app.all(['/dashboardapi/getatt', '/api/getatt'], async (req, res) => {\n    try {\n        const stateId = req.query?.state_id || req.body?.state_id;\n        let sql = 'SELECT * FROM attacks WHERE d_in = 0';\n        const params = [];\n        if (stateId && stateId !== 'all') {\n            sql += ' AND (state_id = ? OR (state_id IS NULL AND ? = 1))';\n            params.push(Number(stateId), Number(stateId));\n        }\n        sql += ' ORDER BY id DESC';\n        const [rows] = await db.query(sql, params);`
    );
    console.log('Updated attacks endpoint for state_id filter (server.js)');
}

fs.writeFileSync(serverPath, code, 'utf8');
console.log('Saved backend/server.js successfully');
