import re

def update_server_js():
    with open('backend/server.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update getCount and getTodayCount in admin-dashboard-stats to handle tables without state_id
    old_get_count = """        async function getCount(tbl, baseWhere = '') {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                    else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            }
            catch (_) {
                return 0;
            }
        }
        async function getTodayCount(tbl, baseWhere = '') {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                if (tbl === 'events') {
                    dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                }
                if (where) {
                    where += ` AND ${dateCondition}`;
                }
                else {
                    where = `WHERE ${dateCondition}`;
                }
                if (stateId) {
                    where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                }
                const [r] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            }
            catch (_) {
                return 0;
            }
        }"""

    new_get_count = """        async function getCount(tbl, baseWhere = '') {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                    else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            }
            catch (_) {
                try {
                    const [r2] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${baseWhere ? baseWhere.trim() : ''}`);
                    return r2 && r2[0] ? Number(r2[0].cnt) : 0;
                } catch (e2) {
                    return 0;
                }
            }
        }
        async function getTodayCount(tbl, baseWhere = '') {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                if (tbl === 'events') {
                    dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                }
                if (where) {
                    where += ` AND ${dateCondition}`;
                }
                else {
                    where = `WHERE ${dateCondition}`;
                }
                if (stateId) {
                    where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                }
                const [r] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            }
            catch (_) {
                try {
                    let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                    if (tbl === 'events') {
                        dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                    }
                    let fallbackWhere = baseWhere ? `${baseWhere.trim()} AND ${dateCondition}` : `WHERE ${dateCondition}`;
                    const [r2] = await db.query(`SELECT COUNT(*) as cnt FROM \\`${tbl}\\` ${fallbackWhere}`);
                    return r2 && r2[0] ? Number(r2[0].cnt) : 0;
                } catch (e2) {
                    return 0;
                }
            }
        }"""

    if old_get_count in content:
        content = content.replace(old_get_count, new_get_count)
        print("Updated getCount and getTodayCount with safe fallbacks")
    else:
        print("Warning: old_get_count not matched directly")

    # 2. Add pastors_associations to Promise.all in admin-dashboard-stats
    old_promise = """        const [believers, believers_today, pastors, pastors_today, churches, churches_today, students, students_today, ministries, ministries_today, organisations, organisations_today, events_active, events_today, events_total, users, users_today] = await Promise.all([
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
        });"""

    new_promise = """        const [believers, believers_today, pastors, pastors_today, churches, churches_today, students, students_today, ministries, ministries_today, organisations, organisations_today, pastor_associations, pastor_associations_today, events_active, events_today, events_total, users, users_today] = await Promise.all([
            getCount('signup_form'), getTodayCount('signup_form'),
            getCount('pastor_reg'), getTodayCount('pastor_reg'),
            getCount('church_reg'), getTodayCount('church_reg'),
            getCount('student_reg'), getTodayCount('student_reg'),
            getCount('ministry_signup'), getTodayCount('ministry_signup'),
            getCount('independentorganisation_reg'), getTodayCount('independentorganisation_reg'),
            getCount('pastors_associations'), getTodayCount('pastors_associations'),
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
                pastor_associations,
                pastor_associations_today,
                events_active,
                events_today,
                events_total,
                users,
                users_today
            }
        });"""

    if old_promise in content:
        content = content.replace(old_promise, new_promise)
        print("Updated Promise.all in admin-dashboard-stats to include pastor_associations")
    else:
        print("Warning: old_promise not matched directly")

    # 3. Update getUserMainData in backend/server.js
    old_get_user_main = """app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req, res) => {
    try {
        const b = req.body || {};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const phone = b.mobile_number || b.phonenumber || b.number || '';
        const cat = String(b.category || b.category_id || '').trim();
        let matchedLeader = null;
        const resolveLeader = (u, role) => {
            if (!u)
                return null;
            let genType = Number(u.generaltype) || 0;
            if (u.d_in == 1 && (!genType || genType === 1)) {
                genType = 1;
            }
            // An approved leader has d_in == 1 OR approval_ind == 1
            const isApproved = (u.d_in == 1) || (Number(u.approval_ind) === 1);
            if (isApproved && (genType === 1 || genType === 2 || genType === 3)) {
                return {
                    id: u.id,
                    leadertype: Number(u.leadertype) || 1,
                    generaltype: genType,
                    state_id: u.state_id || 1,
                    district_id: u.district_id,
                    constituency_id: u.constituency_id,
                    mandal_id: u.mandal_id,
                    village_id: u.village_id,
                    fname: u.name,
                    d_in: u.d_in,
                    approval_ind: u.approval_ind,
                    role: role
                };
            }
            return null;
        };
        // 1. Search in pastor_reg (Pastor)
        if (cat === '4' || !matchedLeader) {
            const [pRows] = await db.query('SELECT id, pastorname as name, phonenumber as mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM pastor_reg WHERE (id = ? OR phonenumber = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (pRows && pRows.length > 0) {
                matchedLeader = resolveLeader(pRows[0], 'pastor');
            }
        }
        // 2. Search in signup_form (Believer)
        if (!matchedLeader && (cat === '1' || !cat)) {
            const [bRows] = await db.query('SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, panchayat_id as village_id, state_id, d_in, approval_ind FROM signup_form WHERE (id = ? OR mobile_number = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (bRows && bRows.length > 0) {
                matchedLeader = resolveLeader(bRows[0], 'believer');
            }
        }
        // 3. Fallback to wingleader table
        if (!matchedLeader && usrId) {
            const [wRows] = await db.query('SELECT * FROM wingleader WHERE (user_id = ? OR pastor_id = ? OR believer_id = ?) AND d_in = 0', [usrId, usrId, usrId]);
            if (wRows && wRows.length > 0) {
                return res.json({ status: 200, data: wRows });
            }
        }
        if (matchedLeader) {
            return res.json({ status: 200, data: [matchedLeader] });
        }
        // Not approved as a leader
        res.json({ status: 200, data: [] });
    }
    catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

    new_get_user_main = """app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req, res) => {
    try {
        const b = req.body || {};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const phone = b.mobile_number || b.phonenumber || b.number || '';
        const cat = String(b.category || b.category_id || '').trim();
        let matchedLeader = null;

        const parseLeadershipLevel = (val) => {
            if (val === null || val === undefined || val === '') return null;
            const str = String(val).trim().toLowerCase();
            if (str === '0' || str.includes('state')) return 0;
            if (str === '1' || str.includes('dist')) return 1;
            if (str === '2' || str.includes('const')) return 2;
            if (str === '3' || str.includes('mandal') || str.includes('municip')) return 3;
            if (str === '4' || str.includes('panchayat') || str.includes('ward') || str.includes('village')) return 4;
            const num = Number(val);
            return isNaN(num) ? null : num;
        };

        const resolveLeader = (u, role) => {
            if (!u) return null;
            const isWingLeader = String(u.leadertype) === '2';
            let genType = null;
            if (isWingLeader) {
                // For wing leaders, wingtype holds leadership level (1=District, 2=Constituency, etc.)
                genType = parseLeadershipLevel(u.wingtype) ?? parseLeadershipLevel(u.generaltype) ?? 1;
            } else {
                genType = parseLeadershipLevel(u.generaltype);
            }

            if (u.d_in == 1 && (genType === null || genType === undefined)) {
                genType = 1; // Default to District incharge
            }

            // An approved leader has d_in == 1 OR approval_ind == 1
            const isApproved = (u.d_in == 1) || (Number(u.approval_ind) === 1);
            if (isApproved && (genType === 0 || genType === 1 || genType === 2 || genType === 3 || genType === 4)) {
                return {
                    id: u.id,
                    leadertype: Number(u.leadertype) || (role === 'student' ? 1 : 1),
                    generaltype: genType,
                    wingtype: u.wingtype,
                    wingtypes: u.wingtypes,
                    state_id: u.state_id || 1,
                    district_id: u.district_id,
                    constituency_id: u.constituency_id,
                    mandal_id: u.mandal_id,
                    village_id: u.village_id,
                    fname: u.name,
                    d_in: u.d_in,
                    approval_ind: u.approval_ind,
                    role: role
                };
            }
            return null;
        };

        // 1. Search in student_reg (Student)
        if (cat === '2' || !matchedLeader) {
            const [sRows] = await db.query('SELECT id, studentname as name, number as mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM student_reg WHERE (id = ? OR number = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (sRows && sRows.length > 0) {
                matchedLeader = resolveLeader(sRows[0], 'student');
            }
        }
        // 2. Search in pastor_reg (Pastor)
        if (!matchedLeader && (cat === '4' || !cat)) {
            const [pRows] = await db.query('SELECT id, pastorname as name, phonenumber as mobile_number, leadership, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM pastor_reg WHERE (id = ? OR phonenumber = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (pRows && pRows.length > 0) {
                matchedLeader = resolveLeader(pRows[0], 'pastor');
            }
        }
        // 3. Search in signup_form (Believer)
        if (!matchedLeader && (cat === '1' || !cat)) {
            const [bRows] = await db.query('SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, leadership, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, panchayat_id as village_id, state_id, d_in, approval_ind FROM signup_form WHERE (id = ? OR mobile_number = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (bRows && bRows.length > 0) {
                matchedLeader = resolveLeader(bRows[0], 'believer');
            }
        }
        // 4. Fallback to wingleader table
        if (!matchedLeader && usrId) {
            const [wRows] = await db.query('SELECT * FROM wingleader WHERE (user_id = ? OR pastor_id = ? OR believer_id = ?) AND d_in = 0', [usrId, usrId, usrId]);
            if (wRows && wRows.length > 0) {
                return res.json({ status: 200, data: wRows });
            }
        }
        if (matchedLeader) {
            return res.json({ status: 200, data: [matchedLeader] });
        }
        // Not approved as a leader
        res.json({ status: 200, data: [] });
    }
    catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

    if old_get_user_main in content:
        content = content.replace(old_get_user_main, new_get_user_main)
        print("Updated getUserMainData to support student leaders and wing leadership hierarchy")
    else:
        print("Warning: old_get_user_main not matched directly")

    # 4. Update getLeaderswebsiteData and getLeaderswebsitewing
    old_leaders_endpoint = """app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req, res) => {
    try {
        const b = req.body || req.query || {};
        const districtId = b.district_id || b.districtId || null;
        const constituencyId = b.constituency_id || b.constituencyId || null;
        const mandalId = b.mandal_id || b.mandalId || null;
        const genType = Number(b.generaltype || b.generalType || 1);
        const currentUserId = b.usr_id || b.user_id || -1;
        if (districtId || constituencyId || mandalId) {
            let bWhere = '';
            let pWhere = '';
            let queryParams = [];
            // Hierarchy Rules:
            // 1. District Leader (genType == 1):
            //    Visible subordinate: Constituency Leaders ONLY (generaltype == '2') within this district.
            // 2. Constituency Leader (genType == 2):
            //    Visible subordinate: Mandal Leaders ONLY (generaltype == '3') within this constituency.
            // 3. Mandal Leader (genType == 3):
            //    Visible subordinate: Panchayat & Ward Leaders (generaltype IN ('4', '5', '6') or ward/subward) within this mandal.
            // In all cases: Rejected leaders (approval_ind == 2) must disappear from the list (only approved == 1 and unapproved == 0/null visible).
            if (genType === 1 && districtId) {
                bWhere = 's.district_id = ? AND s.generaltype = "2"';
                pWhere = 'pr.district_id = ? AND pr.generaltype = "2"';
                queryParams = [districtId];
            }
            else if (genType === 2 && (constituencyId || districtId)) {
                if (constituencyId) {
                    bWhere = 's.constituency_id = ? AND s.generaltype = "3"';
                    pWhere = 'pr.constituency_id = ? AND pr.generaltype = "3"';
                    queryParams = [constituencyId];
                }
                else {
                    bWhere = 's.district_id = ? AND s.generaltype = "3"';
                    pWhere = 'pr.district_id = ? AND pr.generaltype = "3"';
                    queryParams = [districtId];
                }
            }
            else if (genType === 3 && (mandalId || constituencyId || districtId)) {
                if (mandalId) {
                    bWhere = 's.mandal_id = ? AND (s.generaltype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)';
                    pWhere = 'pr.mandal_id = ? AND (pr.generaltype IN ("4", "5", "6") OR pr.subward IS NOT NULL)';
                    queryParams = [mandalId];
                }
                else if (constituencyId) {
                    bWhere = 's.constituency_id = ? AND (s.generaltype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)';
                    pWhere = 'pr.constituency_id = ? AND (pr.generaltype IN ("4", "5", "6") OR pr.subward IS NOT NULL)';
                    queryParams = [constituencyId];
                }
                else {
                    bWhere = 's.district_id = ? AND (s.generaltype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)';
                    pWhere = 'pr.district_id = ? AND (pr.generaltype IN ("4", "5", "6") OR pr.subward IS NOT NULL)';
                    queryParams = [districtId];
                }
            }
            else if (districtId) {
                bWhere = 's.district_id = ?';
                pWhere = 'pr.district_id = ?';
                queryParams = [districtId];
            }
            // Exclude rejected leaders (approval_ind == 2) and exclude current logged in leader themselves
            const bFullWhere = `${bWhere} AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?`;
            const pFullWhere = `${pWhere} AND COALESCE(pr.approval_ind, 0) != 2 AND pr.id != ?`;
            const [believers] = await db.query(`
                SELECT s.id, s.fname, s.lname, s.mobile_number, s.generaltype, s.leadership, s.leadertype,
                       s.wingtype, s.wingtypes, s.wardnumber, s.subward,
                       s.approval_ind, s.district_id, s.constituency_id, s.mandal_id, s.panchayat_id,
                       s.address, s.nativeplace, s.villagename,
                       COALESCE(c.const_nm, '') as constituency_name,
                       COALESCE(m.mndl_nm, '') as mandal_name,
                       COALESCE(p.pnchyt_nm, '') as panchayat_name,
                       COALESCE(w.position, w.wing_name, '') as wing_name
                FROM signup_form s
                LEFT JOIN const_dtl_t c ON s.constituency_id = c.id
                LEFT JOIN mndls_lst_t m ON s.mandal_id = m.id
                LEFT JOIN pnchyt_lst_t p ON s.panchayat_id = p.id
                LEFT JOIN wings w ON s.wingtype = w.id
                WHERE ${bFullWhere}
                ORDER BY s.id DESC
            `, [...queryParams, currentUserId]);
            const [pastors] = await db.query(`
                SELECT pr.id, pr.pastorname, pr.phonenumber, pr.generaltype, pr.leadership, pr.leadertype,
                       pr.wingtype, pr.wingtypes, pr.subward,
                       pr.approval_ind, pr.district_id, pr.constituency_id, pr.mandal_id, pr.village_id,
                       pr.address, pr.nativeplace, pr.villagename,
                       COALESCE(c.const_nm, '') as constituency_name,
                       COALESCE(m.mndl_nm, '') as mandal_name,
                       COALESCE(p.pnchyt_nm, '') as panchayat_name,
                       COALESCE(w.position, w.wing_name, '') as wing_name
                FROM pastor_reg pr
                LEFT JOIN const_dtl_t c ON pr.constituency_id = c.id
                LEFT JOIN mndls_lst_t m ON pr.mandal_id = m.id
                LEFT JOIN pnchyt_lst_t p ON pr.village_id = p.id
                LEFT JOIN wings w ON pr.wingtype = w.id
                WHERE ${pFullWhere}
                ORDER BY pr.id DESC
            `, [...queryParams, currentUserId]);
            // Fetch constituencies for this district
            const [constituencies] = await db.query('SELECT id, const_nm FROM const_dtl_t WHERE dstrct_id = ? AND d_in = 0', [districtId || 0]);
            return res.json({ status: 200, data: [believers, constituencies, pastors] });
        }
        // Fallback to wingleaderstype
        const [rows] = await db.query('SELECT * FROM wingleaderstype WHERE d_in = 0 ORDER BY id ASC');
        res.json({ status: 200, data: rows });
    }
    catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

    new_leaders_endpoint = """app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req, res) => {
    try {
        const b = req.body || req.query || {};
        const stateId = b.state_id || b.stateId || 1;
        const districtId = b.district_id || b.districtId || null;
        const constituencyId = b.constituency_id || b.constituencyId || null;
        const mandalId = b.mandal_id || b.mandalId || null;
        const genType = Number(b.generaltype !== undefined ? b.generaltype : (b.generalType !== undefined ? b.generalType : 1));
        const currentUserId = b.usr_id || b.user_id || -1;
        const isWingRequest = req.path.includes('wing') || String(b.leadertype) === '2' || b.wingtype;

        let bWhere = '';
        let pWhere = '';
        let sWhere = '';
        let queryParams = [];

        // HIERARCHY RULES:
        // 0. State Leader (genType == 0):
        //    Visible subordinates: District Leaders ONLY (level 1 or 'District Level') across this state
        // 1. District Leader (genType == 1):
        //    Visible subordinates: Constituency Leaders ONLY (level 2 or 'Constituency Level') within this district
        // 2. Constituency Leader (genType == 2):
        //    Visible subordinates: Mandal Leaders ONLY (level 3 or 'Municipality / Mandal Level') within this constituency
        // 3. Mandal Leader (genType == 3):
        //    Visible subordinates: Panchayat & Ward Leaders (level 4, 5, 6 or 'Ward / Panchayati Level') within this mandal
        // In all cases:
        // - Rejected subordinates (approval_ind == 2) disappear immediately.
        // - Subordinates can be from any wing category or general category.

        if (genType === 0) {
            // State Leader -> Sees District Leaders (Level 1)
            bWhere = '(s.state_id = ? OR s.state_id IS NULL) AND (s.generaltype = "1" OR s.generaltype = "District Level" OR s.wingtype = "1" OR s.wingtype = "District Level")';
            pWhere = '(pr.state_id = ? OR pr.state_id IS NULL) AND (pr.generaltype = "1" OR pr.generaltype = "District Level" OR pr.wingtype = "1" OR pr.wingtype = "District Level")';
            sWhere = '(st.state_id = ? OR st.state_id IS NULL) AND (st.generaltype = "1" OR st.generaltype = "District Level" OR st.generaltype = 1)';
            queryParams = [stateId];
        } else if (genType === 1 && districtId) {
            // District Leader -> Sees Constituency Leaders (Level 2)
            bWhere = 's.district_id = ? AND (s.generaltype = "2" OR s.generaltype = "Constituency Level" OR s.wingtype = "2" OR s.wingtype = "Constituency Level")';
            pWhere = 'pr.district_id = ? AND (pr.generaltype = "2" OR pr.generaltype = "Constituency Level" OR pr.wingtype = "2" OR pr.wingtype = "Constituency Level")';
            sWhere = 'st.district_id = ? AND (st.generaltype = "2" OR st.generaltype = "Constituency Level" OR st.generaltype = 2)';
            queryParams = [districtId];
        } else if (genType === 2 && (constituencyId || districtId)) {
            // Constituency Leader -> Sees Mandal Leaders (Level 3)
            const targetId = constituencyId || districtId;
            const targetCol = constituencyId ? 'constituency_id' : 'district_id';
            bWhere = `s.${targetCol} = ? AND (s.generaltype = "3" OR s.generaltype = "Municipality / Mandal Level" OR s.wingtype = "3" OR s.wingtype = "Municipality / Mandal Level")`;
            pWhere = `pr.${targetCol} = ? AND (pr.generaltype = "3" OR pr.generaltype = "Municipality / Mandal Level" OR pr.wingtype = "3" OR pr.wingtype = "Municipality / Mandal Level")`;
            sWhere = `st.${targetCol} = ? AND (st.generaltype = "3" OR st.generaltype = "Municipality / Mandal Level" OR st.generaltype = 3)`;
            queryParams = [targetId];
        } else if (genType === 3 && (mandalId || constituencyId || districtId)) {
            // Mandal Leader -> Sees Panchayat/Ward Leaders (Level 4, 5, 6)
            const targetId = mandalId || constituencyId || districtId;
            const targetCol = mandalId ? 'mandal_id' : (constituencyId ? 'constituency_id' : 'district_id');
            bWhere = `s.${targetCol} = ? AND (s.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR s.wingtype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)`;
            pWhere = `pr.${targetCol} = ? AND (pr.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR pr.wingtype IN ("4", "5", "6") OR pr.subward IS NOT NULL)`;
            sWhere = `st.${targetCol} = ? AND (st.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR st.generaltype = 4)`;
            queryParams = [targetId];
        } else if (districtId) {
            bWhere = 's.district_id = ?';
            pWhere = 'pr.district_id = ?';
            sWhere = 'st.district_id = ?';
            queryParams = [districtId];
        } else {
            bWhere = '1=1';
            pWhere = '1=1';
            sWhere = '1=1';
            queryParams = [];
        }

        // Exclude rejected leaders (approval_ind == 2) and exclude current logged in leader themselves
        const bFullWhere = `${bWhere} AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?`;
        const pFullWhere = `${pWhere} AND COALESCE(pr.approval_ind, 0) != 2 AND pr.id != ?`;
        const sFullWhere = `${sWhere} AND COALESCE(st.approval_ind, 0) != 2 AND st.id != ?`;

        const [believers] = await db.query(`
            SELECT s.id, s.fname, s.lname, s.mobile_number, s.generaltype, s.leadership, s.leadertype,
                   s.wingtype, s.wingtypes, s.wardnumber, s.subward,
                   s.approval_ind, s.district_id, s.constituency_id, s.mandal_id, s.panchayat_id,
                   s.address, s.nativeplace, s.villagename,
                   COALESCE(c.const_nm, '') as constituency_name,
                   COALESCE(m.mndl_nm, '') as mandal_name,
                   COALESCE(p.pnchyt_nm, '') as panchayat_name,
                   COALESCE(w.position, w.wing_name, '') as wing_name
            FROM signup_form s
            LEFT JOIN const_dtl_t c ON s.constituency_id = c.id
            LEFT JOIN mndls_lst_t m ON s.mandal_id = m.id
            LEFT JOIN pnchyt_lst_t p ON s.panchayat_id = p.id
            LEFT JOIN wings w ON s.wingtype = w.id
            WHERE ${bFullWhere}
            ORDER BY s.id DESC
        `, [...queryParams, currentUserId]);

        const [pastors] = await db.query(`
            SELECT pr.id, pr.pastorname, pr.phonenumber, pr.generaltype, pr.leadership, pr.leadertype,
                   pr.wingtype, pr.wingtypes, pr.subward,
                   pr.approval_ind, pr.district_id, pr.constituency_id, pr.mandal_id, pr.village_id,
                   pr.address, pr.nativeplace, pr.villagename,
                   COALESCE(c.const_nm, '') as constituency_name,
                   COALESCE(m.mndl_nm, '') as mandal_name,
                   COALESCE(p.pnchyt_nm, '') as panchayat_name,
                   COALESCE(w.position, w.wing_name, '') as wing_name
            FROM pastor_reg pr
            LEFT JOIN const_dtl_t c ON pr.constituency_id = c.id
            LEFT JOIN mndls_lst_t m ON pr.mandal_id = m.id
            LEFT JOIN pnchyt_lst_t p ON pr.village_id = p.id
            LEFT JOIN wings w ON pr.wingtype = w.id
            WHERE ${pFullWhere}
            ORDER BY pr.id DESC
        `, [...queryParams, currentUserId]);

        const [students] = await db.query(`
            SELECT st.id, st.studentname as fname, '' as lname, st.number as mobile_number, st.generaltype, st.leadership, st.leadertype,
                   st.wingtype, st.wingtype as wingtypes,
                   st.approval_ind, st.district_id, st.constituency_id, st.mandal_id, st.village_id as panchayat_id,
                   st.address, st.nativeplace,
                   COALESCE(c.const_nm, '') as constituency_name,
                   COALESCE(m.mndl_nm, '') as mandal_name,
                   COALESCE(p.pnchyt_nm, '') as panchayat_name,
                   'Student Wing' as wing_name
            FROM student_reg st
            LEFT JOIN const_dtl_t c ON st.constituency_id = c.id
            LEFT JOIN mndls_lst_t m ON st.mandal_id = m.id
            LEFT JOIN pnchyt_lst_t p ON st.village_id = p.id
            WHERE ${sFullWhere}
            ORDER BY st.id DESC
        `, [...queryParams, currentUserId]);

        // Fetch constituencies for this district if applicable
        const [constituencies] = await db.query('SELECT id, const_nm FROM const_dtl_t WHERE dstrct_id = ? AND d_in = 0', [districtId || 0]);

        if (isWingRequest) {
            return res.json({ status: 200, data: [believers, students, pastors] });
        } else {
            return res.json({ status: 200, data: [believers, constituencies, pastors, students] });
        }
    }
    catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});"""

    if old_leaders_endpoint in content:
        content = content.replace(old_leaders_endpoint, new_leaders_endpoint)
        print("Updated getLeaderswebsiteData and getLeaderswebsitewing with full state/district/constituency/mandal hierarchy and students")
    else:
        print("Warning: old_leaders_endpoint not matched directly")

    # 5. Update deleteboardmember and updateconsis for tableId === 2 (student_reg)
    old_reject = """        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]);
            }
            else if (tableId === 2 || tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]);
            }
            else {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
            }
        }"""

    new_reject = """        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]);
            }
            else if (tableId === 2) {
                await db.query('UPDATE student_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
            }
            else if (tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]);
            }
            else {
                await db.query('UPDATE signup_form SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE student_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 2 WHERE id = ?', [id]).catch(() => { });
            }
        }"""

    if old_reject in content:
        content = content.replace(old_reject, new_reject)
        print("Updated deleteboardmember for tableId === 2 (student_reg)")

    old_approve = """        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]);
            }
            else if (tableId === 2 || tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]);
            }
            else {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
            }
        }"""

    new_approve = """        if (id) {
            if (tableId === 1) {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]);
            }
            else if (tableId === 2) {
                await db.query('UPDATE student_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
            }
            else if (tableId === 3) {
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]);
            }
            else {
                await db.query('UPDATE signup_form SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE student_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
                await db.query('UPDATE pastor_reg SET approval_ind = 1 WHERE id = ?', [id]).catch(() => { });
            }
        }"""

    if old_approve in content:
        content = content.replace(old_approve, new_approve)
        print("Updated updateconsis for tableId === 2 (student_reg)")

    with open('backend/server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully wrote backend/server.js")

if __name__ == '__main__':
    update_server_js()

