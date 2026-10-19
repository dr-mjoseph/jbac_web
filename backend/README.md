# JBAC Backend API Server (Jesus Believers Association Council)

This repository houses the core Node.js/Express API server for the JBAC community portal. It serves as a secure, permanent, 24/7 cloud network bridge connecting the frontend interface (`jbac_core`) directly to an isolated AWS Aurora Serverless v2 MySQL database cluster.

## 🚀 Infrastructure Architecture

[ Angular Website UI ] ──► (HTTPS REST) ──► [ Node.js Express API ] ──► (Private Port 3306) ──► [ AWS Aurora MySQL ](jbac_core)                                (jbac-backend)                               (Serverless v2 Cluster)
## 🛠️ Tech Stack & Configurations
- **Framework & Language:** Node.js, Express, TypeScript (Target: `ES2022`, ModuleResolution: `Node`)
- **Database Connector:** `mysql2/promise` (Connection Pooling enabled)
- **Deployment Platform:** AWS Elastic Beanstalk (Node.js 20 running on 64bit Amazon Linux 2023)
- **Security Group Rules:** Inbound TCP traffic allowed natively on Port `3306` inside the AWS Private VPC, with temporary external access configured via secure port forwarding tunnels.

---

## 🗄️ Database Table Schema Layout

The server automatically initializes and manages the operational relational data schemas within the `jbac_db` database instance upon startup:

1. **`announcements` Table:** Powers home screen community alerts.
2. **`registrations` Table:** A unified master data registry using a polymorphic `registration_type` flag and an open `additional_data` JSON column to store unique parameters from multi-role submission streams.

```sql
CREATE TABLE IF NOT EXISTS jbac_db.registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_type VARCHAR(50) NOT NULL, -- 'believer', 'pastor', 'church', 'organisation', 'ministry', 'student', 'pastorassociation'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Role-Specific Registration Tables:**
   - **`signup_form` (Believers):** Stores believer registrations from both standard forms and `/namodu`. Key columns: `id`, `cts` (IST timestamp, positioned before name), `fname`, `lname`, `mobile_number`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`, `password`, `is_first_login`, `from_signup`.
   - **`student_reg` (Students):** Key columns: `id`, `cts`, `studentname`, `number`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`pastor_reg` (Pastors):** Key columns: `id`, `cts`, `pastorname`, `phonenumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`church_reg` (Churches):** Key columns: `id`, `cts`, `church_name`, `contactnumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`pastors_associations` (Pastors Associations):** Key columns: `id`, `cts`, `paname`, `phonenumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`ministry_signup` (Ministries):** Key columns: `id`, `cts`, `ministryname`, `headnmber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`independentorganisation_reg` (Independent Organizations):** Key columns: `id`, `cts`, `organisation_name`, `contact_num`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.

---

## ⚙️ Core Application Routes

### 1. `GET /api/events` & `POST /dashboardapi/getupdateevents`
Fetches upcoming meetings and landing-page metadata from the `events` table:
- **Filtering Options**: Supports `?current_date_only=true` (meetings covering current date) and `?d_in=0` or `?d_in=1` (filtering by display-in ribbon status).
- **Default Behavior**: Automatically hides past meetings (`enddate < CURDATE()`), while returning `d_in` and `activestatus` fields.

### 1a. `GET/POST /api/getribbonevents` & `POST /dashboardapi/getribbonevents`
Dedicated endpoint returning small horizontal ribbon items from `events` where `d_in = 1` ordered by `id DESC`. Meetings with `d_in = 0` are excluded from this endpoint.

### 2. `POST /api/register-all`
Consumes multi-form request bodies, dynamically flattening custom data fields into the open MySQL JSON property column block.
- **Payload Structure:** `{ registrationType, firstName, lastName, email, phone, ...customMetadata }`

### 3. `POST /dashboardapi/postregform` (Namodu & Entry Form Submissions)
Processes unified entry and `/namodu` submissions, routing to role-specific tables:
- **Category 1 (Believer):** Stores directly into `signup_form` with `cts` (IST timestamp), `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`, `from_signup: 'believer'`, and sets initial `password = phone`, `is_first_login = 1`.
- **Other Categories:** Student (`student_reg`), Pastor (`pastor_reg`), Church (`church_reg`), Pastors Association (`pastors_associations`), Ministry (`ministry_signup`), Independent Organization (`independentorganisation_reg`). All store `cts`, `whatsapp`, and `is_first_login = 1`.

### 4. `POST /dashboardapi/postbeliversignup` (Regular Believer Registration)
Stores regular believer registrations into `signup_form`:
- Maps geographic fields: `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`.
- Stores `cts` (IST timestamp), dedicated user password, and sets `is_first_login = 0`.

### 5. `POST /dashboardapi/passwordwebsitelogin` (Authentication)
Authenticates users across all category tables:
- **First Login (Namodu & Entry):** If `is_first_login == 1`, returns `{ status: 201, first_login: true }` which triggers the change password modal on the frontend.
- **Regular Registrations:** If `is_first_login == 0`, returns `{ status: 200, message: 'Login successful' }` for direct, normal login without the modal.

### 6. `GET /api/admin-database-view`
A private, browser-based database cockpit GUI panel. It aggregates separate, interactive spreadsheet rows viewable natively inside your standard browser window pane to view incoming registrations cleanly by roles without looking at terminal blocks.

---

## 🔒 Environment Properties Configuration (AWS Elastic Beanstalk / Lambda)
To run without hitting network timeout errors, pass these identical key-value parameters directly within your AWS Elastic Beanstalk or Lambda environment configuration:

- `DB_HOST`: `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`
- `DB_USER`: `admin`
- `DB_NAME`: `jbac_jbac`
- `DB_PASSWORD`: `biUt2TrZ9EZAqn6GXhiA`
- `PORT`: `8081`

---

## 📋 Comprehensive CRUD REST Endpoints

1. **Table Metadata & Schemas:**
   - `GET /api/tables` - Returns all 37 tables, column definitions, and live row counts.
2. **Universal CRUD Operations:**
   - `GET /api/crud/:table` - Retrieve table rows (supports `?limit=100&offset=0&[column]=[value]`)
   - `GET /api/crud/:table/:id` - Retrieve single record by primary key ID
   - `POST /api/crud/:table` - Insert new record into specified table
   - `PUT /api/crud/:table/:id` - Update existing record by ID
   - `DELETE /api/crud/:table/:id` - Permanently delete record by ID
3. **Admin Database Console (GUI):**
   - Access `http://<your-host>/api/admin-database-view` in browser to visually browse, search, add, update, and delete records across all 37 tables in `jbac_db`!

---

## 💾 Local Development & Production Packaging Deployment

### 1. Run Server Locally
```bash
export DB_HOST="jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com"
export DB_USER="admin"
export DB_NAME="jbac_jbac"
export DB_PASSWORD="biUt2TrZ9EZAqn6GXhiA"
export PORT="8081"

# Compile and start
npx tsc
node server.js
```

### 2. Package for AWS Deployment
- **AWS Elastic Beanstalk Package:**
  `backend-deploy.zip` contains `server.js`, `package.json`, and `tsconfig.json`.
- **AWS Lambda Package:**
  `lambda-deploy.zip` contains `server.js`, `package.json`, `tsconfig.json`, and bundled dependencies.
```bash
# Rebuild packages
npx tsc
zip -r backend-deploy.zip server.js package.json tsconfig.json
```