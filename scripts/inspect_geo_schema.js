const mysql = require('../backend/node_modules/mysql2/promise');

async function run() {
    const conn = await mysql.createConnection({
        host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
        user: 'admin',
        password: process.env.RDS_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA',
        database: 'jbac_jbac'
    });
    
    for (const t of ['dstrct', 'const_dtl_t', 'mndls_lst_t', 'pnchyt_lst_t']) {
        const [[{ minId, maxId, count }]] = await conn.query(`SELECT MIN(id) as minId, MAX(id) as maxId, COUNT(*) as count FROM \`${t}\``);
        console.log(`${t}: count=${count}, minId=${minId}, maxId=${maxId}`);
    }

    const [dists] = await conn.query('SELECT id, distrct_nm FROM dstrct ORDER BY id ASC');
    console.log('\nAll current districts in dstrct:');
    dists.forEach(d => console.log(`  ID ${d.id}: ${d.distrct_nm}`));

    await conn.end();
}
run().catch(console.error);
