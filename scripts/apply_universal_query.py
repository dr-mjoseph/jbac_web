import re

def update_server_files(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Universal Level Helper Functions
    universal_helpers = """
// -------------------------------------------------------------------------
// CANONICAL 6-TIER LEADERSHIP HIERARCHY & UNIVERSAL QUERY HELPERS
// Doc Level 1: రాష్ట్ర నాయకుడు (State Leader)
// Doc Level 2: జిల్లా నాయకుడు (District Leader)
// Doc Level 3: నియోజకవర్గం నాయకుడు (Constituency Leader)
// Doc Level 4: మండల నాయకుడు (Mandal Leader)
// Doc Level 5: పంచాయతి నాయకుడు (Panchayat Leader)
// Doc Level 6: వార్డు నాయకుడు (Ward Leader)
// -------------------------------------------------------------------------
function getCanonicalLevel(val) {
    if (val === null || val === undefined || val === '') return null;
    const str = String(val).trim().toLowerCase();
    if (str === '0' || str.includes('state') || str.includes('రాష్ట్ర')) return 1;
    if (str.includes('dist') || str.includes('జిల్లా')) return 2;
    if (str.includes('const') || str.includes('నియోజకవర్గ')) return 3;
    if (str.includes('mandal') || str.includes('municip') || str.includes('మండల')) return 4;
    if (str.includes('panchayat') || str.includes('village') || str.includes('పంచాయతి') || str.includes('గ్రామ')) return 5;
    if (str.includes('ward') || str.includes('వార్డు')) return 6;
    const num = Number(val);
    if (!isNaN(num)) {
        if (num === 0) return 1;
        if (num === 1) return 2;
        if (num === 2) return 3;
        if (num === 3) return 4;
        if (num === 4) return 5;
        if (num === 5 || num === 6) return 6;
    }
    return null;
}

function parseLeadershipLevel(val) {
    const canonical = getCanonicalLevel(val);
    if (canonical === null) return null;
    // Map canonical (1-6) to internal 0-indexed representation for client compatibility:
    // State: 0, District: 1, Constituency: 2, Mandal: 3, Panchayat: 4, Ward: 5
    return canonical === 1 ? 0 : canonical - 1;
}

function getLevelSql(prefix, targetLvl) {
    if (targetLvl === 2) {
        // District Leader
        return `((${prefix}generaltype IN ('1', 'District Level') OR ${prefix}generaltype LIKE '%జిల్లా%') OR (${prefix}leadertype = 2 AND (${prefix}wingtype IN ('1', 'District Level') OR ${prefix}wingtype LIKE '%జిల్లా%')))`;
    }
    if (targetLvl === 3) {
        // Constituency Leader
        return `((${prefix}generaltype IN ('2', 'Constituency Level') OR ${prefix}generaltype LIKE '%నియోజకవర్గ%') OR (${prefix}leadertype = 2 AND (${prefix}wingtype IN ('2', 'Constituency Level') OR ${prefix}wingtype LIKE '%నియోజకవర్గ%')))`;
    }
    if (targetLvl === 4) {
        // Mandal Leader
        return `((${prefix}generaltype IN ('3', 'Municipality / Mandal Level', 'Mandal') OR ${prefix}generaltype LIKE '%మండల%') OR (${prefix}leadertype = 2 AND (${prefix}wingtype IN ('3', 'Municipality / Mandal Level', 'Mandal') OR ${prefix}wingtype LIKE '%మండల%')))`;
    }
    if (targetLvl === 5) {
        // Panchayat Leader
        return `((${prefix}generaltype IN ('4', 'Ward / Panchayati Level', 'Village') OR ${prefix}generaltype LIKE '%పంచాయతి%' OR ${prefix}generaltype LIKE '%గ్రామ%') OR (${prefix}leadertype = 2 AND (${prefix}wingtype IN ('4', 'Ward / Panchayati Level') OR ${prefix}wingtype LIKE '%పంచాయతి%')))`;
    }
    if (targetLvl === 6) {
        // Ward Leader
        return `((${prefix}generaltype IN ('5', '6', 'Ward', 'Sub Ward') OR ${prefix}generaltype LIKE '%వార్డు%') OR (${prefix}leadertype = 2 AND (${prefix}wingtype IN ('5', '6') OR ${prefix}wingtype LIKE '%వార్డు%')) OR ${prefix}subward IS NOT NULL ${prefix.startsWith('s.') ? `OR ${prefix}wardnumber IS NOT NULL` : ''})`;
    }
    return '1=0';
}

function getStudentLevelSql(prefix, targetLvl) {
    if (targetLvl === 2) return `(${prefix}generaltype IN ('District Level', '1') OR ${prefix}generaltype LIKE '%జిల్లా%')`;
    if (targetLvl === 3) return `(${prefix}generaltype IN ('Constituency Level', 'Constituency level', '2') OR ${prefix}generaltype LIKE '%నియోజకవర్గ%')`;
    if (targetLvl === 4) return `(${prefix}generaltype IN ('Municipality / Mandal Level', 'Muncipality / Mandal Level', '3') OR ${prefix}generaltype LIKE '%మండల%')`;
    if (targetLvl === 5) return `(${prefix}generaltype IN ('Ward / Panchayati Level', 'Ward / Panchaithi Level', '4') OR ${prefix}generaltype LIKE '%పంచాయతి%' OR ${prefix}generaltype LIKE '%గ్రామ%')`;
    if (targetLvl === 6) return `(${prefix}generaltype IN ('Ward', '5', '6') OR ${prefix}generaltype LIKE '%వార్డు%')`;
    return '1=0';
}
"""

    # Replace old parseLeadershipLevel definition
    old_parse_pattern = re.compile(r'function parseLeadershipLevel\(val\)\s*\{.*?return null;\s*\}', re.DOTALL)
    if old_parse_pattern.search(code):
        code = old_parse_pattern.sub(universal_helpers.strip(), code)
        print(f"Replaced parseLeadershipLevel with universal_helpers in {file_path}")
    else:
        # Place before app.all(['/dashboardapi/getLeaderswebsiteData'
        target_marker = "app.all(['/dashboardapi/getLeaderswebsiteData'"
        idx = code.find(target_marker)
        if idx != -1:
            code = code[:idx] + universal_helpers + "\n\n" + code[idx:]
            print(f"Inserted universal_helpers before getLeaderswebsiteData in {file_path}")

    # 2. Universal getLeaderswebsiteData Handler
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
        let stateId = b.state_id || b.stateId || 1;
        let districtId = b.district_id || b.districtId || null;
        let constituencyId = b.constituency_id || b.constituencyId || null;
        let mandalId = b.mandal_id || b.mandalId || null;
        let panchayatId = b.panchayat_id || b.panchayatId || b.village_id || null;
        const currentUserId = b.usr_id || b.user_id || -1;
        let isWingRequest = req.path.includes('wing') || String(b.leadertype) === '2' || Boolean(b.wingtype) || Boolean(b.wingtypes);

        let loggedInLeaderType = isWingRequest ? 'wing' : 'general';
        let loggedInCanonicalLevel = null;
        let leaderWing = null;

        // 1. Session Parameter Binding: Fetch authoritative leader level & locations directly from DB
        if (currentUserId && currentUserId !== -1) {{
            const [p]{any_type} = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM pastor_reg WHERE id = ?', [currentUserId]);
            if (p && p[0]) {{
                const pWing = resolveWingCategory(p[0].wingtypes) || resolveWingCategory(p[0].wingtype);
                if (String(p[0].leadertype) === '2' || pWing) {{
                    loggedInLeaderType = 'wing';
                    isWingRequest = true;
                    leaderWing = pWing;
                    loggedInCanonicalLevel = getCanonicalLevel(p[0].wingtype) ?? getCanonicalLevel(p[0].generaltype);
                }} else {{
                    loggedInLeaderType = 'general';
                    loggedInCanonicalLevel = getCanonicalLevel(p[0].generaltype);
                }}
                if (p[0].d_in == 1 && (!loggedInCanonicalLevel || loggedInCanonicalLevel > 4)) loggedInCanonicalLevel = 2; // District Leader
                if (p[0].district_id) districtId = p[0].district_id;
                if (p[0].constituency_id) constituencyId = p[0].constituency_id;
                if (p[0].mandal_id) mandalId = p[0].mandal_id;
                if (p[0].village_id) panchayatId = p[0].village_id;
                if (p[0].state_id) stateId = p[0].state_id;
            }} else {{
                const [s]{any_type} = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, panchayat_id, state_id, d_in, approval_ind FROM signup_form WHERE id = ?', [currentUserId]);
                if (s && s[0]) {{
                    const sWing = resolveWingCategory(s[0].wingtypes) || resolveWingCategory(s[0].wingtype);
                    if (String(s[0].leadertype) === '2' || sWing) {{
                        loggedInLeaderType = 'wing';
                        isWingRequest = true;
                        leaderWing = sWing;
                        loggedInCanonicalLevel = getCanonicalLevel(s[0].generaltype) ?? getCanonicalLevel(s[0].wingtype);
                    }} else {{
                        loggedInLeaderType = 'general';
                        loggedInCanonicalLevel = getCanonicalLevel(s[0].generaltype);
                    }}
                    if (s[0].d_in == 1 && (!loggedInCanonicalLevel || loggedInCanonicalLevel > 4)) loggedInCanonicalLevel = 2; // District Leader
                    if (s[0].district_id) districtId = s[0].district_id;
                    if (s[0].constituency_id) constituencyId = s[0].constituency_id;
                    if (s[0].mandal_id) mandalId = s[0].mandal_id;
                    if (s[0].panchayat_id) panchayatId = s[0].panchayat_id;
                    if (s[0].state_id) stateId = s[0].state_id;
                }} else {{
                    const [st]{any_type} = await db.query('SELECT id, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, village_id, state_id, d_in, approval_ind FROM student_reg WHERE id = ?', [currentUserId]);
                    if (st && st[0]) {{
                        loggedInLeaderType = 'wing';
                        isWingRequest = true;
                        leaderWing = resolveWingCategory(1); // Student Wing
                        loggedInCanonicalLevel = getCanonicalLevel(st[0].generaltype) ?? getCanonicalLevel(st[0].wingtype);
                        if (st[0].d_in == 1 && (!loggedInCanonicalLevel || loggedInCanonicalLevel > 4)) loggedInCanonicalLevel = 2; // District Leader
                        if (st[0].district_id) districtId = st[0].district_id;
                        if (st[0].constituency_id) constituencyId = st[0].constituency_id;
                        if (st[0].mandal_id) mandalId = st[0].mandal_id;
                        if (st[0].village_id) panchayatId = st[0].village_id;
                        if (st[0].state_id) stateId = st[0].state_id;
                    }}
                }}
            }}
        }}

        // If not resolved from DB, check request body
        if (loggedInCanonicalLevel === null) {{
            if (b.logged_in_level_id !== undefined) {{
                loggedInCanonicalLevel = Number(b.logged_in_level_id);
            }} else if (b.generaltype !== undefined || b.generalType !== undefined) {{
                loggedInCanonicalLevel = getCanonicalLevel(b.generaltype !== undefined ? b.generaltype : b.generalType);
            }} else {{
                loggedInCanonicalLevel = 2; // Default to District level
            }}
        }}

        if (!leaderWing && (b.wingtypes || b.wingtype)) {{
            leaderWing = resolveWingCategory(b.wingtypes) || resolveWingCategory(b.wingtype);
            if (leaderWing) {{
                loggedInLeaderType = 'wing';
                isWingRequest = true;
            }}
        }}

        // 2. UNIVERSAL SQL QUERY: Targets the immediate level below (:logged_in_level_id + 1)
        const targetLevel = loggedInCanonicalLevel + 1;

        // 3. LEADER TYPE ISOLATION (general vs wing)
        let bLeaderTypeSql = '';
        let pLeaderTypeSql = '';
        let sLeaderTypeSql = '';

        if (loggedInLeaderType === 'general') {{
            // General leader only sees general records (wingtype/wingtypes null, leadertype != 2)
            bLeaderTypeSql = `(COALESCE(s.leadertype, '1') != '2' AND (s.wingtypes IS NULL OR s.wingtypes IN ('', 'null', 'undefined')))`;
            pLeaderTypeSql = `(COALESCE(pr.leadertype, '1') != '2' AND (pr.wingtypes IS NULL OR pr.wingtypes IN ('', 'null', 'undefined')))`;
            sLeaderTypeSql = `1=1`;
        }} else {{
            // Wing leader only sees wing records of the EXACT SAME wing category
            const bWingSql = getWingMatchSql('s.', leaderWing);
            const pWingSql = getWingMatchSql('pr.', leaderWing);
            bLeaderTypeSql = `(s.leadertype = '2' OR s.leadertype = 2) AND ${{bWingSql}}`;
            pLeaderTypeSql = `(pr.leadertype = '2' OR pr.leadertype = 2) AND ${{pWingSql}}`;
            sLeaderTypeSql = (leaderWing && leaderWing.id === 1) ? `1=1` : `1=0`;
        }}

        // 4. LEVEL & GEOGRAPHIC SCOPING (Universal Query across all 6 tiers)
        let bGeoSql = '';
        let pGeoSql = '';
        let sGeoSql = '';
        let queryParams{array_any} = [];

        if (loggedInCanonicalLevel === 1) {{
            // Level 1 (రాష్ట్ర నాయకుడు) viewing Level 2 (జిల్లా నాయకుడు)
            bGeoSql = `(s.state_id = ? OR s.state_id IS NULL)`;
            pGeoSql = `(pr.state_id = ? OR pr.state_id IS NULL)`;
            sGeoSql = `(st.state_id = ? OR st.state_id IS NULL)`;
            queryParams = [stateId];
        }} else if (loggedInCanonicalLevel === 2) {{
            // Level 2 (జిల్లా నాయకుడు) viewing Level 3 (నియోజకవర్గం నాయకుడు)
            bGeoSql = `s.district_id = ?`;
            pGeoSql = `pr.district_id = ?`;
            sGeoSql = `st.district_id = ?`;
            queryParams = [districtId];
        }} else if (loggedInCanonicalLevel === 3) {{
            // Level 3 (నియోజకవర్గం నాయకుడు) viewing Level 4 (మండల నాయకుడు)
            bGeoSql = `s.constituency_id = ? AND (s.district_id = ? OR ? IS NULL)`;
            pGeoSql = `pr.constituency_id = ? AND (pr.district_id = ? OR ? IS NULL)`;
            sGeoSql = `st.constituency_id = ? AND (st.district_id = ? OR ? IS NULL)`;
            queryParams = [constituencyId, districtId, districtId];
        }} else if (loggedInCanonicalLevel === 4) {{
            // Level 4 (మండల నాయకుడు) viewing Level 5 (పంచాయతి నాయకుడు)
            bGeoSql = `s.mandal_id = ? AND (s.constituency_id = ? OR ? IS NULL)`;
            pGeoSql = `pr.mandal_id = ? AND (pr.constituency_id = ? OR ? IS NULL)`;
            sGeoSql = `st.mandal_id = ? AND (st.constituency_id = ? OR ? IS NULL)`;
            queryParams = [mandalId, constituencyId, constituencyId];
        }} else if (loggedInCanonicalLevel === 5) {{
            // Level 5 (పంచాయతి నాయకుడు) viewing Level 6 (వార్డు నాయకుడు)
            bGeoSql = `s.panchayat_id = ? AND (s.mandal_id = ? OR ? IS NULL)`;
            pGeoSql = `pr.village_id = ? AND (pr.mandal_id = ? OR ? IS NULL)`;
            sGeoSql = `st.village_id = ? AND (st.mandal_id = ? OR ? IS NULL)`;
            queryParams = [panchayatId, mandalId, mandalId];
        }} else {{
            // Level 6 (వార్డు నాయకుడు) - no tier below
            bGeoSql = `1=0`;
            pGeoSql = `1=0`;
            sGeoSql = `1=0`;
            queryParams = [];
        }}

        const bLevelSql = getLevelSql('s.', targetLevel);
        const pLevelSql = getLevelSql('pr.', targetLevel);
        const sLevelSql = getStudentLevelSql('st.', targetLevel);

        // Exclude rejected leaders (approval_ind == 2) and exclude current logged in leader themselves
        const bFullWhere = `${{bGeoSql}} AND ${{bLevelSql}} AND ${{bLeaderTypeSql}} AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?`;
        const pFullWhere = `${{pGeoSql}} AND ${{pLevelSql}} AND ${{pLeaderTypeSql}} AND COALESCE(pr.approval_ind, 0) != 2 AND pr.id != ?`;
        const sFullWhere = `${{sGeoSql}} AND ${{sLevelSql}} AND ${{sLeaderTypeSql}} AND COALESCE(st.approval_ind, 0) != 2 AND st.id != ?`;

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
        if (loggedInLeaderType === 'general' || (leaderWing && leaderWing.id === 1)) {{
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
            const isWingLeader = String(u.leadertype) === '2' || Boolean(u.wingtypes && u.wingtypes !== 'null' && u.wingtypes !== 'undefined') || (role === 'pastor' && Boolean(u.wingtype && u.wingtype !== 'null' && String(u.wingtype).trim() !== '' && String(u.leadertype) === '2'));
            let canonicalLvl = null;
            if (role === 'pastor') {{
                canonicalLvl = getCanonicalLevel(u.wingtype) ?? getCanonicalLevel(u.generaltype);
            }} else if (role === 'student') {{
                canonicalLvl = getCanonicalLevel(u.generaltype) ?? getCanonicalLevel(u.wingtype);
            }} else {{
                canonicalLvl = getCanonicalLevel(u.generaltype);
            }}

            if (u.d_in == 1 && (canonicalLvl === null || canonicalLvl === undefined || canonicalLvl > 4)) {{
                canonicalLvl = 2; // Default to District incharge
            }}

            // An approved leader has d_in == 1 OR approval_ind == 1
            const isApproved = (u.d_in == 1) || (Number(u.approval_ind) === 1);
            if (isApproved && canonicalLvl !== null) {{
                const resolvedWing = resolveWingCategory(u.wingtypes) || resolveWingCategory(u.wingtype) || (role === 'student' ? resolveWingCategory(1) : null);
                // Return internal 0-indexed genType for client compatibility (0=State, 1=District, 2=Constituency, 3=Mandal, 4=Panchayat, 5=Ward)
                const clientGenType = canonicalLvl === 1 ? 0 : canonicalLvl - 1;
                return {{
                    id: u.id,
                    leadertype: (isWingLeader || resolvedWing) ? 2 : (Number(u.leadertype) || 1),
                    generaltype: clientGenType,
                    canonical_level: canonicalLvl,
                    wingtype: u.wingtype,
                    wingtypes: u.wingtypes,
                    wing_name: resolvedWing ? resolvedWing.telugu : '',
                    wing_english: resolvedWing ? resolvedWing.english : '',
                    state_id: u.state_id || 1,
                    district_id: u.district_id,
                    constituency_id: u.constituency_id,
                    mandal_id: u.mandal_id,
                    village_id: u.village_id || u.panchayat_id,
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

if __name__ == '__main__':
    update_server_files('backend/server.js')
    update_server_files('backend/server.ts')

