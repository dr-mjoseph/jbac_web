import re

def update_server_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add loggedInRole declaration
    old_decl = "let leaderWing = null;"
    new_decl = "let leaderWing = null;\n        let loggedInRole = null;"
    if old_decl in content and new_decl not in content:
        content = content.replace(old_decl, new_decl)

    # 2. Tag loggedInRole when matching user in DB
    p_check = "if (p && p[0]) {"
    p_replace = "if (p && p[0]) {\n                loggedInRole = 'pastor';"
    if p_check in content and p_replace not in content:
        content = content.replace(p_check, p_replace, 1)

    s_check = "if (s && s[0]) {"
    s_replace = "if (s && s[0]) {\n                loggedInRole = 'believer';"
    if s_check in content and s_replace not in content:
        content = content.replace(s_check, s_replace, 1)

    st_check = "if (st && st[0]) {"
    st_replace = "if (st && st[0]) {\n                    loggedInRole = 'student';"
    if st_check in content and st_replace not in content:
        content = content.replace(st_check, st_replace, 1)

    # 3. Add targetUserType determination after leaderWing checks
    target_user_type_block = """        // 1.5 USER TYPE ISOLATION: Filter out requests belonging to other user types
        let targetUserType = null;
        const reqUserType = String(b.user_type || b.selected_user_type || '').toLowerCase().trim();
        const reqCatId = String(b.category_id || b.category || '').trim();

        if (reqUserType === 'pastor' || reqCatId === '4' || reqCatId === '3') {
            targetUserType = 'pastor';
        } else if (reqUserType === 'student' || reqCatId === '2') {
            targetUserType = 'student';
        } else if (reqUserType === 'believer' || reqCatId === '1') {
            targetUserType = 'believer';
        } else if (reqUserType === 'all') {
            targetUserType = 'all';
        } else if (loggedInRole) {
            targetUserType = loggedInRole;
        }"""

    wing_check_end = """            if (leaderWing) {
                loggedInLeaderType = 'wing';
                isWingRequest = true;
            }
        }"""

    if wing_check_end in content and target_user_type_block not in content:
        content = content.replace(wing_check_end, wing_check_end + "\n\n" + target_user_type_block)

    # 4. Conditionally execute queries based on targetUserType
    old_query_block = """        const [believers] = await db.query(`
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
            LEFT JOIN wings w ON w.id = COALESCE(NULLIF(s.wingtypes, ''), s.wingtype)
            WHERE ${bFullWhere}
            GROUP BY s.id
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
            LEFT JOIN wings w ON w.id = COALESCE(NULLIF(pr.wingtypes, ''), pr.wingtype)
            WHERE ${pFullWhere}
            GROUP BY pr.id
            ORDER BY pr.id DESC
        `, [...queryParams, currentUserId]);

        let students = [];
        if (loggedInLeaderType === 'general' || (leaderWing && leaderWing.id === 1)) {
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
        }"""

    new_query_block = """        let believers = [];
        let pastors = [];
        let students = [];

        // Query Believers only if targetUserType is believer or all
        if (!targetUserType || targetUserType === 'believer' || targetUserType === 'all') {
            const [bRows] = await db.query(`
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
                LEFT JOIN wings w ON w.id = COALESCE(NULLIF(s.wingtypes, ''), s.wingtype)
                WHERE ${bFullWhere}
                GROUP BY s.id
                ORDER BY s.id DESC
            `, [...queryParams, currentUserId]);
            believers = bRows || [];
        }

        // Query Pastors only if targetUserType is pastor or all
        if (!targetUserType || targetUserType === 'pastor' || targetUserType === 'all') {
            const [pRows] = await db.query(`
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
                LEFT JOIN wings w ON w.id = COALESCE(NULLIF(pr.wingtypes, ''), pr.wingtype)
                WHERE ${pFullWhere}
                GROUP BY pr.id
                ORDER BY pr.id DESC
            `, [...queryParams, currentUserId]);
            pastors = pRows || [];
        }

        // Query Students only if targetUserType is student or all
        if (!targetUserType || targetUserType === 'student' || targetUserType === 'all') {
            if (loggedInLeaderType === 'general' || (leaderWing && leaderWing.id === 1)) {
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
        }"""

    if old_query_block in content:
        content = content.replace(old_query_block, new_query_block)

    # 5. Add selected_user_type to JSON response
    old_res1 = "return res.json({ status: 200, data: [believers, students, pastors] });"
    new_res1 = "return res.json({ status: 200, data: [believers, students, pastors], selected_user_type: targetUserType });"
    if old_res1 in content:
        content = content.replace(old_res1, new_res1)

    old_res2 = "return res.json({ status: 200, data: [believers, constituencies, pastors, students] });"
    new_res2 = "return res.json({ status: 200, data: [believers, constituencies, pastors, students], selected_user_type: targetUserType });"
    if old_res2 in content:
        content = content.replace(old_res2, new_res2)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[SUCCESS] Updated {filepath}")

update_server_file("backend/server.js")
update_server_file("backend/server.ts")

