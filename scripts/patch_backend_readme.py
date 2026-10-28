with open('backend/README.md', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """3. **Admin Dashboard Telemetry:**
   - `GET /dashboardapi/admin-dashboard-stats` - Aggregates real-time counts across Believers, Pastors, Churches, Students, Ministries, Organisations, Active Events, and Registered Users.
4. **Universal CRUD Operations:**
   - `GET /dashboardapi/crud/:table` - Retrieve table rows with safe pagination (supports `?limit=50&offset=0&[column]=[value]`).
   - `GET /dashboardapi/crud/:table/:id` - Retrieve single record by primary key ID.
   - `POST /dashboardapi/crud/:table` - Insert new record into specified table.
   - `PUT /dashboardapi/crud/:table/:id` - Update existing record by ID.
   - `DELETE /dashboardapi/crud/:table/:id` - Permanently delete record by ID.
5. **Admin Database Console & Cockpit (GUI):**
   - Access `https://www.jbac.in/admin` (or `/public.html`, `/dashboard`) to visually browse schemas, search rows, execute arbitrary SQL queries, and manipulate records across all 89 tables in `jbac_jbac`."""

new_block = """3. **Admin Dashboard Telemetry:**
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
8. **District Leader Hierarchy & Authorization (`d_in = 1`):**
   - `POST /dashboardapi/getUserMainData` - Checks if a believer or pastor general leader is designated as a District Leader (`d_in = 1`). Returns empty data if `d_in = 0`.
   - `POST /dashboardapi/getLeaderswebsiteData` - Given `{ "district_id": ..., "usr_id": ... }`, retrieves all subordinate leaders in that district with joined constituency, mandal, and panchayat names for hierarchical management.
   - `POST /dashboardapi/updateconsis` & `POST /dashboardapi/deleteboardmember` - Confirm (`approval_ind = 1`) or reject (`approval_ind = 2`) subordinate leader applications."""

if old_block in text:
    text = text.replace(old_block, new_block)
    print('Replaced LF')
elif old_block.replace('\n', '\r\n') in text:
    text = text.replace(old_block.replace('\n', '\r\n'), new_block.replace('\n', '\r\n'))
    print('Replaced CRLF')
else:
    print('Block not found!')

with open('backend/README.md', 'w', encoding='utf-8') as f:
    f.write(text)
print('Saved backend/README.md')
