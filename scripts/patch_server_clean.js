const fs = require('fs');

const serverJsPath = 'c:/Users/rajes/Documents/jbac_web/backend/server.js';
let jsContent = fs.readFileSync(serverJsPath, 'utf8');

// Replace the postregform handler with clean code using Unicode escapes + IDs
const startMarker = "app.post(['/dashboardapi/postregform', '/api/postregform'], async (req, res) => {";
const endMarker = "// Family Members by Mobile Number (for Multi-Family Member Registrations)";

const startIndex = jsContent.indexOf(startMarker);
const endIndex = jsContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newHandler = `app.post(['/dashboardapi/postregform', '/api/postregform'], async (req, res) => {
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
        let categoryInsertResult = null;
        let targetCategoryTable = '';

        // Helper unicode identifiers:
        // Student: "2", "student", or "\u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C3F"
        // Pastor: "4", "pastor", or "\u0C2A\u0C3E\u0C38\u0C4D\u0C1F\u0C30\u0C4D"
        // Church: "5", "church", or "\u0C1A\u0C30\u0C4D\u0C1A\u0C3F"
        // Pastors Association: "7", "association", or "\u0C05\u0C38\u0C4B\u0C38\u0C3F\u0C2F\u0C47\u0C37\u0C28\u0C4D"
        // Ministries: "3", "ministry", "ministries", or "\u0C2E\u0C3F\u0C28\u0C3F\u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C40\u0C38\u0C4D"
        // Christian Org: "6", "organization", or "\u0C06\u0C30\u0C4D\u0C17\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D"
        // Business: "8", "business", "company", "\u0C06\u0C2B\u0C40\u0C38\u0C4D", or "\u0C15\u0C02\u0C2A\u0C46\u0C28\u0C40"
        try {
            if (cat === '2' || cat.includes('student') || cat.includes('\u0C35\u0C3F\u0C26\u0C4D\u0C2F\u0C3E\u0C30\u0C4D\u0C25\u0C3F')) {
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
            } else if (cat === '4' || ((cat.includes('pastor') || cat.includes('\u0C2A\u0C3E\u0C38\u0C4D\u0C1F\u0C30\u0C4D')) && !cat.includes('association') && !cat.includes('\u0C05\u0C38\u0C4B\u0C38\u0C3F\u0C2F\u0C47\u0C37\u0C28\u0C4D'))) {
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
            } else if (cat === '5' || cat.includes('church') || cat.includes('\u0C1A\u0C30\u0C4D\u0C1A\u0C3F')) {
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
            } else if (cat === '7' || cat.includes('association') || cat.includes('\u0C05\u0C38\u0C4B\u0C38\u0C3F\u0C2F\u0C47\u0C37\u0C28\u0C4D')) {
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
            } else if (cat === '3' || cat.includes('ministr') || cat.includes('\u0C2E\u0C3F\u0C28\u0C3F\u0C38\u0C4D\u0C1F\u0C4D\u0C30\u0C40\u0C38\u0C4D')) {
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
            } else if (cat === '6' || cat.includes('organization') || cat.includes('\u0C06\u0C30\u0C4D\u0C17\u0C28\u0C48\u0C1C\u0C47\u0C37\u0C28\u0C4D')) {
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
            } else if (cat === '8' || cat.includes('business') || cat.includes('company') || cat.includes('\u0C06\u0C2B\u0C40\u0C38\u0C4D') || cat.includes('\u0C15\u0C02\u0C2A\u0C46\u0C28\u0C40')) {
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
        } catch (catErr) {
            console.error('Category specific table insert error:', catErr?.message);
        }

        res.json({
            status: 200,
            message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.',
            insertId: regFormResult?.insertId,
            categoryTable: targetCategoryTable || 'reg_form',
            categoryInsertId: categoryInsertResult?.insertId || null
        });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

`;
    jsContent = jsContent.slice(0, startIndex) + newHandler + jsContent.slice(endIndex);
    fs.writeFileSync(serverJsPath, jsContent, 'utf8');
    console.log('Successfully updated server.js with unicode-safe handlers!');
} else {
    console.log('Could not find markers:', startIndex, endIndex);
}
