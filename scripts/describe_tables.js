const path = require('path');
const mysql = require(path.join(__dirname, '../backend/node_modules/mysql2/promise'));
(async () => {
    const conn = await mysql.createConnection({
        host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
        user: 'admin',
        password: 'biUt2TrZ9EZAqn6GXhiA',
        database: 'jbac_jbac'
    });
    console.log('=== INSTITUTES ROWS ===');
    const [instRows] = await conn.query('SELECT id, institutename, image, course_offered, college_type, cts FROM institutes');
    console.log(instRows);

    console.log('=== HELPS ROWS ===');
    const [helpRows] = await conn.query('SELECT id, help, description, image, cts FROM helps');
    console.log(helpRows);

    console.log('=== INDEPENDENTORGANISATION_REG ROWS ===');
    const [orgRows] = await conn.query('SELECT id, organisation_name, image, cts FROM independentorganisation_reg');
    console.log(orgRows);

    await conn.end();
})();
