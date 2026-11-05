const mysql = require('../backend/node_modules/mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
      user: 'admin',
      password: 'biUt2TrZ9EZAqn6GXhiA',
      database: 'jbac_jbac'
    });

    console.log('Testing business_types query...');
    const [btypes] = await conn.query('SELECT * FROM business_types WHERE d_in = 0 LIMIT 3');
    console.log('Business types sample:', btypes);

    console.log('Testing sample insert into entrepreneur_reg...');
    const [eRes] = await conn.query(`
      INSERT INTO entrepreneur_reg (
        name, mobile, email, state_id, district_id, state_name, district_name,
        business_state_id, business_district_id, business_state_name, business_district_name,
        business_type_id, business_type, denomination_id, denomination,
        self_fund, capital_need, description
      ) VALUES (
        'Test Entrepreneur', '9876543210', 'test.entrepreneur@example.com', 1, 5, 'Andhra Pradesh', 'Guntur',
        1, 5, 'Andhra Pradesh', 'Guntur',
        1, 'వ్యవసాయం & అనుబంధ రంగాలు - Agriculture & Allied', 1, 'అసెంబ్లీ ఆఫ్ గాడ్-Assembly of God',
        '2,00,000', '10,00,000', 'Organic farming startup'
      )
    `);
    console.log('Entrepreneur insert id:', eRes.insertId);

    console.log('Testing sample insert into investor_reg...');
    const [iRes] = await conn.query(`
      INSERT INTO investor_reg (
        name, mobile, email, state_id, district_id, state_name, district_name,
        business_type_id, business_type, denomination_id, denomination,
        capital_to_invest, description
      ) VALUES (
        'Test Investor', '9123456780', 'test.investor@example.com', 2, 31, 'Telangana', 'Hyderabad',
        1, 'వ్యవసాయం & అనుబంధ రంగాలు - Agriculture & Allied', 2, 'బాప్టిస్ట్-BAPTIST',
        '15,00,000', 'Interested in funding agro tech startups'
      )
    `);
    console.log('Investor insert id:', iRes.insertId);

    // Verify retrieval
    const [eList] = await conn.query('SELECT id, name, mobile, business_type, capital_need FROM entrepreneur_reg WHERE id = ?', [eRes.insertId]);
    console.log('Retrieved entrepreneur:', eList[0]);

    const [iList] = await conn.query('SELECT id, name, mobile, business_type, capital_to_invest FROM investor_reg WHERE id = ?', [iRes.insertId]);
    console.log('Retrieved investor:', iList[0]);

    await conn.end();
    console.log('Database test completed with 100% success!');
  } catch (err) {
    console.error('Test error:', err);
  }
})();
