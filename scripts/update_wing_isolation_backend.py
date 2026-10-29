import re

def update_server(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Define WING_CATALOG and helpers if not present
    wing_catalog_code = """// -------------------------------------------------------------
// WING CATALOG & CANONICAL RESOLVER FOR STRICT WING ISOLATION
// -------------------------------------------------------------
const WING_CATALOG = [
    { id: 1, telugu: 'స్టూడెంట్ వింగ్', english: 'Student Wing', terms: ['student', 'విద్యార్థి'] },
    { id: 2, telugu: 'బ్యూరోక్రాట్  వింగ్', english: 'Bureaucrat Wing', terms: ['bureaucrat', 'బ్యూరోక్రాట్'] },
    { id: 3, telugu: 'మెడికల్ వింగ్', english: 'Medical Wing', terms: ['medical', 'doctor', 'మెడికల్'] },
    { id: 4, telugu: 'ఇంజనీరింగ్ వింగ్', english: 'Engineering Wing', terms: ['engineering', 'engineer', 'ఇంజనీరింగ్'] },
    { id: 5, telugu: 'పోలీస్ వింగ్ & మిలిటరీ వింగ్', english: 'Police & Military Wing', terms: ['police', 'military', 'పోలీస్', 'మిలిటరీ'] },
    { id: 6, telugu: 'అడ్వకేట్ వింగ్', english: 'Advocate Wing', terms: ['advocate', 'lawyer', 'అడ్వకేట్'] },
    { id: 7, telugu: 'టీచింగ్ వింగ్', english: 'Teaching Wing', terms: ['teaching', 'teacher', 'టీచింగ్'] },
    { id: 8, telugu: 'బ్యాంకింగ్ వింగ్', english: 'Banking Wing', terms: ['banking', 'banker', 'బ్యాంకింగ్'] },
    { id: 9, telugu: 'చార్టెడ్ అకౌంట్ వింగ్', english: 'Chartered Accountant Wing', terms: ['chartered', 'ca', 'చార్టెడ్'] },
    { id: 10, telugu: 'బిజినెస్ వింగ్', english: 'Business Wing', terms: ['business', 'బిజినెస్'] },
    { id: 11, telugu: 'గ్రూప్1 ఆఫీసర్ వింగ్', english: 'Group 1 Officer Wing', terms: ['group1', 'group 1', 'గ్రూప్1', 'గ్రూప్ 1'] },
    { id: 12, telugu: 'గ్రూప్2 ఆఫీసర్ వింగ్', english: 'Group 2 Officer Wing', terms: ['group2', 'group 2', 'గ్రూప్2', 'గ్రూప్ 2'] },
    { id: 13, telugu: 'గ్రూప్3 ఆఫీసర్ వింగ్', english: 'Group 3 Officer Wing', terms: ['group3', 'group 3', 'గ్రూప్3', 'గ్రూప్ 3'] },
    { id: 14, telugu: 'గ్రూప్4 ఆఫీసర్ వింగ్', english: 'Group 4 Officer Wing', terms: ['group4', 'group 4', 'గ్రూప్4', 'గ్రూప్ 4'] },
    { id: 15, telugu: 'ఎన్ జి ఓ- NGO వింగ్', english: 'NGO Wing', terms: ['ngo', 'ఎన్ జి'] },
    { id: 16, telugu: 'నిర్మాణ రంగం వింగ్', english: 'Construction Wing', terms: ['construction', 'నిర్మాణ'] },
    { id: 17, telugu: 'సాఫ్ట్ వెర్ వింగ్', english: 'Software Wing', terms: ['software', 'సాఫ్ట్'] },
    { id: 18, telugu: 'హౌస్ కీపింగ్ వింగ్', english: 'Housekeeping Wing', terms: ['housekeeping', 'హౌస్'] },
    { id: 19, telugu: 'సోషల్ మీడియా వింగ్', english: 'Social Media Wing', terms: ['socialmedia', 'social media', 'సోషల్'] },
    { id: 20, telugu: 'పేపర్ మీడియా వింగ్', english: 'Paper Media Wing', terms: ['papermedia', 'paper media', 'పేపర్'] },
    { id: 21, telugu: 'ఎలక్ట్రానిక్ మీడియా వింగ్', english: 'Electronic Media Wing', terms: ['electronic', 'electronic media', 'ఎలక్ట్రానిక్'] },
    { id: 22, telugu: 'పొలిటికల్ వింగ్', english: 'Political Wing', terms: ['political', 'politics', 'పొలిటికల్'] },
    { id: 23, telugu: 'ఇతర వింగ్స్', english: 'Other Wings', terms: ['other', 'ఇతర'] },
];

function resolveWingCategory(rawVal) {
    if (rawVal === null || rawVal === undefined || rawVal === '' || rawVal === 'null' || rawVal === 'undefined') {
        return null;
    }
    const str = String(rawVal).trim().toLowerCase();
    const num = Number(rawVal);
    if (!isNaN(num) && num >= 1 && num <= 23) {
        const found = WING_CATALOG.find(w => w.id === num);
        if (found) return found;
    }
    for (const w of WING_CATALOG) {
        if (str === String(w.id) || str === w.telugu.toLowerCase() || str === w.english.toLowerCase()) {
            return w;
        }
        if (w.telugu.toLowerCase().includes(str) || str.includes(w.telugu.toLowerCase())) {
            return w;
        }
        for (const t of w.terms) {
            if (str.includes(t.toLowerCase())) {
                return w;
            }
        }
    }
    return null;
}

function getWingMatchSql(prefix, wing) {
    if (!wing) return '';
    const id = wing.id;
    const telugu = wing.telugu;
    const conds = [
        `${prefix}wingtypes = '${id}'`,
        `${prefix}wingtypes = ${id}`,
        `${prefix}wingtypes LIKE '%${telugu}%'`,
        `${prefix}wingtype = '${id}'`,
        `${prefix}wingtype = ${id}`,
        `${prefix}wingtype LIKE '%${telugu}%'`
    ];
    for (const t of (wing.terms || [])) {
        conds.push(`${prefix}wingtypes LIKE '%${t}%'`);
        conds.push(`${prefix}wingtype LIKE '%${t}%'`);
    }
    return `(${conds.join(' OR ')})`;
}
"""

    if 'const WING_CATALOG =' not in content:
        # Place before app.all(['/dashboardapi/getLeaderswebsiteData'
        target_pos = content.find("app.all(['/dashboardapi/getLeaderswebsiteData'")
        if target_pos != -1:
            content = content[:target_pos] + wing_catalog_code + "\n" + content[target_pos:]
            print(f"Added WING_CATALOG to {filepath}")

    # 2. Update resolveLeader inside getUserMainData to attach wing_name
    old_resolve_leader = """            // An approved leader has d_in == 1 OR approval_ind == 1
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
            }"""

    new_resolve_leader = """            // An approved leader has d_in == 1 OR approval_ind == 1
            const isApproved = (u.d_in == 1) || (Number(u.approval_ind) === 1);
            if (isApproved && (genType === 0 || genType === 1 || genType === 2 || genType === 3 || genType === 4)) {
                const resolvedWing = resolveWingCategory(u.wingtypes) || resolveWingCategory(u.wingtype) || (role === 'student' ? resolveWingCategory(1) : null);
                return {
                    id: u.id,
                    leadertype: isWingLeader ? 2 : (Number(u.leadertype) || 1),
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
                };
            }"""

    if old_resolve_leader in content:
        content = content.replace(old_resolve_leader, new_resolve_leader)
        print(f"Updated resolveLeader with wing_name in {filepath}")

    # 3. Rewrite getLeaderswebsiteData to strictly enforce wing category isolation
    # Find start and end of getLeaderswebsiteData handler
    start_tag = "app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req, res) => {"
    end_tag = "app.all(['/dashboardapi/postwishform', '/api/postwishform'], async (req, res) => {"

    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx != -1 and end_idx != -1:
        new_handler = """app.all(['/dashboardapi/getLeaderswebsiteData', '/dashboardapi/getLeaderswebsitewing', '/api/leaders', '/api/getLeaderswebsiteData'], async (req, res) => {
    try {
        const b = req.body || req.query || {};
        const stateId = b.state_id || b.stateId || 1;
        let districtId = b.district_id || b.districtId || null;
        let constituencyId = b.constituency_id || b.constituencyId || null;
        let mandalId = b.mandal_id || b.mandalId || null;
        let genType = Number(b.generaltype !== undefined ? b.generaltype : (b.generalType !== undefined ? b.generalType : 1));
        const currentUserId = b.usr_id || b.user_id || -1;
        let isWingRequest = req.path.includes('wing') || String(b.leadertype) === '2' || Boolean(b.wingtype) || Boolean(b.wingtypes);

        let leaderWing = null;

        // 1. If currentUserId is available, inspect the authenticated leader in DB to resolve their exact wing category & level
        if (currentUserId && currentUserId !== -1) {
            const [p] = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM pastor_reg WHERE id = ?', [currentUserId]);
            if (p && p[0]) {
                if (String(p[0].leadertype) === '2' || (p[0].wingtypes && p[0].wingtypes !== 'null') || (p[0].wingtype && String(p[0].wingtype) !== '1')) {
                    isWingRequest = true;
                    leaderWing = resolveWingCategory(p[0].wingtypes) || resolveWingCategory(p[0].wingtype);
                    if (p[0].wingtype) {
                        const parsedLvl = parseLeadershipLevel(p[0].wingtype);
                        if (parsedLvl !== null) genType = parsedLvl;
                    }
                }
                if (p[0].district_id && !districtId) districtId = p[0].district_id;
                if (p[0].constituency_id && !constituencyId) constituencyId = p[0].constituency_id;
                if (p[0].mandal_id && !mandalId) mandalId = p[0].mandal_id;
            } else {
                const [s] = await db.query('SELECT id, leadertype, generaltype, wingtype, wingtypes, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM signup_form WHERE id = ?', [currentUserId]);
                if (s && s[0]) {
                    if (String(s[0].leadertype) === '2' || (s[0].wingtypes && s[0].wingtypes !== 'null') || (s[0].wingtype && String(s[0].wingtype) !== '1')) {
                        isWingRequest = true;
                        leaderWing = resolveWingCategory(s[0].wingtypes) || resolveWingCategory(s[0].wingtype);
                        if (s[0].wingtype) {
                            const parsedLvl = parseLeadershipLevel(s[0].wingtype);
                            if (parsedLvl !== null) genType = parsedLvl;
                        }
                    }
                    if (s[0].district_id && !districtId) districtId = s[0].district_id;
                    if (s[0].constituency_id && !constituencyId) constituencyId = s[0].constituency_id;
                    if (s[0].mandal_id && !mandalId) mandalId = s[0].mandal_id;
                } else {
                    const [st] = await db.query('SELECT id, leadership, leadertype, generaltype, wingtype, district_id, constituency_id, mandal_id, state_id, d_in, approval_ind FROM student_reg WHERE id = ?', [currentUserId]);
                    if (st && st[0]) {
                        isWingRequest = true;
                        leaderWing = resolveWingCategory(1); // Student Wing
                        const parsedLvl = parseLeadershipLevel(st[0].generaltype) ?? parseLeadershipLevel(st[0].wingtype);
                        if (parsedLvl !== null) genType = parsedLvl;
                        if (st[0].district_id && !districtId) districtId = st[0].district_id;
                        if (st[0].constituency_id && !constituencyId) constituencyId = st[0].constituency_id;
                        if (st[0].mandal_id && !mandalId) mandalId = st[0].mandal_id;
                    }
                }
            }
        }

        // If not resolved from DB, check request body
        if (!leaderWing && (b.wingtypes || b.wingtype)) {
            leaderWing = resolveWingCategory(b.wingtypes) || resolveWingCategory(b.wingtype);
            if (leaderWing) isWingRequest = true;
        }

        let bWhere = '';
        let pWhere = '';
        let sWhere = '';
        let queryParams = [];

        // HIERARCHICAL LEVEL FILTERING (ONE LEVEL DOWN):
        if (genType === 0) {
            // State Leader -> Sees District Leaders (Level 1)
            bWhere = '(s.state_id = ? OR s.state_id IS NULL) AND (s.generaltype = "1" OR s.generaltype = "District Level" OR s.wingtype = "1" OR s.wingtype = "District Level")';
            pWhere = '(pr.state_id = ? OR pr.state_id IS NULL) AND (pr.generaltype = "1" OR pr.generaltype = "District Level" OR pr.wingtype = "1" OR pr.wingtype = "District Level")';
            sWhere = '(st.state_id = ? OR st.state_id IS NULL) AND (st.generaltype = "1" OR st.generaltype = "District Level" OR st.generaltype = 1 OR st.wingtype = "1" OR st.wingtype = 1)';
            queryParams = [stateId];
        } else if (genType === 1 && districtId) {
            // District Leader -> Sees Constituency Leaders (Level 2)
            bWhere = 's.district_id = ? AND (s.generaltype = "2" OR s.generaltype = "Constituency Level" OR s.wingtype = "2" OR s.wingtype = "Constituency Level")';
            pWhere = 'pr.district_id = ? AND (pr.generaltype = "2" OR pr.generaltype = "Constituency Level" OR pr.wingtype = "2" OR pr.wingtype = "Constituency Level")';
            sWhere = 'st.district_id = ? AND (st.generaltype = "2" OR st.generaltype = "Constituency Level" OR st.generaltype = 2 OR st.wingtype = "2" OR st.wingtype = 2)';
            queryParams = [districtId];
        } else if (genType === 2 && (constituencyId || districtId)) {
            // Constituency Leader -> Sees Mandal Leaders (Level 3)
            const targetId = constituencyId || districtId;
            const targetCol = constituencyId ? 'constituency_id' : 'district_id';
            bWhere = `s.${targetCol} = ? AND (s.generaltype = "3" OR s.generaltype = "Municipality / Mandal Level" OR s.wingtype = "3" OR s.wingtype = "Municipality / Mandal Level")`;
            pWhere = `pr.${targetCol} = ? AND (pr.generaltype = "3" OR pr.generaltype = "Municipality / Mandal Level" OR pr.wingtype = "3" OR pr.wingtype = "Municipality / Mandal Level")`;
            sWhere = `st.${targetCol} = ? AND (st.generaltype = "3" OR st.generaltype = "Municipality / Mandal Level" OR st.generaltype = 3 OR st.wingtype = "3" OR st.wingtype = 3)`;
            queryParams = [targetId];
        } else if (genType === 3 && (mandalId || constituencyId || districtId)) {
            // Mandal Leader -> Sees Panchayat/Ward Leaders (Level 4, 5, 6)
            const targetId = mandalId || constituencyId || districtId;
            const targetCol = mandalId ? 'mandal_id' : (constituencyId ? 'constituency_id' : 'district_id');
            bWhere = `s.${targetCol} = ? AND (s.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR s.wingtype IN ("4", "5", "6") OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)`;
            pWhere = `pr.${targetCol} = ? AND (pr.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR pr.wingtype IN ("4", "5", "6") OR pr.subward IS NOT NULL)`;
            sWhere = `st.${targetCol} = ? AND (st.generaltype IN ("4", "5", "6", "Ward / Panchayati Level") OR st.generaltype = 4 OR st.wingtype IN ("4", "5", "6", 4))`;
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

        // STRICT WING CATEGORY ISOLATION:
        // When leader is elected/approved for a particular wing category (e.g. Student Wing, Advocate Wing, etc.):
        // ONLY subordinates of that EXACT SAME wing category can be displayed!
        // If subordinate is from the same location but wing is different, they are excluded.
        if (leaderWing) {
            const bWingSql = getWingMatchSql('s.', leaderWing);
            const pWingSql = getWingMatchSql('pr.', leaderWing);
            bWhere += ` AND ${bWingSql}`;
            pWhere += ` AND ${pWingSql}`;

            // student_reg is inherently Student Wing (id === 1)
            if (leaderWing.id === 1) {
                // Students match
            } else {
                // If leader is Advocate Wing, Medical Wing, etc., student_reg records must NOT display
                sWhere = '1=0';
            }
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
            LEFT JOIN wings w ON s.wingtype = w.id OR s.wingtypes = w.id
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
            LEFT JOIN wings w ON pr.wingtype = w.id OR pr.wingtypes = w.id
            WHERE ${pFullWhere}
            ORDER BY pr.id DESC
        `, [...queryParams, currentUserId]);

        let students = [];
        if (!leaderWing || leaderWing.id === 1) {
            const [stRows] = await db.query(`
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
            students = stRows || [];
        }

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
});
"""
        content = content[:start_idx] + new_handler + "\n" + content[end_idx:]
        print(f"Replaced getLeaderswebsiteData handler in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_server('backend/server.js')
update_server('backend/server.ts')
print("Finished updating backend files.")

