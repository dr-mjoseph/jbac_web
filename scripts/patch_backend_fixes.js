const fs = require('fs');

function patchServer(filePath, isTs) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix individual registration endpoints dynamicInsert('users', ...) otp field:
    // Replace "otp: b.password," or "otp: p.password," or "otp: c.password," etc with "otp: 0,"
    content = content.replace(/otp:\s*[bpcsmoa]\.password,/g, 'otp: 0,');

    // 2. Fix postwebsitesignup:
    // 'INSERT INTO users (name, number, email, otp, d_in) VALUES (?, ?, ?, ?, 0)', [name, phone, userMail, password]
    content = content.replace(
        /INSERT INTO users \(name, number, email, otp, d_in\) VALUES \(\?, \?, \?, \?, 0\)',\s*\[name, phone, userMail, password\]/g,
        "INSERT INTO users (name, number, email, otp, d_in) VALUES (?, ?, ?, NULL, 0)', [name, phone, userMail]"
    );

    // 3. Remove "UPDATE users SET otp = ? WHERE number = ?"
    content = content.replace(/await db\.query\(['"]UPDATE users SET otp = \? WHERE number = \?['"],\s*\[[^\]]+\]\)\.catch\(\(\) =>\s*\{\s*\}\);/g, '// users.otp is not a password field');

    // 4. In postregform:
    // Update phone/pwd/whatsapp extraction and category insertions
    // We want to replace the body of postregform carefully
    const anyType = isTs ? ': any' : '';

    const postregRegex = new RegExp(
        `app\\.post\\(\\['/dashboardapi/postregform', '/api/postregform'\\],\\s*async\\s*\\(req${anyType},\\s*res${anyType}\\)\\s*=>\\s*\\{[\\s\\S]*?res\\.status\\(500\\)\\.json\\(\\{ status: 500, error: err\\.message \\}\\);\\s*\\}\\s*\\}\\);`
    );

    const newPostRegHandler = `app.post(['/dashboardapi/postregform', '/api/postregform'], async (req${anyType}, res${anyType}) => {
    try {
        const body = req.body || {};
        const isNamodu = body.source === 'namodu' || body.is_namodu === true || body.form_name === 'namodu' || (body.number && !body.phnumber);
        const phone = String(body.phonenum || body.phnumber || body.mobile_number || body.phone || body.number || '').trim();
        const name = String(body.name || body.studentname || body.pastorname || body.church_name || body.paname || body.ministryname || body.organisation_name || '').trim();
        const rawPwd = body.password ? String(body.password).trim() : null;
        const pwd = (rawPwd && rawPwd !== phone) ? rawPwd : null;
        const whatsappPhone = String(body.whatsapp || body.whatsappno || body.whatsapp_number || body.whatsapnum || '').trim() || null;
        const distId = body.district_id || body.districts || body.districtname || null;
        const constId = body.constituency_id || body.constituencyname || body.constituency || null;
        const mandalId = body.mandal_id || body.mandals || body.mandalname || null;
        const villageId = body.village_id || body.panchayat_id || body.panchayati || body.panchayat || null;
        const addr = body.address || '';
        const desc = body.description || '';
        const cts = getIndianCts();

        if (phone) {
            body.phonenum = phone;
            if (pwd) {
                body.password = pwd;
            } else {
                delete body.password;
            }
            body.is_first_login = 1;
            body.cts = cts;
            if (whatsappPhone) {
                body.whatsappno = whatsappPhone;
                body.whatsapp = whatsappPhone;
                body.whatsapp_number = whatsappPhone;
            } else {
                delete body.whatsapp;
                delete body.whatsappno;
                delete body.whatsapp_number;
                delete body.whatsapnum;
            }
        }

        // 1. Insert into reg_form ONLY if NOT from /namodu form
        let regFormResult${anyType} = null;
        if (!isNamodu) {
            regFormResult = await dynamicInsert('reg_form', body);
        }

        // 2. Insert into category-specific table according to selected category
        const cat = String(body.category || '').trim().toLowerCase();
        let categoryInsertResult${anyType} = null;
        let targetCategoryTable = '';

        try {
            if (cat === '1' || cat.includes('believer') || cat.includes('\\u0c35\\u0c3f\\u0c36\\u0c4d\\u0c35\\u0c3e\\u0c38\\u0c3f')) {
                // Category 1: Believer -> signup_form
                targetCategoryTable = 'signup_form';
                categoryInsertResult = await dynamicInsert('signup_form', {
                    cts: cts,
                    fname: name,
                    mobile_number: phone,
                    whatsapp: whatsappPhone,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    panchayat_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    retypepassword: pwd,
                    term: body.term ? String(body.term) : 'Yes',
                    from_signup: 'believer',
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '2' || cat.includes('student') || cat.includes('\\u0c35\\u0c3f\\u0c26\\u0c4d\\u0c2f\\u0c3e\\u0c30\\u0c4d\\u0c25\\u0c3f')) {
                targetCategoryTable = 'student_reg';
                categoryInsertResult = await dynamicInsert('student_reg', {
                    cts: cts,
                    studentname: name,
                    number: phone,
                    whatsapp: whatsappPhone,
                    parentnum: body.parentnum || body.mother || body.fathernum || null,
                    pastornum: body.pastornum || null,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    village_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    term: body.term ? String(body.term) : '1',
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '4' || ((cat.includes('pastor') || cat.includes('\\u0c2a\\u0c3e\\u0c38\\u0c4d\\u0c1f\\u0c30\\u0c4d')) && !cat.includes('association') && !cat.includes('\\u0c05\\u0c38\\u0c4b\\u0c38\\u0c3f\\u0c2f\\u0c47\\u0c37\\u0c28\\u0c4d'))) {
                targetCategoryTable = 'pastor_reg';
                categoryInsertResult = await dynamicInsert('pastor_reg', {
                    cts: cts,
                    pastorname: name,
                    phonenumber: phone,
                    whatsapp: whatsappPhone,
                    phonenumber2: body.phonenumber2 || null,
                    pa_phonenumber: body.pa_phonenumber || null,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    village_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    retypepassword: pwd,
                    term: body.term ? String(body.term) : '1',
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '5' || cat.includes('church') || cat.includes('\\u0c1a\\u0c30\\u0c4d\\u0c1a\\u0c3f')) {
                targetCategoryTable = 'church_reg';
                categoryInsertResult = await dynamicInsert('church_reg', {
                    cts: cts,
                    church_name: name,
                    contactnumber: phone,
                    whatsapp: whatsappPhone,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    village_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    term: body.term ? String(body.term) : '1',
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '7' || cat.includes('association') || cat.includes('\\u0c05\\u0c38\\u0c4b\\u0c38\\u0c3f\\u0c2f\\u0c47\\u0c37\\u0c28\\u0c4d')) {
                targetCategoryTable = 'pastors_associations';
                categoryInsertResult = await dynamicInsert('pastors_associations', {
                    cts: cts,
                    paname: name,
                    headname: name,
                    phonenumber: phone,
                    whatsapp_number: whatsappPhone,
                    president: body.president || null,
                    secretory: body.secretory || null,
                    stdph: body.stdph || null,
                    districtname: distId,
                    constituencyname: constId,
                    mandals: mandalId,
                    panchaiti: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    terms: 'YES',
                    d_in: 0,
                    is_first_login: 1
                });
            } else if (cat === '3' || cat.includes('ministr') || cat.includes('\\u0c2e\\u0c3f\\u0c28\\u0c3f\\u0c38\\u0c4d\\u0c1f\\u0c4d\\u0c30\\u0c40\\u0c38\\u0c4d')) {
                targetCategoryTable = 'ministry_signup';
                categoryInsertResult = await dynamicInsert('ministry_signup', {
                    cts: cts,
                    ministryname: name,
                    headname: name,
                    headnmber: phone,
                    whatsapp: whatsappPhone,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    panchayat_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    retypepassword: pwd,
                    terms: body.term ? String(body.term) : '1',
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '6' || cat.includes('organization') || cat.includes('\\u0c06\\u0c30\\u0c4d\\u0c17\\u0c28\\u0c48\\u0c1c\\u0c47\\u0c37\\u0c28\\u0c4d')) {
                targetCategoryTable = 'independentorganisation_reg';
                categoryInsertResult = await dynamicInsert('independentorganisation_reg', {
                    cts: cts,
                    organisation_name: name,
                    contact_num: phone,
                    whatsapp: whatsappPhone,
                    districts: distId,
                    constituencyname: constId,
                    mandals: mandalId,
                    panchayati: villageId,
                    org_address: addr,
                    description: desc,
                    password: pwd,
                    d_in: 0,
                    approval_ind: 0,
                    is_first_login: 1
                });
            } else if (cat === '8' || cat.includes('business') || cat.includes('company') || cat.includes('\\u0c06\\u0c2b\\u0c40\\u0c38\\u0c4d') || cat.includes('\\u0c15\\u0c02\\u0c2a\\u0c46\\u0c28\\u0c40')) {
                targetCategoryTable = 'business_table';
                categoryInsertResult = await dynamicInsert('business_table', {
                    cts: cts,
                    title: name,
                    usr_name: name,
                    number: phone,
                    districtname: distId,
                    constituencyname: constId,
                    mandals: mandalId,
                    village_name: villageId,
                    description: desc,
                    d_in: 0
                });
            }
        } catch (catErr${anyType}) {
            console.error('Category specific table insert error:', catErr?.message);
        }

        // Also insert/update users table (without setting phone to otp!)
        if (phone) {
            try {
                await dynamicInsert('users', {
                    name: name || 'Member',
                    number: phone,
                    email: body.email || null,
                    otp: 0,
                    d_in: 0
                });
            } catch (_) {}
        }

        res.json({
            status: 200,
            message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.',
            insertId: categoryInsertResult?.insertId || regFormResult?.insertId,
            categoryTable: targetCategoryTable || (isNamodu ? null : 'reg_form'),
            categoryInsertId: categoryInsertResult?.insertId || null,
            insertedToRegForm: !isNamodu
        });
    } catch (err${anyType}) {
        res.status(500).json({ status: 500, error: err.message });
    }
});`;

    if (postregRegex.test(content)) {
        content = content.replace(postregRegex, newPostRegHandler);
        console.log('Successfully patched postregform in', filePath);
    } else {
        console.warn('Could not match postregform regex in', filePath);
    }

    // 5. Update passwordwebsitelogin category queries to handle NULL/empty passwords:
    const oldLoginQuery1 = "query: 'SELECT id, CONCAT(fname, \" \", COALESCE(lname, \"\")) as name, mobile_number, email, password, is_first_login FROM signup_form WHERE mobile_number = ? AND password = ?'";
    const newLoginQuery1 = "query: 'SELECT id, CONCAT(fname, \" \", COALESCE(lname, \"\")) as name, mobile_number, email, password, is_first_login FROM signup_form WHERE mobile_number = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = mobile_number))'";
    content = content.replace(oldLoginQuery1, newLoginQuery1);

    const oldLoginQuery2 = "query: 'SELECT id, studentname as name, number as mobile_number, null as email, password, is_first_login FROM student_reg WHERE number = ? AND password = ?'";
    const newLoginQuery2 = "query: 'SELECT id, studentname as name, number as mobile_number, null as email, password, is_first_login FROM student_reg WHERE number = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = number))'";
    content = content.replace(oldLoginQuery2, newLoginQuery2);

    const oldLoginQuery3 = "query: 'SELECT id, ministryname as name, headnmber as mobile_number, ministryemail as email, password, is_first_login FROM ministry_signup WHERE headnmber = ? AND password = ?'";
    const newLoginQuery3 = "query: 'SELECT id, ministryname as name, headnmber as mobile_number, ministryemail as email, password, is_first_login FROM ministry_signup WHERE headnmber = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = headnmber))'";
    content = content.replace(oldLoginQuery3, newLoginQuery3);

    const oldLoginQuery4 = "query: 'SELECT id, pastorname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastor_reg WHERE phonenumber = ? AND password = ?'";
    const newLoginQuery4 = "query: 'SELECT id, pastorname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastor_reg WHERE phonenumber = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = phonenumber))'";
    content = content.replace(oldLoginQuery4, newLoginQuery4);

    const oldLoginQuery5 = "query: 'SELECT id, church_name as name, contactnumber as mobile_number, null as email, password, is_first_login FROM church_reg WHERE contactnumber = ? AND password = ?'";
    const newLoginQuery5 = "query: 'SELECT id, church_name as name, contactnumber as mobile_number, null as email, password, is_first_login FROM church_reg WHERE contactnumber = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = contactnumber))'";
    content = content.replace(oldLoginQuery5, newLoginQuery5);

    const oldLoginQuery6 = "query: 'SELECT id, organisation_name as name, contact_num as mobile_number, email, password, is_first_login FROM independentorganisation_reg WHERE contact_num = ? AND password = ?'";
    const newLoginQuery6 = "query: 'SELECT id, organisation_name as name, contact_num as mobile_number, email, password, is_first_login FROM independentorganisation_reg WHERE contact_num = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = contact_num))'";
    content = content.replace(oldLoginQuery6, newLoginQuery6);

    const oldLoginQuery7 = "query: 'SELECT id, paname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastors_associations WHERE phonenumber = ? AND password = ?'";
    const newLoginQuery7 = "query: 'SELECT id, paname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastors_associations WHERE phonenumber = ? AND (password = ? OR ((password IS NULL OR password = \"\") AND ? = phonenumber))'";
    content = content.replace(oldLoginQuery7, newLoginQuery7);

    // Also update db.query(cfg.query, [phone, pwd]) to pass [phone, pwd, pwd]
    content = content.replace(/await db\.query\(cfg\.query,\s*\[phone,\s*pwd\]\);/g, 'await db.query(cfg.query, [phone, pwd, pwd]);');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Saved patched file:', filePath);
}

patchServer('c:/Users/rajes/Documents/jbac_web/backend/server.ts', true);
patchServer('c:/Users/rajes/Documents/jbac_web/backend/server.js', false);
