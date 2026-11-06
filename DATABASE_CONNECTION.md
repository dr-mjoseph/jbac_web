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

#### 📤 How to Import Data & Adjust Database Tables (CSV & JSON):
Administrators can export any table, modify values in Microsoft Excel / Google Sheets, and re-import the file to automatically apply changes and adjust the database table:

1. **Export the Table**: In the **"🗄️ Tables & Schema Explorer"** tab, click **`📥 Export CSV`**.
2. **Make Adjustments**: Open the exported CSV file in Excel, edit any values (names, mobile numbers, dates, statuses), or append new rows at the bottom.
3. **Open Import Dialog**: In the Cockpit, ensure the target table is selected and click the blue **`📤 Import`** button on the toolbar.
4. **Choose File**: Click the upload box or drag-and-drop your updated `.csv` or `.json` file.
5. **Select Adjustment Mode**:
   - **⚡ Upsert (Update matching IDs & Insert new records)** *(Recommended)*: Automatically matches records by `id`, updates existing rows with your modifications, and inserts any newly added rows.
   - **✏️ Update Only**: Only modifies existing records that match by primary key `id`.
   - **➕ Insert Only**: Inserts all rows as new records (generating new auto-increment IDs).
6. **Preview & Confirm**: The dialog displays row count and column preview. Click **`🚀 Start Import`**.
7. **Instant Database Synchronization**: Records are updated safely with session-level foreign key protection (`SET FOREIGN_KEY_CHECKS = 0`) and the table data refreshes automatically.

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

---

## 📱 Android Studio Native App Dual-Write Architecture

For mobile apps built using Android Studio (native Kotlin / Java) requiring persistent storage without relying solely on Firebase Realtime Database or Cloud Firestore, the JBAC ecosystem provides **dual-write synchronization** directly to AWS RDS MySQL 8.4 via REST API endpoints on AWS Lambda (`jbac-backend-api`).

### 1. Dedicated MySQL Tables (`jbac_*`)

The following 6 tables have been provisioned in the live `jbac_jbac` production database:

#### A. User Synchronization (`jbac_users`)
Stores user profiles synchronized from Firebase Authentication, Google Sign-In, or phone login:
```sql
CREATE TABLE IF NOT EXISTS `jbac_users` (
  `uid` VARCHAR(128) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `timestamp` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### B. News & Gospel Articles (`jbac_news`)
Stores published news items, gospel bulletins, and media announcements:
```sql
CREATE TABLE IF NOT EXISTS `jbac_news` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `content` LONGTEXT,
  `image_url` VARCHAR(1000) DEFAULT NULL,
  `video_url` VARCHAR(1000) DEFAULT NULL,
  `timestamp` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### C. Meetings & Events (`jbac_meetings`)
Stores convention meetings, youth retreats, and regional prayer gatherings:
```sql
CREATE TABLE IF NOT EXISTS `jbac_meetings` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `date_time` VARCHAR(100) DEFAULT NULL,
  `venue_name` VARCHAR(500) DEFAULT NULL,
  `venue_query` VARCHAR(500) DEFAULT NULL,
  `timestamp` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### D. Church Branches & Locations (`jbac_branches`)
Stores physical church branches, pastors-in-charge, and GPS coordinates:
```sql
CREATE TABLE IF NOT EXISTS `jbac_branches` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(500) NOT NULL,
  `address` TEXT,
  `pastor_name` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### E. Prayer Requests (`jbac_prayer_requests`)
Stores believer prayer submissions and counseling requests:
```sql
CREATE TABLE IF NOT EXISTS `jbac_prayer_requests` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(128) NOT NULL,
  `user_name` VARCHAR(255) DEFAULT NULL,
  `request` TEXT NOT NULL,
  `timestamp` BIGINT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_prayer_uid` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### F. In-App Chat Messages (`jbac_chat_messages`)
Stores one-on-one and pastoral counseling chat messages:
```sql
CREATE TABLE IF NOT EXISTS `jbac_chat_messages` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` VARCHAR(128) NOT NULL,
  `receiver_id` VARCHAR(128) NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` BIGINT DEFAULT NULL,
  `read_status` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_chat_sender` (`sender_id`),
  INDEX `idx_chat_receiver` (`receiver_id`),
  INDEX `idx_chat_pair` (`sender_id`, `receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 💼 Business & Investor Match Ecosystem Tables

For entrepreneur incubation and investor matchmaking across Andhra Pradesh & Telangana:

#### A. Business Industry Sectors (`business_types`)
```sql
CREATE TABLE IF NOT EXISTS `business_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_en` VARCHAR(150) NOT NULL,
  `name_te` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### B. Entrepreneur Registrations (`entrepreneur_reg`)
```sql
CREATE TABLE IF NOT EXISTS `entrepreneur_reg` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `state_id` INT NOT NULL,
  `district_id` INT NOT NULL,
  `constituency_id` INT DEFAULT NULL,
  `mandal_id` INT DEFAULT NULL,
  `panchayat_id` INT DEFAULT NULL,
  `biz_state_id` INT NOT NULL,
  `biz_district_id` INT NOT NULL,
  `biz_constituency_id` INT DEFAULT NULL,
  `biz_mandal_id` INT DEFAULT NULL,
  `biz_panchayat_id` INT DEFAULT NULL,
  `business_type_id` INT NOT NULL,
  `denomination_id` INT NOT NULL,
  `self_fund` VARCHAR(100) DEFAULT NULL,
  `capital_need` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `approval_ind` TINYINT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### C. Investor Registrations (`investor_reg`)
```sql
CREATE TABLE IF NOT EXISTS `investor_reg` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `state_id` INT NOT NULL,
  `district_id` INT NOT NULL,
  `constituency_id` INT DEFAULT NULL,
  `mandal_id` INT DEFAULT NULL,
  `panchayat_id` INT DEFAULT NULL,
  `interested_business_type_id` INT NOT NULL,
  `denomination_id` INT NOT NULL,
  `capital_to_invest` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `approval_ind` TINYINT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🌐 Android Retrofit REST API Integration Guide

Native Android developers can connect `ChurchRepository.kt` via Retrofit to the AWS Lambda backend:

### 1. Base URL
```text
https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com
```

### 2. Available Endpoints

| HTTP Method | Route | Description | Request Body Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/dashboardapi/usersync` | Upsert user record | `{"uid": "str", "email": "str", "name": "str", "phone": "str", "role": "user", "timestamp": 1730000000}` |
| `POST` | `/dashboardapi/postnews` | Post news article | `{"title": "str", "content": "str", "imageUrl": "url", "timestamp": 1730000000}` |
| `GET` | `/dashboardapi/getnews` | Fetch active news | *None (Query params: `limit`, `offset`)* |
| `POST` | `/dashboardapi/postevents` | Post event / meeting | `{"title": "str", "dateTime": "str", "venueName": "str", "venueQuery": "str", "timestamp": 1730000000}` |
| `GET` | `/dashboardapi/events` | Fetch active events | *None* |
| `POST` | `/dashboardapi/postbranches` | Register branch location | `{"name": "str", "address": "str", "pastorName": "str", "phone": "str", "latitude": 16.5, "longitude": 80.6}` |
| `GET` | `/dashboardapi/branches` | Fetch all branches | *None* |
| `POST` | `/dashboardapi/postprayers` | Submit prayer request | `{"userId": "str", "userName": "str", "request": "str", "timestamp": 1730000000}` |
| `GET` | `/dashboardapi/getprayers` | Fetch prayer requests | *None* |
| `POST` | `/dashboardapi/postchats` | Send chat message | `{"senderId": "str", "receiverId": "str", "message": "str", "timestamp": 1730000000}` |
| `GET` | `/dashboardapi/chats/{u1}/{u2}`| Fetch conversation | *Path params: `userId1`, `userId2`* |

### 3. Android Kotlin Sample (`ChurchRepository.kt` with Retrofit)

```kotlin
// 1. Retrofit API Interface
interface ChurchApiService {
    @POST("dashboardapi/usersync")
    suspend fun syncUser(@Body user: UserSyncRequest): Response<ApiResponse>

    @POST("dashboardapi/postprayers")
    suspend fun submitPrayer(@Body request: PrayerRequest): Response<ApiResponse>

    @GET("dashboardapi/getnews")
    suspend fun getNews(): Response<NewsListResponse>

    @GET("dashboardapi/events")
    suspend fun getEvents(): Response<EventListResponse>

    @GET("dashboardapi/branches")
    suspend fun getBranches(): Response<BranchListResponse>

    @POST("dashboardapi/postchats")
    suspend fun sendMessage(@Body message: ChatMessageRequest): Response<ApiResponse>

    @GET("dashboardapi/chats/{userId1}/{userId2}")
    suspend fun getChatHistory(
        @Path("userId1") userId1: String,
        @Path("userId2") userId2: String
    ): Response<ChatHistoryResponse>
}

// 2. Dual-Write Repository Implementation
class ChurchRepository(
    private val api: ChurchApiService,
    private val firebaseDb: DatabaseReference
) {
    suspend fun submitPrayerRequest(userId: String, userName: String, text: String): Result<Unit> {
        val timestamp = System.currentTimeMillis()
        val request = PrayerRequest(userId = userId, userName = userName, request = text, timestamp = timestamp)

        // Dual-write: Write to Firebase Realtime Database
        firebaseDb.child("prayer_requests").push().setValue(request)

        // Dual-write: Synchronize with AWS RDS MySQL via AWS Lambda REST API
        return try {
            val response = api.submitPrayer(request)
            if (response.isSuccessful) Result.success(Unit)
            else Result.failure(Exception("API Error: ${response.code()}"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```


