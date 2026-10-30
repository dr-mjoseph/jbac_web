import re

def update_backend(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Update parseLeadershipLevel
    old_parse = """function parseLeadershipLevel(val) {
    if (val === null || val === undefined || val === '') return null;
    const str = String(val).trim().toLowerCase();
    if (str === '0' || str.includes('state')) return 0;
    if (str === '1' || str.includes('dist')) return 1;
    if (str === '2' || str.includes('const')) return 2;
    if (str === '3' || str.includes('mandal') || str.includes('municip')) return 3;
    if (str === '4' || str.includes('panchayat') || str.includes('ward') || str.includes('village')) return 4;
    const num = Number(val);
    return isNaN(num) ? null : num;
}"""

    new_parse = """function parseLeadershipLevel(val) {
    if (val === null || val === undefined || val === '') return null;
    const str = String(val).trim().toLowerCase();
    if (str === '0' || str.includes('state') || str.includes('రాష్ట్ర')) return 0;
    if (str === '1' || str.includes('dist') || str.includes('జిల్లా')) return 1;
    if (str === '2' || str.includes('const') || str.includes('నియోజకవర్గ')) return 2;
    if (str === '3' || str.includes('mandal') || str.includes('municip') || str.includes('మండల')) return 3;
    if (str === '4' || str === '5' || str === '6' || str.includes('panchayat') || str.includes('ward') || str.includes('village') || str.includes('పంచాయతి') || str.includes('వార్డు') || str.includes('గ్రామ')) return 4;
    return null;
}"""

    if old_parse in code:
        code = code.replace(old_parse, new_parse)
        print(f"Updated parseLeadershipLevel in {file_path}")
    elif "function parseLeadershipLevel(val) {" not in code:
        target = "app.all(['/dashboardapi/getLeaderswebsiteData'"
        idx = code.find(target)
        if idx != -1:
            code = code[:idx] + new_parse + "\n\n" + code[idx:]
            print(f"Inserted parseLeadershipLevel in {file_path}")

    # 2. Update getLeaderswebsiteData
    start_tag = "app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req"
    end_tag = "app.all(['/dashboardapi/postwishform', '/api/postwishform'], async (req"

    start_idx = code.find(start_tag)
    end_idx = code.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        is_ts = file_path.endswith('.ts')
        req_sig = "(req: any, res: any)" if is_ts else "(req, res)"
        any_type = ": any" if is_ts else ""
        array_any = ": any[]" if is_ts else ""

        new_handler = f"""app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async {req_sig} => {{
    try {{
        const b = req.body || req.query || {{}};
        const stateId = b.state_id || b.stateId || 1;
        let districtId = b.district_id || b.districtId || null;
        let constituencyId = b.constituency_id || b.constituencyId || null;
        let mandalId = b.mandal_id || b.mandalId || null;
        let genType = Number(b.generaltype !== undefined ? b.generaltype : (b.generalType !== undefined ? b.generalType : 1));
        const currentUserId = b.usr_id || b.user_id || -1;
        let isWingRequest = req.path.includes('wing') || String(b.leadertype) === '2' || Boolean(b.wingtype) || Boolean(b.wingtypes);

        let leaderWing = null;

        // 1. If currentUserId is available, inspect the authenticated leader in DB to resolve their exact wing category & level
        if (currentUserId && currentUserId !== -1) {{
            const [p]{any_type} = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM pastor_reg WHERE id = ?', [currentUserId]);
            if (p && p[0]) {{
                const pWing = resolveWingCategory(p[0].wingtypes) || resolveWingCategory(p[0].wingtype);
                if (String(p[0].leadertype) === '2' || pWing) {{
                    isWingRequest = true;
                    leaderWing = pWing;
                    const parsedLvl = parseLeadershipLevel(p[0].wingtype) ?? parseLeadershipLevel(p[0].generaltype);
                    if (parsedLvl !== null) genType = parsedLvl;
                }}
                if (p[0].d_in == 1 && (!genType || genType > 3)) genType = 1;
                if (p[0].district_id && !districtId) districtId = p[0].district_id;
                if (p[0].constituency_id && !constituencyId) constituencyId = p[0].constituency_id;
                if (p[0].mandal_id && !mandalId) mandalId = p[0].mandal_id;
            }} else {{
                const [s]{any_type} = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM signup_form WHERE id = ?', [currentUserId]);
                if (s && s[0]) {{
                    const sWing = resolveWingCategory(s[0].wingtypes) || resolveWingCategory(s[0].wingtype);
                    if (String(s[0].leadertype) === '2' || sWing) {{
                        isWingRequest = true;
                        leaderWing = sWing;
                        const parsedLvl = parseLeadershipLevel(s[0].generaltype);
                        if (parsedLvl !== null) genType = parsedLvl;
                    }}
                    if (s[0].d_in == 1 && (!genType || genType > 3)) genType = 1;
                    if (s[0].district_id && !districtId) districtId = s[0].district_id;
                    if (s[0].constituency_id && !constituencyId) constituencyId = s[0].constituency_id;
                    if (s[0].mandal_id && !mandalId) mandalId = s[0].mandal_id;
                }} else {{
                    const [st]{any_type} = await db.query('SELECT id, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM student_reg WHERE id = ?', [currentUserId]);
                    if (st && st[0]) {{
                        isWingRequest = true;
                        leaderWing = resolveWingCategory(1); // Student Wing
                        const parsedLvl = parseLeadershipLevel(st[0].generaltype) ?? parseLeadershipLevel(st[0].wingtype);
                        if (parsedLvl !== null) genType = parsedLvl;
                        if (st[0].d_in == 1 && (!genType || genType > 3)) genType = 1;
                        if (st[0].district_id && !districtId) districtId = st[0].district_id;
                        if (st[0].constituency_id && !constituencyId) constituencyId = st[0].constituency_id;
                        if (st[0].mandal_id && !mandalId) mandalId = st[0].mandal_id;
                    }}
                }}
            }}
        }}

        // If not resolved from DB, check request body
        if (!leaderWing && (b.wingtypes || b.wingtype)) {{
            leaderWing = resolveWingCategory(b.wingtypes) || resolveWingCategory(b.wingtype);
            if (leaderWing) isWingRequest = true;
        }}

        let bWhere = '';
        let pWhere = '';
        let sWhere = '';
        let queryParams{array_any} = [];

        // HIERARCHICAL LEVEL FILTERING (STRICTLY ONE LEVEL DOWN):
        if (genType === 0) {{
            // State Leader -> Sees District Leaders (Level 1)
            bWhere = '(s.state_id = ? OR s.state_id IS NULL) AND (s.generaltype = "1" OR s.generaltype = "District Level" OR s.generaltype LIKE "%జిల్లా%" OR s.wingtype = "1" OR s.wingtype = "District Level" OR s.wingtype LIKE "%జిల్లా%" OR (s.district_id IS NOT NULL AND s.district_id != "" AND s.district_id != "0"))';
            pWhere = '(pr.state_id = ? OR pr.state_id IS NULL) AND (pr.generaltype = "1" OR pr.generaltype = "District Level" OR pr.generaltype LIKE "%జిల్లా%" OR pr.wingtype = "1" OR pr.wingtype = "District Level" OR pr.wingtype LIKE "%జిల్లా%" OR (pr.district_id IS NOT NULL AND pr.district_id != "" AND pr.district_id != "0"))';
            sWhere = '(st.state_id = ? OR st.state_id IS NULL) AND (st.generaltype = "1" OR st.generaltype = "District Level" OR st.generaltype LIKE "%జిల్లా%" OR st.generaltype = 1 OR st.wingtype = "1" OR st.wingtype = 1 OR (st.district_id IS NOT NULL AND st.district_id != "" AND st.district_id != "0"))';
            queryParams = [stateId];
        }} else if (genType === 1 && districtId) {{
            // District Leader -> Sees Constituency Leaders/Users ONLY (Level 2) within this district
            bWhere = 's.district_id = ? AND (s.generaltype IN ("2", "Constituency Level") OR s.generaltype LIKE "%నియోజకవర్గ%" OR s.wingtype IN ("2", "Constituency Level") OR s.wingtype LIKE "%నియోజకవర్గ%" OR (s.constituency_id IS NOT NULL AND s.constituency_id != "" AND s.constituency_id != "0"))';
            pWhere = 'pr.district_id = ? AND (pr.generaltype IN ("2", "Constituency Level") OR pr.generaltype LIKE "%నియోజకవర్గ%" OR pr.wingtype IN ("2", "Constituency Level") OR pr.wingtype LIKE "%నియోజకవర్గ%" OR (pr.constituency_id IS NOT NULL AND pr.constituency_id != "" AND pr.constituency_id != "0"))';
            sWhere = 'st.district_id = ? AND (st.generaltype IN ("2", "Constituency Level", 2) OR st.wingtype IN ("2", "Constituency Level", 2) OR (st.constituency_id IS NOT NULL AND st.constituency_id != "" AND st.constituency_id != "0"))';
            queryParams = [districtId];
        }} else if (genType === 2 && (constituencyId || districtId)) {{
            // Constituency Leader -> Sees Mandal Leaders/Users ONLY (Level 3) within this constituency
            const targetId = constituencyId || districtId;
            const targetCol = constituencyId ? 'constituency_id' : 'district_id';
            bWhere = `s.${{targetCol}} = ? AND (s.generaltype IN ("3", "Municipality / Mandal Level") OR s.generaltype LIKE "%మండల%" OR s.wingtype IN ("3", "Municipality / Mandal Level") OR s.wingtype LIKE "%మండల%" OR (s.mandal_id IS NOT NULL AND s.mandal_id != "" AND s.mandal_id != "0"))`;
            pWhere = `pr.${{targetCol}} = ? AND (pr.generaltype IN ("3", "Municipality / Mandal Level") OR pr.generaltype LIKE "%మండల%" OR pr.wingtype IN ("3", "Municipality / Mandal Level") OR pr.wingtype LIKE "%మండల%" OR (pr.mandal_id IS NOT NULL AND pr.mandal_id != "" AND pr.mandal_id != "0"))`;
            sWhere = `st.${{targetCol}} = ? AND (st.generaltype IN ("3", "Municipality / Mandal Level", 3) OR st.wingtype IN ("3", "Municipality / Mandal Level", 3) OR (st.mandal_id IS NOT NULL AND st.mandal_id != "" AND st.mandal_id != "0"))`;
            queryParams = [targetId];
        }} else if (genType === 3 && (mandalId || constituencyId || districtId)) {{
            // Mandal Leader -> Sees Panchayat/Ward Leaders/Users ONLY (Level 4, 5, 6) within this mandal
            const targetId = mandalId || constituencyId || districtId;
            const targetCol = mandalId ? 'mandal_id' : (constituencyId ? 'constituency_id' : 'district_id');
            bWhere = `s.${{targetCol}} = ? AND (s.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR s.generaltype LIKE "%పంచాయతి%" OR s.generaltype LIKE "%వార్డు%" OR s.generaltype LIKE "%గ్రామ%" OR s.wingtype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL OR (s.panchayat_id IS NOT NULL AND s.panchayat_id != "" AND s.panchayat_id != "0"))`;
            pWhere = `pr.${{targetCol}} = ? AND (pr.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR pr.generaltype LIKE "%పంచాయతి%" OR pr.generaltype LIKE "%వార్డు%" OR pr.generaltype LIKE "%గ్రామ%" OR pr.wingtype IN ("4", "5", "6") OR pr.subward IS NOT NULL OR (pr.village_id IS NOT NULL AND pr.village_id != "" AND pr.village_id != "0"))`;
            sWhere = `st.${{targetCol}} = ? AND (st.generaltype IN ("4", "5", "6", "Ward / Panchayati Level", 4) OR st.wingtype IN ("4", "5", "6", 4) OR (st.village_id IS NOT NULL AND st.village_id != "" AND st.village_id != "0"))`;
            queryParams = [targetId];
        }} else if (districtId) {{
            bWhere = 's.district_id = ?';
            pWhere = 'pr.district_id = ?';
            sWhere = 'st.district_id = ?';
            queryParams = [districtId];
        }} else {{
            bWhere = '1=1';
            pWhere = '1=1';
            sWhere = '1=1';
            queryParams = [];
        }}

        // STRICT WING CATEGORY ISOLATION:
        // When leader is elected/approved for a particular wing category (e.g. Student Wing, Advocate Wing, etc.):
        // ONLY subordinates of that EXACT SAME wing category can be displayed!
        // If subordinate is from the same location but wing is different, they are excluded.
        if (leaderWing) {{
            const bWingSql = getWingMatchSql('s.', leaderWing);
            const pWingSql = getWingMatchSql('pr.', leaderWing);
            bWhere += ` AND ${{bWingSql}}`;
            pWhere += ` AND ${{pWingSql}}`;

            // student_reg is inherently Student Wing (id === 1)
            if (leaderWing.id === 1) {{
                // Students match
            }} else {{
                // If leader is Advocate Wing, Medical Wing, etc., student_reg records must NOT display
                sWhere = '1=0';
            }}
        }}

        // Exclude rejected leaders (approval_ind == 2) and exclude current logged in leader themselves
        const bFullWhere = `${{bWhere}} AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?`;
        const pFullWhere = `${{pWhere}} AND COALESCE(pr.approval_ind, 0) != 2 AND pr.id != ?`;
        const sFullWhere = `${{sWhere}} AND COALESCE(st.approval_ind, 0) != 2 AND st.id != ?`;

        const [believers]{any_type} = await db.query(`
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
            LEFT JOIN wings w ON s.wingtype = w.id OR s.wingtypes = w.id
            WHERE ${{bFullWhere}}
            ORDER BY s.id DESC
        `, [...queryParams, currentUserId]);

        const [pastors]{any_type} = await db.query(`
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
            LEFT JOIN wings w ON pr.wingtype = w.id OR pr.wingtypes = w.id
            WHERE ${{pFullWhere}}
            ORDER BY pr.id DESC
        `, [...queryParams, currentUserId]);

        let students{any_type} = [];
        if (!leaderWing || leaderWing.id === 1) {{
            const [stRows]{any_type} = await db.query(`
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
                WHERE ${{sFullWhere}}
                ORDER BY st.id DESC
            `, [...queryParams, currentUserId]);
            students = stRows || [];
        }}

        // Fetch constituencies for this district if applicable
        const [constituencies]{any_type} = await db.query('SELECT id, const_nm FROM const_dtl_t WHERE dstrct_id = ? AND d_in = 0', [districtId || 0]);

        if (isWingRequest) {{
            return res.json({{ status: 200, data: [believers, students, pastors] }});
        }} else {{
            return res.json({{ status: 200, data: [believers, constituencies, pastors, students] }});
        }}
    }} catch (err{any_type}) {{
        res.status(500).json({{ status: 500, error: err.message }});
    }}
}});
"""
        code = code[:start_idx] + new_handler + "\n" + code[end_idx:]
        print(f"Replaced getLeaderswebsiteData in {file_path}")

    # 3. Update getUserMainData
    start_user_tag = "app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async (req"
    end_user_tag = "app.all(['/dashboardapi/postinfo', '/api/postinfo'], async (req"

    start_u_idx = code.find(start_user_tag)
    end_u_idx = code.find(end_user_tag)

    if start_u_idx != -1 and end_u_idx != -1:
        is_ts = file_path.endswith('.ts')
        req_sig = "(req: any, res: any)" if is_ts else "(req, res)"
        any_type = ": any" if is_ts else ""
        str_type = ": string" if is_ts else ""

        new_user_handler = f"""app.all(['/dashboardapi/getUserMainData', '/dashboardapi/getUserMainData/:id', '/api/getUserMainData', '/api/getUserMainData/:id'], async {req_sig} => {{
    try {{
        const b = req.body || {{}};
        const usrId = b.usr_id || b.user_id || req.params.id || '';
        const phone = b.mobile_number || b.phonenumber || b.number || '';
        const cat = String(b.category || b.category_id || '').trim();
        let matchedLeader{any_type} = null;

        const resolveLeader = (u{any_type}, role{str_type}) => {{
            if (!u) return null;
            const isWingLeader = String(u.leadertype) === '2' || Boolean(u.wingtypes && u.wingtypes !== 'null') || (role === 'pastor' && Boolean(u.wingtype && u.wingtype !== 'null'));
            let genType = null;
            if (role === 'pastor') {{
                genType = parseLeadershipLevel(u.wingtype) ?? parseLeadershipLevel(u.generaltype);
            }} else if (role === 'student') {{
                genType = parseLeadershipLevel(u.generaltype) ?? parseLeadershipLevel(u.wingtype);
            }} else {{
                genType = parseLeadershipLevel(u.generaltype);
            }}

            if (u.d_in == 1 && (genType === null || genType === undefined || genType > 3)) {{
                genType = 1; // Default to District incharge
            }}

            // An approved leader has d_in == 1 OR approval_ind == 1
            const isApproved = (u.d_in == 1) || (Number(u.approval_ind) === 1);
            if (isApproved && (genType === 0 || genType === 1 || genType === 2 || genType === 3 || genType === 4)) {{
                const resolvedWing = resolveWingCategory(u.wingtypes) || resolveWingCategory(u.wingtype) || (role === 'student' ? resolveWingCategory(1) : null);
                return {{
                    id: u.id,
                    leadertype: (isWingLeader || resolvedWing) ? 2 : (Number(u.leadertype) || 1),
                    generaltype: genType,
                    wingtype: u.wingtype,
                    wingtypes: u.wingtypes,
                    wing_name: resolvedWing ? resolvedWing.telugu : '',
                    wing_english: resolvedWing ? resolvedWing.english : '',
                    state_id: u.state_id || 1,
                    district_id: u.district_id,
                    constituency_id: u.constituency_id,
                    mandal_id: u.mandal_id,
                    village_id: u.village_id,
                    fname: u.name,
                    d_in: u.d_in,
                    approval_ind: u.approval_ind,
                    role: role
                }};
            }}
            return null;
        }};

        // 1. Search in student_reg (Student)
        if (cat === '2' || !matchedLeader) {{
            const [sRows]{any_type} = await db.query('SELECT id, studentname as name, number as mobile_number, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM student_reg WHERE (id = ? OR number = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (sRows && sRows.length > 0) {{
                matchedLeader = resolveLeader(sRows[0], 'student');
            }}
        }}
        // 2. Search in pastor_reg (Pastor)
        if (!matchedLeader && (cat === '4' || !cat)) {{
            const [pRows]{any_type} = await db.query('SELECT id, pastorname as name, phonenumber as mobile_number, leadership, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM pastor_reg WHERE (id = ? OR phonenumber = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (pRows && pRows.length > 0) {{
                matchedLeader = resolveLeader(pRows[0], 'pastor');
            }}
        }}
        // 3. Search in signup_form (Believer)
        if (!matchedLeader && (cat === '1' || !cat)) {{
            const [bRows]{any_type} = await db.query('SELECT id, CONCAT(fname, " ", COALESCE(lname, "")) as name, mobile_number, leadership, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, panchayat_id as village_id, state_id, d_in, approval_ind FROM signup_form WHERE (id = ? OR mobile_number = ?) LIMIT 1', [usrId || -1, phone || '']);
            if (bRows && bRows.length > 0) {{
                matchedLeader = resolveLeader(bRows[0], 'believer');
            }}
        }}
        // 4. Fallback to wingleader table
        if (!matchedLeader && usrId) {{
            const [wRows]{any_type} = await db.query('SELECT * FROM wingleader WHERE (user_id = ? OR pastor_id = ? OR believer_id = ?) AND d_in = 0', [usrId, usrId, usrId]);
            if (wRows && wRows.length > 0) {{
                return res.json({{ status: 200, data: wRows }});
            }}
        }}
        if (matchedLeader) {{
            return res.json({{ status: 200, data: [matchedLeader] }});
        }}
        // Not approved as a leader
        res.json({{ status: 200, data: [] }});
    }} catch (err{any_type}) {{
        res.status(500).json({{ status: 500, error: err.message }});
    }}
}});
"""
        code = code[:start_u_idx] + new_user_handler + "\n" + code[end_u_idx:]
        print(f"Replaced getUserMainData in {file_path}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)

update_backend('backend/server.js')
update_backend('backend/server.ts')

