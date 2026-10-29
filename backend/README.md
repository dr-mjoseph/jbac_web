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
   - **`student_reg` (Students):** Key columns: `id`, `cts`, `studentname`, `number`, `whatsapp`, `whatsappnumber`, `study`, `group_branch`, `tmarks`, `totmarks`, `mmarks`, `maxmarks`, `talent`, `schname`, `fathername`, `mother`, `orphon`, `branch`, `passexam`, `exampass`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `resdistricts`, `resconstituencyname`, `resmandals`, `respanchayati`, `villagename`, `password`, `is_first_login`.
   - **`pastor_reg` (Pastors):** Key columns: `id`, `cts`, `pastorname`, `phonenumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`church_reg` (Churches):** Key columns: `id`, `cts`, `church_name`, `contactnumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`pastors_associations` (Pastors Associations):** Key columns: `id`, `cts`, `paname`, `phonenumber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`ministry_signup` (Ministries):** Key columns: `id`, `cts`, `ministryname`, `headnmber`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.
   - **`independentorganisation_reg` (Independent Organizations):** Key columns: `id`, `cts`, `organisation_name`, `contact_num`, `whatsapp`, `district_id`, `constituency_id`, `mandal_id`, `village_id`, `password`, `is_first_login`.

---

## ⚙️ Core Application Routes

### 1. `GET /api/events` & `POST /dashboardapi/getupdateevents`
Fetches upcoming meetings and landing-page metadata from the `events` table:
- **Filtering Options**: Supports `?current_date_only=true` (meetings covering current date), `?state_id=1` (Andhra Pradesh), `?state_id=2` (Telangana), and `?d_in=0` or `?d_in=1` (filtering by display-in ribbon status).
- **State Resolution**: Automatically joins `dstrct` on `events.district_id = dstrct.id` to compute `COALESCE(e.state_id, d.state_id, CASE WHEN e.district_id >= 31 THEN 2 ELSE 1 END) AS state_id`, ensuring accurate state filtering even for legacy meeting rows.
- **Default Behavior**: Automatically hides past meetings (`enddate < CURDATE()`), while returning `d_in`, `state_id`, and `activestatus` fields.

### 1a. `GET/POST /api/getribbonevents` & `POST /dashboardapi/getribbonevents`
Dedicated endpoint returning small horizontal ribbon items from `events` where `d_in = 1` and dates have not passed (`enddate >= CURDATE()` or `startdate >= CURDATE()`) ordered by `id DESC`. Supports optional `?state_id` filtering (AP/TG). Meetings with `d_in = 0` as well as expired meetings are automatically excluded from this endpoint.

### 1b. `POST /dashboardapi/searchingdata` (Meeting Search & Multi-tier Filter)
Searches meetings across multiple combined criteria: `state_id`, `district_id`, `constituency_id`, `mandal_id`, `panchayati_id`, `startdate`, `mettingtype`, `denomation_id`, `speakerone`, and `ministry_id`.
- Automatically maps and filters by `state_id` (`1` = AP, `2` = TG).
- Excludes old/expired meetings.

### 1c. `POST /dashboardapi/postmeetings` (Meeting Submission)
Stores newly created meetings into `events`:
- Automatically persists `state_id` (`1` or `2`) and `state` (`'AP'` or `'TG'`).
- Enforces proper linkage to `district_id`, `constituency_id`, `mandal_id`, and `village_id`.

### 1d. `GET/POST /dashboardapi/getdistricts`
Retrieves active districts with optional `?state_id` filtering:
- `state_id=1` returns Andhra Pradesh districts (including fallback range `id < 31`).
- `state_id=2` returns Telangana districts (including fallback range `id >= 31`).

### 2. `POST /api/register-all`
Consumes multi-form request bodies, dynamically flattening custom data fields into the open MySQL JSON property column block.
- **Payload Structure:** `{ registrationType, firstName, lastName, email, phone, ...customMetadata }`

### 3. `POST /dashboardapi/postregform` (Namodu & Entry Form Submissions)
Processes unified entry and `/namodu` submissions, routing to role-specific tables with strict contact number isolation:
- **Clean Phone Field Separation**: The registrant's primary phone number is mapped exclusively to the primary contact field (`student_reg.number`, `church_reg.contactnumber`, `pastor_reg.phonenumber`, `ministry_signup.headnmber`, `independentorganisation_reg.contact_num`, `pastors_associations.phonenumber`, `signup_form.mobile_number`). Secondary numbers (`parentnum`, `pastornum`, `phonenumber2`, `pa_phonenumber`, `president`) remain `NULL` unless explicitly provided by the registrant.
- **`users.otp` Integer Overflow Protection**: `users.otp` (MySQL `INT` column) is sanitized and only accepts numeric values `<= 999999` or `NULL`. Phone numbers and passwords are never written into `users.otp`, preventing 32-bit integer out-of-range database exceptions.
- **Category Routing**:
  - **Category 1 (Believer):** Stores directly into `signup_form` with `cts` (IST timestamp), `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`, `from_signup: 'believer'`, and `is_first_login = 1`.
  - **Other Categories:** Student (`student_reg`), Pastor (`pastor_reg`), Church (`church_reg`), Pastors Association (`pastors_associations`), Ministry (`ministry_signup`), Independent Organization (`independentorganisation_reg`). All store `cts` and `is_first_login = 1`.

### 4. `POST /dashboardapi/postbeliversignup` (Regular Believer Registration)
Stores regular believer registrations into `signup_form`:
- Maps geographic fields: `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`.
- Stores `cts` (IST timestamp), dedicated user password, and sets `is_first_login = 0`.
- Protects `users.otp` from non-OTP data.

### 4a. `POST /dashboardapi/studentsignup` (Student Registration)
Dedicated endpoint processing student registrations from both web (`/studentregister`) and mobile (`StudentPage`):
- **Bidirectional Alias Synchronization**:
  - `study` ⟷ `group_branch`
  - `tmarks` ⟷ `totmarks`
  - `mmarks` ⟷ `maxmarks`
  - `passexam` ⟷ `exampass`
  - `whatsappnumber` ⟷ `whatsapp`
- **Automatic Password Fallback**:
  - Automatically defaults empty/omitted password submissions to the registrant's mobile number, enabling immediate login.
- **Master User Sync**:
  - Synchronizes phone and password into `users` table.

### 5. `POST /dashboardapi/passwordwebsitelogin` (Authentication)
Authenticates users across all category tables:
- **Seamless Password / Phone Authentication**: Supports authenticating via phone number when the user's password record in the database is `NULL` or matches phone without mutating the password column.
- **First Login (Namodu & Entry):** If `is_first_login == 1`, returns `{ status: 201, first_login: true }` which triggers the change password modal on the frontend.
- **Regular Registrations:** If `is_first_login == 0`, returns `{ status: 200, message: 'Login successful' }` for direct, normal login without the modal.

### 6. `POST /dashboardapi/geteditdtails` (Profile Pre-population)
Fetches user details across all 9 category tables (`belivers_tbl`, `pastors_tbl`, `student_tbl`, `ministry_tbl`, `church_reg`, `organisation_tbl`, `pastorsassociations_tbl`, `tbl_councelling_doctor`, `users`) by `usr_id` and/or `mobile_number`. Returns standardized aliases (`name`, `mobile_number`, `dob`, `gender`, `district_id`, `constituency_id`, `mandal_id`, `panchayat_id`) enabling full pre-population of previously entered fields while keeping unentered fields blank and editable.

### 7. `GET /api/admin-database-view`
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

## 📋 Universal SQL Execution & CRUD REST Endpoints

1. **Table Metadata & Schemas:**
   - `GET /api/tables` (or `/dashboardapi/tables`) - Returns all 89 tables in `jbac_jbac`, column definitions, and live row counts.
2. **Direct SQL Query Execution:**
   - `POST /dashboardapi/execute-query` (or `/api/query`) - Executes arbitrary SQL queries (SELECT, INSERT, UPDATE, DELETE, SHOW, DESCRIBE).
     - Payload: `{ "query": "SELECT * FROM users LIMIT 10" }`
     - Response: Includes `rowCount`, `fields`, `data`, and execution `durationMs`.
3. **Admin Dashboard Telemetry:**
   - `GET /dashboardapi/admin-dashboard-stats` - Aggregates real-time counts across Believers, Pastors, Churches, Students, Ministries, Organisations, Active Events, and Registered Users. Returns both cumulative **Total** (`believers`, `pastors`, etc.) and **Today's Registrations** (`believers_today`, `pastors_today`, etc.) matched against Indian Standard Time (IST) calendar dates (`cts LIKE 'YYYY-MM-DD%'`), resetting at midnight every day. Supports `?state_id=1` (AP), `?state_id=2` (TG), or `?state_id=all`.
4. **Universal CRUD Operations:**
   - `GET /dashboardapi/crud/:table` - Retrieve table rows with safe pagination (supports `?limit=50&offset=0&[column]=[value]`).
   - `GET /dashboardapi/crud/:table/:id` - Retrieve single record by primary key ID.
   - `POST /dashboardapi/crud/:table` - Insert new record into specified table.
   - `PUT /dashboardapi/crud/:table/:id` - Update existing record by ID.
   - `DELETE /dashboardapi/crud/:table/:id` - Permanently delete record by ID.
5. **Admin Database Console & Cockpit (GUI):**
   - Access `https://www.jbac.in/admin` (or `/public.html`, `/dashboard`) to visually browse schemas, search rows, execute arbitrary SQL queries, and manipulate records across all 89 tables in `jbac_jbac`. Card boxes display real-time dual metrics (`Today: X | Total: Y`).
6. **Cross-Category User Discovery & Autofill:**
   - `POST /dashboardapi/lookup-existing-user` (or `/api/lookup-existing-user`) - Accepts `{ "phone": "10-digit-number" }`, searches `student_reg`, `signup_form`, and `pastor_reg`, and returns the user's complete normalized demographic, educational, caste, leadership, and geographic profile for instant prefill across registration forms.
7. **Automated Ad Lifecycle & Meeting Expiration:**
   - `GET/POST /dashboardapi/getaddsdata` (or `/api/getadds`) - Automatically filters active ads (`d_in = 0`). Meeting ads are dynamically constrained to `enddate >= CURDATE()`; expired meetings automatically disappear from the feed, while general non-meeting ads persist until administratively stopped.
8. **Multi-Tier Leadership Hierarchy & Authorization (`d_in = 1` or `approval_ind = 1`):**
   - `POST /dashboardapi/getUserMainData` - Checks if a believer or pastor is an approved leader: District (`d_in = 1` / `generaltype = 1`), Constituency (`generaltype = 2`), or Mandal (`generaltype = 3`).
   - `POST /dashboardapi/getLeaderswebsiteData` - Implements strict one-level-down delegation: District leaders see Constituency leaders; Constituency leaders see Mandal leaders; Mandal leaders see Panchayat/Ward leaders. Excludes rejected leaders (`approval_ind = 2`), keeping only approved (`approval_ind = 1`) and pending (`approval_ind = 0`).
   - `POST /dashboardapi/updateconsis` & `POST /dashboardapi/deleteboardmember` - Confirm (`approval_ind = 1`) or reject (`approval_ind = 2`) subordinate leader applications.
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
& "C:\Users\rajes\AppData\Local\OpenAI\Codex\runtimes\cua_node\cfb32733c877621e\bin\node.exe" node_modules/typescript/bin/tsc
node server.js
```

### 2. Package & Deploy to AWS Lambda
The active serverless deployment runs on AWS Lambda `jbac-backend-api` in `ap-southeast-2`:
```bash
# 1. Compile TypeScript to JavaScript
& "C:\Users\rajes\AppData\Local\OpenAI\Codex\runtimes\cua_node\cfb32733c877621e\bin\node.exe" node_modules/typescript/bin/tsc server.ts --target es2020 --module commonjs --skipLibCheck --esModuleInterop --ignoreConfig --noEmitOnError false

# 2. Package backend-deploy.zip with server.js, public.html, admin_db.html, and package.json
python scripts/package_backend.py

# 3. Deploy to AWS Lambda
aws lambda update-function-code --function-name jbac-backend-api --zip-file fileb://backend/backend-deploy.zip --region ap-southeast-2
```
