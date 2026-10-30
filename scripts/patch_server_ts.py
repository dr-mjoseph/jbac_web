with open('backend/server.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Admin Dashboard Stats
old_stats = """// Admin Dashboard KPI Stats API (Supports state-wise filtering: ?state_id=1 or ?state_id=2 or ?state_id=all)
app.get(['/dashboardapi/admin-dashboard-stats', '/api/admin-dashboard-stats', '/api/dashboard-stats'], async (req, res) => {
    try {
        const stateId = req.query.state_id && req.query.state_id !== 'all' ? Number(req.query.state_id) : null;

        async function getCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    } else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                return 0;
            }
        }

        const [
            believers,
            pastors,
            churches,
            students,
            ministries,
            organisations,
            events_active,
            events_total,
            users
        ] = await Promise.all([
            getCount('signup_form'),
            getCount('pastor_reg'),
            getCount('church_reg'),
            getCount('student_reg'),
            getCount('ministry_signup'),
            getCount('independentorganisation_reg'),
            getCount('events', "WHERE d_in = 0 OR d_in IS NULL"),
            getCount('events'),
            getCount('users')
        ]);

        res.json({
            status: 200,
            success: true,
            state_id: stateId || 'all',
            stats: {
                believers,
                pastors,
                churches,
                students,
                ministries,
                organisations,
                events_active,
                events_total,
                users
            }
        });
    } catch (err: any) {
        res.status(500).json({ status: 500, success: false, error: err.message });
    }
});"""

new_stats = """// Admin Dashboard KPI Stats API (Supports state-wise filtering: ?state_id=1 or ?state_id=2 or ?state_id=all)
app.get(['/dashboardapi/admin-dashboard-stats', '/api/admin-dashboard-stats', '/api/dashboard-stats'], async (req, res) => {
    try {
        const stateId = req.query.state_id && req.query.state_id !== 'all' ? Number(req.query.state_id) : null;
        const todayDate = getIndianCts().substring(0, 10);

        async function getCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    } else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                return 0;
            }
        }

        async function getTodayCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                if (tbl === 'events') {
                    dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                }
                if (where) {
                    where += ` AND ${dateCondition}`;
                } else {
                    where = `WHERE ${dateCondition}`;
                }
                if (stateId) {
                    where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                return 0;
            }
        }

        const [
            believers, believers_today,
            pastors, pastors_today,
            churches, churches_today,
            students, students_today,
            ministries, ministries_today,
            organisations, organisations_today,
            events_active, events_today,
            events_total,
            users, users_today
        ] = await Promise.all([
            getCount('signup_form'), getTodayCount('signup_form'),
            getCount('pastor_reg'), getTodayCount('pastor_reg'),
            getCount('church_reg'), getTodayCount('church_reg'),
            getCount('student_reg'), getTodayCount('student_reg'),
            getCount('ministry_signup'), getTodayCount('ministry_signup'),
            getCount('independentorganisation_reg'), getTodayCount('independentorganisation_reg'),
            getCount('events', "WHERE d_in = 0 OR d_in IS NULL"), getTodayCount('events'),
            getCount('events'),
            getCount('users'), getTodayCount('users')
        ]);

        res.json({
            status: 200,
            success: true,
            state_id: stateId || 'all',
            today_date: todayDate,
            stats: {
                believers,
                believers_today,
                pastors,
                pastors_today,
                churches,
                churches_today,
                students,
                students_today,
                ministries,
                ministries_today,
                organisations,
                organisations_today,
                events_active,
                events_today,
                events_total,
                users,
                users_today
            }
        });
    } catch (err: any) {
        res.status(500).json({ status: 500, success: false, error: err.message });
    }
});"""

# 2. Update postmeetings to save enddate & event_id into adds_data
old_postmeetings_adds = """        // Also add to adds_data so meetings show in search & banner lists
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
        } catch (_) {}"""

new_postmeetings_adds = """        // Also add to adds_data so meetings show in search & banner lists
        try {
            await dynamicInsert('adds_data', {
                type: 'Meetings',
                title: m.orgname || m.mettingtype || 'Meeting',
                description: m.description || '',
                image: img,
                number: m.evntphone || m.orgphone || '',
                user_id: m.usr_id || null,
                enddate: m.todate || m.enddate || null,
                event_id: result?.insertId || null,
                d_in: 0,
                approval_ind: 1
            });
        } catch (_) {}"""

# 3. Update postadds and getaddsdata
old_ads_block = """// Ads & Classifieds
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
});"""

new_ads_block = """// Ads & Classifieds
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
            enddate: a.enddate || a.todate || null,
            d_in: 0,
            approval_ind: 0
        });
        res.json({ status: 200, message: 'Ad created successfully', insertId: result?.insertId });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

app.all(['/dashboardapi/getaddsdata', '/api/getadds'], async (_req, res) => {
    try {
        const todayStr = getIndianCts().substring(0, 10);
        // If the ad is a meeting, display until end date after that disappear.
        // If not a meeting, display continuously until admin stops it (d_in = 0).
        const [rows]: any = await db.query(`
            SELECT * FROM adds_data 
            WHERE d_in = 0 
              AND (
                LOWER(COALESCE(type, '')) NOT LIKE '%meet%'
                OR (
                  enddate IS NOT NULL 
                  AND enddate != '' 
                  AND enddate >= ?
                )
                OR (
                  (enddate IS NULL OR enddate = '')
                  AND (cts IS NULL OR LEFT(cts, 10) >= ?)
                )
              )
            ORDER BY id DESC
        `, [todayStr, todayStr]);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

# 4. Cross-Category User Lookup API
lookup_endpoint = """
// Cross-Category User Profile Autofetch API (e.g., student registering as believer/pastor)
app.post(['/dashboardapi/lookup-existing-user', '/api/lookup-existing-user', '/api/finduserbyphone'], async (req: any, res: any) => {
    try {
        const rawPhone = String(req.body?.phone || req.body?.mobile_number || req.body?.number || '').trim();
        const digits = rawPhone.replace(/\\D/g, '').slice(-10);
        if (!digits || digits.length < 10) {
            return res.json({ status: 200, found: false, message: 'Valid 10-digit phone required' });
        }

        let foundUser: any = null;
        let sourceCategory = '';

        // 1. Check student_reg
        const [students]: any = await db.query(
            'SELECT * FROM student_reg WHERE (number LIKE ? OR whatsapp LIKE ? OR whatsappnumber LIKE ?) ORDER BY id DESC LIMIT 1',
            [`%${digits}`, `%${digits}`, `%${digits}`]
        );
        if (students && students.length > 0) {
            const s = students[0];
            foundUser = {
                name: s.studentname,
                fname: s.studentname,
                fathername: s.fathername || '',
                phone: digits,
                mobile_number: digits,
                whatsapp: s.whatsapp || s.whatsappnumber || digits,
                email: s.email || '',
                gender: s.gender || '',
                dob: s.dob || '',
                state_id: s.state_id || 1,
                state: s.state || 'Andhra Pradesh',
                district_id: s.district_id || s.resdistricts || null,
                constituency_id: s.constituency_id || s.resconstituencyname || null,
                mandal_id: s.mandal_id || s.resmandals || null,
                panchayat_id: s.village_id || s.respanchayati || null,
                villagename: s.villagename || '',
                address: s.address || '',
                nativeplace: s.nativeplace || '',
                caste: s.caste || '',
                subcaste: s.subcaste || '',
                denomination_id: s.denomination_id || null,
                education: s.study || s.group_branch || '',
                leadership: s.leadership || 'NO',
                leadertype: s.leadertype || '',
                generaltype: s.generaltype || '',
                wingtype: s.wingtype || '',
                talent: s.talent || '',
                hobbies: s.hobbies || '',
                lifegoal: s.lifegoal || '',
                spirti: s.spirti || ''
            };
            sourceCategory = 'student';
        }

        // 2. Check signup_form (Believer) if not found in student
        if (!foundUser) {
            const [believers]: any = await db.query(
                'SELECT * FROM signup_form WHERE (mobile_number LIKE ? OR whatsapp LIKE ?) ORDER BY id DESC LIMIT 1',
                [`%${digits}`, `%${digits}`]
            );
            if (believers && believers.length > 0) {
                const b = believers[0];
                foundUser = {
                    name: b.fname ? `${b.fname} ${b.lname || ''}`.trim() : '',
                    fname: b.fname || '',
                    lname: b.lname || '',
                    fathername: '',
                    phone: digits,
                    mobile_number: digits,
                    whatsapp: b.whatsapp || digits,
                    email: b.email || '',
                    gender: b.gender || '',
                    dob: b.dob || '',
                    state_id: b.state_id || 1,
                    state: b.state || 'Andhra Pradesh',
                    district_id: b.district_id || null,
                    constituency_id: b.constituency_id || null,
                    mandal_id: b.mandal_id || null,
                    panchayat_id: b.panchayat_id || null,
                    villagename: b.villagename || '',
                    address: b.address || '',
                    nativeplace: b.nativeplace || '',
                    caste: b.caste || '',
                    subcaste: b.subcaste || '',
                    denomination_id: b.denomination_id || null,
                    education: b.education || '',
                    leadership: b.leadership || 'NO',
                    leadertype: b.leadertype || '',
                    generaltype: b.generaltype || '',
                    wingtype: b.wingtype || '',
                    talent: b.talent || '',
                    hobbies: b.hobbies || '',
                    lifegoal: b.lifegoal || '',
                    spirti: b.spirti || ''
                };
                sourceCategory = 'believer';
            }
        }

        // 3. Check pastor_reg if still not found
        if (!foundUser) {
            const [pastors]: any = await db.query(
                'SELECT * FROM pastor_reg WHERE (phonenumber LIKE ? OR phonenumber2 LIKE ? OR pa_phonenumber LIKE ? OR whatsapp LIKE ?) ORDER BY id DESC LIMIT 1',
                [`%${digits}`, `%${digits}`, `%${digits}`, `%${digits}`]
            );
            if (pastors && pastors.length > 0) {
                const p = pastors[0];
                foundUser = {
                    name: p.pastorname,
                    fname: p.pastorname,
                    pastorname: p.pastorname,
                    fathername: '',
                    phone: digits,
                    mobile_number: digits,
                    whatsapp: p.whatsapp || digits,
                    email: '',
                    gender: p.gender || '',
                    dob: p.dob || '',
                    state_id: p.state_id || 1,
                    state: p.state || 'Andhra Pradesh',
                    district_id: p.district_id || null,
                    constituency_id: p.constituency_id || null,
                    mandal_id: p.mandal_id || null,
                    panchayat_id: p.village_id || null,
                    villagename: p.villagename || '',
                    address: p.address || '',
                    nativeplace: p.nativeplace || '',
                    caste: p.caste || '',
                    subcaste: p.subcaste || '',
                    denomination_id: p.denomination_id || null,
                    education: p.education || '',
                    leadership: p.leadership || 'NO',
                    leadertype: p.leadertype || '',
                    generaltype: p.generaltype || '',
                    wingtype: p.wingtype || '',
                    talent: p.talent || '',
                    lifegoal: p.lifegoal || ''
                };
                sourceCategory = 'pastor';
            }
        }

        if (foundUser) {
            res.json({
                status: 200,
                found: true,
                source_category: sourceCategory,
                message: `Existing registration found in ${sourceCategory} category`,
                data: foundUser
            });
        } else {
            res.json({ status: 200, found: false, message: 'No existing registration found' });
        }
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});
"""

# 5. Update getUserMainData, getLeaderswebsiteData, updateconsis, deleteboardmember
old_getUserMainData = """app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const [rows]: any = await db.query('SELECT * FROM wingleader WHERE (usr_id = ? OR user_id = ?) AND d_in = 0', [usrId, usrId]);
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

new_getUserMainData = """app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req: any, res: any) => {
    try {
        const b = req.body || {};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const phone = b.mobile_number || b.phonenumber || b.number || '';
        const cat = String(b.category || b.category_id || '').trim();

        let matchedLeader: any = null;

        // 1. Search in pastor_reg (Pastor)
        if (cat === '4' || !matchedLeader) {
            const [pRows]: any = await db.query(
                'SELECT id, pastorname as name, phonenumber as mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, village_id, state_id, d_in FROM pastor_reg WHERE (id = ? OR phonenumber = ?) LIMIT 1',
                [usrId || -1, phone || '']
            );
            if (pRows && pRows.length > 0) {
                const u = pRows[0];
                // Admin decides if user is registered as district level leader by setting d_in = 1 in db
                if (u.d_in == 1) {
                    matchedLeader = {
                        id: u.id,
                        leadertype: 1, // General leader
                        generaltype: 1, // District level leader
                        state_id: u.state_id || 1,
                        district_id: u.district_id,
                        constituency_id: u.constituency_id,
                        mandal_id: u.mandal_id,
                        village_id: u.village_id,
                        fname: u.name,
                        d_in: 1,
                        role: 'pastor'
                    };
                }
            }
        }

        // 2. Search in signup_form (Believer)
        if (!matchedLeader && (cat === '1' || !cat)) {
            const [bRows]: any = await db.query(
                'SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, panchayat_id as village_id, state_id, d_in FROM signup_form WHERE (id = ? OR mobile_number = ?) LIMIT 1',
                [usrId || -1, phone || '']
            );
            if (bRows && bRows.length > 0) {
                const u = bRows[0];
                // Admin decides if user is registered as district level leader by setting d_in = 1 in db
                if (u.d_in == 1) {
                    matchedLeader = {
                        id: u.id,
                        leadertype: 1, // General leader
                        generaltype: 1, // District level leader
                        state_id: u.state_id || 1,
                        district_id: u.district_id,
                        constituency_id: u.constituency_id,
                        mandal_id: u.mandal_id,
                        village_id: u.village_id,
                        fname: u.name,
                        d_in: 1,
                        role: 'believer'
                    };
                }
            }
        }

        // 3. Fallback to wingleader table
        if (!matchedLeader && usrId) {
            const [wRows]: any = await db.query('SELECT * FROM wingleader WHERE (usr_id = ? OR user_id = ?) AND d_in = 0', [usrId, usrId]);
            if (wRows && wRows.length > 0) {
                return res.json({ status: 200, data: wRows });
            }
        }

        if (matchedLeader) {
            return res.json({ status: 200, data: [matchedLeader] });
        }

        // Not approved as district leader (d_in != 1)
        res.json({ status: 200, data: [] });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

old_leaders_data = """app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders'], async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM wingleaderstype WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

new_leaders_data = """app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req: any, res: any) => {
    try {
        const b = req.body || req.query || {};
        const districtId = b.district_id || b.districtId || null;
        const currentUserId = b.usr_id || b.user_id || -1;

        if (districtId) {
            // Fetch believers under this district (mandal/panchayat/constituency wise)
            const [believers]: any = await db.query(`
                SELECT s.id, s.fname, s.lname, s.mobile_number, s.generaltype, s.leadership, s.leadertype,
                       s.approval_ind, s.district_id, s.constituency_id, s.mandal_id, s.panchayat_id,
                       s.address, s.nativeplace, s.villagename,
                       COALESCE(c.const_nm, '') as constituency_name,
                       COALESCE(m.mndl_nm, '') as mandal_name,
                       COALESCE(p.pnchyt_nm, '') as panchayat_name
                FROM signup_form s
                LEFT JOIN const_dtl_t c ON s.constituency_id = c.id
                LEFT JOIN mndls_lst_t m ON s.mandal_id = m.id
                LEFT JOIN pnchyt_lst_t p ON s.panchayat_id = p.id
                WHERE s.district_id = ? 
                  AND (LOWER(COALESCE(s.leadership, '')) = 'yes' OR s.leadertype IS NOT NULL OR s.generaltype IS NOT NULL)
                  AND s.id != ?
                ORDER BY s.id DESC
            `, [districtId, currentUserId]);

            // Fetch pastors under this district (mandal/panchayat/constituency wise)
            const [pastors]: any = await db.query(`
                SELECT pr.id, pr.pastorname, pr.phonenumber, pr.generaltype, pr.leadership, pr.leadertype,
                       pr.approval_ind, pr.district_id, pr.constituency_id, pr.mandal_id, pr.village_id,
                       pr.address, pr.nativeplace, pr.villagename,
                       COALESCE(c.const_nm, '') as constituency_name,
                       COALESCE(m.mndl_nm, '') as mandal_name,
                       COALESCE(p.pnchyt_nm, '') as panchayat_name
                FROM pastor_reg pr
                LEFT JOIN const_dtl_t c ON pr.constituency_id = c.id
                LEFT JOIN mndls_lst_t m ON pr.mandal_id = m.id
                LEFT JOIN pnchyt_lst_t p ON pr.village_id = p.id
                WHERE pr.district_id = ? 
                  AND (LOWER(COALESCE(pr.leadership, '')) = 'yes' OR pr.leadertype IS NOT NULL OR pr.generaltype IS NOT NULL)
                  AND pr.id != ?
                ORDER BY pr.id DESC
            `, [districtId, currentUserId]);

            // Fetch constituencies for this district
            const [constituencies]: any = await db.query('SELECT id, const_nm FROM const_dtl_t WHERE dstrct_id = ? AND d_in = 0', [districtId]);

            return res.json({ status: 200, data: [believers, constituencies, pastors] });
        }

        // Fallback to wingleaderstype
        const [rows] = await db.query('SELECT * FROM wingleaderstype WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

old_updateconsis = """app.all(['/dashboardapi/updateconsis', '/dashboardapi/updateconsis/:id', '/api/updateconsis', '/api/updateconsis/:id'], async (req: any, res: any) => {
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
});"""

new_updateconsis = """app.all(['/dashboardapi/updateconsis', '/dashboardapi/updateconsis/:id', '/api/updateconsis', '/api/updateconsis/:id'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const id = req.params.id || body.id || body.usr_id;
        const tableId = Number(body.tableid || 1);
        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]);
            } else if (tableId === 2 || tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]);
            } else {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]).catch(() => {});
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => {});
            }
        }
        res.json({ status: 200, message: 'Leader approved successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

old_deleteboard = """app.all(['/dashboardapi/deleteboardmember', '/api/deleteboardmember'], async (req, res) => {
    try {
        const id = req.body.id;
        if (id) await db.query('DELETE FROM wingleader WHERE id = ?', [id]);
        res.json({ status: 200, message: 'Board member removed successfully' });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

new_deleteboard = """app.all(['/dashboardapi/deleteboardmember', '/api/deleteboardmember', '/api/rejectleader'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const id = body.id || req.params.id;
        const tableId = Number(body.tableid || 1);
        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]);
            } else if (tableId === 2 || tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]);
            } else {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]).catch(() => {});
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => {});
            }
            await db.query('DELETE FROM wingleader WHERE id = ?', [id]).catch(() => {});
        }
        res.json({ status: 200, message: 'Leader rejected successfully' });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

# Apply substitutions
def replace_chunk(txt, old, new, name):
    if old in txt:
        print(f"Replaced {name}")
        return txt.replace(old, new, 1)
    old_crlf = old.replace('\n', '\r\n')
    if old_crlf in txt:
        print(f"Replaced {name} (CRLF)")
        return txt.replace(old_crlf, new.replace('\n', '\r\n'), 1)
    print(f"FAILED to replace {name}")
    return txt

text = replace_chunk(text, old_stats, new_stats, "Admin Dashboard Stats")
text = replace_chunk(text, old_postmeetings_adds, new_postmeetings_adds, "PostMeetings Adds")
text = replace_chunk(text, old_ads_block, new_ads_block + lookup_endpoint, "Ads Block + Lookup API")
text = replace_chunk(text, old_getUserMainData, new_getUserMainData, "getUserMainData")
text = replace_chunk(text, old_leaders_data, new_leaders_data, "Leaders Data")
text = replace_chunk(text, old_updateconsis, new_updateconsis, "Updateconsis")
text = replace_chunk(text, old_deleteboard, new_deleteboard, "Deleteboard")

with open('backend/server.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated backend/server.ts")

