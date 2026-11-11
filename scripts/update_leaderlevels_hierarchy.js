const mysql = require('../backend/node_modules/mysql2/promise');

(async () => {
  const db = mysql.createPool({
    host: process.env.DB_HOST || 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA',
    database: (process.env.DB_NAME && process.env.DB_NAME !== 'sys') ? process.env.DB_NAME : 'jbac_jbac',
    charset: 'utf8mb4'
  });

  const levels = [
    { id: 1, level: 'జిల్లా నాయకుడు' },
    { id: 2, level: 'నియోజకవర్గం నాయకుడు' },
    { id: 3, level: 'మండల నాయకుడు' },
    { id: 4, level: 'పంచాయతి నాయకుడు' },
    { id: 5, level: 'వార్డు నాయకుడు' },
    { id: 6, level: 'సబ్-వార్డు నాయకుడు' }
  ];

  try {
    console.log('Updating leaderlevel table (removing State level, starting 1..6 from District)...');
    for (const row of levels) {
      const [existing] = await db.query('SELECT id FROM leaderlevel WHERE id = ?', [row.id]);
      if (existing.length > 0) {
        await db.query('UPDATE leaderlevel SET level = ?, d_in = 0 WHERE id = ?', [row.level, row.id]);
      } else {
        await db.query('INSERT INTO leaderlevel (id, level, d_in) VALUES (?, ?, 0)', [row.id, row.level]);
      }
    }
    await db.query('UPDATE leaderlevel SET d_in = 1 WHERE id NOT IN (1, 2, 3, 4, 5, 6)');

    console.log('Updating leader_levels table...');
    for (const row of levels) {
      const [existing] = await db.query('SELECT id FROM leader_levels WHERE id = ?', [row.id]);
      if (existing.length > 0) {
        await db.query('UPDATE leader_levels SET level_name = ?, level = ?, d_in = 0 WHERE id = ?', [row.level, row.level, row.id]);
      } else {
        await db.query('INSERT INTO leader_levels (id, level_name, level, d_in) VALUES (?, ?, ?, 0)', [row.id, row.level, row.level]);
      }
    }
    await db.query('UPDATE leader_levels SET d_in = 1 WHERE id NOT IN (1, 2, 3, 4, 5, 6)');

    const [verify1] = await db.query('SELECT id, level, d_in FROM leaderlevel WHERE d_in = 0 ORDER BY id ASC');
    const [verify2] = await db.query('SELECT id, level_name, level, d_in FROM leader_levels WHERE d_in = 0 ORDER BY id ASC');
    console.log('Verified leaderlevel:', verify1);
    console.log('Verified leader_levels:', verify2);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
  process.exit(0);
})();

