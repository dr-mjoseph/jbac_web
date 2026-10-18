const fs = require('fs');

const sqlPath = 'c:/Users/rajes/Documents/jbac_web/database/jbac_structure.sql';
let sql = fs.readFileSync(sqlPath, 'utf8');

// 1. student_reg
// Add `cts` after id, `whatsapp` after number, `is_first_login`
sql = sql.replace(
  /CREATE TABLE `student_reg` \(\s*`id` int NOT NULL AUTO_INCREMENT,\s*`i_ts`/,
  "CREATE TABLE `student_reg` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cts` varchar(255) DEFAULT NULL,\n  `i_ts`"
);
sql = sql.replace(
  /`number` varchar\(255\) DEFAULT NULL,\s*`parentnum`/,
  "`number` varchar(255) DEFAULT NULL,\n  `whatsapp` varchar(25) DEFAULT NULL,\n  `parentnum`"
);
sql = sql.replace(
  /`password` varchar\(255\) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\s*PRIMARY KEY \(`id`\)/,
  "`password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 2. pastor_reg
sql = sql.replace(
  /CREATE TABLE `pastor_reg` \(\s*`id` int NOT NULL AUTO_INCREMENT,\s*`i_ts`/,
  "CREATE TABLE `pastor_reg` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cts` varchar(255) DEFAULT NULL,\n  `i_ts`"
);
sql = sql.replace(
  /`phonenumber` varchar\(255\) DEFAULT NULL,\s*`description`/,
  "`phonenumber` varchar(255) DEFAULT NULL,\n  `whatsapp` varchar(25) DEFAULT NULL,\n  `description`"
);
sql = sql.replace(
  /`retypepassword` varchar\(255\) DEFAULT NULL,\s*PRIMARY KEY \(`id`\)/,
  "`retypepassword` varchar(255) DEFAULT NULL,\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 3. church_reg
sql = sql.replace(
  /`contactnumber` varchar\(255\) NOT NULL,\s*`d_in`/,
  "`contactnumber` varchar(255) NOT NULL,\n  `whatsapp` varchar(25) DEFAULT NULL,\n  `d_in`"
);
sql = sql.replace(
  /`term` varchar\(255\) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'No',\s*`approval_ind` int NOT NULL DEFAULT '0',\s*PRIMARY KEY \(`id`\)/,
  "`term` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'No',\n  `approval_ind` int NOT NULL DEFAULT '0',\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 4. pastors_associations
sql = sql.replace(
  /CREATE TABLE `pastors_associations` \(\s*`id` int NOT NULL AUTO_INCREMENT,\s*`paname`/,
  "CREATE TABLE `pastors_associations` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cts` varchar(255) DEFAULT NULL,\n  `paname`"
);
sql = sql.replace(
  /`d_in` int NOT NULL DEFAULT '0',\s*PRIMARY KEY \(`id`\)/,
  "`d_in` int NOT NULL DEFAULT '0',\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 5. ministry_signup
sql = sql.replace(
  /CREATE TABLE `ministry_signup` \(\s*`id` int NOT NULL AUTO_INCREMENT,\s*`dts`/,
  "CREATE TABLE `ministry_signup` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cts` varchar(255) DEFAULT NULL,\n  `dts`"
);
sql = sql.replace(
  /`headnmber` varchar\(255\) DEFAULT NULL,\s*`description`/,
  "`headnmber` varchar(255) DEFAULT NULL,\n  `whatsapp` varchar(25) DEFAULT NULL,\n  `description`"
);
sql = sql.replace(
  /`terms` varchar\(255\) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\s*PRIMARY KEY \(`id`\)/,
  "`terms` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 6. independentorganisation_reg
sql = sql.replace(
  /CREATE TABLE `independentorganisation_reg` \(\s*`id` int NOT NULL AUTO_INCREMENT,\s*`ctsdate`/,
  "CREATE TABLE `independentorganisation_reg` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `cts` varchar(255) DEFAULT NULL,\n  `ctsdate`"
);
sql = sql.replace(
  /`contact_num` varchar\(255\) DEFAULT NULL,\s*`email`/,
  "`contact_num` varchar(255) DEFAULT NULL,\n  `whatsapp` varchar(25) DEFAULT NULL,\n  `email`"
);
sql = sql.replace(
  /`approval_ind` int NOT NULL DEFAULT '0',\s*PRIMARY KEY \(`id`\)/,
  "`approval_ind` int NOT NULL DEFAULT '0',\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

// 7. signup_form
sql = sql.replace(
  /`from_signup` varchar\(11\) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\s*PRIMARY KEY \(`id`\)/,
  "`from_signup` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,\n  `is_first_login` tinyint(1) DEFAULT '0',\n  PRIMARY KEY (`id`)"
);

fs.writeFileSync(sqlPath, sql, 'utf8');
console.log('Successfully updated database/jbac_structure.sql');
