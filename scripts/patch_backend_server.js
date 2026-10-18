const fs = require('fs');

function patchServerFile(filePath, isTs) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure getIndianCts helper is present
  if (!content.includes('function getIndianCts(')) {
    const helperCode = isTs 
      ? `function getIndianCts(): string {\n    const d = new Date();\n    const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));\n    return istTime.toISOString().replace('T', ' ').substring(0, 19);\n}\n\n`
      : `function getIndianCts() {\n    const d = new Date();\n    const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));\n    return istTime.toISOString().replace('T', ' ').substring(0, 19);\n}\n\n`;
    
    content = content.replace(/(const app = express\(\);)/, `$1\n\n${helperCode}`);
  }

  // 2. Patch postbeliversignup
  // Look for: app.post(['/dashboardapi/postbeliversignup', ...
  const beliverOldRegex = /(app\.post\(\['\/dashboardapi\/postbeliversignup'[\s\S]*?b\.from_signup = 'believer';\s*b\.d_in = 0;)/;
  if (beliverOldRegex.test(content)) {
    content = content.replace(
      beliverOldRegex,
      `$1\n        b.cts = getIndianCts();\n        b.is_first_login = 0;\n        if (!b.district_id && b.districts) b.district_id = b.districts;\n        if (!b.constituency_id && b.constituencyname) b.constituency_id = b.constituencyname;\n        if (!b.mandal_id && b.mandals) b.mandal_id = b.mandals;\n        if (!b.panchayat_id && (b.panchayati || b.village_id || b.panchayat)) b.panchayat_id = b.panchayati || b.village_id || b.panchayat;`
    );
  }

  // 3. Patch postpastor
  const pastorOldRegex = /(app\.post\(\['\/dashboardapi\/postpastor'[\s\S]*?p\.d_in = 0;)/;
  if (pastorOldRegex.test(content)) {
    content = content.replace(
      pastorOldRegex,
      `$1\n        p.cts = getIndianCts();\n        p.is_first_login = 0;`
    );
  }

  // 4. Patch church registration
  const churchOldRegex = /(app\.post\(\['\/dashboardapi\/postchurchregister'[\s\S]*?c\.d_in = 0;)/;
  if (churchOldRegex.test(content)) {
    content = content.replace(
      churchOldRegex,
      `$1\n        c.cts = getIndianCts();\n        c.is_first_login = 0;`
    );
  }

  // 5. Patch student registration
  const studentOldRegex = /(app\.post\(\['\/dashboardapi\/studentsignup'[\s\S]*?s\.d_in = 0;)/;
  if (studentOldRegex.test(content)) {
    content = content.replace(
      studentOldRegex,
      `$1\n        s.cts = getIndianCts();\n        s.is_first_login = 0;`
    );
  }

  // 6. Patch ministry registration
  const ministryOldRegex = /(app\.post\(\['\/dashboardapi\/postministrysignup'[\s\S]*?m\.d_in = 0;)/;
  if (ministryOldRegex.test(content)) {
    content = content.replace(
      ministryOldRegex,
      `$1\n        m.cts = getIndianCts();\n        m.is_first_login = 0;`
    );
  }

  // 7. Patch organisation registration
  const orgOldRegex = /(app\.post\(\['\/dashboardapi\/postindepedentorganisation'[\s\S]*?o\.d_in = 0;)/;
  if (orgOldRegex.test(content)) {
    content = content.replace(
      orgOldRegex,
      `$1\n        o.cts = getIndianCts();\n        o.is_first_login = 0;`
    );
  }

  // 8. Patch pastors associations
  const paOldRegex = /(app\.post\(\['\/dashboardapi\/postpastorassociations'[\s\S]*?a\.d_in = 0;)/;
  if (paOldRegex.test(content)) {
    content = content.replace(
      paOldRegex,
      `$1\n        a.cts = getIndianCts();\n        a.is_first_login = 0;`
    );
  }

  // 9. Patch postregform completely
  const postRegBlock = isTs ? `// Registration Form (reg_form) & Category Specific Tables
app.post(['/dashboardapi/postregform', '/api/postregform'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const isNamodu = body.source === 'namodu' || body.is_namodu === true || body.form_name === 'namodu' || (body.number && !body.phnumber);
        const phone = String(body.phonenum || body.phnumber || body.mobile_number || body.phone || body.number || '').trim();
        const name = String(body.name || body.studentname || body.pastorname || body.church_name || body.paname || body.ministryname || body.organisation_name || '').trim();
        const pwd = String(body.password || phone).trim();
        const whatsappPhone = String(body.whatsapp || body.whatsappno || body.whatsapp_number || body.whatsapnum || '').trim();
        const distId = body.district_id || null;
        const constId = body.constituency_id || null;
        const mandalId = body.mandal_id || null;
        const villageId = body.village_id || body.panchayat_id || null;
        const addr = body.address || '';
        const desc = body.description || '';
        const cts = getIndianCts();

        if (phone) {
            body.phonenum = phone;
            if (!body.password) {
                body.password = pwd;
            }
            body.is_first_login = 1;
            body.cts = cts;
            if (whatsappPhone) {
                body.whatsappno = whatsappPhone;
                body.whatsapp = whatsappPhone;
                body.whatsapp_number = whatsappPhone;
            }
        }

        // 1. Insert into reg_form ONLY if NOT from /namodu form
        let regFormResult: any = null;
        if (!isNamodu) {
            regFormResult = await dynamicInsert('reg_form', body);
        }

        // 2. Insert into category-specific table according to selected category
        const cat = String(body.category || '').trim().toLowerCase();
        let categoryInsertResult: any = null;
        let targetCategoryTable = '';

        try {
            if (cat === '1' || cat.includes('believer') || cat.includes('విశ్వాసి')) {
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
            } else if (cat === '2' || cat.includes('student') || cat.includes('విద్యార్థి')) {
                targetCategoryTable = 'student_reg';
                categoryInsertResult = await dynamicInsert('student_reg', {
                    cts: cts,
                    studentname: name,
                    number: phone,
                    whatsapp: whatsappPhone,
                    parentnum: phone,
                    pastornum: phone,
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
            } else if (cat === '4' || ((cat.includes('pastor') || cat.includes('పాస్టర్')) && !cat.includes('association') && !cat.includes('అసోసియేషన్'))) {
                targetCategoryTable = 'pastor_reg';
                categoryInsertResult = await dynamicInsert('pastor_reg', {
                    cts: cts,
                    pastorname: name,
                    phonenumber: phone,
                    whatsapp: whatsappPhone,
                    phonenumber2: phone,
                    pa_phonenumber: phone,
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
            } else if (cat === '5' || cat.includes('church') || cat.includes('చర్చి')) {
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
            } else if (cat === '7' || cat.includes('association') || cat.includes('అసోసియేషన్')) {
                targetCategoryTable = 'pastors_associations';
                categoryInsertResult = await dynamicInsert('pastors_associations', {
                    cts: cts,
                    paname: name,
                    headname: name,
                    phonenumber: phone,
                    whatsapp_number: whatsappPhone || phone,
                    president: phone,
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
            } else if (cat === '3' || cat.includes('ministr') || cat.includes('మినిస్ట్రీస్')) {
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
            } else if (cat === '6' || cat.includes('organization') || cat.includes('ఆర్గనైజేషన్')) {
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
            } else if (cat === '8' || cat.includes('business') || cat.includes('company') || cat.includes('ఆఫీస్') || cat.includes('కంపెనీ')) {
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
        } catch (catErr: any) {
            console.error('Category specific table insert error:', catErr?.message);
        }

        // Also insert/update users table
        if (phone) {
            try {
                await dynamicInsert('users', {
                    name: name || 'Member',
                    number: phone,
                    email: body.email || null,
                    otp: pwd,
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
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});` : `// Registration Form (reg_form) & Category Specific Tables
app.post(['/dashboardapi/postregform', '/api/postregform'], async (req, res) => {
    try {
        const body = req.body || {};
        const isNamodu = body.source === 'namodu' || body.is_namodu === true || body.form_name === 'namodu' || (body.number && !body.phnumber);
        const phone = String(body.phonenum || body.phnumber || body.mobile_number || body.phone || body.number || '').trim();
        const name = String(body.name || body.studentname || body.pastorname || body.church_name || body.paname || body.ministryname || body.organisation_name || '').trim();
        const pwd = String(body.password || phone).trim();
        const whatsappPhone = String(body.whatsapp || body.whatsappno || body.whatsapp_number || body.whatsapnum || '').trim();
        const distId = body.district_id || null;
        const constId = body.constituency_id || null;
        const mandalId = body.mandal_id || null;
        const villageId = body.village_id || body.panchayat_id || null;
        const addr = body.address || '';
        const desc = body.description || '';
        const cts = getIndianCts();

        if (phone) {
            body.phonenum = phone;
            if (!body.password) {
                body.password = pwd;
            }
            body.is_first_login = 1;
            body.cts = cts;
            if (whatsappPhone) {
                body.whatsappno = whatsappPhone;
                body.whatsapp = whatsappPhone;
                body.whatsapp_number = whatsappPhone;
            }
        }

        // 1. Insert into reg_form ONLY if NOT from /namodu form
        let regFormResult = null;
        if (!isNamodu) {
            regFormResult = await dynamicInsert('reg_form', body);
        }

        // 2. Insert into category-specific table according to selected category
        const cat = String(body.category || '').trim().toLowerCase();
        let categoryInsertResult = null;
        let targetCategoryTable = '';

        try {
            if (cat === '1' || cat.includes('believer') || cat.includes('విశ్వాసి')) {
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
            } else if (cat === '2' || cat.includes('student') || cat.includes('విద్యార్థి')) {
                targetCategoryTable = 'student_reg';
                categoryInsertResult = await dynamicInsert('student_reg', {
                    cts: cts,
                    studentname: name,
                    number: phone,
                    whatsapp: whatsappPhone,
                    parentnum: phone,
                    pastornum: phone,
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
            } else if (cat === '4' || ((cat.includes('pastor') || cat.includes('పాస్టర్')) && !cat.includes('association') && !cat.includes('అసోసియేషన్'))) {
                targetCategoryTable = 'pastor_reg';
                categoryInsertResult = await dynamicInsert('pastor_reg', {
                    cts: cts,
                    pastorname: name,
                    phonenumber: phone,
                    whatsapp: whatsappPhone,
                    phonenumber2: phone,
                    pa_phonenumber: phone,
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
            } else if (cat === '5' || cat.includes('church') || cat.includes('చర్చి')) {
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
            } else if (cat === '7' || cat.includes('association') || cat.includes('అసోసియేషన్')) {
                targetCategoryTable = 'pastors_associations';
                categoryInsertResult = await dynamicInsert('pastors_associations', {
                    cts: cts,
                    paname: name,
                    headname: name,
                    phonenumber: phone,
                    whatsapp_number: whatsappPhone || phone,
                    president: phone,
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
            } else if (cat === '3' || cat.includes('ministr') || cat.includes('మినిస్ట్రీస్')) {
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
            } else if (cat === '6' || cat.includes('organization') || cat.includes('ఆర్గనైజేషన్')) {
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
            } else if (cat === '8' || cat.includes('business') || cat.includes('company') || cat.includes('ఆఫీస్') || cat.includes('కంపెనీ')) {
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
        } catch (catErr) {
            console.error('Category specific table insert error:', catErr?.message);
        }

        // Also insert/update users table
        if (phone) {
            try {
                await dynamicInsert('users', {
                    name: name || 'Member',
                    number: phone,
                    email: body.email || null,
                    otp: pwd,
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
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});`;

  content = content.replace(
    /\/\/ Registration Form \(reg_form\) & Category Specific Tables\s*app\.post\(\['\/dashboardapi\/postregform', '\/api\/postregform'\][\s\S]*?res\.status\(500\)\.json\(\{ status: 500, error: err\.message \}\);\s*\}\s*\}\);/,
    postRegBlock
  );

  // 10. Patch categoryTables in login to select is_first_login
  content = content.replace(
    /query:\s*'SELECT id, CONCAT\(fname, \\" \\", COALESCE\(lname, \\"\\"\)\) as name, mobile_number, email, password FROM signup_form WHERE mobile_number = \? AND password = \?'/,
    "query: 'SELECT id, CONCAT(fname, \" \", COALESCE(lname, \"\")) as name, mobile_number, email, password, is_first_login FROM signup_form WHERE mobile_number = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, studentname as name, number as mobile_number, null as email, password FROM student_reg WHERE number = \? AND password = \?'/,
    "query: 'SELECT id, studentname as name, number as mobile_number, null as email, password, is_first_login FROM student_reg WHERE number = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, ministryname as name, headnmber as mobile_number, ministryemail as email, password FROM ministry_signup WHERE headnmber = \? AND password = \?'/,
    "query: 'SELECT id, ministryname as name, headnmber as mobile_number, ministryemail as email, password, is_first_login FROM ministry_signup WHERE headnmber = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, pastorname as name, phonenumber as mobile_number, null as email, password FROM pastor_reg WHERE phonenumber = \? AND password = \?'/,
    "query: 'SELECT id, pastorname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastor_reg WHERE phonenumber = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, church_name as name, contactnumber as mobile_number, null as email, password FROM church_reg WHERE contactnumber = \? AND password = \?'/,
    "query: 'SELECT id, church_name as name, contactnumber as mobile_number, null as email, password, is_first_login FROM church_reg WHERE contactnumber = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, organisation_name as name, contact_num as mobile_number, email, password FROM independentorganisation_reg WHERE contact_num = \? AND password = \?'/,
    "query: 'SELECT id, organisation_name as name, contact_num as mobile_number, email, password, is_first_login FROM independentorganisation_reg WHERE contact_num = ? AND password = ?'"
  );
  content = content.replace(
    /query:\s*'SELECT id, paname as name, phonenumber as mobile_number, null as email, password FROM pastors_associations WHERE phonenumber = \? AND password = \?'/,
    "query: 'SELECT id, paname as name, phonenumber as mobile_number, null as email, password, is_first_login FROM pastors_associations WHERE phonenumber = ? AND password = ?'"
  );

  // 11. In login response: only return 201 (first_login) if user.is_first_login == 1
  content = content.replace(
    /if \(rows && rows\.length > 0\) \{\s*return res\.json\(\{ status: 200, message: 'Login successful', data: \[formatUser\(rows\[0\], cfg\.category_id, cfg\.category_name\)\] \}\);\s*\}/,
    `if (rows && rows.length > 0) {
                const user = rows[0];
                const userObj = formatUser(user, cfg.category_id, cfg.category_name);
                if (user.is_first_login == 1) {
                    return res.json({ status: 201, first_login: true, message: 'First login detected. You can change password now or continue.', data: [userObj] });
                }
                return res.json({ status: 200, message: 'Login successful', data: [userObj] });
            }`
  );

  // Also replace in category fallback loop
  content = content.replace(
    /if \(rows && rows\.length > 0\) \{\s*return res\.json\(\{ status: 200, message: 'Login successful', data: \[formatUser\(rows\[0\], cfg\.category_id, cfg\.category_name\)\] \}\);\s*\}/,
    `if (rows && rows.length > 0) {
                const user = rows[0];
                const userObj = formatUser(user, cfg.category_id, cfg.category_name);
                if (user.is_first_login == 1) {
                    return res.json({ status: 201, first_login: true, message: 'First login detected. You can change password now or continue.', data: [userObj] });
                }
                return res.json({ status: 200, message: 'Login successful', data: [userObj] });
            }`
  );

  // In reg_form check: only return 201 if targetMember.is_first_login == 1
  content = content.replace(
    /const isInitialPwd = \(pwd === phone \|\| targetMember\.password === phone \|\| targetMember\.is_first_login == 1\);/,
    "const isInitialPwd = (targetMember.is_first_login == 1);"
  );

  // 12. In password updates: reset is_first_login = 0 across category tables
  const updatePassAll = `await db.query('UPDATE users SET otp = ? WHERE number = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE signup_form SET password = ?, is_first_login = 0 WHERE mobile_number = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE student_reg SET password = ?, is_first_login = 0 WHERE number = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE pastor_reg SET password = ?, is_first_login = 0 WHERE phonenumber = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE church_reg SET password = ?, is_first_login = 0 WHERE contactnumber = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE pastors_associations SET password = ?, is_first_login = 0 WHERE phonenumber = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE ministry_signup SET password = ?, is_first_login = 0 WHERE headnmber = ?', [newPassword, phone]).catch(() => {});
        await db.query('UPDATE independentorganisation_reg SET password = ?, is_first_login = 0 WHERE contact_num = ?', [newPassword, phone]).catch(() => {});`;

  content = content.replace(
    /await db\.query\('UPDATE users SET otp = \? WHERE number = \?', \[newPassword, phone\]\)\.catch\(\(\) => \{\}\);\s*await db\.query\('UPDATE signup_form SET password = \? WHERE mobile_number = \?', \[newPassword, phone\]\)\.catch\(\(\) => \{\}\);\s*await db\.query\('UPDATE belivers_tbl SET password = \? WHERE mobile_number = \?', \[newPassword, phone\]\)\.catch\(\(\) => \{\}\);/,
    updatePassAll
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully patched ${filePath}`);
}

patchServerFile('c:/Users/rajes/Documents/jbac_web/backend/server.ts', true);
patchServerFile('c:/Users/rajes/Documents/jbac_web/backend/server.js', false);
