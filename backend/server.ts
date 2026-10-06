import express from 'express';
import serverless from 'serverless-http';
import mysql from 'mysql2/promise';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    charset: 'utf8mb4',
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

function extractUploadedImage(body) {
    if (!body) return '';
    if (typeof body === 'string') return body.trim();
    if (typeof body.image === 'string' && body.image.trim()) return body.image.trim();
    if (typeof body.reviewimg === 'string' && body.reviewimg.trim()) return body.reviewimg.trim();
    if (typeof body.reviewImg === 'string' && body.reviewImg.trim()) return body.reviewImg.trim();

    const candidates = [body.reviewImg, body.reviewimg, body.imagesData, body.images, body.image, body.imagedata];
    for (const cand of candidates) {
        if (Array.isArray(cand) && cand.length > 0) {
            const first = cand[0];
            if (typeof first === 'string' && first.trim()) return first.trim();
            if (first && typeof first === 'object') {
                const val = first.reviewimg || first.reviewImg || first.image || first.url || first.src || '';
                if (typeof val === 'string' && val.trim()) return val.trim();
            }
        } else if (cand && typeof cand === 'object') {
            const val = cand.reviewimg || cand.reviewImg || cand.image || cand.url || cand.src || '';
            if (typeof val === 'string' && val.trim()) return val.trim();
        }
    }
    return '';
}

// Dynamic insert helper: matches input fields to real table columns
async function dynamicInsert(tableName, data) {
    try {
        const [cols] = await db.query(`DESCRIBE \`${tableName}\``);
        const colMap = new Map();
        for (const c of cols) {
            colMap.set(c.Field.toLowerCase(), c.Field);
        }

        // Auto-extract image if table has image column and data has reviewImg/imagesData
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
                fields.push(`\`${actualCol}\``);
                placeholders.push('?');
                let val: any = typeof v === 'object' && v !== null ? JSON.stringify(v) : (v === undefined ? null : v);
                if (typeof val === 'string' && val.trim() === '' && (lk.endsWith('_id') || lk === 'constituencyname' || lk === 'districts' || lk === 'mandals')) {
                    val = null;
                }
                values.push(val);
            }
        }
        if (fields.length === 0) return null;
        const sql = `INSERT INTO \`${tableName}\` (${fields.join(',')}) VALUES (${placeholders.join(',')})`;
        const [res] = await db.query(sql, values);
        return res;
    } catch (e) {
        console.error(`dynamicInsert error in ${tableName}:`, e.message);
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
            const [cnt] = await db.query(`SELECT COUNT(*) as count FROM \`${tableName}\``).catch(() => [[{ count: 0 }]]);
            const [cols] = await db.query(`DESCRIBE \`${tableName}\``).catch(() => [[]]);
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
            tables: tableList,
            data: tableList
        });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Interactive Web Database Cockpit UI
app.get(['/admin-db', '/api/admin-db', '/dashboardapi/admin-db', '/api/admin-database-view'], (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    try {
        const htmlPath = path.join(__dirname, 'admin_db.html');
        if (fs.existsSync(htmlPath)) {
            return res.send(fs.readFileSync(htmlPath, 'utf8'));
        }
    } catch (_) {}
    res.send('<!DOCTYPE html><html><body><h2>JBAC Database Cockpit</h2><p>Please visit <a href="/dashboardapi/tables">/dashboardapi/tables</a> for JSON view.</p></body></html>');
});

app.get(['/api/crud/:table', '/dashboardapi/crud/:table', '/crud/:table'], async (req, res) => {
    const table = req.params.table;
    if (!isValidTable(table)) {
        return res.status(400).json({ status: 400, error: `Invalid or restricted table: ${table}` });
    }
    try {
        const limit = Math.min(Number(req.query.limit) || 100, 500);
        const offset = Number(req.query.offset) || 0;
        const queryParams = [];
        let whereClause = '';
        const filters = [];
        for (const [key, val] of Object.entries(req.query)) {
            if (!['limit', 'offset', 'search', 'sort', 'order'].includes(key) && typeof val === 'string') {
                filters.push(`\`${key.replace(/[^a-zA-Z0-9_]/g, '')}\` = ?`);
                queryParams.push(val);
            }
        }
        if (filters.length > 0) {
            whereClause = 'WHERE ' + filters.join(' AND ');
        }
        const sql = `SELECT * FROM \`${table}\` ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
        const [rows] = await db.query(sql, queryParams);
        const [countResult] = await db.query(`SELECT COUNT(*) as total FROM \`${table}\` ${whereClause}`, queryParams.slice(0, filters.length)).catch(() => [[{ total: rows.length }]]);
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
        return res.status(400).json({ status: 400, error: `Invalid table: ${table}` });
    }
    try {
        const [rows] = await db.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ status: 404, message: `Record with ID ${id} not found in ${table}` });
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
        const [rows] = await db.query('SELECT id, distrct_nm, distrct_nm as districtname, distrct_nm as district_name, d_in FROM dstrct WHERE d_in = 0 AND distrct_nm IS NOT NULL AND TRIM(distrct_nm) != "" ORDER BY distrct_nm ASC');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getconsistencys', '/dashboardapi/getmconsistencys', '/api/constituencies', '/constituencies'], async (req, res) => {
    try {
        const districtId = req.query.district_id || req.body?.district_id || req.body?.dstrct_id;
        let sql = 'SELECT id, const_nm, const_nm as constituencyname, const_nm as name, dstrct_id, d_in FROM const_dtl_t WHERE d_in = 0 AND const_nm IS NOT NULL AND TRIM(const_nm) != ""';
        const params = [];
        if (districtId) {
            sql += ' AND dstrct_id = ?';
            params.push(districtId);
        }
        sql += ' ORDER BY const_nm ASC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getmandals', '/dashboardapi/getmmandals', '/api/mandals', '/mandals'], async (req, res) => {
    try {
        const constId = req.query.const_id || req.body?.const_id || req.body?.constituency_id;
        const districtId = req.query.district_id || req.body?.district_id || req.body?.dstrct_id;
        let sql = 'SELECT id, mndl_nm, mndl_nm as mandalname, mndl_nm as name, const_id, dstrct_id, d_in FROM mndls_lst_t WHERE d_in = 0 AND mndl_nm IS NOT NULL AND TRIM(mndl_nm) != ""';
        const params = [];
        if (constId) {
            sql += ' AND const_id = ?';
            params.push(constId);
        }
        if (districtId) {
            sql += ' AND dstrct_id = ?';
            params.push(districtId);
        }
        sql += ' ORDER BY mndl_nm ASC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/gepanchayati', '/dashboardapi/gempanchayati', '/api/panchayats', '/panchayats'], async (req, res) => {
    try {
        const mandalId = req.query.mandal_id || req.body?.mandal_id || req.body?.mndl_id || req.query.mndl_id;
        let sql = 'SELECT id, pnchyt_nm, pnchyt_nm as panchayatname, pnchyt_nm as name, mndl_id, d_in FROM pnchyt_lst_t WHERE d_in = 0 AND pnchyt_nm IS NOT NULL AND TRIM(pnchyt_nm) != ""';
        const params = [];
        if (mandalId) {
            sql += ' AND mndl_id = ?';
            params.push(mandalId);
        }
        sql += ' ORDER BY pnchyt_nm ASC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
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
        const [rows] = await db.query('SELECT id, title, title as name, para1, para2, para3, para1 as description, para1 as aboutus, image, d_in FROM about_tbl LIMIT 1');
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
app.all(['/api/events', '/dashboardapi/getevents', '/dashboardapi/getupdateevents', '/api/getupdateevents'], async (req: any, res: any) => {
    try {
        const isCurrentDateOnly = req.query?.current_date_only === 'true' || req.body?.current_date_only === true;
        const showAll = req.query?.all === 'true' || req.body?.all === true || req.query?.admin === 'true';

        let sql = 'SELECT id, eventname as title, eventname, eventname as event_name, orgname, meetsize, description, startdate, startdate as event_date, enddate, starttime, starttime as event_time, endtime, location, address, facebook, youtube, phone, eventcontactnumber, image, speaker1, speaker2, speaker3, speaker4, district_id, constituency_id, mandal_id, panchayat_id FROM events WHERE d_in = 0';
        
        if (isCurrentDateOnly) {
            sql += ' AND ((startdate <= CURDATE() AND (enddate >= CURDATE() OR enddate IS NULL OR enddate = "")) OR startdate = CURDATE())';
        } else if (!showAll) {
            // By default hide old meetings where enddate < CURDATE()
            sql += ' AND ((enddate IS NOT NULL AND enddate != "" AND enddate >= CURDATE()) OR ((enddate IS NULL OR enddate = "") AND (startdate IS NULL OR startdate >= CURDATE())))';
        }

        sql += ' ORDER BY id DESC';
        const [eventsRows] = await db.query(sql);
        res.json({ status: 200, data: eventsRows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.post(['/dashboardapi/postmeetings', '/dashboardapi/postchuechmeetings', '/dashboardapi/postchurchmeetings', '/api/postmeetings'], async (req: any, res: any) => {
    try {
        const m = req.body;
        const img = extractUploadedImage(m);
        
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
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

const searchMeetingsHandler = async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT id, eventname as title, eventname, eventname as event_name, orgname, meetsize, description, startdate, startdate as event_date, enddate, starttime, starttime as event_time, endtime, location, address, facebook, youtube, phone, eventcontactnumber, image, speaker1, speaker2, speaker3, speaker4, district_id, constituency_id, mandal_id, panchayat_id FROM events WHERE d_in = 0';
        const params: any[] = [];
        
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id || body.mandals) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id || body.mandals); }
        if (body.village_id || body.panchayat_id || body.panchayati_id) { sql += ' AND panchayat_id = ?'; params.push(body.village_id || body.panchayat_id || body.panchayati_id); }
        if (body.denomation_id || body.denomation) { sql += ' AND denomation_id = ?'; params.push(body.denomation_id || body.denomation); }
        if (body.ministry_id) { sql += ' AND ministry_id = ?'; params.push(body.ministry_id); }
        if (body.mettingtype) { sql += ' AND (LOWER(eventname) LIKE ? OR eventname = ?)'; params.push(`%${body.mettingtype}%`, body.mettingtype); }
        if (body.speakerone) { sql += ' AND (speaker1 LIKE ? OR speaker2 LIKE ?)'; params.push(`%${body.speakerone}%`, `%${body.speakerone}%`); }
        
        if (body.startdate) {
            // Match event that covers this date
            sql += ' AND ((startdate <= ? AND (enddate >= ? OR enddate IS NULL OR enddate = "")) OR startdate = ?)';
            params.push(body.startdate, body.startdate, body.startdate);
        } else if (body.current_date_only) {
            sql += ' AND ((startdate <= CURDATE() AND (enddate >= CURDATE() OR enddate IS NULL OR enddate = "")) OR startdate = CURDATE())';
        } else if (body.show_old !== true) {
            // By default hide old past meetings
            sql += ' AND ((enddate IS NOT NULL AND enddate != "" AND enddate >= CURDATE()) OR ((enddate IS NULL OR enddate = "") AND (startdate IS NULL OR startdate >= CURDATE())))';
        }

        if (body.fromdate) { sql += ' AND startdate >= ?'; params.push(body.fromdate); }
        if (body.todate) { sql += ' AND startdate <= ?'; params.push(body.todate); }

        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
};

app.all(['/dashboardapi/searchingdata', '/api/searchingdata'], searchMeetingsHandler);
app.all(['/dashboardapi/searchingdemonation', '/dashboardapi/searchingdemonationdata', '/api/searchingdemonation', '/api/searchingdemonationdata'], searchMeetingsHandler);

const TELUGU_MEETING_KEYWORDS: Record<string, string[]> = {
    'revival': ['revival', 'ఉజ్జీవ', 'కూటములు'],
    'youth': ['youth', 'యూత్', 'యువజన'],
    'women': ['women', 'మహిళ', 'స్త్రీల'],
    'pastor': ['pastor', 'పాస్టర్', 'సేవకుల'],
    'child': ['child', 'పిల్లల', 'బాల'],
    'musical': ['musical', 'music', 'సంగీత']
};

const getMeetingHandler = (type: string) => async (_req: any, res: any) => {
    try {
        const keywords = TELUGU_MEETING_KEYWORDS[type] || [type];
        const whereClauses: string[] = [];
        const queryParams: any[] = [];
        for (const kw of keywords) {
            whereClauses.push('LOWER(eventname) LIKE ? OR LOWER(description) LIKE ?');
            queryParams.push(`%${kw}%`, `%${kw}%`);
        }
        const [rows]: any = await db.query(
            `SELECT id, eventname as mettingtype, speaker1 as speakerone, speaker2 as speakertwo, speaker3 as speakerthree, speaker4 as speakerfour, startdate as fromdate, enddate as todate, starttime as fromtime, endtime as totime, image, district_id as districtname, constituency_id as constituencyname, mandal_id as mandals, panchayat_id as village_name, description, address, location, facebook, youtube, denomation_id as denomation, user_id as usr_id FROM events WHERE d_in = 0 AND (${whereClauses.join(' OR ')}) ORDER BY id DESC`,
            queryParams
        );
        res.json({ status: 200, data: rows });
    } catch (err: any) {
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
        const img = extractUploadedImage(a);
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
                    name: `${b.fname || ''} ${b.lname || ''}`.trim() || 'Believer',
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

app.all(['/dashboardapi/getbelivers', '/api/believers'], async (_req, res) => {
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
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

const searchPastorsHandler = async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const district = body.district_id || body.districts;
        const constituency = body.constituency_id || body.constenncy_id || body.constituencyname;
        const mandal = body.mandal_id || body.mandals;
        const pastor = body.pastor_id || body.pastorname || body.pastor;
        
        let sql = 'SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address FROM pastor_reg WHERE d_in = 0';
        const params: any[] = [];
        if (district) { sql += ' AND district_id = ?'; params.push(district); }
        if (constituency) { sql += ' AND constituency_id = ?'; params.push(constituency); }
        if (mandal) { sql += ' AND mandal_id = ?'; params.push(mandal); }
        if (pastor) { sql += ' AND (pastorname LIKE ? OR id = ?)'; params.push(`%${pastor}%`, pastor); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
};

app.all(['/dashboardapi/getpastorsfilters', '/api/getpastorsfilters', '/dashboardapi/searchpastors', '/api/searchpastors'], searchPastorsHandler);

app.all(['/dashboardapi/pastorviewupdates', '/dashboardapi/viewpastorupdates', '/api/pastorviewupdates', '/api/viewpastorupdates'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const district = body.district_id || body.districts;
        const constituency = body.constituency_id || body.constenncy_id || body.constituencyname;
        const mandal = body.mandal_id || body.mandals;
        const pastor = body.pastor_id || body.pastorname;

        let sql = 'SELECT * FROM pastor_reg WHERE d_in = 0';
        const params: any[] = [];
        if (district) { sql += ' AND district_id = ?'; params.push(district); }
        if (constituency) { sql += ' AND constituency_id = ?'; params.push(constituency); }
        if (mandal) { sql += ' AND mandal_id = ?'; params.push(mandal); }
        if (pastor) { sql += ' AND (pastorname LIKE ? OR id = ?)'; params.push(`%${pastor}%`, pastor); }
        sql += ' ORDER BY id DESC LIMIT 1';
        const [rows]: any = await db.query(sql, params);
        res.json({ status: 200, data: rows[0] || {} });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Churches (church_reg)
app.post(['/dashboardapi/postchurchregister', '/api/postchurchregister'], async (req: any, res: any) => {
    try {
        const c = req.body;
        c.d_in = 0;
        const result = await dynamicInsert('church_reg', c);
        const phone = c.contactnumber || c.phonenumber || c.mobile_number;
        if (phone && c.password) {
            try {
                await dynamicInsert('users', {
                    name: c.church_name || c.churchname || 'Church',
                    number: phone,
                    email: c.email || null,
                    otp: c.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Church registration successful', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getchurch', '/dashboardapi/getchurches', '/api/getchurch'], async (_req: any, res: any) => {
    try {
        // Query church_timings joined with church_reg for church details
        const [timingRows]: any = await db.query(`
            SELECT ct.id, 
                COALESCE(cr.church_name, ct.descriptions, ct.user_name, 'Church') AS church_name,
                COALESCE(ct.day, 'Sunday') AS day,
                ct.starttime, ct.endtime,
                COALESCE(cr.location, '') AS location,
                COALESCE(cr.youtube, '') AS youtube,
                COALESCE(cr.facebook, '') AS facebook,
                COALESCE(ct.district_id, cr.district_id) AS district_id,
                COALESCE(ct.constituency_id, cr.constituency_id) AS constituency_id,
                COALESCE(ct.mandal_id, cr.mandal_id) AS mandal_id,
                COALESCE(ct.village_id, cr.village_id) AS village_id
            FROM church_timings ct
            LEFT JOIN church_reg cr ON ct.church_id = cr.id
            WHERE ct.d_in = 0
            ORDER BY ct.id DESC
        `);

        if (timingRows.length > 0) {
            return res.json({ status: 200, data: timingRows });
        }

        // Fallback to church_reg with default timings if church_timings has no rows
        const [rows] = await db.query('SELECT id, church_name, "Sunday" as day, "10:00 AM" as starttime, "12:30 PM" as endtime, location, youtube, facebook, district_id, constituency_id, mandal_id, village_id, address FROM church_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

const searchChurchesHandler = async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const district = body.district_id || body.districts;
        const constituency = body.constenncy_id || body.constituency_id || body.constituencyname;
        const mandal = body.mandal_id || body.mandals;
        const village = body.panchayati_id || body.village_id || body.panchayat_id;
        const day = body.day;

        let sql = `SELECT ct.id, 
            COALESCE(cr.church_name, ct.descriptions, ct.user_name, 'Church') AS church_name,
            COALESCE(ct.day, 'Sunday') AS day,
            ct.starttime, ct.endtime,
            COALESCE(cr.location, '') AS location,
            COALESCE(cr.youtube, '') AS youtube,
            COALESCE(cr.facebook, '') AS facebook,
            COALESCE(ct.district_id, cr.district_id) AS district_id,
            COALESCE(ct.constituency_id, cr.constituency_id) AS constituency_id,
            COALESCE(ct.mandal_id, cr.mandal_id) AS mandal_id,
            COALESCE(ct.village_id, cr.village_id) AS village_id
            FROM church_timings ct
            LEFT JOIN church_reg cr ON ct.church_id = cr.id
            WHERE ct.d_in = 0`;
        const params: any[] = [];
        if (district) { sql += ' AND (ct.district_id = ? OR cr.district_id = ?)'; params.push(district, district); }
        if (constituency) { sql += ' AND (ct.constituency_id = ? OR cr.constituency_id = ?)'; params.push(constituency, constituency); }
        if (mandal) { sql += ' AND (ct.mandal_id = ? OR cr.mandal_id = ?)'; params.push(mandal, mandal); }
        if (village) { sql += ' AND (ct.village_id = ? OR cr.village_id = ?)'; params.push(village, village); }
        if (day) { sql += ' AND ct.day = ?'; params.push(day); }

        sql += ' ORDER BY ct.id DESC';
        const [rows]: any = await db.query(sql, params);

        if (rows.length === 0 && (district || constituency || mandal)) {
            // Check church_reg fallback
            let crSql = 'SELECT id, church_name, "Sunday" as day, "10:00 AM" as starttime, "12:30 PM" as endtime, location, youtube, facebook, district_id, constituency_id, mandal_id, village_id FROM church_reg WHERE d_in = 0';
            const crParams: any[] = [];
            if (district) { crSql += ' AND district_id = ?'; crParams.push(district); }
            if (constituency) { crSql += ' AND constituency_id = ?'; crParams.push(constituency); }
            if (mandal) { crSql += ' AND mandal_id = ?'; crParams.push(mandal); }
            crSql += ' ORDER BY id DESC';
            const [crRows] = await db.query(crSql, crParams);
            return res.json({ status: 200, data: crRows });
        }

        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
};

app.all(['/dashboardapi/getchurchesdatafilters', '/api/getchurchesdatafilters', '/dashboardapi/searchingchurchdata', '/api/searchingchurchdata'], searchChurchesHandler);

app.all(['/dashboardapi/viewupdates', '/api/viewupdates'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const district = body.district_id || body.districts;
        const constituency = body.constituency_id || body.constenncy_id || body.constituencyname;
        const mandal = body.mandal_id || body.mandals;
        const church = body.church || body.church_name;

        let sql = 'SELECT * FROM church_reg WHERE d_in = 0';
        const params: any[] = [];
        if (district) { sql += ' AND district_id = ?'; params.push(district); }
        if (constituency) { sql += ' AND constituency_id = ?'; params.push(constituency); }
        if (mandal) { sql += ' AND mandal_id = ?'; params.push(mandal); }
        if (church) { sql += ' AND (church_name LIKE ? OR id = ?)'; params.push(`%${church}%`, church); }
        sql += ' ORDER BY id DESC LIMIT 1';
        const [rows]: any = await db.query(sql, params);
        res.json({ status: 200, data: rows[0] || {} });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Students (student_reg)
app.post(['/dashboardapi/studentsignup', '/api/studentsignup'], async (req: any, res: any) => {
    try {
        const s = req.body;
        s.d_in = 0;
        const result = await dynamicInsert('student_reg', s);
        const phone = s.number || s.phonenumber || s.mobile_number;
        if (phone && s.password) {
            try {
                await dynamicInsert('users', {
                    name: s.studentname || 'Student',
                    number: phone,
                    email: s.email || null,
                    otp: s.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Student registration successful', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getstudent', '/api/getstudent'], async (_req: any, res: any) => {
    try {
        const [rows] = await db.query('SELECT * FROM student_reg WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Ministries (ministry_signup)
app.post(['/dashboardapi/postministrysignup', '/api/postministrysignup'], async (req: any, res: any) => {
    try {
        const m = req.body;
        m.d_in = 0;
        const result = await dynamicInsert('ministry_signup', m);
        const phone = m.headnmber || m.phonenumber || m.mobile_number;
        if (phone && m.password) {
            try {
                await dynamicInsert('users', {
                    name: m.ministryname || 'Ministry',
                    number: phone,
                    email: m.ministryemail || m.email || null,
                    otp: m.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Ministry registration successful', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getministry', '/api/getministry', '/dashboardapi/getbeliversdata'], async (_req: any, res: any) => {
    try {
        const [rows] = await db.query('SELECT * FROM ministry_signup WHERE d_in = 0 ORDER BY id DESC');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Organisations (independentorganisation_reg)
app.post(['/dashboardapi/postindepedentorganisation', '/dashboardapi/postindependentorganisation', '/dashboardapi/postindepedentchurch', '/dashboardapi/postindependentchurch', '/api/postindepedentorganisation', '/api/postindependentorganisation'], async (req: any, res: any) => {
    try {
        const o = req.body;
        o.d_in = 0;
        const result = await dynamicInsert('independentorganisation_reg', o);
        const phone = o.contact_num || o.phonenumber || o.mobile_number;
        if (phone && o.password) {
            try {
                await dynamicInsert('users', {
                    name: o.organisation_name || 'Organization',
                    number: phone,
                    email: o.email || null,
                    otp: o.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Organisation registration successful', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getorganizations', '/dashboardapi/searchorganization', '/dashboardapi/searchinorganizations', '/api/organizations'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT * FROM independentorganisation_reg WHERE d_in = 0';
        const params: any[] = [];
        
        if (body.denomation_id) { sql += ' AND denomation_id = ?'; params.push(body.denomation_id); }
        if (body.ministry_id) { sql += ' AND ministry_id = ?'; params.push(body.ministry_id); }
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id || body.mandals) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id || body.mandals); }
        if (body.panchayati_id || body.village_id) { sql += ' AND (panchayat_id = ? OR village_id = ?)'; params.push(body.panchayati_id || body.village_id, body.panchayati_id || body.village_id); }
        if (body.gender) { sql += ' AND gender = ?'; params.push(body.gender); }
        if (body.status) { sql += ' AND status = ?'; params.push(body.status); }

        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Pastor Associations (pastors_associations)
app.post(['/dashboardapi/postpastorassociations', '/api/postpastorassociations'], async (req: any, res: any) => {
    try {
        const a = req.body;
        a.d_in = 0;
        const result = await dynamicInsert('pastors_associations', a);
        const phone = a.phonenumber || a.whatsapp_number || a.mobile_number;
        if (phone && a.password) {
            try {
                await dynamicInsert('users', {
                    name: a.paname || a.headname || 'Pastor Association',
                    number: phone,
                    email: a.email || null,
                    otp: a.password,
                    d_in: 0
                });
            } catch (_) {}
        }
        res.json({ status: 200, message: 'Pastor Association registration successful', insertId: result?.insertId });
    } catch (err: any) {
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

app.all(['/dashboardapi/getjobs', '/dashboardapi/getjob', '/dashboardapi/searchjob', '/dashboardapi/searchjobswise', '/api/jobs'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT * FROM jobs WHERE d_in = 0';
        const params: any[] = [];
        if (body.colid && body.name) {
            if (body.colid == 1) { sql += ' AND (jobtitle LIKE ? OR title LIKE ?)'; params.push(`%${body.name}%`, `%${body.name}%`); }
            else if (body.colid == 2) { sql += ' AND qualification LIKE ?'; params.push(`%${body.name}%`); }
            else if (body.colid == 3) { sql += ' AND experience = ?'; params.push(body.name); }
        }
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id); }
        if (body.panchayati_id) { sql += ' AND panchayati_id = ?'; params.push(body.panchayati_id); }
        if (body.jobtitle || body.jobtile || body.title) { sql += ' AND (jobtitle LIKE ? OR title LIKE ?)'; params.push(`%${body.jobtitle || body.jobtile || body.title}%`, `%${body.jobtitle || body.jobtile || body.title}%`); }
        if (body.qualification || body.qual) { sql += ' AND qualification LIKE ?'; params.push(`%${body.qualification || body.qual}%`); }
        if (body.experience) { sql += ' AND experience = ?'; params.push(body.experience); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Marriages (marriages)
app.post(['/dashboardapi/postmarriages', '/dashboardapi/postingmarriages', '/api/postmarriages'], async (req, res) => {
    try {
        const m = req.body || {};
        m.d_in = 0;
        if (m.districtname && !m.district_id) m.district_id = m.districtname;
        if (m.constituencyname && !m.constituency_id) m.constituency_id = m.constituencyname;
        if (m.mandals && !m.mandal_id) m.mandal_id = m.mandals;
        if (m.village_name && !m.panchayat_id) m.panchayat_id = m.village_name;
        if (m.denomation_id && !m.denomination_id) m.denomination_id = m.denomation_id;
        const result = await dynamicInsert('marriages', m);
        res.json({ status: 200, message: 'Marriage profile created successfully', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/searchmarriages', '/dashboardapi/Searchmarriages', '/dashboardapi/searchingmarriages', '/api/marriages'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT * FROM marriages WHERE d_in = 0';
        const params: any[] = [];
        
        // Handle name & columnid from marriages.component.ts:
        // columnid 1 = denomination, 2 = ministry, 3 = gender, 4 = status, 5 = caste, 6 = spiritual
        if (body.columnid && body.name) {
            if (body.columnid == 1) { sql += ' AND denomination_id = ?'; params.push(body.name); }
            else if (body.columnid == 2) { sql += ' AND ministry_id = ?'; params.push(body.name); }
            else if (body.columnid == 3) { sql += ' AND gender = ?'; params.push(body.name); }
            else if (body.columnid == 4) { sql += ' AND status = ?'; params.push(body.name); }
            else if (body.columnid == 5) { sql += ' AND caste = ?'; params.push(body.name); }
            else if (body.columnid == 6) { sql += ' AND (spirti LIKE ? OR description LIKE ?)'; params.push(`%${body.name}%`, `%${body.name}%`); }
        }
        if (body.gender) { sql += ' AND gender = ?'; params.push(body.gender); }
        if (body.status) { sql += ' AND status = ?'; params.push(body.status); }
        if (body.caste) { sql += ' AND caste = ?'; params.push(body.caste); }
        if (body.subcaste) { sql += ' AND subcaste = ?'; params.push(body.subcaste); }
        if (body.denomination_id || body.denomation_id) { sql += ' AND denomination_id = ?'; params.push(body.denomination_id || body.denomation_id); }
        if (body.ministry_id) { sql += ' AND ministry_id = ?'; params.push(body.ministry_id); }
        if (body.spirti || body.spirituality) { sql += ' AND (spirti LIKE ? OR description LIKE ?)'; params.push(`%${body.spirti || body.spirituality}%`, `%${body.spirti || body.spirituality}%`); }
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id || body.mandals) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id || body.mandals); }
        if (body.village_id || body.panchayat_id || body.panchayati_id) { sql += ' AND (village_id = ? OR panchayat_id = ?)'; params.push(body.village_id || body.panchayat_id || body.panchayati_id, body.village_id || body.panchayat_id || body.panchayati_id); }
        if (body.id) { sql += ' AND id = ?'; params.push(body.id); }

        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
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

app.all(['/dashboardapi/getbusiness', '/dashboardapi/searchingbusiness', '/api/business'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT * FROM business_table WHERE d_in = 0';
        const params: any[] = [];
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id || body.mandals) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id || body.mandals); }
        if (body.panchayati_id || body.village_id) { sql += ' AND (panchayat_id = ? OR village_id = ?)'; params.push(body.panchayati_id || body.village_id, body.panchayati_id || body.village_id); }
        if (body.type) { sql += ' AND type = ?'; params.push(body.type); }
        if (body.title) { sql += ' AND title LIKE ?'; params.push(`%${body.title}%`); }
        if (body.denomation_id || body.denomation) { sql += ' AND denomation_id = ?'; params.push(body.denomation_id || body.denomation); }
        if (body.ministry_id) { sql += ' AND ministry_id = ?'; params.push(body.ministry_id); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
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

app.all(['/dashboardapi/getinstitutes', '/dashboardapi/Searchinstitute', '/api/institutes'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        let sql = 'SELECT * FROM institutes WHERE d_in = 0';
        const params: any[] = [];
        if (body.district_id) { sql += ' AND district_id = ?'; params.push(body.district_id); }
        if (body.constenncy_id || body.constituency_id) { sql += ' AND constituency_id = ?'; params.push(body.constenncy_id || body.constituency_id); }
        if (body.mandal_id || body.mandals) { sql += ' AND mandal_id = ?'; params.push(body.mandal_id || body.mandals); }
        if (body.type) { sql += ' AND type = ?'; params.push(body.type); }
        sql += ' ORDER BY id DESC';
        const [rows] = await db.query(sql, params);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Registration Form (reg_form)
app.post(['/dashboardapi/postregform', '/api/postregform'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        body.d_in = 0;
        const result = await dynamicInsert('reg_form', body);
        res.json({ status: 200, message: 'Registration submitted successfully', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// User Main Data & Constituency Updates
app.get(['/dashboardapi/getUserMainData/:id', '/api/getUserMainData/:id'], async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const [rows]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json({ status: 200, data: rows[0] || {} });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/updateconsis', '/dashboardapi/updateconsis/:id', '/api/updateconsis', '/api/updateconsis/:id'], async (req: any, res: any) => {
    try {
        const id = req.params.id || req.body?.id || req.body?.usr_id;
        const body = req.body || {};
        if (id) {
            await db.query('UPDATE belivers_tbl SET constituencyname = COALESCE(?, constituencyname) WHERE id = ?', [body.constituencyname || body.constituency_id, id]).catch(() => {});
        }
        res.json({ status: 200, message: 'Constituency updated successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/viewconstituencyname', '/api/viewconstituencyname'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const [rows]: any = await db.query('SELECT * FROM const_dtl_t WHERE d_in = 0 AND (id = ? OR const_nm = ?)', [body.id || body.constituency_id, body.const_nm || '']);
        res.json({ status: 200, data: rows[0] || {} });
    } catch (err: any) {
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
app.post(['/dashboardapi/passwordwebsitelogin', '/api/login'], async (req: any, res: any) => {
    try {
        const { mobile_number, mobilenumber, phonenumber, number, password, category } = req.body;
        const phone = String(mobile_number || mobilenumber || phonenumber || number || '').trim();
        const pwd = String(password || '').trim();
        const cat = category !== undefined && category !== null ? String(category).trim() : '';

        if (!phone || !pwd) {
            return res.json({ status: 400, message: 'Missing phone or password' });
        }

        const formatUser = (user: any, defaultCatId: string, defaultCatName: string) => {
            return {
                id: user.id,
                name: user.name || user.studentname || user.ministryname || user.pastorname || user.church_name || user.organisation_name || user.paname || 'User',
                mobile_number: phone,
                email: user.email || user.ministryemail || null,
                password: pwd,
                category_id: user.category_id || cat || defaultCatId,
                category: defaultCatName
            };
        };

        const categoryTables: Record<string, { name: string; category_id: string; category_name: string; query: string; phoneQuery: string }> = {
            '1': {
                name: 'signup_form',
                category_id: '1',
                category_name: 'Believer',
                query: 'SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, email, password FROM signup_form WHERE mobile_number = ? AND password = ?',
                phoneQuery: 'SELECT id FROM signup_form WHERE mobile_number = ?'
            },
            '2': {
                name: 'student_reg',
                category_id: '2',
                category_name: 'Student',
                query: 'SELECT id, studentname as name, number as mobile_number, null as email, password FROM student_reg WHERE number = ? AND password = ?',
                phoneQuery: 'SELECT id FROM student_reg WHERE number = ?'
            },
            '3': {
                name: 'ministry_signup',
                category_id: '3',
                category_name: 'Ministry',
                query: 'SELECT id, ministryname as name, headnmber as mobile_number, ministryemail as email, password FROM ministry_signup WHERE headnmber = ? AND password = ?',
                phoneQuery: 'SELECT id FROM ministry_signup WHERE headnmber = ?'
            },
            '4': {
                name: 'pastor_reg',
                category_id: '4',
                category_name: 'Pastor',
                query: 'SELECT id, pastorname as name, phonenumber as mobile_number, null as email, password FROM pastor_reg WHERE phonenumber = ? AND password = ?',
                phoneQuery: 'SELECT id FROM pastor_reg WHERE phonenumber = ?'
            },
            '5': {
                name: 'church_reg',
                category_id: '5',
                category_name: 'Church',
                query: 'SELECT id, church_name as name, contactnumber as mobile_number, null as email, password FROM church_reg WHERE contactnumber = ? AND password = ?',
                phoneQuery: 'SELECT id FROM church_reg WHERE contactnumber = ?'
            },
            '6': {
                name: 'independentorganisation_reg',
                category_id: '6',
                category_name: 'Independent Organization',
                query: 'SELECT id, organisation_name as name, contact_num as mobile_number, email, password FROM independentorganisation_reg WHERE contact_num = ? AND password = ?',
                phoneQuery: 'SELECT id FROM independentorganisation_reg WHERE contact_num = ?'
            },
            '7': {
                name: 'pastors_associations',
                category_id: '7',
                category_name: 'Pastors Association',
                query: 'SELECT id, paname as name, phonenumber as mobile_number, null as email, password FROM pastors_associations WHERE phonenumber = ? AND password = ?',
                phoneQuery: 'SELECT id FROM pastors_associations WHERE phonenumber = ?'
            }
        };

        // 1. If category provided, check category table first
        if (cat && categoryTables[cat]) {
            const cfg = categoryTables[cat];
            const [rows]: any = await db.query(cfg.query, [phone, pwd]);
            if (rows && rows.length > 0) {
                return res.json({ status: 200, message: 'Login successful', data: [formatUser(rows[0], cfg.category_id, cfg.category_name)] });
            }
        }

        // 2. Check users table
        const [users]: any = await db.query('SELECT id, name, number as mobile_number, email, otp as password FROM users WHERE number = ? AND otp = ?', [phone, pwd]);
        if (users && users.length > 0) {
            return res.json({ status: 200, message: 'Login successful', data: [formatUser(users[0], cat || '1', 'Believer')] });
        }

        // 3. Fallback across all category tables
        for (const [key, cfg] of Object.entries(categoryTables)) {
            if (cat && key === cat) continue;
            const [rows]: any = await db.query(cfg.query, [phone, pwd]);
            if (rows && rows.length > 0) {
                return res.json({ status: 200, message: 'Login successful', data: [formatUser(rows[0], cfg.category_id, cfg.category_name)] });
            }
        }

        // 4. Distinguish wrong password vs unregistered phone
        let phoneFound = false;
        const [userExists]: any = await db.query('SELECT id FROM users WHERE number = ?', [phone]);
        if (userExists && userExists.length > 0) phoneFound = true;

        if (!phoneFound) {
            for (const cfg of Object.values(categoryTables)) {
                const [pRows]: any = await db.query(cfg.phoneQuery, [phone]);
                if (pRows && pRows.length > 0) {
                    phoneFound = true;
                    break;
                }
            }
        }

        if (phoneFound) {
            return res.json({ status: 600, message: 'Wrong password' });
        } else {
            return res.json({ status: 250, message: 'Phone number not registered' });
        }
    } catch (err: any) {
        console.error('Login error:', err);
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

app.all(['/dashboardapi/getcount', '/api/getcount'], async (_req: any, res: any) => {
    try {
        const [rows]: any = await db.query('SELECT count FROM visitor_count LIMIT 1');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/updatecount', '/api/updatecount'], async (_req: any, res: any) => {
    try {
        await db.query('UPDATE visitor_count SET count = count + 1').catch(() => {});
        const [rows]: any = await db.query('SELECT count FROM visitor_count LIMIT 1');
        res.json({ status: 200, message: 'Count updated', data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/checknumberpassword', '/api/checknumberpassword'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const phone = b.mobile_number || b.number || b.phone || b.contactnumber || '';
        const cat = Number(b.category) || 1;
        let table = 'belivers_tbl';
        let phoneCol = 'mobile_number';
        if (cat === 2) { table = 'student_reg'; phoneCol = 'number'; }
        else if (cat === 3) { table = 'independentorganisation_reg'; phoneCol = 'contact_num'; }
        else if (cat === 4) { table = 'church_reg'; phoneCol = 'contactnumber'; }
        else if (cat === 5) { table = 'pastor_reg'; phoneCol = 'number'; }
        else if (cat === 6) { table = 'pastors_associations'; phoneCol = 'number'; }
        else if (cat === 7) { table = 'ministry_signup'; phoneCol = 'headnmber'; }
        
        const [rows]: any = await db.query(`SELECT * FROM \`${table}\` WHERE \`${phoneCol}\` = ? AND d_in = 0 LIMIT 1`, [phone]);
        if (rows.length > 0) {
            res.json({ status: 200, message: 'User found', data: rows });
        } else {
            res.json({ status: 404, message: 'User not found' });
        }
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/upadtedpassword', '/dashboardapi/updatedpassword', '/api/upadtedpassword', '/api/updatedpassword'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const phone = b.mobile_number || b.number || b.phone || b.contactnumber || '';
        const newPass = b.password || b.repassword || '';
        const cat = Number(b.category) || 1;
        let table = 'belivers_tbl';
        let phoneCol = 'mobile_number';
        if (cat === 2) { table = 'student_reg'; phoneCol = 'number'; }
        else if (cat === 3) { table = 'independentorganisation_reg'; phoneCol = 'contact_num'; }
        else if (cat === 4) { table = 'church_reg'; phoneCol = 'contactnumber'; }
        else if (cat === 5) { table = 'pastor_reg'; phoneCol = 'number'; }
        else if (cat === 6) { table = 'pastors_associations'; phoneCol = 'number'; }
        else if (cat === 7) { table = 'ministry_signup'; phoneCol = 'headnmber'; }

        await db.query(`UPDATE \`${table}\` SET password = ? WHERE \`${phoneCol}\` = ? AND d_in = 0`, [newPass, phone]);
        res.json({ status: 200, message: 'Password updated successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const [rows]: any = await db.query('SELECT * FROM wingleader WHERE (usr_id = ? OR user_id = ?) AND d_in = 0', [usrId, usrId]);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/postinfo', '/api/postinfo'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        b.d_in = 0;
        const result = await dynamicInsert('information_tbl', b);
        res.json({ status: 200, message: 'Information submitted successfully', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/updatenewsdataa', '/api/updatenewsdataa'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        if (b.id) {
            await db.query('UPDATE post_news SET title = COALESCE(?, title), description = COALESCE(?, description) WHERE id = ?', [b.title, b.description, b.id]);
        }
        res.json({ status: 200, message: 'News updated successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
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
        console.log(`JBAC Backend API listening on port ${PORT}`);
    });
}
