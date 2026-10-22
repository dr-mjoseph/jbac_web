# AWS RDS MySQL Database Connection Guide

This document contains the official connection details and configuration guides for the JBAC live production database on AWS RDS.

---

## 📌 Active Database Details

| Parameter | Value |
| :--- | :--- |
| **AWS RDS Instance ID** | `jbac-mysql-db-v3` |
| **AWS Region** | `ap-southeast-2` (Asia Pacific - Sydney) |
| **Database Engine** | MySQL Community 8.0 / 8.4 |
| **Endpoint / Hostname** | `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com` |
| **Direct IP Address** | `13.236.218.42` |
| **Port** | `3306` |
| **Master Username** | `admin` |
| **Master Password** | `biUt2TrZ9EZAqn6GXhiA` |
| **Default Database / Schema** | `jbac_jbac` |
| **Storage Encryption** | AWS KMS (`alias/aws/rds`) enabled at rest |
| **Public Accessibility** | Yes (`PubliclyAccessible: true`) |
| **Security Group** | Allows Inbound TCP `3306` |

---

## ⚠️ Important Note on Decommissioned Instances

- **`jbac-mysql-db-v2`** and **`jbac-mysql-db`** were permanently decommissioned and deleted following zero-downtime storage encryption and cost-optimization migrations.
- If any client attempts to connect to `jbac-mysql-db-v2.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`, Windows will return:
  ```text
  Unknown MySQL server host 'jbac-mysql-db-v2...' (11001)
  ```
- **Fix**: Always use the active **`jbac-mysql-db-v3...`** endpoint or direct IP `13.236.218.42`.

---

## 🛠️ Connection Setup Guides

### 1. MySQL Workbench
1. Open **MySQL Workbench**.
2. Click the **`+`** icon next to **MySQL Connections** (or right-click your existing connection tile and select **Edit Connection**).
3. Set the following parameters:
   - **Connection Name**: `JBAC AWS RDS MySQL (v3)`
   - **Connection Method**: `Standard (TCP/IP)`
   - **Hostname**: `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com` *(or `13.236.218.42`)*
   - **Port**: `3306`
   - **Username**: `admin`
   - **Password**: Click **Store in Vault...** and enter `biUt2TrZ9EZAqn6GXhiA`
   - **Default Schema**: `jbac_jbac`
4. Click **Test Connection**. You should see **"Successfully made the MySQL connection"**.
5. Click **OK** to save and open.

---

### 2. DBeaver / Navicat / VS Code Database Extension
- **Host**: `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`
- **Port**: `3306`
- **Database**: `jbac_jbac`
- **Username**: `admin`
- **Password**: `biUt2TrZ9EZAqn6GXhiA`

---

### 3. Node.js Connection String (mysql2 / sequelize / knex)
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA',
  database: process.env.DB_NAME || 'jbac_jbac',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

URI format:
```text
mysql://admin:biUt2TrZ9EZAqn6GXhiA@jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com:3306/jbac_jbac
```

---

### 4. AWS Lambda Environment Variables (`jbac-backend-api`)
```json
{
  "DB_HOST": "jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com",
  "DB_PORT": "3306",
  "DB_USER": "admin",
  "DB_PASSWORD": "biUt2TrZ9EZAqn6GXhiA",
  "DB_NAME": "jbac_jbac"
}
```

---

### 5. Web-Based Cockpit & SQL Query Console (`jbac.in/admin`)
You can query, explore, and manipulate the AWS RDS database directly from any desktop or mobile web browser without installing MySQL Workbench or DBeaver:

- **Primary Custom Domain**: [https://www.jbac.in/admin](https://www.jbac.in/admin) *(or [https://jbac.in/admin](https://jbac.in/admin))*
- **Alternative Path**: [https://www.jbac.in/public.html](https://www.jbac.in/public.html) *(or [https://jbac.in/public.html](https://jbac.in/public.html))*
- **Direct AWS Lambda Endpoint**: [https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin](https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin)
- **Local File**: [`public.html`](public.html) *(Double-click to open in browser)*

#### 🔐 Security & Access Credentials:
Access to the Cockpit and all query execution APIs is guarded by a unified authentication gate:
* **Admin Unique ID**: `admin`
* **Admin Password**: `JbacAdmin@2026`
* **Session Security**: Authenticated via SHA-256 session token stored in browser session and verified on each request.

#### Programmatic Query API:
You can also execute custom SQL queries programmatically via HTTP REST with your admin credentials or token:
* **Method**: `POST`
* **URL**: `https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query`
* **Headers**:
  - `Content-Type: application/json`
  - `x-admin-auth: <token>` *(obtained from `POST /dashboardapi/admin-login`)* or HTTP Basic Auth (`admin:JbacAdmin@2026`)
* **Body**:
  ```json
  {
    "query": "SELECT COUNT(*) as active_users FROM users"
  }
  ```
* **Sample Response**:
  ```json
  {
    "success": true,
    "type": "SELECT",
    "rowCount": 1,
    "fields": ["active_users"],
    "data": [{ "active_users": 66 }],
    "durationMs": 30
  }
  ```

#### 📥 How to Export Database Tables (CSV & JSON):
You can export any of the 89 database tables to spreadsheet (CSV) or JSON format directly from the browser:

##### Method 1: 1-Click Table Export (Tables & Schema Explorer)
1. Sign in to [https://jbac.in/admin](https://jbac.in/admin) with `admin` / `JbacAdmin@2026`.
2. Navigate to the **"🗄️ Tables & Schema Explorer"** tab.
3. Select any table from the left sidebar (e.g., `signup_form`, `pastor_reg`, `church_reg`, `events`, `student_reg`, `users`).
4. On the top toolbar right next to `➕ New Record`, click:
   - **`📥 Export CSV`**: Exports the entire table to a `.csv` spreadsheet file with UTF-8 BOM encoding for seamless Microsoft Excel and Google Sheets viewing.
   - **`📥 Export JSON`**: Exports all records to a formatted `.json` file.
5. The browser will automatically save the file named `jbac_<tablename>_export_<timestamp>.csv` (or `.json`).

##### Method 2: Custom Export via SQL Query Console
1. Navigate to the **"⚡ SQL Query Console"** tab.
2. Enter your custom SQL query (e.g., `SELECT * FROM signup_form;` or `SELECT id, fname, mobile_number, cts FROM signup_form ORDER BY id DESC LIMIT 500;`).
3. Click **"⚡ Run Query"** (or press `Ctrl + Enter`).
4. In the results header bar above the data grid, click **`📥 CSV`** or **`📥 JSON`**.
5. The downloaded file contains the exact query results with headers matching your chosen columns.

#### 🛡️ Data Manipulation & Foreign Key Handling:
When modifying or inserting rows through the Cockpit's **Edit Record** or **New Record** modals:
* **Automatic NULL Mapping**: Any input left blank or containing literal `NULL` is automatically stored as SQL `NULL` rather than an empty string `""` or `0`.
* **Foreign Key Protection**: On tables with foreign keys (such as `events` linking to `pastor_reg`, `signup_form`, `student_reg`), optional relational identifiers left empty are saved as clean `NULL` values, and admin mutation operations run with session-level foreign key safety (`SET FOREIGN_KEY_CHECKS = 0` scoped to the request) preventing constraint failures.

---

## 🔍 Network & Connectivity Test (PowerShell)
To verify connectivity from any Windows computer:
```powershell
Test-NetConnection -ComputerName jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com -Port 3306
```
Expected output: `TcpTestSucceeded : True`

