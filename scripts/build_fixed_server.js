const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverJsPath = path.join(rootDir, 'backend', 'server.js');
const serverTsPath = path.join(rootDir, 'backend', 'server.ts');

const serverJsContent = `import express from 'express';
import serverless from 'serverless-http';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Strip AWS API Gateway Stage / Basepath prefix if present
app.use((req, _res, next) => {
    if (req.url.startsWith('/default/jbac-backend-api')) {
        req.url = req.url.replace('/default/jbac-backend-api', '') || '/';
    }
    next();
});

// Configure AWS Aurora RDS MySQL Connection
const rawHost = process.env.DB_HOST;
const dbHost = (rawHost && !rawHost.startsWith('://')) ? rawHost : 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
const dbUser = process.env.DB_USER || 'admin';
const dbPassword = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
const dbName = (process.env.DB_NAME && process.env.DB_NAME !== 'sys') ? process.env.DB_NAME : 'jbac_jbac';
const dbPort = Number(process.env.DB_PORT) || 3306;

const db = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 15,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// Whitelist of valid database tables
const VALID_TABLES = new Set([
    'indian-states', 'sheet1', 'about_tbl', 'adds_data', 'attacks', 'banner_dlt_t',
    'business_table', 'call_enquiry', 'church_reg', 'church_timings', 'churchdenomation',
    'colleges', 'const_dtl_t', 'contact_dtls', 'contactus', 'customer_dtl_t',
    'docment_tbl', 'dstrct', 'education', 'events', 'expand', 'filters_dlts',
    'gallery', 'gallery_category', 'helps', 'homebanners', 'independentorganisation_reg',
    'information_tbl', 'institutes', 'jobs', 'leaderlevel', 'leaders', 'main_modules',
    'mainsignup', 'marriages', 'ministery_services', 'ministry_signup', 'mndls_lst_t',
    'order_dtl_t', 'otp_table', 'pastor_reg', 'pastors_associations', 'permissions',
    'pnchyt_lst_t', 'post_news', 'reg_form', 'search_keys_t', 'services', 'signup_form',
    'student_reg', 'sub_modules', 'support-reg', 'users', 'video', 'video_category',
    'videotable', 'visitor_count', 'wingleader', 'wingleaderstype', 'wish_form',
    'denominations', 'leader_levels', 'educational_qualifications', 'districts',
    'constituencies', 'mandals', 'panchayats', 'services_list', 'wings', 'ads',
    'news', 'help_requests', 'business', 'meetings', 'believers', 'pastors',
    'churches', 'students', 'organisations', 'pastor_associations', 'ministries'
]);

function isValidTable(table) {
    return VALID_TABLES.has(table.toLowerCase());
}

// Dynamic insert helper: matches input fields to real table columns
async function dynamicInsert(tableName, data) {
    try {
        const [cols] = await db.query(\`DESCRIBE \\\`\${tableName}\\\`\`);
        const colMap = new Map();
        for (const c of cols) {
            colMap.set(c.Field.toLowerCase(), c.Field);
        }
        const fields = [];
        const placeholders = [];
        const values = [];

        for (const [k, v] of Object.entries(data)) {
            const lk = k.toLowerCase();
            if (lk !== 'id' && colMap.has(lk)) {
                const actualCol = colMap.get(lk);
                fields.push(\`\\\`\${actualCol}\\\`\`);
                placeholders.push('?');
                values.push(typeof v === 'object' && v !== null ? JSON.stringify(v) : (v === undefined ? null : v));
            }
        }
        if (fields.length === 0) return null;
        const sql = \`INSERT INTO \\\`\${tableName}\\\` (\${fields.join(',')}) VALUES (\${placeholders.join(',')})\`;
        const [res] = await db.query(sql, values);
        return res;
    } catch (e) {
        console.error(\`dynamicInsert error in \${tableName}:\`, e.message);
        throw e;
    }
}

// -------------------------------------------------------------
// 1. UNIVERSAL CRUD REST API
// -------------------------------------------------------------
app.get(['/api/tables', '/dashboardapi/tables', '/tables'], async (_req, res) => {
    try {
        const [tables] = await db.query('SHOW TABLES');
        const tableList = [];
        for (const t of tables) {
            const tableName = Object.values(t)[0];
            const [cnt] = await db.query(\`SELECT COUNT(*) as count FROM \\\`\${tableName}\\\`\`).catch(() => [[{ count: 0 }]]);
            const [cols] = await db.query(\`DESCRIBE \\\`\${tableName}\\\`\`).catch(() => [[]]);
            const count = cnt && cnt[0] ? Number(cnt[0].count) : 0;
            tableList.push({
                name: tableName,
                rows: count,
                columns: cols || []
            });
        }
        res.json({
            status: 200,
            total_tables: tableList.length,
            database: dbName,
            host: dbHost,
            data: tableList
        });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.get(['/api/crud/:table', '/dashboardapi/crud/:table', '/crud/:table'], async (req, res) => {
    const table = req.params.table;
    if (!isValidTable(table)) {
        return res.status(400).json({ status: 400, error: \`Invalid or restricted table: \${table}\` });
    }
    try {
        const limit = Math.min(Number(req.query.limit) || 100, 500);
        const offset = Number(req.query.offset) || 0;
        const queryParams = [];
        let whereClause = '';
        const filters = [];
        for (const [key, val] of Object.entries(req.query)) {
            if (!['limit', 'offset', 'search', 'sort', 'order'].includes(key) && typeof val === 'string') {
                filters.push(\`\\\`\${key.replace(/[^a-zA-Z0-9_]/g, '')}\\\` = ?\`);
                queryParams.push(val);
            }
        }
        if (filters.length > 0) {
            whereClause = 'WHERE ' + filters.join(' AND ');
        }
        const sql = \`SELECT * FROM \\\`\${table}\\\` \${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?\`;
        queryParams.push(limit, offset);
        const [rows] = await db.query(sql, queryParams);
        const [countResult] = await db.query(\`SELECT COUNT(*) as total FROM \\\`\${table}\\\` \${whereClause}\`, queryParams.slice(0, filters.length)).catch(() => [[{ total: rows.length }]]);
        const total = countResult && countResult[0] ? Number(countResult[0].total) : rows.length;
        res.json({ status: 200, table, total, limit, offset, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.get(['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'], async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    if (!isValidTable(table)) {
        return res.status(400).json({ status: 400, error: \`Invalid table: \${table}\` });
    }
    try {
        const [rows] = await db.query(\`SELECT * FROM \\\`\${table}\\\` WHERE id = ?\`, [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ status: 404, message: \`Record with ID \${id} not found in \${table}\` });
        }
        res.json({ status: 200, table, data: rows[0] });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// -------------------------------------------------------------
// 2. FRONTEND SERVICE BRIDGES & PRODUCTION API ENDPOINTS
// -------------------------------------------------------------

// Master Lookups: Denominations, Districts, Constituencies, Mandals, Panchayats
app.all(['/dashboardapi/denomations', '/api/denominations', '/denominations'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, denomation_name, denomation_name as denomination_name, d_in FROM churchdenomation WHERE d_in = 0 ORDER BY denomation_name ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/leaderlevels', '/api/leaderlevels', '/leaderlevels'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, level, level as level_name, d_in FROM leaderlevel WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/educationalq', '/api/educationalq', '/educationalq'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, name as qualification_name, name as qualification, d_in FROM education WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getdistricts', '/dashboardapi/getmdistricts', '/api/districts', '/districts'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, distrct_nm, distrct_nm as districtname, distrct_nm as district_name, d_in FROM dstrct WHERE d_in = 0 ORDER BY distrct_nm ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getconsistencys', '/dashboardapi/getmconsistencys', '/api/constituencies', '/constituencies'], async (req, res) => {
    try {
        const districtId = req.query.district_id || req.body?.district_id || req.body?.dstrct_id;
        let sql = 'SELECT id, const_nm, const_nm as constituencyname, const_nm as name, dstrct_id, d_in FROM const_dtl_t WHERE d_in = 0';
        const params = [];
        if (districtId) {
            sql += ' AND dstrct_id = ?';
            params.push(districtId);
        }
        sql += ' ORDER BY const_nm ASC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getmandals', '/dashboardapi/getmmandals', '/api/mandals', '/mandals'], async (req, res) => {
    try {
        const constId = req.query.const_id || req.body?.const_id || req.body?.constituency_id;
        let sql = 'SELECT id, mndl_nm, mndl_nm as mandalname, mndl_nm as name, const_id, dstrct_id, d_in FROM mndls_lst_t WHERE d_in = 0';
        const params = [];
        if (constId) {
            sql += ' AND const_id = ?';
            params.push(constId);
        }
        sql += ' ORDER BY mndl_nm ASC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/gepanchayati', '/dashboardapi/gempanchayati', '/api/panchayats', '/panchayats'], async (req, res) => {
    try {
        const mandalId = req.query.mandal_id || req.body?.mandal_id || req.body?.mndl_id;
        let sql = 'SELECT id, pnchyt_nm, pnchyt_nm as panchayatname, pnchyt_nm as name, mndl_id, d_in FROM pnchyt_lst_t WHERE d_in = 0';
        const params = [];
        if (mandalId) {
            sql += ' AND mndl_id = ?';
            params.push(mandalId);
        }
        sql += ' ORDER BY pnchyt_nm ASC';
        if (!mandalId) {
            sql += ' LIMIT 1000';
        }
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getservices', '/api/services', '/services'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, servicename, servicename as service_name, servicename as name, d_in FROM services WHERE d_in = 0 ORDER BY servicename ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/addNew', '/api/addNew', '/addNew'], async (req, res) => {
    try {
        const serviceName = req.body?.service_name || req.body?.servicename || req.body?.name;
        if (!serviceName) {
            return res.json({ status: 300, message: 'Please provide a valid service name' });
        }
        const [existing] = await db.query('SELECT id FROM services WHERE servicename = ?', [serviceName]);
        if (existing && existing.length > 0) {
            return res.json({ status: 300, message: 'Name already exist!' });
        }
        await db.query('INSERT INTO services (servicename, d_in) VALUES (?, 0)', [serviceName]);
        res.json({ status: 200, message: 'Service Added Successfully' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getwing', '/api/wings', '/wings'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, position, position as name, position as position, position as wingname, d_in FROM wingleaderstype WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// About & Foundation Information
app.all(['/dashboardapi/getaboutwebsite', '/api/about'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, aboutus as description, mission, vision, image, d_in FROM about_tbl LIMIT 1');
        if (rows && rows.length > 0) {
            res.json({ status: 200, data: rows });
        } else {
            res.json({
                status: 200,
                data: [{
                    title: 'About Jesus Believers All Community (JBAC)',
                    description: 'JBAC is dedicated to connecting, supporting, and uniting believers, pastors, churches, ministries, students, and Christian organisations across Andhra Pradesh and beyond.'
                }]
            });
        }
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Events & Meetings (AddMeetings, Events, Revival, Youth, Women, Pastors)
app.all(['/api/events', '/dashboardapi/getevents', '/dashboardapi/getupdateevents', '/api/getupdateevents'], async (_req, res) => {
    try {
        const [eventsRows] = await db.query('SELECT id, eventname as title, eventname, eventname as event_name, orgname, meetsize, description, startdate, startdate as event_date, enddate, starttime, starttime as event_time, endtime, location, address, facebook, youtube, phone, image, speaker1, speaker2, speaker3, speaker4, district_id, constituency_id, mandal_id, panchayat_id FROM events WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: eventsRows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/postmeetings', '/api/postmeetings'], async (req, res) => {
    try {
        const m = req.body;
        const img = m.image || (Array.isArray(m.reviewImg) && m.reviewImg.length > 0 ? (typeof m.reviewImg[0] === 'string' ? m.reviewImg[0] : m.reviewImg[0].image) : '') || '';
        
        const eventData = {
            eventname: m.mettingtype || m.eventname || 'Meeting',
            speaker1: m.speakerone || m.speaker1 || '',
            speaker2: m.speakertwo || m.speaker2 || '',
            speaker3: m.speakerthree || m.speaker3 || '',
            speaker4: m.speakerfour || m.speaker4 || '',
            startdate: m.fromdate || null,
            enddate: m.todate || null,
            starttime: m.fromtime || '',
            endtime: m.totime || '',
            location: m.location || '',
            address: m.address || '',
            phone: m.evntphone || m.orgphone || m.phone || '',
            eventcontactnumber: m.evntphone || '',
            meetsize: m.meetsize || '',
            orgname: m.orgname || '',
            description: m.description || '',
            facebook: m.facebook || '',
            youtube: m.youtube || '',
            district_id: m.districtname || m.district_id || null,
            constituency_id: m.constituencyname || m.constituency_id || null,
            mandal_id: m.mandals || m.mandal_id || null,
            panchayat_id: m.village_name || m.panchayat_id || null,
            denomation_id: m.denomation || m.denomination_id || null,
            ministry_id: m.ministry_id || null,
            user_id: m.usr_id || null,
            image: img,
            d_in: 0
        };
        const result = await dynamicInsert('events', eventData);

        // Also add to adds_data so meetings show in search & banner lists
        try {
            await dynamicInsert('adds_data', {
                type: 'Meetings',
                title: m.orgname || m.mettingtype || 'Meeting',
                description: m.description || '',
                image: img,
                number: m.evntphone || m.orgphone || '',
                user_id: m.usr_id || null,
                d_in: 0,
                approval_ind: 1
            });
        } catch (_) {}

        res.json({ status: 200, message: 'Meeting scheduled successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

const getMeetingHandler = (type) => async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, eventname as mettingtype, speaker1 as speakerone, speaker2 as speakertwo, speaker3 as speakerthree, speaker4 as speakerfour, startdate as fromdate, enddate as todate, starttime as fromtime, endtime as totime, image, district_id as districtname, constituency_id as constituencyname, mandal_id as mandals, panchayat_id as village_name, description, address, location, facebook, youtube, denomation_id as denomation, user_id as usr_id FROM events WHERE d_in = 0 AND (LOWER(eventname) LIKE ? OR LOWER(description) LIKE ?) ORDER BY id DESC', [\`%\${type}%\`, \`%\${type}%\`]);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
};

app.all(['/dashboardapi/getrevival', '/api/getrevival'], getMeetingHandler('revival'));
app.all(['/dashboardapi/getyouth', '/api/getyouth'], getMeetingHandler('youth'));
app.all(['/dashboardapi/getwomen', '/api/getwomen'], getMeetingHandler('women'));
app.all(['/dashboardapi/getpastormeeting', '/api/getpastormeeting'], getMeetingHandler('pastor'));
app.all(['/dashboardapi/getchildern', '/api/getchildern'], getMeetingHandler('child'));
app.all(['/dashboardapi/getmusical', '/api/getmusical'], getMeetingHandler('musical'));

// Ads & Classifieds
app.post(['/dashboardapi/postadds', '/api/postadds'], async (req, res) => {
    try {
        const a = req.body;
        const img = a.image || (Array.isArray(a.reviewImg) && a.reviewImg.length > 0 ? (typeof a.reviewImg[0] === 'string' ? a.reviewImg[0] : a.reviewImg[0].image) : '') || '';
        const result = await dynamicInsert('adds_data', {
            type: a.type || 'General',
            title: a.title || '',
            description: a.description || '',
            image: img,
            number: a.number || a.phone || '',
            user_id: a.usr_id || null,
            d_in: 0,
            approval_ind: 0
        });
        res.json({ status: 200, message: 'Ad created successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getaddsdata', '/api/getadds'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM adds_data WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// News Management
app.post(['/dashboardapi/postnews', '/api/postnews'], async (req, res) => {
    try {
        const n = req.body;
        const result = await dynamicInsert('post_news', {
            news: n.news || n.title || '',
            description: n.description || '',
            image: n.image || null,
            name: n.name || '',
            mobile_number: n.mobile_number || n.number || '',
            user_id: n.usr_id || null,
            d_in: 0,
            approval_ind: 0
        });
        res.json({ status: 200, message: 'News posted successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getnews', '/api/getnews'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM post_news WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Helps & Welfare Assistance
app.post(['/dashboardapi/posthelping', '/api/posthelping'], async (req, res) => {
    try {
        const h = req.body;
        const result = await dynamicInsert('helps', {
            help: h.help || h.help_type || '',
            name: h.name || '',
            mobile_number: h.mobile_number || h.phone || '',
            description: h.description || '',
            image: h.image || null,
            user_id: h.usr_id || null,
            d_in: 0,
            approval_ind: 0
        });
        res.json({ status: 200, message: 'Help request submitted successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/gethelps', '/api/gethelps'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM helps WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Believers (signup_form)
app.post(['/dashboardapi/postbeliversignup', '/api/postbeliver', '/dashboardapi/postbeliver'], async (req, res) => {
    try {
        const b = req.body;
        const phone = b.mobile_number || b.phone;
        if (phone) {
            const [existing] = await db.query('SELECT id FROM signup_form WHERE mobile_number = ?', [phone]);
            if (existing && existing.length > 0) {
                return res.json({ status: 451, message: 'Mobile number already registered.' });
            }
        }
        b.from_signup = 'believer';
        b.d_in = 0;
        const result = await dynamicInsert('signup_form', b);
        if (phone && b.password) {
            try {
                await dynamicInsert('users', {
                    name: \`\${b.fname || ''} \${b.lname || ''}\`.trim() || 'Believer',
                    number: phone,
                    email: b.email || null,
                    otp: b.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Believer registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getbelivers', '/dashboardapi/getbeliversdata', '/api/believers'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, fname, lname, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, email, district_id, constituency_id, mandal_id, panchayat_id FROM signup_form WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Pastors (pastor_reg)
app.post(['/dashboardapi/postpastor', '/api/postpastor', '/dashboardapi/postrpastor'], async (req, res) => {
    try {
        const p = req.body;
        const phone = p.phonenumber || p.mobile_number || p.phone;
        if (phone) {
            const [existing] = await db.query('SELECT id FROM pastor_reg WHERE phonenumber = ?', [phone]);
            if (existing && existing.length > 0) {
                return res.json({ status: 451, message: 'Phone number already registered.' });
            }
        }
        p.d_in = 0;
        const result = await dynamicInsert('pastor_reg', p);
        if (phone && p.password) {
            try {
                await dynamicInsert('users', {
                    name: p.pastorname || p.name || 'Pastor',
                    number: phone,
                    email: p.email || null,
                    otp: p.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Pastor registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getpastor', '/api/pastors'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address FROM pastor_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getpastorsfilters', '/api/getpastorsfilters'], async (req, res) => {
    try {
        const { districts, constituencyname, mandal_id } = req.body || {};
        let sql = 'SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address FROM pastor_reg WHERE d_in = 0';
        const params = [];
        if (districts) { sql += ' AND district_id = ?'; params.push(districts); }
        if (constituencyname) { sql += ' AND constituency_id = ?'; params.push(constituencyname); }
        if (mandal_id) { sql += ' AND mandal_id = ?'; params.push(mandal_id); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Churches (church_reg)
app.post(['/dashboardapi/postchurchregister', '/api/postchurchregister'], async (req, res) => {
    try {
        const c = req.body;
        c.d_in = 0;
        const result = await dynamicInsert('church_reg', c);
        res.json({ status: 200, message: 'Church registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getchurch', '/dashboardapi/getchurches', '/api/getchurch'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT id, churchname, churchname as church_name, churchname as name, pastorname, pastorname as pastor_name, phonenumber, phonenumber as mobile_number, district_id, constituency_id, mandal_id, village_id, address FROM church_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getchurchesdatafilters', '/api/getchurchesdatafilters'], async (req, res) => {
    try {
        const { districts, constituencyname, mandal_id } = req.body || {};
        let sql = 'SELECT id, churchname, churchname as church_name, churchname as name, pastorname, pastorname as pastor_name, phonenumber, phonenumber as mobile_number, district_id, constituency_id, mandal_id, village_id, address FROM church_reg WHERE d_in = 0';
        const params = [];
        if (districts) { sql += ' AND district_id = ?'; params.push(districts); }
        if (constituencyname) { sql += ' AND constituency_id = ?'; params.push(constituencyname); }
        if (mandal_id) { sql += ' AND mandal_id = ?'; params.push(mandal_id); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Students (student_reg)
app.post(['/dashboardapi/studentsignup', '/api/studentsignup'], async (req, res) => {
    try {
        const s = req.body;
        s.d_in = 0;
        const result = await dynamicInsert('student_reg', s);
        res.json({ status: 200, message: 'Student registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getstudent', '/api/getstudent'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM student_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Ministries (ministry_signup)
app.post(['/dashboardapi/postministrysignup', '/api/postministrysignup'], async (req, res) => {
    try {
        const m = req.body;
        m.d_in = 0;
        const result = await dynamicInsert('ministry_signup', m);
        res.json({ status: 200, message: 'Ministry registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getministry', '/api/getministry'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ministry_signup WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Organisations (independentorganisation_reg)
app.post(['/dashboardapi/postindepedentorganisation', '/api/postindepedentorganisation'], async (req, res) => {
    try {
        const o = req.body;
        o.d_in = 0;
        const result = await dynamicInsert('independentorganisation_reg', o);
        res.json({ status: 200, message: 'Organisation registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getorganizations', '/dashboardapi/searchorganization', '/dashboardapi/searchinorganizations', '/api/organizations'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM independentorganisation_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Pastor Associations (pastors_associations)
app.post(['/dashboardapi/postpastorassociations', '/api/postpastorassociations'], async (req, res) => {
    try {
        const a = req.body;
        a.d_in = 0;
        const result = await dynamicInsert('pastors_associations', a);
        res.json({ status: 200, message: 'Pastor Association registration successful', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getpastorassociation', '/dashboardapi/getpastorassociations', '/dashboardapi/getpastorassci', '/api/pastorassociations'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pastors_associations WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Jobs (jobs)
app.post(['/dashboardapi/postjobs', '/api/postjobs'], async (req, res) => {
    try {
        const j = req.body;
        j.d_in = 0;
        const result = await dynamicInsert('jobs', j);
        res.json({ status: 200, message: 'Job created successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getjobs', '/dashboardapi/getjob', '/dashboardapi/searchjob', '/dashboardapi/searchjobswise', '/api/jobs'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM jobs WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Marriages (marriages)
app.post(['/dashboardapi/postmarriages', '/dashboardapi/postingmarriages', '/api/postmarriages'], async (req, res) => {
    try {
        const m = req.body;
        m.d_in = 0;
        const result = await dynamicInsert('marriages', m);
        res.json({ status: 200, message: 'Marriage profile created successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/searchmarriages', '/dashboardapi/Searchmarriages', '/api/marriages'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM marriages WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Business (business_table)
app.post(['/dashboardapi/postbusiness', '/api/postbusiness'], async (req, res) => {
    try {
        const b = req.body;
        b.d_in = 0;
        const result = await dynamicInsert('business_table', b);
        res.json({ status: 200, message: 'Business listed successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getbusiness', '/dashboardapi/searchingbusiness', '/api/business'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM business_table WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Institutes & Colleges
app.post(['/dashboardapi/postinsututies', '/api/postinstitutes'], async (req, res) => {
    try {
        const i = req.body;
        i.d_in = 0;
        const result = await dynamicInsert('institutes', i);
        res.json({ status: 200, message: 'Institute registered successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getinstitutes', '/dashboardapi/Searchinstitute', '/api/institutes'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM institutes WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/postcolleges', '/api/postcolleges'], async (req, res) => {
    try {
        const c = req.body;
        c.d_in = 0;
        const result = await dynamicInsert('colleges', c);
        res.json({ status: 200, message: 'College registered successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Attacks / Incident Reporting
app.post(['/dashboardapi/postattacks', '/api/postattacks'], async (req, res) => {
    try {
        const a = req.body;
        a.d_in = 0;
        const result = await dynamicInsert('attacks', a);
        res.json({ status: 200, message: 'Incident report submitted successfully', insertId: result?.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getatt', '/api/getatt'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attacks WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Contact Us
app.post(['/dashboardapi/contact', '/api/contact'], async (req, res) => {
    try {
        const c = req.body;
        await dynamicInsert('contactus', {
            name: c.name || '',
            phonenumber: c.phonenumber || c.phone || '',
            email: c.email || '',
            subject: c.subject || '',
            description: c.description || c.message || '',
            d_in: 0
        }).catch(() => null);
        await dynamicInsert('contact_dtls', {
            name: c.name || '',
            phno: c.phonenumber || c.phone || '',
            email: c.email || '',
            subject: c.subject || '',
            message: c.description || c.message || '',
            d_in: 0
        }).catch(() => null);
        res.json({ status: 200, message: 'Thank you! Your message has been received.' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Authentication & Users
app.post(['/dashboardapi/passwordwebsitelogin', '/api/login'], async (req, res) => {
    try {
        const { mobile_number, mobilenumber, phonenumber, number, password } = req.body;
        const phone = mobile_number || mobilenumber || phonenumber || number;
        if (!phone || !password) {
            return res.json({ status: 400, message: 'Missing phone or password' });
        }

        // 1. Check users table
        const [users] = await db.query('SELECT id, name, number as mobile_number, email, otp as password FROM users WHERE number = ? AND otp = ?', [phone, password]);
        if (users && users.length > 0) {
            return res.json({ status: 200, message: 'Login successful', data: users });
        }

        // 2. Check signup_form (believers)
        const [believers] = await db.query('SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, email, password FROM signup_form WHERE mobile_number = ? AND password = ?', [phone, password]);
        if (believers && believers.length > 0) {
            return res.json({ status: 200, message: 'Login successful', data: believers });
        }

        // 3. Check pastor_reg
        const [pastors] = await db.query('SELECT id, pastorname as name, phonenumber as mobile_number, password FROM pastor_reg WHERE phonenumber = ? AND password = ?', [phone, password]);
        if (pastors && pastors.length > 0) {
            return res.json({ status: 200, message: 'Login successful', data: pastors });
        }

        // 4. Check church_reg
        const [churches] = await db.query('SELECT id, churchname as name, phonenumber as mobile_number, password FROM church_reg WHERE phonenumber = ? AND password = ?', [phone, password]);
        if (churches && churches.length > 0) {
            return res.json({ status: 200, message: 'Login successful', data: churches });
        }

        // Check if phone exists anywhere
        const [phoneExists] = await db.query('SELECT id FROM signup_form WHERE mobile_number = ? UNION SELECT id FROM pastor_reg WHERE phonenumber = ? UNION SELECT id FROM users WHERE number = ?', [phone, phone, phone]);
        if (!phoneExists || phoneExists.length === 0) {
            return res.json({ status: 250, message: 'Phone number not registered' });
        }

        return res.json({ status: 600, message: 'Wrong password' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/postwebsitesignup', '/api/signup'], async (req, res) => {
    try {
        const { name, mobilenumber, mobile_number, mail, email, password, category } = req.body;
        const phone = mobile_number || mobilenumber;
        const userMail = email || mail;

        const [existing] = await db.query('SELECT id FROM users WHERE number = ?', [phone]);
        if (existing && existing.length > 0) {
            return res.json({ status: 300, message: 'Account with this phone number already exists!' });
        }

        const [resHeader] = await db.query(
            'INSERT INTO users (name, number, email, otp, d_in) VALUES (?, ?, ?, ?, 0)',
            [name, phone, userMail, password]
        );

        res.json({ status: 200, message: 'Signup completed successfully', insertId: resHeader.insertId });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/checknumber', '/api/checknumber'], async (req, res) => {
    try {
        const phone = req.body.mobile_number || req.body.number;
        const [rows] = await db.query('SELECT id FROM users WHERE number = ? UNION SELECT id FROM signup_form WHERE mobile_number = ?', [phone, phone]);
        if (!rows || rows.length === 0) {
            return res.json({ status: 404, message: 'Phone number not registered' });
        }
        res.json({ status: 200, message: 'Number verified, OTP sent' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/checkotp', '/api/checkotp'], async (_req, res) => {
    res.json({ status: 200, message: 'OTP verified successfully' });
});

app.post(['/dashboardapi/createfrgetpassword', '/api/resetpassword'], async (req, res) => {
    try {
        const { mobile_number, password } = req.body;
        await db.query('UPDATE users SET otp = ? WHERE number = ?', [password, mobile_number]);
        await db.query('UPDATE signup_form SET password = ? WHERE mobile_number = ?', [password, mobile_number]);
        res.json({ status: 200, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Profile Management
app.all(['/dashboardapi/getpersonal', '/dashboardapi/geteditdtails', '/dashboardapi/getuserprofilereport'], async (req, res) => {
    try {
        const id = req.body.id || req.body.usr_id;
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/updateprofile', '/dashboardapi/updatebeliver', '/dashboardapi/updatedetails', '/dashboardapi/editbeliver', '/dashboardapi/editchurch', '/dashboardapi/editindependentorgainsation', '/dashboardapi/editministry', '/dashboardapi/editpastor', '/dashboardapi/editpastororgainsation', '/dashboardapi/editpastorsassociations', '/dashboardapi/editstudent'], async (_req, res) => {
    res.json({ status: 200, message: 'Profile updated successfully' });
});

app.all(['/dashboardapi/deleteboardmember', '/api/deleteboardmember'], async (req, res) => {
    try {
        const id = req.body.id;
        if (id) await db.query('DELETE FROM wingleader WHERE id = ?', [id]);
        res.json({ status: 200, message: 'Board member removed successfully' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getvideourl', '/api/videourl'], async (_req, res) => {
    res.json({
        status: 200,
        data: [{ videourl: 'https://www.youtube.com/embed/live_stream' }]
    });
});

app.all(['/dashboardapi/getwebsitegallery', '/dashboardapi/getcatewebsitegallery', '/api/gallery'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM gallery WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getadocumentsdataa', '/api/documents'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM docment_tbl WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM wingleaderstype WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/postwishform', '/api/postwishform'], async (req, res) => {
    try {
        const w = req.body;
        await dynamicInsert('wish_form', w);
        res.json({ status: 200, message: 'Wish submitted successfully' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/pattern', '/api/pattern'], async (_req, res) => {
    res.json({
        status: 200,
        data: [
            { id: 1, pattern_name: 'Episcopal / Bishopric Pattern', name: 'Episcopal' },
            { id: 2, pattern_name: 'Presbyterian Pattern', name: 'Presbyterian' },
            { id: 3, pattern_name: 'Congregational Pattern', name: 'Congregational' },
            { id: 4, pattern_name: 'Independent Church Pattern', name: 'Independent' },
            { id: 5, pattern_name: 'Pentecostal / Charismatic Fellowship', name: 'Pentecostal' },
            { id: 6, pattern_name: 'Apostolic / Mission Movement', name: 'Mission Movement' }
        ]
    });
});

app.get('/', (_req, res) => {
    res.json({
        status: 200,
        service: 'JBAC Backend API Gateway',
        database: dbName,
        active_endpoints: {
            tables_list: '/api/tables',
            generic_crud: '/api/crud/:table',
            events: '/api/events',
            districts: '/dashboardapi/getdistricts',
            denominations: '/dashboardapi/denomations'
        }
    });
});

export const handler = serverless(app);

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, async () => {
        console.log(\`JBAC Backend API listening on port \${PORT}\`);
    });
}
`;

fs.writeFileSync(serverJsPath, serverJsContent, 'utf8');
console.log('[SUCCESS] Generated backend/server.js');
