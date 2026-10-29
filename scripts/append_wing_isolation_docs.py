import datetime

now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

doc_entry = f"""

---

## [{now}] Strict Wing Category Isolation & Hierarchical Subordinate Filtering

### 1. Functional Overview
Rewrote and hardened the leadership dashboard hierarchy and subordinate filtering logic for Believer and Pastor registrations:
- **Strict Wing Category Isolation**:
  - Admin-elected or approved District-level leaders of a specific wing (e.g., Student Wing, Advocate Wing, Medical Wing, etc.) can **ONLY** see the list of users registered for that **exact same wing category** in that district's constituencies.
  - If a user resides in the same district/constituency but registered under a different wing category, they are **strictly excluded** from the dashboard.
  - Similarly, a Constituency-level leader of a specific wing can only see Mandal-level users of the same wing.
  - Similarly, a Mandal-level leader of a specific wing can only see Village / Panchayat / Ward users of the same wing.
- **Hierarchical Scoping (One Level Down)**:
  - State Leader (`generaltype = 0`) $\\rightarrow$ sees District Leaders (`generaltype = 1`).
  - District Leader (`generaltype = 1`, `d_in = 1`) $\\rightarrow$ sees Constituency Leaders (`generaltype = 2`).
  - Constituency Leader (`generaltype = 2`) $\\rightarrow$ sees Mandal Leaders (`generaltype = 3`).
  - Mandal Leader (`generaltype = 3`) $\\rightarrow$ sees Village / Panchayat / Ward Leaders (`generaltype IN (4, 5, 6)` or `wardnumber`/`subward`).
- **Rejection & Self-Exclusion Shielding**:
  - Rejected leaders (`approval_ind = 2`) are completely removed from all subordinate lists (`COALESCE(approval_ind, 0) != 2`).
  - The logged-in leader themselves is excluded (`s.id != currentUserId`, `pr.id != currentUserId`, `st.id != currentUserId`).

### 2. Backend Implementation (`backend/server.js` & `backend/server.ts`)
- **Canonical Wing Catalog (`WING_CATALOG`)**: Defined all 23 official wings with canonical Telugu titles, English descriptors, and token sets.
- **Canonical Wing Resolver (`resolveWingCategory`)**: Converts numeric IDs (`1` to `23`), Telugu strings (`'అడ్వకేట్ వింగ్'`, `'స్టూడెంట్ వింగ్'`), and English terms (`'advocate'`, `'student'`) into unified canonical wing objects.
- **SQL Condition Builder (`getWingMatchSql`)**: Cross-checks both `wingtypes` and `wingtype` columns against wing IDs, Telugu names, and keywords.
- **Top-Level Helper (`parseLeadershipLevel`)**: Normalized leadership parsing across State (`0`), District (`1`), Constituency (`2`), Mandal (`3`), and Ward/Village (`4`) in both English and Telugu (`జిల్లా`, `నియోజకవర్గ`, `మండల`, `పంచాయతి`, `వార్డు`).
- **Endpoints Updated**:
  - `/dashboardapi/getLeaderswebsiteData` and `/dashboardapi/getLeaderswebsitewing`: Dynamic SQL matching with wing category filtering and one-level-down hierarchy.
  - `/dashboardapi/getUserMainData`: Resolves `wing_name` and `wing_english` for the authenticated leader to display the exact title in the frontend header.

### 3. Frontend Implementation (`src/app/jesus/leaders/leaders.component.ts`)
- **Title Rendering**: Sets `this.wingtypes = res.data[0].wing_name || res.data[0].wingtypes;` so the header displays the exact Telugu title (`District అడ్వకేట్ వింగ్ Leader`, `District స్టూడెంట్ వింగ్ Leader`).
- **Payload Enrichment**: Transmits `leadertype`, `wingtypes`, and `generaltype` in both `data` and `data4` requests to ensure seamless backend resolution.

### 4. Verification on Live AWS Infrastructure
- **District 17 Test**:
  - Advocate Wing Leader query $\\rightarrow$ returned 0 students (student records shielded).
  - Student Wing Leader query $\\rightarrow$ returned 2 students (Chukka Divya Darshitha, Vinukonda samyuktha).
- **District 20 Test**:
  - Advocate Wing Leader query $\\rightarrow$ returned Pastor 1261 (Rajesh chadamala, registered as Advocate Wing).
  - Student Wing Leader query $\\rightarrow$ returned 0 pastors (cross-wing pastor shielded).
- **Production Deployment**:
  - AWS Lambda function `jbac-backend-api` updated in `ap-southeast-2`.
  - Angular production build compiled (`main.c8b61a671568b0b1.js`, `styles.db5f96a266671e53.css`).
  - Synced to S3 bucket `jbac-web-production-298363284024` and CloudFront cache invalidated (`EOBBU8SU7H3BI`).
"""

with open('README.md', 'a', encoding='utf-8') as f:
    f.write(doc_entry)
print('Updated README.md')

with open('PROJECT_JOURNAL_AND_EXECUTION_LOG.md', 'a', encoding='utf-8') as f:
    f.write(doc_entry)
print('Updated PROJECT_JOURNAL_AND_EXECUTION_LOG.md')
