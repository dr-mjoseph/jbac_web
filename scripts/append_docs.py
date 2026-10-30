import datetime

entry_text = f"""

---

## 🚀 Update Log ({datetime.date.today().isoformat()}): Admin Pastor Associations, Mobile Hamburger Menu, Student Leadership Hierarchy, & Believer Wing Leadership

### 1. Admin Panel - Pastor Associations Section (`public.html` & Backend)
- **Database Metrics & Real-Time Stats**: Added `pastor_associations` and `pastor_associations_today` to `GET /dashboardapi/admin-dashboard-stats` in `backend/server.js` and `backend/server.ts`, querying the `pastors_associations` table for live counts.
- **Admin Dashboard KPI Card**: Added the interactive **Pastor Associations** card (`stat-pastor-associations`, `stat-pastor-associations-today`, `stat-pastor-associations-total`) to `public.html`, `src/public.html`, and `backend/public.html`. Clicking it immediately launches `SELECT * FROM pastors_associations ORDER BY id DESC LIMIT 50;` in the SQL Query Console.

### 2. Mobile Responsive Hamburger Menu Fix (`header.component.ts`, `header.component.html`, & `styles.css`)
- **Native Angular State & Handlers**: Added `mobileMenuOpen: boolean` with `toggleMobileMenu()` and `closeMobileMenu()` methods in `HeaderComponent`.
- **Responsive Hamburger Icon**: Bound `(click)="toggleMobileMenu()"` to `.menu_button`, `[class.open]="mobileMenuOpen"` to `.side_wrap`, and `[class.show]="mobileMenuOpen"` to `.mask`.
- **CSS Isolation**: Prevented `@media (max-width: 1023px)` from hiding `.menu_main_nav_area` inside `.side_wrap` (by scoping desktop nav hiding to `.top_panel_wrap .menu_main_nav_area`). Styled the hamburger icon with `content: "☰"` and provided a high z-index overlay (`z-index: 100005`) for immediate responsiveness on iPhone and Android mobile browsers.

### 3. Student Leader Hierarchy & Dashboard Requests (`studentregister`, `leaders`, & Backend)
- **Student Register Form Fix**: Fixed `src/app/jesus/studentregister/studentregister.component.html` option values for "Select Leadership Level you want" so State, District, Constituency, Mandal, Ward/Panchayat, and institution levels submit accurate values rather than duplicate strings.
- **Backend Leader Resolution (`/dashboardapi/getUserMainData`)**: Enabled resolution of student leaders (`student_reg`, category `2`). Normalized string and numeric leadership levels (`State Level` -> 0, `District Level` -> 1, `Constituency Level` -> 2, `Mandal Level` -> 3, `Ward / Panchayati Level` -> 4).
- **One-Level-Down Hierarchy**:
  - State Leaders (`generaltype == 0`): view District leaders (`generaltype == 1`) in that state.
  - District Leaders (`generaltype == 1`): view Constituency leaders (`generaltype == 2`) in that district.
  - Constituency Leaders (`generaltype == 2`): view Mandal leaders (`generaltype == 3`) in that constituency.
  - Mandal Leaders (`generaltype == 3`): view Panchayat/Ward leaders in that mandal.
- **Student Requests Tab & Actions**: Added the **🎓 Students Requests (విద్యార్థులు)** tab and table in `leaders.component.html`, with Confirm (`confirm(2, x.id)`) and Reject (`deleteAlert(2, x.id)`).
- **Instant Rejection Disappearance**: Filtered all queries with `COALESCE(approval_ind, 0) != 2` so rejected leaders disappear immediately from all dashboards.

### 4. Believer Registration Wing Leadership Level (`believerregister` & Backend)
- **Form Controls & Dynamic Binding**: Added the "మీరు చేయగలిగిన వింగ్ లీడర్ షిప్ లెవెల్ ఎంచుకోండి" (`wingtype`) dropdown to `believerregister.component.html` populated dynamically from `this.service.getleaderlevel()`, matching `pastorregister`. Kept "వింగ్ లీడర్ కేటగిరి" (`wingtypes`) populated from `this.service.getwing()`.
- **Wing Leader Hierarchy**: When any pastor or believer registers as a Wing Leader and selects a leadership level (with admin setting `d_in = 1`), they access the hierarchical subordinates of the next level down (District &rarr; Constituency &rarr; Mandal &rarr; Village/Ward) across all wing categories.

### 5. Production Build & Cloud Deployment
- **AWS Lambda**: Updated package `backend-deploy.zip` with new `server.js` and `public.html`, and deployed to AWS Lambda function `jbac-backend-api` (region `ap-southeast-2`).
- **Angular Production Build**: Generated optimized chunks (`main.50cf944bb900db77.js`, `styles.db5f96a266671e53.css`).
- **AWS S3 & CloudFront**: Synchronized `dist/churchwebsite` to S3 bucket `jbac-web-production-298363284024` and created CloudFront cache invalidation (`EOBBU8SU7H3BI`).
"""

with open('README.md', 'a', encoding='utf-8') as f:
    f.write(entry_text)
print("Updated README.md")

with open('PROJECT_JOURNAL_AND_EXECUTION_LOG.md', 'a', encoding='utf-8') as f:
    f.write(entry_text)
print("Updated PROJECT_JOURNAL_AND_EXECUTION_LOG.md")

