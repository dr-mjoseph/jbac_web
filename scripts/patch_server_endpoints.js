const fs = require('fs');
const path = require('path');

const serverTsPath = path.join(__dirname, '..', 'backend', 'server.ts');
let content = fs.readFileSync(serverTsPath, 'utf8');

const anchor = "app.get('/', (_req, res) => {";
if (!content.includes(anchor)) {
  console.error("Anchor not found in server.ts!");
  process.exit(1);
}

const endpointsCode = `
// ==========================================
// ENTREPRENEUR & INVESTOR SERVICES & ADMIN APIS
// ==========================================

// 1. Business Types Dropdown Data
app.all(['/dashboardapi/business-types', '/api/business-types', '/dashboardapi/getbusinesstypes', '/api/getbusinesstypes'], async (req: any, res: any) => {
    try {
        const [rows]: any = await db.query('SELECT * FROM \`business_types\` WHERE \`d_in\` = 0 AND \`status\` = 1 ORDER BY \`id\` ASC');
        res.json({ status: 200, data: rows || [], message: 'Success' });
    } catch (err: any) {
        res.json({ status: 500, message: err.message || 'Error fetching business types', data: [] });
    }
});

// Helper to resolve geographic location names
async function resolveLocationNames(loc: any) {
    try {
        let state_name = loc.state_name || '';
        let district_name = loc.district_name || '';
        let constituency_name = loc.constituency_name || '';
        let mandal_name = loc.mandal_name || '';
        let panchayat_name = loc.panchayat_name || '';

        if (!state_name && loc.state_id) {
            const [rows]: any = await db.query('SELECT state_name FROM \`states\` WHERE id = ?', [loc.state_id]);
            if (rows && rows.length > 0) state_name = rows[0].state_name;
        }
        if (!district_name && loc.district_id) {
            const [rows]: any = await db.query('SELECT distrct_nm FROM \`dstrct\` WHERE id = ?', [loc.district_id]);
            if (rows && rows.length > 0) district_name = rows[0].distrct_nm;
        }
        if (!constituency_name && loc.constituency_id) {
            const [rows]: any = await db.query('SELECT const_nm, name FROM \`constituencies\` WHERE id = ?', [loc.constituency_id]);
            if (rows && rows.length > 0) constituency_name = rows[0].const_nm || rows[0].name;
        }
        if (!mandal_name && loc.mandal_id) {
            const [rows]: any = await db.query('SELECT mndl_nm, name FROM \`mandals\` WHERE id = ?', [loc.mandal_id]);
            if (rows && rows.length > 0) mandal_name = rows[0].mndl_nm || rows[0].name;
        }
        if (!panchayat_name && loc.panchayat_id) {
            const [rows]: any = await db.query('SELECT pnchyt_nm, name FROM \`panchayats\` WHERE id = ?', [loc.panchayat_id]);
            if (rows && rows.length > 0) panchayat_name = rows[0].pnchyt_nm || rows[0].name;
        }

        return { state_name, district_name, constituency_name, mandal_name, panchayat_name };
    } catch (e) {
        return {
            state_name: loc.state_name || '',
            district_name: loc.district_name || '',
            constituency_name: loc.constituency_name || '',
            mandal_name: loc.mandal_name || '',
            panchayat_name: loc.panchayat_name || ''
        };
    }
}

// 2. Register Entrepreneur
app.all(['/dashboardapi/entrepreneur-register', '/api/entrepreneur-register', '/dashboardapi/register-entrepreneur', '/api/register-entrepreneur'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const name = (b.name || '').trim();
        const mobile = String(b.mobile || b.phone || b.mobile_number || '').trim();
        if (!name || !mobile) {
            return res.json({ status: 400, message: 'Name and mobile number are required. / పేరు మరియు మొబైల్ నంబర్ తప్పనిసరి.' });
        }

        // Resolve personal address names
        const personalLoc = await resolveLocationNames({
            state_id: b.state_id,
            district_id: b.district_id || b.districts,
            constituency_id: b.constituency_id || b.constituencyname,
            mandal_id: b.mandal_id || b.mandals,
            panchayat_id: b.panchayat_id || b.panchayati,
            state_name: b.state_name,
            district_name: b.district_name,
            constituency_name: b.constituency_name,
            mandal_name: b.mandal_name,
            panchayat_name: b.panchayat_name
        });

        // Resolve business location names
        const businessLoc = await resolveLocationNames({
            state_id: b.business_state_id,
            district_id: b.business_district_id || b.business_districts,
            constituency_id: b.business_constituency_id || b.business_constituencyname,
            mandal_id: b.business_mandal_id || b.business_mandals,
            panchayat_id: b.business_panchayat_id || b.business_panchayati,
            state_name: b.business_state_name,
            district_name: b.business_district_name,
            constituency_name: b.business_constituency_name,
            mandal_name: b.business_mandal_name,
            panchayat_name: b.business_panchayat_name
        });

        // Resolve business type name if needed
        let business_type = b.business_type || '';
        if (!business_type && b.business_type_id) {
            const [bRows]: any = await db.query('SELECT business_type FROM \`business_types\` WHERE id = ?', [b.business_type_id]);
            if (bRows && bRows.length > 0) business_type = bRows[0].business_type;
        }

        // Resolve denomination name if needed
        let denomination = b.denomination || '';
        if (!denomination && b.denomination_id) {
            const [dRows]: any = await db.query('SELECT denomation_name FROM \`churchdenomation\` WHERE id = ?', [b.denomination_id]);
            if (dRows && dRows.length > 0) denomination = dRows[0].denomation_name;
        }

        const insertSql = \`
            INSERT INTO \\\`entrepreneur_reg\\\` (
                name, mobile, email,
                state_id, district_id, constituency_id, mandal_id, panchayat_id,
                state_name, district_name, constituency_name, mandal_name, panchayat_name,
                business_state_id, business_district_id, business_constituency_id, business_mandal_id, business_panchayat_id,
                business_state_name, business_district_name, business_constituency_name, business_mandal_name, business_panchayat_name,
                business_type_id, business_type,
                denomination_id, denomination,
                self_fund, capital_need, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`;

        const params = [
            name,
            mobile,
            b.email || '',
            b.state_id || null,
            b.district_id || b.districts || null,
            b.constituency_id || b.constituencyname || null,
            b.mandal_id || b.mandals || null,
            b.panchayat_id || b.panchayati || null,
            personalLoc.state_name,
            personalLoc.district_name,
            personalLoc.constituency_name,
            personalLoc.mandal_name,
            personalLoc.panchayat_name,
            b.business_state_id || null,
            b.business_district_id || b.business_districts || null,
            b.business_constituency_id || b.business_constituencyname || null,
            b.business_mandal_id || b.business_mandals || null,
            b.business_panchayat_id || b.business_panchayati || null,
            businessLoc.state_name,
            businessLoc.district_name,
            businessLoc.constituency_name,
            businessLoc.mandal_name,
            businessLoc.panchayat_name,
            b.business_type_id || null,
            business_type,
            b.denomination_id || null,
            denomination,
            String(b.self_fund || ''),
            String(b.capital_need || ''),
            b.description || ''
        ];

        const [result]: any = await db.query(insertSql, params);
        res.json({
            status: 200,
            message: 'Entrepreneur registration submitted successfully! / మీ ఎంటర్‌ప్రెన్యూర్ వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి!',
            id: result.insertId
        });
    } catch (err: any) {
        console.error('Error in entrepreneur-register:', err);
        res.json({ status: 500, message: err.message || 'Error submitting entrepreneur registration' });
    }
});

// 3. Register Investor
app.all(['/dashboardapi/investor-register', '/api/investor-register', '/dashboardapi/register-investor', '/api/register-investor'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const name = (b.name || '').trim();
        const mobile = String(b.mobile || b.phone || b.mobile_number || '').trim();
        if (!name || !mobile) {
            return res.json({ status: 400, message: 'Name and mobile number are required. / పేరు మరియు మొబైల్ నంబర్ తప్పనిసరి.' });
        }

        // Resolve personal address names
        const personalLoc = await resolveLocationNames({
            state_id: b.state_id,
            district_id: b.district_id || b.districts,
            constituency_id: b.constituency_id || b.constituencyname,
            mandal_id: b.mandal_id || b.mandals,
            panchayat_id: b.panchayat_id || b.panchayati,
            state_name: b.state_name,
            district_name: b.district_name,
            constituency_name: b.constituency_name,
            mandal_name: b.mandal_name,
            panchayat_name: b.panchayat_name
        });

        // Resolve business type name if needed
        let business_type = b.business_type || '';
        if (!business_type && b.business_type_id) {
            const [bRows]: any = await db.query('SELECT business_type FROM \`business_types\` WHERE id = ?', [b.business_type_id]);
            if (bRows && bRows.length > 0) business_type = bRows[0].business_type;
        }

        // Resolve denomination name if needed
        let denomination = b.denomination || '';
        if (!denomination && b.denomination_id) {
            const [dRows]: any = await db.query('SELECT denomation_name FROM \`churchdenomation\` WHERE id = ?', [b.denomination_id]);
            if (dRows && dRows.length > 0) denomination = dRows[0].denomation_name;
        }

        const insertSql = \`
            INSERT INTO \\\`investor_reg\\\` (
                name, mobile, email,
                state_id, district_id, constituency_id, mandal_id, panchayat_id,
                state_name, district_name, constituency_name, mandal_name, panchayat_name,
                business_type_id, business_type,
                denomination_id, denomination,
                capital_to_invest, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`;

        const params = [
            name,
            mobile,
            b.email || '',
            b.state_id || null,
            b.district_id || b.districts || null,
            b.constituency_id || b.constituencyname || null,
            b.mandal_id || b.mandals || null,
            b.panchayat_id || b.panchayati || null,
            personalLoc.state_name,
            personalLoc.district_name,
            personalLoc.constituency_name,
            personalLoc.mandal_name,
            personalLoc.panchayat_name,
            b.business_type_id || null,
            business_type,
            b.denomination_id || null,
            denomination,
            String(b.capital_to_invest || ''),
            b.description || ''
        ];

        const [result]: any = await db.query(insertSql, params);
        res.json({
            status: 200,
            message: 'Investor registration submitted successfully! / మీ ఇన్వెస్టర్ వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి!',
            id: result.insertId
        });
    } catch (err: any) {
        console.error('Error in investor-register:', err);
        res.json({ status: 500, message: err.message || 'Error submitting investor registration' });
    }
});

// 4. Admin List of Entrepreneurs
app.all(['/dashboardapi/admin-entrepreneurs', '/api/admin-entrepreneurs'], async (req: any, res: any) => {
    try {
        const [rows]: any = await db.query('SELECT * FROM \`entrepreneur_reg\` WHERE \`d_in\` = 0 ORDER BY \`id\` DESC');
        res.json({ status: 200, data: rows || [], message: 'Success' });
    } catch (err: any) {
        res.json({ status: 500, message: err.message || 'Error fetching entrepreneurs', data: [] });
    }
});

// 5. Admin List of Investors
app.all(['/dashboardapi/admin-investors', '/api/admin-investors'], async (req: any, res: any) => {
    try {
        const [rows]: any = await db.query('SELECT * FROM \`investor_reg\` WHERE \`d_in\` = 0 ORDER BY \`id\` DESC');
        res.json({ status: 200, data: rows || [], message: 'Success' });
    } catch (err: any) {
        res.json({ status: 500, message: err.message || 'Error fetching investors', data: [] });
    }
});

// 6. Admin Update Entrepreneur
app.all(['/dashboardapi/admin-update-entrepreneur', '/api/admin-update-entrepreneur'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const id = b.id;
        const action = b.action; // 'approve', 'reject', 'reset', 'delete'
        if (!id) return res.json({ status: 400, message: 'ID required' });

        if (action === 'approve') {
            await db.query('UPDATE \`entrepreneur_reg\` SET approval_ind = 1, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'reject') {
            await db.query('UPDATE \`entrepreneur_reg\` SET approval_ind = 2, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'reset') {
            await db.query('UPDATE \`entrepreneur_reg\` SET approval_ind = 0, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'delete') {
            await db.query('UPDATE \`entrepreneur_reg\` SET d_in = 1 WHERE id = ?', [id]);
        }
        res.json({ status: 200, message: 'Entrepreneur status updated successfully' });
    } catch (err: any) {
        res.json({ status: 500, message: err.message || 'Error updating entrepreneur' });
    }
});

// 7. Admin Update Investor
app.all(['/dashboardapi/admin-update-investor', '/api/admin-update-investor'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const id = b.id;
        const action = b.action; // 'approve', 'reject', 'reset', 'delete'
        if (!id) return res.json({ status: 400, message: 'ID required' });

        if (action === 'approve') {
            await db.query('UPDATE \`investor_reg\` SET approval_ind = 1, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'reject') {
            await db.query('UPDATE \`investor_reg\` SET approval_ind = 2, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'reset') {
            await db.query('UPDATE \`investor_reg\` SET approval_ind = 0, d_in = 0 WHERE id = ?', [id]);
        } else if (action === 'delete') {
            await db.query('UPDATE \`investor_reg\` SET d_in = 1 WHERE id = ?', [id]);
        }
        res.json({ status: 200, message: 'Investor status updated successfully' });
    } catch (err: any) {
        res.json({ status: 500, message: err.message || 'Error updating investor' });
    }
});

`;

content = content.replace(anchor, endpointsCode + "\n" + anchor);
fs.writeFileSync(serverTsPath, content, 'utf8');
console.log('Successfully patched server.ts with Entrepreneur and Investor endpoints!');

