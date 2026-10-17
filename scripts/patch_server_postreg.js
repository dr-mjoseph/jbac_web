const fs = require('fs');

const serverTsPath = 'c:/Users/rajes/Documents/jbac_web/backend/server.ts';
let tsContent = fs.readFileSync(serverTsPath, 'utf8');

const targetOldBlock = `// Registration Form (reg_form)
app.post(['/dashboardapi/postregform', '/api/postregform'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        body.d_in = 0;
        const phone = String(body.phonenum || body.phnumber || body.mobile_number || body.phone || body.number || '').trim();
        if (phone) {
            body.phonenum = phone;
            if (!body.password) {
                body.password = phone;
            }
            if (body.is_first_login === undefined || body.is_first_login === null) {
                body.is_first_login = 1;
            }
        }
        const result = await dynamicInsert('reg_form', body);
        res.json({
            status: 200,
            message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.',
            insertId: result?.insertId
        });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});`;

const replacementNewBlock = `// Registration Form (reg_form) & Category Specific Tables
app.post(['/dashboardapi/postregform', '/api/postregform'], async (req: any, res: any) => {
    try {
        const body = req.body || {};
        const phone = String(body.phonenum || body.phnumber || body.mobile_number || body.phone || body.number || '').trim();
        const name = String(body.name || body.studentname || body.pastorname || body.church_name || body.paname || body.ministryname || body.organisation_name || '').trim();
        const pwd = String(body.password || phone).trim();
        const distId = body.district_id || null;
        const constId = body.constituency_id || null;
        const mandalId = body.mandal_id || null;
        const villageId = body.village_id || body.panchayat_id || null;
        const addr = body.address || '';
        const desc = body.description || '';

        if (phone) {
            body.phonenum = phone;
            if (!body.password) {
                body.password = pwd;
            }
            if (body.is_first_login === undefined || body.is_first_login === null) {
                body.is_first_login = 1;
            }
        }

        // 1. Always insert into reg_form (primary registration table)
        const regFormResult = await dynamicInsert('reg_form', body);

        // 2. Insert into category-specific table according to selected category (e.g. namodu / entry)
        const cat = String(body.category || '').trim().toLowerCase();
        let categoryInsertResult: any = null;
        let targetCategoryTable = '';

        try {
            // Student: "2" or contains "??????????" or "student"
            if (cat === '2' || cat.includes('??????????') || cat.includes('student')) {
                targetCategoryTable = 'student_reg';
                categoryInsertResult = await dynamicInsert('student_reg', {
                    studentname: name,
                    number: phone,
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
                    approval_ind: 0
                });
            }
            // Pastor: "4" or contains "???????" / "pastor" (excluding association)
            else if (cat === '4' || ((cat.includes('???????') || cat.includes('pastor')) && !cat.includes('??????????') && !cat.includes('association'))) {
                targetCategoryTable = 'pastor_reg';
                categoryInsertResult = await dynamicInsert('pastor_reg', {
                    pastorname: name,
                    phonenumber: phone,
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
                    approval_ind: 0
                });
            }
            // Church: "5" or contains "?????" / "church"
            else if (cat === '5' || cat.includes('?????') || cat.includes('church')) {
                targetCategoryTable = 'church_reg';
                categoryInsertResult = await dynamicInsert('church_reg', {
                    church_name: name,
                    contactnumber: phone,
                    district_id: distId,
                    constituency_id: constId,
                    mandal_id: mandalId,
                    village_id: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    term: body.term ? String(body.term) : '1',
                    d_in: 0,
                    approval_ind: 0
                });
            }
            // Pastors Association: "7" or contains "??????????" / "association"
            else if (cat === '7' || cat.includes('??????????') || cat.includes('association')) {
                targetCategoryTable = 'pastors_associations';
                categoryInsertResult = await dynamicInsert('pastors_associations', {
                    paname: name,
                    headname: name,
                    phonenumber: phone,
                    whatsapp_number: body.whatsapnum || phone,
                    president: phone,
                    districtname: distId,
                    constituencyname: constId,
                    mandals: mandalId,
                    panchaiti: villageId,
                    address: addr,
                    description: desc,
                    password: pwd,
                    terms: 'YES',
                    d_in: 0
                });
            }
            // Ministries: "3" or contains "????????????" / "ministr"
            else if (cat === '3' || cat.includes('????????????') || cat.includes('ministr')) {
                targetCategoryTable = 'ministry_signup';
                categoryInsertResult = await dynamicInsert('ministry_signup', {
                    ministryname: name,
                    headname: name,
                    headnmber: phone,
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
                    approval_ind: 0
                });
            }
            // Christian Organization / Independent Organisation: "6" or contains "???????????" / "organization"
            else if (cat === '6' || cat.includes('???????????') || cat.includes('organization')) {
                targetCategoryTable = 'independentorganisation_reg';
                categoryInsertResult = await dynamicInsert('independentorganisation_reg', {
                    organisation_name: name,
                    contact_num: phone,
                    districts: distId,
                    constituencyname: constId,
                    mandals: mandalId,
                    panchayati: villageId,
                    org_address: addr,
                    description: desc,
                    password: pwd,
                    d_in: 0,
                    approval_ind: 0
                });
            }
            // Business / Office / Company: "8" or contains "?????" / "??????" / "business"
            else if (cat === '8' || cat.includes('?????') || cat.includes('??????') || cat.includes('business')) {
                targetCategoryTable = 'business_table';
                categoryInsertResult = await dynamicInsert('business_table', {
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
            console.error('Category table insert error:', catErr?.message);
        }

        res.json({
            status: 200,
            message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.',
            insertId: regFormResult?.insertId,
            categoryTable: targetCategoryTable || 'reg_form',
            categoryInsertId: categoryInsertResult?.insertId || null
        });
    } catch (err: any) {
        res.status(500).json({ status: 500, error: err.message });
    }
});`;

if (tsContent.includes(targetOldBlock)) {
    tsContent = tsContent.replace(targetOldBlock, replacementNewBlock);
    fs.writeFileSync(serverTsPath, tsContent, 'utf8');
    console.log('Successfully updated server.ts!');
} else {
    console.log('Could not find targetOldBlock in server.ts');
}
