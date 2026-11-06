const fs = require('fs');

const path = 'backend/server.ts';
let code = fs.readFileSync(path, 'utf8');

const target = "app.get('/', (_req, res) => {";
if (!code.includes(target)) {
  console.error("Target app.get('/', (_req, res) => { not found!");
  process.exit(1);
}

const teacherEndpoints = `
// ==========================================
// TEACHING STAFF & TEACHERS REGISTRATION MODULE
// ==========================================

// 1. Get Teaching Master Data (Roles, Family Backgrounds, Institution Types, Experience, Qualifications, Denominations)
app.all(['/dashboardapi/teaching-master-data', '/api/teaching-master-data'], async (_req: any, res: any) => {
    try {
        const [roles]: any = await db.query('SELECT * FROM \`teaching_role_categories\` WHERE \`status\` = "active" ORDER BY \`id\` ASC');
        const [backgrounds]: any = await db.query('SELECT * FROM \`teaching_family_backgrounds\` WHERE \`status\` = "active" ORDER BY \`id\` ASC');
        const [institutions]: any = await db.query('SELECT * FROM \`teaching_institution_types\` WHERE \`status\` = "active" ORDER BY \`id\` ASC');
        const [experience]: any = await db.query('SELECT * FROM \`teaching_experience_levels\` WHERE \`status\` = "active" ORDER BY \`id\` ASC');
        const [qualifications]: any = await db.query('SELECT * FROM \`educational_qualifications\` WHERE \`d_in\` = 0 ORDER BY \`id\` ASC');
        const [denominations]: any = await db.query('SELECT * FROM \`denominations\` WHERE \`d_in\` = 0 ORDER BY \`id\` ASC');

        res.json({
            status: 200,
            data: {
                roles: roles || [],
                backgrounds: backgrounds || [],
                institutions: institutions || [],
                experience: experience || [],
                qualifications: qualifications || [],
                denominations: denominations || []
            },
            message: 'Success'
        });
    } catch (err: any) {
        console.error('Error fetching teaching master data:', err);
        res.status(500).json({ status: 500, message: err.message || 'Error fetching teaching master data' });
    }
});

// 2. Register Teaching Employee
app.all(['/dashboardapi/teacher-register', '/api/teacher-register', '/dashboardapi/register-teacher', '/api/register-teacher'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const name = (b.name || '').trim();
        const mobile = String(b.mobile || b.phone || b.mobile_number || '').trim();
        if (!name || !mobile) {
            return res.json({ status: 400, message: 'Name and mobile number are required. / పేరు మరియు మొబైల్ నంబర్ తప్పనిసరి.' });
        }

        // Resolve Residential Address Names
        const resLoc = await resolveLocationNames({
            state_id: b.res_state_id || b.state_id,
            district_id: b.res_district_id || b.district_id || b.districts,
            constituency_id: b.res_constituency_id || b.constituency_id || b.constituencyname,
            mandal_id: b.res_mandal_id || b.mandal_id || b.mandals,
            panchayat_id: b.res_panchayat_id || b.panchayat_id || b.panchayati,
            state_name: b.res_state_name,
            district_name: b.res_district_name,
            constituency_name: b.res_constituency_name,
            mandal_name: b.res_mandal_name,
            panchayat_name: b.res_panchayat_name
        });

        // Resolve Institute Address Names
        const instLoc = await resolveLocationNames({
            state_id: b.inst_state_id || b.institute_state_id || b.business_state_id,
            district_id: b.inst_district_id || b.institute_district_id || b.institute_districts || b.business_districts,
            constituency_id: b.inst_constituency_id || b.institute_constituency_id || b.institute_constituencyname || b.business_constituencyname,
            mandal_id: b.inst_mandal_id || b.institute_mandal_id || b.institute_mandals || b.business_mandals,
            panchayat_id: b.inst_panchayat_id || b.institute_panchayat_id || b.institute_panchayati || b.business_panchayati,
            state_name: b.inst_state_name,
            district_name: b.inst_district_name,
            constituency_name: b.inst_constituency_name,
            mandal_name: b.inst_mandal_name,
            panchayat_name: b.inst_panchayat_name
        });

        const [result]: any = await db.query(
            \`INSERT INTO \\\`teacher_reg\\\` (
                \\\`name\\\`, \\\`mobile\\\`, \\\`email\\\`, \\\`gender\\\`, \\\`designation\\\`,
                \\\`role_category\\\`, \\\`qualification_category\\\`, \\\`qualification_id\\\`,
                \\\`total_experience_years\\\`, \\\`experience_in\\\`, \\\`caste\\\`, \\\`subcaste\\\`,
                \\\`denomination_id\\\`, \\\`faith_category\\\`, \\\`family_background\\\`,
                \\\`pastor_phone\\\`, \\\`teacher_type\\\`, \\\`working_in\\\`, \\\`institute_name\\\`,
                \\\`inst_state_id\\\`, \\\`inst_district_id\\\`, \\\`inst_constituency_id\\\`, \\\`inst_mandal_id\\\`, \\\`inst_panchayat_id\\\`, \\\`inst_address\\\`,
                \\\`res_state_id\\\`, \\\`res_district_id\\\`, \\\`res_constituency_id\\\`, \\\`res_mandal_id\\\`, \\\`res_panchayat_id\\\`, \\\`res_address\\\`,
                \\\`description\\\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
            [
                name,
                mobile,
                b.email ? String(b.email).trim() : null,
                b.gender || 'Not Specified',
                b.designation || 'Teacher',
                b.role_category || 'Teaching',
                b.qualification_category || 'UG',
                b.qualification_id ? Number(b.qualification_id) : null,
                String(b.total_experience_years || b.experience || '0'),
                b.experience_in ? String(b.experience_in).trim() : null,
                b.caste || 'No Caste',
                b.subcaste ? String(b.subcaste).trim() : null,
                b.denomination_id ? Number(b.denomination_id) : null,
                b.faith_category || null,
                b.family_background || 'First Generation Employee',
                b.pastor_phone || '',
                b.teacher_type || 'Private',
                b.working_in || 'High School',
                b.institute_name || '',
                Number(b.inst_state_id || b.institute_state_id || b.business_state_id || 1),
                Number(b.inst_district_id || b.institute_district_id || b.institute_districts || b.business_districts || 0),
                b.inst_constituency_id || b.institute_constituency_id ? Number(b.inst_constituency_id || b.institute_constituency_id) : null,
                b.inst_mandal_id || b.institute_mandal_id ? Number(b.inst_mandal_id || b.institute_mandal_id) : null,
                b.inst_panchayat_id || b.institute_panchayat_id ? Number(b.inst_panchayat_id || b.institute_panchayat_id) : null,
                b.inst_address || instLoc.full_address || null,
                Number(b.res_state_id || b.state_id || 1),
                Number(b.res_district_id || b.district_id || b.districts || 0),
                b.res_constituency_id || b.constituency_id ? Number(b.res_constituency_id || b.constituency_id) : null,
                b.res_mandal_id || b.mandal_id ? Number(b.res_mandal_id || b.mandal_id) : null,
                b.res_panchayat_id || b.panchayat_id ? Number(b.res_panchayat_id || b.panchayat_id) : null,
                b.res_address || resLoc.full_address || null,
                b.description || null
            ]
        );

        res.json({
            status: 200,
            message: 'Teaching staff registration submitted successfully! / మీ బోధనా రంగ ఉద్యోగి వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి!',
            id: result.insertId
        });
    } catch (err: any) {
        console.error('Error in teacher-register:', err);
        res.status(500).json({ status: 500, message: err.message || 'Error submitting teacher registration' });
    }
});

// 3. Admin List of Teachers
app.all(['/dashboardapi/admin-teachers', '/api/admin-teachers'], async (req: any, res: any) => {
    try {
        const [rows]: any = await db.query('SELECT * FROM \`teacher_reg\` ORDER BY \`id\` DESC');
        res.json({ status: 200, data: rows || [], message: 'Success' });
    } catch (err: any) {
        res.status(500).json({ status: 500, message: err.message || 'Error fetching teachers', data: [] });
    }
});

// 4. Admin Update Teacher Status (Approve / Reject / Reset)
app.all(['/dashboardapi/admin-update-teacher', '/api/admin-update-teacher'], async (req: any, res: any) => {
    try {
        const { id, approval_ind, status } = req.body || {};
        if (!id) return res.json({ status: 400, message: 'Teacher ID required' });
        await db.query(
            'UPDATE \`teacher_reg\` SET \`approval_ind\` = ?, \`status\` = ? WHERE \`id\` = ?',
            [Number(approval_ind || 0), status || 'pending', Number(id)]
        );
        res.json({ status: 200, message: 'Teacher status updated successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, message: err.message || 'Error updating teacher status' });
    }
});

`;

code = code.replace(target, teacherEndpoints + target);
fs.writeFileSync(path, code, 'utf8');
console.log('Successfully patched backend/server.ts with teacher endpoints!');
