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

### 5. Web-Based Cockpit & SQL Query Console (`www.jbac.in/admin`)
You can query, explore, and manipulate the AWS RDS database directly from any web browser without installing MySQL Workbench or DBeaver:

- **Live URL**: **`https://www.jbac.in/admin`** *(or `https://www.jbac.in/public.html`)*
- **Direct Lambda URL**: `https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin`
- **Local File**: [`public.html`](public.html) *(Double-click to open in browser)*

#### Programmatic Query API:
You can also execute custom SQL queries programmatically via HTTP REST:
* **Method**: `POST`
* **URL**: `https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "query": "SELECT COUNT(*) as active_users FROM users WHERE status = 'Active'"
  }
  ```
* **Sample Response**:
  ```json
  {
    "success": true,
    "type": "SELECT",
    "rowCount": 1,
    "fields": ["active_users"],
    "data": [{ "active_users": 64 }],
    "durationMs": 30
  }
  ```

---

## 🔍 Network & Connectivity Test (PowerShell)
To verify connectivity from any Windows computer:
```powershell
Test-NetConnection -ComputerName jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com -Port 3306
```
Expected output: `TcpTestSucceeded : True`

