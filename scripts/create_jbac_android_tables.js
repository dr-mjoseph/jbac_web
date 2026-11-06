const https = require('https');

function runSql(query) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      adminUsername: 'admin',
      adminPassword: 'JbacAdmin@2026',
      query: query
    });

    const req = https.request('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const tables = [
  {
    name: 'jbac_users',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_users\` (
      \`uid\` VARCHAR(128) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(255) NOT NULL,
      \`name\` VARCHAR(255) DEFAULT NULL,
      \`phone\` VARCHAR(50) DEFAULT NULL,
      \`role\` VARCHAR(50) DEFAULT 'user',
      \`timestamp\` BIGINT DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'jbac_news',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_news\` (
      \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(500) NOT NULL,
      \`content\` LONGTEXT,
      \`image_url\` VARCHAR(1000) DEFAULT NULL,
      \`video_url\` VARCHAR(1000) DEFAULT NULL,
      \`timestamp\` BIGINT DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'jbac_meetings',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_meetings\` (
      \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(500) NOT NULL,
      \`date_time\` VARCHAR(100) DEFAULT NULL,
      \`venue_name\` VARCHAR(500) DEFAULT NULL,
      \`venue_query\` VARCHAR(500) DEFAULT NULL,
      \`timestamp\` BIGINT DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'jbac_branches',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_branches\` (
      \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(500) NOT NULL,
      \`address\` TEXT,
      \`pastor_name\` VARCHAR(255) DEFAULT NULL,
      \`phone\` VARCHAR(50) DEFAULT NULL,
      \`latitude\` DECIMAL(10, 8) DEFAULT NULL,
      \`longitude\` DECIMAL(11, 8) DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'jbac_prayer_requests',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_prayer_requests\` (
      \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
      \`user_id\` VARCHAR(128) NOT NULL,
      \`user_name\` VARCHAR(255) DEFAULT NULL,
      \`request\` TEXT NOT NULL,
      \`timestamp\` BIGINT DEFAULT NULL,
      \`status\` VARCHAR(50) DEFAULT 'pending',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_prayer_uid\` (\`user_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    name: 'jbac_chat_messages',
    ddl: `CREATE TABLE IF NOT EXISTS \`jbac_chat_messages\` (
      \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
      \`sender_id\` VARCHAR(128) NOT NULL,
      \`receiver_id\` VARCHAR(128) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`timestamp\` BIGINT DEFAULT NULL,
      \`read_status\` TINYINT(1) DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_chat_sender\` (\`sender_id\`),
      INDEX \`idx_chat_receiver\` (\`receiver_id\`),
      INDEX \`idx_chat_pair\` (\`sender_id\`, \`receiver_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  }
];

(async () => {
  for (const t of tables) {
    console.log(`Creating table ${t.name}...`);
    try {
      const res = await runSql(t.ddl);
      console.log(`Success ${t.name}:`, res);
    } catch (e) {
      console.error(`Error on ${t.name}:`, e.message);
    }
  }

  console.log('\nVerifying tables created:');
  const verifyRes = await runSql("SHOW TABLES LIKE 'jbac_%'");
  console.log(verifyRes);
})();

