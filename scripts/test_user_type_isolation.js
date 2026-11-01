const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));

async function test() {
    console.log("=== Testing User Type Isolation Logic in Node.js ===");
    const conn = await mysql.createConnection({
        host: "jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com",
        user: "admin",
        password: "biUt2TrZ9EZAqn6GXhiA",
        database: "jbac_jbac"
    });
    console.log("[DB] Connected to RDS successfully.");

    const [pastors] = await conn.query(`
        SELECT pr.id, pr.pastorname, pr.generaltype, pr.leadertype, pr.district_id, pr.constituency_id
        FROM pastor_reg pr
        WHERE pr.district_id = 40
          AND (pr.generaltype = 2 OR pr.generaltype = '2' OR pr.generaltype = 'Constituency')
          AND (COALESCE(pr.leadertype, '1') != '2' AND (pr.wingtypes IS NULL OR pr.wingtypes IN ('', 'null', 'undefined')))
          AND COALESCE(pr.approval_ind, 0) != 2
          AND pr.id != 1438
    `);

    console.log(`Subordinate pastors count: ${pastors.length}`);
    pastors.forEach(p => {
        console.log(`  - Pastor: ID=${p.id}, Name=${p.pastorname}, level=${p.generaltype}`);
    });

    if (pastors.length === 1 && pastors[0].pastorname === 'sample1') {
        console.log("[VERIFIED] Subordinate query returns strictly sample1 for Pastor Sample.");
    } else {
        console.error("[FAILED] Unexpected count or pastor");
    }

    await conn.end();
}

test().catch(err => console.error(err));
