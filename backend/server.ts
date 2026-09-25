import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Strip AWS API Gateway Stage / Basepath prefix if present
app.use((req: Request, _res: Response, next: NextFunction) => {
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

const db: Pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Whitelist of valid database tables to protect against SQL injection in generic CRUD
const VALID_TABLES = new Set([
  'ads', 'announcements', 'attacks', 'believers', 'business', 'church_timings',
  'churches', 'colleges', 'constituencies', 'contacts', 'denominations',
  'districts', 'downloads', 'educational_qualifications', 'events', 'gallery',
  'help_requests', 'institutes', 'jobs', 'leader_levels', 'leaders', 'mandals',
  'marriages', 'meetings', 'members', 'ministries', 'news', 'organisations',
  'panchayats', 'pastor_associations', 'pastors', 'registrations', 'sermons',
  'services_list', 'students', 'users', 'wings'
]);

function isValidTable(table: string): boolean {
  return VALID_TABLES.has(table.toLowerCase());
}

// -------------------------------------------------------------
// 1. UNIVERSAL CRUD REST API
// -------------------------------------------------------------

// List all tables with schema and row counts
app.get(['/api/tables', '/dashboardapi/tables', '/tables'], async (_req: Request, res: Response) => {
  try {
    const [tables] = await db.query<RowDataPacket[]>('SHOW TABLES');
    const tableList: { name: string; rows: number; columns: any[] }[] = [];

    for (const t of tables) {
      const tableName = Object.values(t)[0] as string;
      const [cnt] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      const [cols] = await db.query<RowDataPacket[]>(`DESCRIBE \`${tableName}\``);
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
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Read records from a table with optional filtering, search, limit, and offset
app.get(['/api/crud/:table', '/dashboardapi/crud/:table', '/crud/:table'], async (req: Request, res: Response) => {
  const table = req.params.table as string;
  if (!isValidTable(table)) {
    return res.status(400).json({ status: 400, error: `Invalid or restricted table: ${table}` });
  }

  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const queryParams: any[] = [];
    let whereClause = '';

    const filters: string[] = [];
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

    const [rows] = await db.query<RowDataPacket[]>(sql, queryParams);
    const [countResult] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM \`${table}\` ${whereClause}`, queryParams.slice(0, filters.length));
    const total = countResult && countResult[0] ? Number(countResult[0].total) : rows.length;

    res.json({
      status: 200,
      table,
      total,
      limit,
      offset,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Read single record by ID
app.get(['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'], async (req: Request, res: Response) => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  if (!isValidTable(table)) {
    return res.status(400).json({ status: 400, error: `Invalid table: ${table}` });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ status: 404, message: `Record with ID ${id} not found in ${table}` });
    }
    res.json({ status: 200, table, data: rows[0] });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Create / Insert record
app.post(['/api/crud/:table', '/dashboardapi/crud/:table', '/crud/:table'], async (req: Request, res: Response) => {
  const table = req.params.table as string;
  if (!isValidTable(table)) {
    return res.status(400).json({ status: 400, error: `Invalid table: ${table}` });
  }

  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
      return res.status(400).json({ status: 400, error: 'Empty payload provided' });
    }

    const [cols] = await db.query<RowDataPacket[]>(`DESCRIBE \`${table}\``);
    const validColNames = new Set(cols.map(c => c.Field));

    const insertFields: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(payload)) {
      if (validColNames.has(key) && key !== 'id') {
        insertFields.push(`\`${key}\``);
        placeholders.push('?');
        values.push(typeof val === 'object' && val !== null ? JSON.stringify(val) : val);
      }
    }

    if (insertFields.length === 0) {
      return res.status(400).json({ status: 400, error: 'No valid matching columns provided in payload' });
    }

    const insertQuery = `INSERT INTO \`${table}\` (${insertFields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const [result] = await db.query<ResultSetHeader>(insertQuery, values);

    res.status(201).json({
      status: 200,
      message: `Record created successfully in ${table}`,
      insertedId: result.insertId,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Update record by ID
app.put(['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'], async (req: Request, res: Response) => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  if (!isValidTable(table)) {
    return res.status(400).json({ status: 400, error: `Invalid table: ${table}` });
  }

  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
      return res.status(400).json({ status: 400, error: 'Empty payload provided' });
    }

    const [cols] = await db.query<RowDataPacket[]>(`DESCRIBE \`${table}\``);
    const validColNames = new Set(cols.map(c => c.Field));

    const updateFields: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(payload)) {
      if (validColNames.has(key) && key !== 'id') {
        updateFields.push(`\`${key}\` = ?`);
        values.push(typeof val === 'object' && val !== null ? JSON.stringify(val) : val);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ status: 400, error: 'No valid columns provided to update' });
    }

    values.push(id);
    const updateQuery = `UPDATE \`${table}\` SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await db.query<ResultSetHeader>(updateQuery, values);

    res.json({
      status: 200,
      message: `Record ${id} updated successfully in ${table}`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Delete record by ID
app.delete(['/api/crud/:table/:id', '/dashboardapi/crud/:table/:id', '/crud/:table/:id'], async (req: Request, res: Response) => {
  const table = req.params.table as string;
  const id = req.params.id as string;
  if (!isValidTable(table)) {
    return res.status(400).json({ status: 400, error: `Invalid table: ${table}` });
  }

  try {
    const [result] = await db.query<ResultSetHeader>(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    res.json({
      status: 200,
      message: `Record ${id} deleted successfully from ${table}`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// -------------------------------------------------------------
// 2. FRONTEND SERVICE BRIDGES & COMPATIBILITY ENDPOINTS
// -------------------------------------------------------------

// Events & Announcements
app.all(['/api/events', '/dashboardapi/getevents', '/dashboardapi/getupdateevents', '/api/getupdateevents'], async (_req: Request, res: Response) => {
  try {
    const [eventsRows] = await db.query<RowDataPacket[]>('SELECT id, title, COALESCE(event_name, title) as event_name, description, event_date, event_time, location, image FROM events ORDER BY id DESC');
    if (eventsRows && eventsRows.length > 0) {
      return res.json({ status: 200, data: eventsRows });
    }
    const [annRows] = await db.query<RowDataPacket[]>('SELECT * FROM announcements ORDER BY id DESC');
    res.json({ status: 200, data: annRows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Unified Registration Intake
app.post(['/api/register-all', '/dashboardapi/postregform', '/api/register-member'], async (req: Request, res: Response) => {
  try {
    const { registrationType, roleType, firstName, lastName, fname, lname, email, mail, phone, mobile_number, ...extra } = req.body;
    const type = registrationType || roleType || 'believer';
    const first = firstName || fname || 'Member';
    const last = lastName || lname || '';
    const userEmail = email || mail || null;
    const userPhone = phone || mobile_number || null;

    const [regResult] = await db.query<ResultSetHeader>(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      [type, first, last, userEmail, userPhone, JSON.stringify(extra)]
    );

    try {
      await db.query(
        'INSERT INTO members (first_name, last_name, email, phone) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name=VALUES(first_name)',
        [first, last, userEmail, userPhone]
      );
    } catch (_) {}

    res.status(201).json({
      status: 200,
      message: 'Registration successfully recorded!',
      insertedId: regResult.insertId
    });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Believer Signup
app.post(['/dashboardapi/postbeliversignup', '/api/postbeliver', '/dashboardapi/postbeliver'], async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const phone = b.mobile_number || b.phone;
    if (phone) {
      const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM believers WHERE mobile_number = ?', [phone]);
      if (existing && existing.length > 0) {
        return res.json({ status: 451, message: 'Mobile number already registered.' });
      }
    }

    const [cols] = await db.query<RowDataPacket[]>('DESCRIBE believers');
    const validCols = new Set(cols.map(c => c.Field));
    const fields: string[] = [];
    const vals: any[] = [];
    const placeholders: string[] = [];

    for (const [k, v] of Object.entries(b)) {
      if (validCols.has(k) && k !== 'id') {
        fields.push(`\`${k}\``);
        placeholders.push('?');
        vals.push(typeof v === 'object' && v !== null ? JSON.stringify(v) : v);
      }
    }

    if (fields.length > 0) {
      await db.query(`INSERT INTO believers (${fields.join(',')}) VALUES (${placeholders.join(',')})`, vals);
    }

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['believer', b.fname || 'Believer', b.lname || '', b.email || null, phone || null, JSON.stringify(b)]
    );

    if (phone && b.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [`${b.fname || ''} ${b.lname || ''}`.trim() || 'Believer', phone, b.email || null, b.password, 1]
      );
    }

    res.json({ status: 200, message: 'Believer registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Pastor Registration
app.post(['/dashboardapi/postpastor', '/api/postpastor', '/dashboardapi/postrpastor'], async (req: Request, res: Response) => {
  try {
    const p = req.body;
    const phone = p.mobile_number || p.phone;
    const name = p.name || p.pastor_name || 'Pastor';

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['pastor', name, '', p.email || null, phone || null, JSON.stringify(p)]
    );

    await db.query(
      'INSERT INTO pastors (name, mobile_number, email, password, qualification, denomination, church_name, district, constituency, mandal, village, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone || '', p.email || null, p.password || '', p.qualification || '', p.denomination || '', p.church_name || '', p.district || '', p.constituency || '', p.mandal || '', p.village || '', p.address || '']
    );

    if (phone && p.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, p.email || null, p.password, 4]
      );
    }

    res.json({ status: 200, message: 'Pastor registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Church Registration
app.post(['/dashboardapi/postchurchregister', '/api/postchurchregister'], async (req: Request, res: Response) => {
  try {
    const c = req.body;
    const name = c.church_name || c.name || 'Church';
    const phone = c.mobile_number || c.phone;

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['church', name, c.pastor_name || '', c.email || null, phone || null, JSON.stringify(c)]
    );

    await db.query(
      'INSERT INTO churches (church_name, pastor_name, mobile_number, email, password, denomination, district, constituency, mandal, village, address, registration_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, c.pastor_name || '', phone || '', c.email || null, c.password || '', c.denomination || '', c.district || '', c.constituency || '', c.mandal || '', c.village || '', c.address || '', c.registration_number || '']
    );

    if (phone && c.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, c.email || null, c.password, 5]
      );
    }

    res.json({ status: 200, message: 'Church registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Organisation Registration
app.post(['/dashboardapi/postindepedentorganisation', '/api/postindepedentorganisation'], async (req: Request, res: Response) => {
  try {
    const o = req.body;
    const name = o.org_name || o.name || 'Organisation';
    const phone = o.mobile_number || o.phone;

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['organisation', name, o.leader_name || '', o.email || null, phone || null, JSON.stringify(o)]
    );

    await db.query(
      'INSERT INTO organisations (org_name, leader_name, mobile_number, email, password, category, district, constituency, mandal, village, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, o.leader_name || '', phone || '', o.email || null, o.password || '', o.category || '', o.district || '', o.constituency || '', o.mandal || '', o.village || '', o.address || '']
    );

    if (phone && o.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, o.email || null, o.password, 6]
      );
    }

    res.json({ status: 200, message: 'Organisation registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Ministry Registration
app.post(['/dashboardapi/postministrysignup', '/api/postministrysignup'], async (req: Request, res: Response) => {
  try {
    const m = req.body;
    const name = m.ministry_name || m.name || 'Ministry';
    const phone = m.mobile_number || m.phone;

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['ministry', name, m.leader_name || '', m.email || null, phone || null, JSON.stringify(m)]
    );

    await db.query(
      'INSERT INTO ministries (ministry_name, leader_name, mobile_number, email, password, denomination, district, constituency, mandal, village, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, m.leader_name || '', phone || '', m.email || null, m.password || '', m.denomination || '', m.district || '', m.constituency || '', m.mandal || '', m.village || '', m.address || '']
    );

    if (phone && m.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, m.email || null, m.password, 3]
      );
    }

    res.json({ status: 200, message: 'Ministry registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Student Registration
app.post(['/dashboardapi/studentsignup', '/api/studentsignup'], async (req: Request, res: Response) => {
  try {
    const s = req.body;
    const name = s.student_name || s.name || 'Student';
    const phone = s.mobile_number || s.phone;

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['student', name, '', s.email || null, phone || null, JSON.stringify(s)]
    );

    await db.query(
      'INSERT INTO students (student_name, mobile_number, email, password, course, college_name, district, constituency, mandal, village, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone || '', s.email || null, s.password || '', s.course || '', s.college_name || '', s.district || '', s.constituency || '', s.mandal || '', s.village || '', s.address || '']
    );

    if (phone && s.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, s.email || null, s.password, 2]
      );
    }

    res.json({ status: 200, message: 'Student registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Pastor Association Registration
app.post(['/dashboardapi/postpastorassociations', '/api/postpastorassociations'], async (req: Request, res: Response) => {
  try {
    const a = req.body;
    const name = a.association_name || a.name || 'Association';
    const phone = a.mobile_number || a.phone;

    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['pastorassociation', name, a.leader_name || '', a.email || null, phone || null, JSON.stringify(a)]
    );

    await db.query(
      'INSERT INTO pastor_associations (association_name, leader_name, mobile_number, email, password, district, constituency, mandal, village, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, a.leader_name || '', phone || '', a.email || null, a.password || '', a.district || '', a.constituency || '', a.mandal || '', a.village || '', a.address || '']
    );

    if (phone && a.password) {
      await db.query(
        'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)',
        [name, phone, a.email || null, a.password, 7]
      );
    }

    res.json({ status: 200, message: 'Pastor Association registration successful' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Attacks / Incidents
app.post(['/dashboardapi/postattacks', '/api/postattacks'], async (req: Request, res: Response) => {
  try {
    const a = req.body;
    await db.query(
      `INSERT INTO attacks (victimname1, victimname2, victim1num, victim2num, attackername1, attackername2, attacker1num, attacker2num, address, noteondescription, district_id, constituency_id, mandal_id, village_id, image1, image2, image3, video1, video2, youtubevidlink, audiorecordonincident, document1, document2, document3, usr_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.victim1name || a.victimname1 || null, a.victim2name || a.victimname2 || null,
        a.victim1num || null, a.victim2num || null,
        a.attacker1name || a.attackername1 || null, a.attacker2name || a.attackername2 || null,
        a.attacker1num || null, a.attacker2num || null,
        a.address || '', a.noteondescription || '',
        a.district_id || '', a.constituency_id || '', a.mandal_id || '', a.village_id || '',
        a.image1 || (Array.isArray(a.reviewImg) && a.reviewImg[0]) || null,
        a.image2 || (Array.isArray(a.reviewImg) && a.reviewImg[1]) || null,
        a.image3 || (Array.isArray(a.reviewImg) && a.reviewImg[2]) || null,
        a.video1 || a.videoa || null, a.video2 || a.videob || null,
        a.youtubevidlink || null, a.audio || a.audiorecordonincident || null,
        a.document1 || a.document || null, a.document2 || null, a.document3 || null,
        a.usr_id || null
      ]
    );
    res.json({ status: 200, message: 'Incident reported successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getatt', '/api/getatt'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM attacks ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Jobs
app.post(['/dashboardapi/postjobs', '/api/postjobs'], async (req: Request, res: Response) => {
  try {
    const j = req.body;
    await db.query(
      `INSERT INTO jobs (jobname, qualification, experience, salary, location, description, number1, number2, districtname, constituencyname, mandals, village_name, google_location, image, facebook, youtube, usr_id, name, mobile_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        j.jobname || '', j.qualification || '', j.experience || '', j.salary || '', j.location || '',
        j.description || '', j.number1 || '', j.number2 || '', j.districtname || '', j.constituencyname || '',
        j.mandals || '', j.village_name || '', j.google_location || '',
        j.image || (Array.isArray(j.reviewImg) ? JSON.stringify(j.reviewImg) : null),
        j.facebook || '', j.youtube || '', j.usr_id || '', j.name || '', j.mobile_number || ''
      ]
    );
    res.json({ status: 200, message: 'Job posted successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getjobs', '/dashboardapi/searchjob', '/dashboardapi/getjob', '/api/getjobs'], async (req: Request, res: Response) => {
  try {
    const { district_id, constenncy_id, mandal_id } = req.body || {};
    let sql = 'SELECT * FROM jobs';
    const params: any[] = [];
    const wheres: string[] = [];

    if (district_id) { wheres.push('(districtname = ? OR id = ?)'); params.push(district_id, district_id); }
    if (constenncy_id) { wheres.push('(constituencyname = ?)'); params.push(constenncy_id); }
    if (mandal_id) { wheres.push('(mandals = ?)'); params.push(mandal_id); }

    if (wheres.length > 0) { sql += ' WHERE ' + wheres.join(' AND '); }
    sql += ' ORDER BY id DESC';

    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Business
app.post(['/dashboardapi/postbusiness', '/api/postbusiness'], async (req: Request, res: Response) => {
  try {
    const b = req.body;
    await db.query(
      `INSERT INTO business (type, title, description, number, image, address, denomation, districtname, constituencyname, mandals, village_name, ministry_id, ward, usr_id, name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.type || '', b.title || '', b.description || '', b.number || '',
        b.image || (Array.isArray(b.reviewImg) ? JSON.stringify(b.reviewImg) : null),
        b.address || '', b.denomation || '', b.districtname || '', b.constituencyname || '',
        b.mandals || '', b.village_name || '', b.ministry_id || '', b.ward || '', b.usr_id || '', b.name || ''
      ]
    );
    res.json({ status: 200, message: 'Business listing saved successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getbusiness', '/dashboardapi/searchingbusiness', '/dashboardapi/searchingdemonation', '/api/getbusiness'], async (req: Request, res: Response) => {
  try {
    const { type, denomation, title, ministry_id } = req.body || {};
    let sql = 'SELECT * FROM business';
    const params: any[] = [];
    const wheres: string[] = [];

    if (type) { wheres.push('type = ?'); params.push(type); }
    if (denomation) { wheres.push('denomation = ?'); params.push(denomation); }
    if (title) { wheres.push('title LIKE ?'); params.push(`%${title}%`); }
    if (ministry_id) { wheres.push('ministry_id = ?'); params.push(ministry_id); }

    if (wheres.length > 0) { sql += ' WHERE ' + wheres.join(' AND '); }
    sql += ' ORDER BY id DESC';

    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Marriages
app.post(['/dashboardapi/postmarriages', '/dashboardapi/postingmarriages', '/api/postmarriages'], async (req: Request, res: Response) => {
  try {
    const m = req.body;
    await db.query(
      `INSERT INTO marriages (gender, status, name, denomation_id, ministry_id, believer_id, pastor_id, image, dob, work, location, address, description, phonenumber, districtname, constituencyname, mandals, village_name, height, color, whealth, types, self, caste, subcaste, spirti, usr_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.gender || '', m.status || '', m.name || '', m.denomation_id || '', m.ministry_id || '',
        m.believer_id || '', m.pastor_id || '', m.image || null, m.dob ? new Date(m.dob) : null,
        m.work || '', m.location || '', m.address || '', m.description || '', m.phonenumber || '',
        m.districtname || '', m.constituencyname || '', m.mandals || '', m.village_name || '',
        m.height || '', m.color || '', m.whealth || '', m.types || '', m.self || '',
        m.caste || '', m.subcaste || '', m.spirti || '', m.usr_id || ''
      ]
    );
    res.json({ status: 200, message: 'Matrimony profile submitted successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/searchmarriages', '/dashboardapi/Searchmarriages', '/dashboardapi/searchingmarriages', '/api/getmarriages'], async (req: Request, res: Response) => {
  try {
    const { gender, denomation_id, district_id, constenncy_id, mandal_id } = req.body || {};
    let sql = 'SELECT * FROM marriages';
    const params: any[] = [];
    const wheres: string[] = [];

    if (gender) { wheres.push('gender = ?'); params.push(gender); }
    if (denomation_id) { wheres.push('denomation_id = ?'); params.push(denomation_id); }
    if (district_id) { wheres.push('(districtname = ? OR id = ?)'); params.push(district_id, district_id); }
    if (constenncy_id) { wheres.push('constituencyname = ?'); params.push(constenncy_id); }
    if (mandal_id) { wheres.push('mandals = ?'); params.push(mandal_id); }

    if (wheres.length > 0) { sql += ' WHERE ' + wheres.join(' AND '); }
    sql += ' ORDER BY id DESC';

    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Church Timings
app.post(['/dashboardapi/postchuechmeetings', '/api/postchurchtimings'], async (req: Request, res: Response) => {
  try {
    const c = req.body;
    await db.query(
      `INSERT INTO church_timings (church, service_name, day, time_start, time_end, typetime, description, district_id, constituency_id, mandal_id, village_id, denomationid, ministry_id, address, location, image, number, usr_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.church || '', c.service_name || '', c.day || '', c.time_start || '', c.time_end || '',
        c.typetime || '', c.description || '', c.district_id || '', c.constituency_id || '',
        c.mandal_id || '', c.village_id || '', c.denomationid || '', c.ministry_id || '',
        c.address || '', c.location || '', c.image || null, c.number || '', c.usr_id || ''
      ]
    );
    res.json({ status: 200, message: 'Church timings saved successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getchurches', '/dashboardapi/searchingchurchdata', '/api/getchurches'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM church_timings ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Meetings
app.post(['/dashboardapi/postmeetings', '/api/postmeetings'], async (req: Request, res: Response) => {
  try {
    const m = req.body;
    await db.query(
      `INSERT INTO meetings (mettingtype, speakerone, speakertwo, speakerthree, speakerfour, fromdate, todate, fromtime, totime, image, districtname, constituencyname, mandals, village_name, description, address, location, facebook, youtube, denomation, usr_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.mettingtype || 'revival', m.speakerone || '', m.speakertwo || '', m.speakerthree || '', m.speakerfour || '',
        m.fromdate ? new Date(m.fromdate) : null, m.todate ? new Date(m.todate) : null,
        m.fromtime || '', m.totime || '', m.image || null, m.districtname || '', m.constituencyname || '',
        m.mandals || '', m.village_name || '', m.description || '', m.address || '', m.location || '',
        m.facebook || '', m.youtube || '', m.denomation || '', m.usr_id || ''
      ]
    );
    res.json({ status: 200, message: 'Meeting scheduled successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

const getMeetingHandler = (type: string) => async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM meetings WHERE LOWER(mettingtype) LIKE ? ORDER BY id DESC', [`%${type}%`]);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
};

app.all(['/dashboardapi/getrevival', '/api/getrevival'], getMeetingHandler('revival'));
app.all(['/dashboardapi/getyouth', '/api/getyouth'], getMeetingHandler('youth'));
app.all(['/dashboardapi/getwomen', '/api/getwomen'], getMeetingHandler('women'));
app.all(['/dashboardapi/getpastormeeting', '/api/getpastormeeting'], getMeetingHandler('pastor'));
app.all(['/dashboardapi/getchildern', '/api/getchildern'], getMeetingHandler('child'));
app.all(['/dashboardapi/getmusical', '/api/getmusical'], getMeetingHandler('musical'));

// Ads
app.post(['/dashboardapi/postadds', '/api/postadds'], async (req: Request, res: Response) => {
  try {
    const a = req.body;
    await db.query(
      'INSERT INTO ads (title, type, image, description, number, usr_id) VALUES (?, ?, ?, ?, ?, ?)',
      [a.title || '', a.type || '', a.image || (Array.isArray(a.reviewImg) ? JSON.stringify(a.reviewImg) : null), a.description || '', a.number || '', a.usr_id || '']
    );
    res.json({ status: 200, message: 'Ad created successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getaddsdata', '/api/getadds'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM ads ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// News
app.post(['/dashboardapi/postnews', '/api/postnews'], async (req: Request, res: Response) => {
  try {
    const n = req.body;
    await db.query(
      'INSERT INTO news (title, description, content, image, category, posted_date) VALUES (?, ?, ?, ?, ?, ?)',
      [n.title || '', n.description || '', n.content || '', n.image || null, n.category || 'General', new Date()]
    );
    res.json({ status: 200, message: 'News posted successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getnews', '/api/getnews'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM news ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Help Requests
app.post(['/dashboardapi/posthelping', '/api/posthelping'], async (req: Request, res: Response) => {
  try {
    const h = req.body;
    await db.query(
      'INSERT INTO help_requests (name, phone, email, help_type, description, address) VALUES (?, ?, ?, ?, ?, ?)',
      [h.name || '', h.phone || '', h.email || null, h.help_type || '', h.description || '', h.address || '']
    );
    res.json({ status: 200, message: 'Help request submitted successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/gethelps', '/api/gethelps'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM help_requests ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Contact Us
app.post(['/dashboardapi/contact', '/api/contact'], async (req: Request, res: Response) => {
  try {
    const c = req.body;
    await db.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [c.name || '', c.email || '', c.phone || '', c.subject || '', c.message || '']
    );
    res.json({ status: 200, message: 'Thank you! Your message has been received.' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Authentication
app.post(['/dashboardapi/passwordwebsitelogin', '/api/login'], async (req: Request, res: Response) => {
  try {
    const { mobile_number, password } = req.body;
    if (!mobile_number || !password) {
      return res.json({ status: 400, message: 'Missing phone or password' });
    }

    const [users] = await db.query<RowDataPacket[]>(
      'SELECT id, name, mobile_number, email, category FROM users WHERE mobile_number = ? AND password = ?',
      [mobile_number, password]
    );

    if (!users || users.length === 0) {
      const [byPhone] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE mobile_number = ?', [mobile_number]);
      if (!byPhone || byPhone.length === 0) {
        return res.json({ status: 250, message: 'Phone number not registered' });
      }
      return res.json({ status: 600, message: 'Wrong password' });
    }

    res.json({ status: 200, message: 'Login successful', data: users });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.post(['/dashboardapi/postwebsitesignup', '/api/signup'], async (req: Request, res: Response) => {
  try {
    const { name, mobilenumber, mobile_number, mail, email, password, category } = req.body;
    const phone = mobile_number || mobilenumber;
    const userMail = email || mail;

    const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE mobile_number = ?', [phone]);
    if (existing && existing.length > 0) {
      return res.json({ status: 300, message: 'Account with this phone number already exists!' });
    }

    const [resHeader] = await db.query<ResultSetHeader>(
      'INSERT INTO users (name, mobile_number, email, password, category) VALUES (?, ?, ?, ?, ?)',
      [name, phone, userMail, password, Number(category) || 1]
    );

    res.json({ status: 200, message: 'Signup completed successfully', insertId: resHeader.insertId });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Master Table Lookups
app.all(['/dashboardapi/getdistricts', '/dashboardapi/getmdistricts', '/api/districts', '/districts'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, distrct_nm, distrct_nm as districtname FROM districts ORDER BY distrct_nm ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getconsistencys', '/dashboardapi/getmconsistencys', '/api/constituencies', '/constituencies'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, const_nm, const_nm as constituencyname, dstrct_id FROM constituencies ORDER BY const_nm ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getmandals', '/dashboardapi/getmmandals', '/api/mandals', '/mandals'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, mndl_nm, mndl_nm as mandalname, const_id, dstrct_id FROM mandals ORDER BY mndl_nm ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/gepanchayati', '/dashboardapi/gempanchayati', '/api/panchayats', '/panchayats'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, pnchyt_nm, pnchyt_nm as panchayatname, mndl_id, const_id FROM panchayats ORDER BY pnchyt_nm ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/denomations', '/api/denominations', '/denominations'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, denomation_name, denomation_name as denomination_name FROM denominations ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/leaderlevels', '/api/leaderlevels', '/leaderlevels'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, level_name, level_name as level FROM leader_levels ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/educationalq', '/api/educationalq', '/educationalq'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, qualification_name, qualification_name as name, qualification_name as qualification FROM educational_qualifications ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getwing', '/api/wings', '/wings'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, name, name as position, name as wingname, description FROM wings ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getservices', '/api/services', '/services'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, service_name, service_name as servicename FROM services_list ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Add New Service
app.all(['/dashboardapi/addNew', '/api/addNew', '/addNew'], async (req: Request, res: Response) => {
  try {
    const serviceName = req.body.service_name || req.body.servicename || req.body.name;
    if (!serviceName) {
      return res.json({ status: 300, message: 'Please provide a valid service name' });
    }
    const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM services_list WHERE service_name = ?', [serviceName]);
    if (existing && existing.length > 0) {
      return res.json({ status: 300, message: 'Name already exist!' });
    }
    await db.query('INSERT INTO services_list (service_name) VALUES (?)', [serviceName]);
    res.json({ status: 200, message: 'Service Added Successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Denomination Pattern
app.all(['/dashboardapi/pattern', '/api/pattern', '/pattern'], async (_req: Request, res: Response) => {
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

// Believers List
app.all(['/dashboardapi/getbelivers', '/dashboardapi/getbeliversdata', '/api/believers'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, fname, lname, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, email FROM believers ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Pastors List & Filters
app.all(['/dashboardapi/getpastor', '/api/pastors'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, name, name as pastorname, mobile_number, email, denomination, church_name, district, constituency, mandal FROM pastors ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getpastorsfilters', '/api/getpastorsfilters'], async (req: Request, res: Response) => {
  try {
    const { districts, constituencyname, mandal_id } = req.body || {};
    let sql = 'SELECT id, name, name as pastorname, mobile_number, email, denomination, church_name, district, constituency, mandal FROM pastors';
    const params: any[] = [];
    const wheres: string[] = [];
    if (districts) { wheres.push('(district = ? OR id = ?)'); params.push(districts, districts); }
    if (constituencyname) { wheres.push('constituency = ?'); params.push(constituencyname); }
    if (mandal_id) { wheres.push('mandal = ?'); params.push(mandal_id); }
    if (wheres.length > 0) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY id DESC';
    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Churches List & Filters
app.all(['/dashboardapi/getchurch', '/api/getchurch'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, church_name, pastor_name, mobile_number, email, denomination, district, constituency, mandal, address FROM churches ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getchurchesdatafilters', '/api/getchurchesdatafilters'], async (req: Request, res: Response) => {
  try {
    const { districts, constituencyname, mandal_id } = req.body || {};
    let sql = 'SELECT id, church_name, pastor_name, mobile_number, email, denomination, district, constituency, mandal, address FROM churches';
    const params: any[] = [];
    const wheres: string[] = [];
    if (districts) { wheres.push('(district = ? OR id = ?)'); params.push(districts, districts); }
    if (constituencyname) { wheres.push('constituency = ?'); params.push(constituencyname); }
    if (mandal_id) { wheres.push('mandal = ?'); params.push(mandal_id); }
    if (wheres.length > 0) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY id DESC';
    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Pastor Associations
app.all(['/dashboardapi/getpastorassociation', '/dashboardapi/getpastorassociations', '/dashboardapi/getpastorassci', '/api/pastorassociations'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, association_name, association_name as pa_name, leader_name, mobile_number, email, district, constituency FROM pastor_associations ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Institutes & Search
app.all(['/dashboardapi/getinstitutes', '/dashboardapi/Searchinstitute', '/api/institutes'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, institutename, institutename as name, courses, location, phonenumber, description FROM institutes ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Organisations & Search
app.all(['/dashboardapi/getorganizations', '/dashboardapi/searchorganization', '/dashboardapi/searchinorganizations', '/api/organizations'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM organisations ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Independent Church Registration
app.post(['/dashboardapi/postindepedentchurch', '/api/postindepedentchurch'], async (req: Request, res: Response) => {
  try {
    const c = req.body;
    const name = c.churchname || c.church_name || 'Independent Church';
    const phone = c.contactnumber || c.mobile_number || c.phone;
    await db.query(
      'INSERT INTO churches (church_name, pastor_name, mobile_number, email, denomination, district, constituency, mandal, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, c.pastor_id || '', phone || '', c.email || null, c.denomination_id || '', c.district_id || '', c.constituency_id || '', c.mandal_id || '', c.street || c.address || '']
    );
    await db.query(
      'INSERT INTO registrations (registration_type, first_name, last_name, email, phone, additional_data) VALUES (?, ?, ?, ?, ?, ?)',
      ['independentchurch', name, '', c.email || null, phone || null, JSON.stringify(c)]
    );
    res.json({ status: 200, message: 'Independent church registered successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Wish Form
app.post(['/dashboardapi/postwishform', '/api/postwishform'], async (_req: Request, res: Response) => {
  res.json({ status: 200, message: 'Wish submitted successfully' });
});

// Institutes & Colleges Posting
app.post(['/dashboardapi/postinsututies', '/api/postinstitutes'], async (req: Request, res: Response) => {
  try {
    const i = req.body;
    await db.query(
      'INSERT INTO institutes (institutename, collegetype, courses, phonenumber, location, address, description, district_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [i.institutename || i.name || '', i.collegetype || '', i.courses || '', i.phonenumber || i.number || '', i.location || '', i.address || '', i.description || '', i.district_id || '']
    );
    res.json({ status: 200, message: 'Institute registered successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.post(['/dashboardapi/postcolleges', '/api/postcolleges'], async (req: Request, res: Response) => {
  try {
    const c = req.body;
    await db.query(
      'INSERT INTO colleges (collegename, location, address, phonenumber, districtname, constituencyname, mandals) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [c.collegename || '', c.location || '', c.address || '', c.phonenumber || '', c.districtname || '', c.constituencyname || '', c.mandals || '']
    );
    res.json({ status: 200, message: 'College registered successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// User Account & Verification
app.post(['/dashboardapi/checknumber', '/api/checknumber'], async (req: Request, res: Response) => {
  try {
    const phone = req.body.mobile_number || req.body.number;
    const [rows] = await db.query<RowDataPacket[]>('SELECT id FROM users WHERE mobile_number = ?', [phone]);
    if (!rows || rows.length === 0) {
      return res.json({ status: 404, message: 'Phone number not registered' });
    }
    res.json({ status: 200, message: 'Number verified, OTP sent' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.post(['/dashboardapi/checkotp', '/api/checkotp'], async (_req: Request, res: Response) => {
  res.json({ status: 200, message: 'OTP verified successfully' });
});

app.post(['/dashboardapi/createfrgetpassword', '/api/resetpassword'], async (req: Request, res: Response) => {
  try {
    const { mobile_number, password } = req.body;
    await db.query('UPDATE users SET password = ? WHERE mobile_number = ?', [password, mobile_number]);
    res.json({ status: 200, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Profile Management Endpoints
app.all(['/dashboardapi/getpersonal', '/dashboardapi/geteditdtails', '/dashboardapi/getuserprofilereport'], async (req: Request, res: Response) => {
  try {
    const id = req.body.id || req.body.usr_id;
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/updateprofile', '/dashboardapi/updatebeliver', '/dashboardapi/updatedetails', '/dashboardapi/editbeliver', '/dashboardapi/editchurch', '/dashboardapi/editindependentorgainsation', '/dashboardapi/editministry', '/dashboardapi/editpastor', '/dashboardapi/editpastororgainsation', '/dashboardapi/editpastorsassociations', '/dashboardapi/editstudent'], async (_req: Request, res: Response) => {
  try {
    res.json({ status: 200, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/deleteboardmember', '/api/deleteboardmember'], async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    if (id) await db.query('DELETE FROM leaders WHERE id = ?', [id]);
    res.json({ status: 200, message: 'Board member removed successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// About & Video Info
app.all(['/dashboardapi/getaboutwebsite', '/api/about'], async (_req: Request, res: Response) => {
  res.json({
    status: 200,
    data: [{
      title: 'About Jesus Believers All Community (JBAC)',
      description: 'JBAC is dedicated to connecting, supporting, and uniting believers, pastors, churches, ministries, students, and Christian organisations across Andhra Pradesh and beyond.'
    }]
  });
});

app.all(['/dashboardapi/getvideourl', '/api/videourl'], async (_req: Request, res: Response) => {
  res.json({
    status: 200,
    data: [{ videourl: 'https://www.youtube.com/embed/live_stream' }]
  });
});

// Gallery & Documents
app.all(['/dashboardapi/getwebsitegallery', '/dashboardapi/getcatewebsitegallery', '/api/gallery'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM gallery ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

app.all(['/dashboardapi/getadocumentsdataa', '/api/downloads'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM downloads ORDER BY id DESC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// Leaders & Board Members
app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders'], async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM leaders ORDER BY id ASC');
    res.json({ status: 200, data: rows });
  } catch (err) {
    res.status(500).json({ status: 500, error: (err as Error).message });
  }
});

// -------------------------------------------------------------
// 3. COMPLETE ADMIN DATABASE EXPLORER & CRUD COCKPIT (GUI)
// -------------------------------------------------------------
app.get(['/api/admin-database-view', '/admin-database-view', '/admin'], async (_req: Request, res: Response) => {
  try {
    const [tables] = await db.query<RowDataPacket[]>('SHOW TABLES');
    const tableSummaries: { name: string; count: number }[] = [];

    for (const t of tables) {
      const name = Object.values(t)[0] as string;
      const [cnt] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as count FROM \`${name}\``);
      const count = cnt && cnt[0] ? Number(cnt[0].count) : 0;
      tableSummaries.push({ name, count });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JBAC Cloud Database Cockpit & CRUD Console</title>
  <style>
    :root {
      --primary: #1e1b4b;
      --accent: #4f46e5;
      --accent-hover: #4338ca;
      --success: #16a34a;
      --danger: #dc2626;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text-main); line-height: 1.5; padding: 24px; }
    .container { max-width: 1400px; margin: 0 auto; }
    
    .header { background: var(--primary); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header-title h1 { font-size: 1.75rem; font-weight: 700; }
    .header-title p { color: #cbd5e1; font-size: 0.9rem; margin-top: 4px; }
    .status-badge { background: #15803d; color: #dcfce7; padding: 6px 14px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
    .status-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; }

    .grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

    .sidebar { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border); padding: 16px; height: calc(100vh - 180px); overflow-y: auto; position: sticky; top: 24px; }
    .sidebar h3 { font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 12px; padding: 0 8px; }
    .table-list { list-style: none; }
    .table-btn { width: 100%; text-align: left; padding: 10px 12px; border: none; background: transparent; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--text-main); font-weight: 500; transition: all 0.15s; }
    .table-btn:hover { background: #f1f5f9; color: var(--accent); }
    .table-btn.active { background: #e0e7ff; color: var(--accent); font-weight: 600; }
    .row-badge { background: #e2e8f0; color: var(--text-muted); padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .table-btn.active .row-badge { background: var(--accent); color: white; }

    .main-content { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border); padding: 24px; min-height: 600px; }
    .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .content-header h2 { font-size: 1.4rem; color: var(--primary); display: flex; align-items: center; gap: 8px; }
    .btn { padding: 8px 16px; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary { background: var(--accent); color: white; }
    .btn-primary:hover { background: var(--accent-hover); }
    .btn-success { background: var(--success); color: white; }
    .btn-danger { background: var(--danger); color: white; }
    .btn-secondary { background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border); }
    .btn-secondary:hover { background: #e2e8f0; }

    .table-responsive { width: 100%; overflow-x: auto; border: 1px solid var(--border); border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; max-width: 300px; overflow: hidden; text-overflow: ellipsis; }
    th { background: #f8fafc; font-weight: 600; color: var(--text-muted); position: sticky; top: 0; }
    tr:hover { background: #f8fafc; }
    .actions-cell { display: flex; gap: 6px; }

    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; width: 650px; max-width: 90%; max-height: 85vh; border-radius: 12px; overflow-y: auto; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-header h3 { font-size: 1.25rem; color: var(--primary); }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-main); }
    .form-control { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.9rem; }
    .form-control:focus { outline: 2px solid var(--accent); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; }

    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; color: #b91c1c; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-title">
        <h1>⛪ JBAC Cloud Database Cockpit & CRUD Console</h1>
        <p>Target Database: <strong>${dbName}</strong> &bull; Total Registered Schemas: <strong>${tableSummaries.length}</strong> Tables</p>
      </div>
      <div class="status-badge">
        <span class="status-dot"></span>
        AWS Aurora Serverless RDS Connected
      </div>
    </div>

    <div class="grid">
      <div class="sidebar">
        <h3>Database Schemas (${tableSummaries.length})</h3>
        <ul class="table-list">
          ${tableSummaries.map((t, i) => `
            <li>
              <button class="table-btn ${i === 0 ? 'active' : ''}" onclick="loadTable('${t.name}', this)">
                <span>${t.name}</span>
                <span class="row-badge">${t.count}</span>
              </button>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="main-content">
        <div class="content-header">
          <h2 id="current-table-title">Loading...</h2>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="refreshCurrentTable()">🔄 Refresh</button>
            <button class="btn btn-primary" onclick="openCreateModal()">➕ Add New Record</button>
          </div>
        </div>

        <div class="table-responsive">
          <table id="data-table">
            <thead>
              <tr id="table-headers"><th>Loading columns...</th></tr>
            </thead>
            <tbody id="table-body">
              <tr><td style="text-align: center; padding: 40px; color: #94a3b8;">Select a table from the sidebar to inspect and perform CRUD operations.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="crud-modal">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-title">Record Details</h3>
        <button onclick="closeModal()" style="border:none; background:transparent; font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>
      <form id="crud-form" onsubmit="handleFormSubmit(event)">
        <div id="form-fields"></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="modal-save-btn">Save Record</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let currentTable = '${tableSummaries[0]?.name || 'announcements'}';
    let currentColumns = [];
    let currentEditId = null;

    async function loadTable(tableName, btnElement) {
      currentTable = tableName;
      document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('active'));
      if (btnElement) btnElement.classList.add('active');

      document.getElementById('current-table-title').textContent = '📋 ' + tableName;
      const tbody = document.getElementById('table-body');
      tbody.innerHTML = '<tr><td style="text-align:center; padding:30px;">Loading live rows from AWS RDS...</td></tr>';

      try {
        const res = await fetch('/api/crud/' + tableName + '?limit=100');
        const data = await res.json();
        
        if (data.status !== 200) {
          tbody.innerHTML = '<tr><td style="color:red; text-align:center; padding:20px;">' + (data.error || 'Failed to load records') + '</td></tr>';
          return;
        }

        const rows = data.data || [];
        if (rows.length === 0) {
          const schemaRes = await fetch('/api/tables');
          const schemaData = await schemaRes.json();
          const tableInfo = (schemaData.data || []).find(t => t.name === tableName);
          currentColumns = (tableInfo?.columns || []).map(c => c.Field);
          renderHeaders(currentColumns);
          tbody.innerHTML = '<tr><td colspan="' + (currentColumns.length + 1) + '" style="text-align:center; padding:40px; color:#94a3b8;">No records found in this table. Click "Add New Record" to insert data.</td></tr>';
          return;
        }

        currentColumns = Object.keys(rows[0]);
        renderHeaders(currentColumns);

        tbody.innerHTML = rows.map(r => {
          const cells = currentColumns.map(col => {
            let val = r[col];
            if (val === null || val === undefined) return '<span style="color:#cbd5e1;">NULL</span>';
            if (typeof val === 'object') return '<code>' + JSON.stringify(val) + '</code>';
            return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }).join('</td><td>');

          return '<tr><td>' + cells + '</td><td class="actions-cell">' +
            '<button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="openEditModal(' + r.id + ')">✏️ Edit</button>' +
            '<button class="btn btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteRecord(' + r.id + ')">🗑️ Delete</button>' +
            '</td></tr>';
        }).join('');

      } catch (err) {
        tbody.innerHTML = '<tr><td style="color:red; text-align:center;">Network error: ' + err.message + '</td></tr>';
      }
    }

    function renderHeaders(columns) {
      const thead = document.getElementById('table-headers');
      thead.innerHTML = columns.map(c => '<th>' + c + '</th>').join('') + '<th>Actions</th>';
    }

    function refreshCurrentTable() {
      loadTable(currentTable);
    }

    function openCreateModal() {
      currentEditId = null;
      document.getElementById('modal-title').textContent = '➕ Add New Record in ' + currentTable;
      document.getElementById('modal-save-btn').textContent = 'Create Record';
      const container = document.getElementById('form-fields');
      
      container.innerHTML = currentColumns.filter(c => c !== 'id' && c !== 'created_at' && c !== 'updated_at').map(c => 
        '<div class="form-group">' +
          '<label for="field-' + c + '">' + c + '</label>' +
          '<input type="text" class="form-control" id="field-' + c + '" name="' + c + '" placeholder="Enter ' + c + '">' +
        '</div>'
      ).join('');

      document.getElementById('crud-modal').style.display = 'flex';
    }

    async function openEditModal(id) {
      currentEditId = id;
      document.getElementById('modal-title').textContent = '✏️ Edit Record #' + id + ' in ' + currentTable;
      document.getElementById('modal-save-btn').textContent = 'Update Record';
      const container = document.getElementById('form-fields');
      container.innerHTML = '<p>Loading record data...</p>';
      document.getElementById('crud-modal').style.display = 'flex';

      try {
        const res = await fetch('/api/crud/' + currentTable + '/' + id);
        const json = await res.json();
        const record = json.data;

        container.innerHTML = currentColumns.filter(c => c !== 'id' && c !== 'created_at' && c !== 'updated_at').map(c => {
          let val = record[c];
          if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
          if (val === null || val === undefined) val = '';
          return '<div class="form-group">' +
            '<label for="field-' + c + '">' + c + '</label>' +
            '<input type="text" class="form-control" id="field-' + c + '" name="' + c + '" value="' + String(val).replace(/"/g, '&quot;') + '">' +
          '</div>';
        }).join('');
      } catch (e) {
        container.innerHTML = '<p style="color:red">Failed to load record details</p>';
      }
    }

    function closeModal() {
      document.getElementById('crud-modal').style.display = 'none';
    }

    async function handleFormSubmit(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = {};
      formData.forEach((value, key) => {
        if (value !== '') payload[key] = value;
      });

      const url = currentEditId ? ('/api/crud/' + currentTable + '/' + currentEditId) : ('/api/crud/' + currentTable);
      const method = currentEditId ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.status === 200 || result.status === 201) {
          alert('✔ Success: ' + (result.message || 'Operation successful!'));
          closeModal();
          refreshCurrentTable();
        } else {
          alert('❌ Error: ' + (result.error || result.message || 'Failed'));
        }
      } catch (err) {
        alert('Network Error: ' + err.message);
      }
    }

    async function deleteRecord(id) {
      if (!confirm('Are you sure you want to permanently delete record #' + id + ' from ' + currentTable + '?')) {
        return;
      }
      try {
        const res = await fetch('/api/crud/' + currentTable + '/' + id, { method: 'DELETE' });
        const result = await res.json();
        if (result.status === 200) {
          alert('✔ Record deleted successfully.');
          refreshCurrentTable();
        } else {
          alert('❌ Failed to delete: ' + (result.error || 'Server error'));
        }
      } catch (e) {
        alert('Network Error: ' + e.message);
      }
    }

    window.onload = () => {
      loadTable(currentTable);
    };
  </script>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    res.status(500).send(`<h2>Database Connection Error</h2><p>${(err as Error).message}</p>`);
  }
});

// Root ping
app.get(['/', '/api'], (_req: Request, res: Response) => {
  res.json({
    status: 200,
    service: 'JBAC Backend API Gateway',
    database: dbName,
    active_endpoints: {
      admin_gui: '/api/admin-database-view',
      tables_list: '/api/tables',
      generic_crud: '/api/crud/:table',
      events: '/api/events',
      register_unified: '/api/register-all'
    }
  });
});

export const handler = serverless(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, async () => {
  console.log(`JBAC Backend API successfully listening on port ${PORT}!`);
  console.log(`Connected to Database Cluster at: ${dbHost}`);
});
