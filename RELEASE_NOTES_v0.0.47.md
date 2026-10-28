# Release Notes - JBAC Web Platform & API Server v0.0.47

## Release Metadata
- **Release Version**: `0.0.47`
- **Release Date**: October 28, 2026
- **Web App URL**: [https://jbac.in](https://jbac.in)
- **Admin Database Cockpit**: [https://jbac.in/admin](https://jbac.in/admin)
- **AWS S3 Production Bucket**: `jbac-web-production-298363284024`
- **AWS CloudFront Distribution**: `EOBBU8SU7H3BI` (`d2wtiz94oy03oy.cloudfront.net`)
- **AWS Lambda Backend API**: `jbac-backend-api` (Node.js 18.x, `ap-southeast-2`)
- **Database**: AWS RDS MySQL 8.4 (`jbac_jbac` on `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`)

---

## 📋 Release Highlights & Summary

Version 0.0.47 delivers significant enhancements across advertisements management, user registration experience, real-time administrative intelligence, and leadership organizational hierarchy:

1. **News Page Loading Spinner & Dynamic Meeting Expiration Engine**:
   - Integrated full-lifecycle loading spinner on [`https://jbac.in/news`](https://jbac.in/news) to prevent layout shifts while news articles are being fetched.
   - Enhanced `adds_data` schema with `enddate` and `event_id` columns, linking ads directly with calendar events.
   - Implemented automated ad lifecycle rules: Meeting ads automatically disappear once their `enddate` has elapsed, while non-meeting informational ads remain active until administratively archived (`d_in != 0`).

2. **Cleaned Login Experience**:
   - Removed the *"త్వరిత డెమో ఖాతాలు / Quick Demo Login"* box from [`https://jbac.in/login`](https://jbac.in/login) for a streamlined, production-grade login experience.

3. **Universal Vertical Ads Sidebar on All Post-Login Services**:
   - Embedded uniform vertical marquee sidebars (`height: 550px`, upward scrolling with hover-to-pause) across all 6 core service pages:
     - Christian Organizations (`/institute`)
     - Christian Marriages (`/marriages`)
     - Christian Jobs (`/jobs`)
     - For Help (`/help`)
     - Business & House Rent (`/business`)
     - Search Organizations (`/organization`)

4. **Cross-Category Registration Autofill**:
   - Added automatic profile discovery: If a user registered previously under any category (such as Student), entering their 10-digit mobile number in another registration stream (e.g. Believer, Pastor, Ministry) automatically retrieves and prefills their personal details, caste, education, and geographic locations (State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat) with active cascading dropdowns.
   - Preserves prefilled data across tab switches between registration types.

5. **Admin Cockpit Real-Time Daily Registration Metrics**:
   - Updated each registration card box in the JBAC Database Cockpit ([`https://jbac.in/admin`](https://jbac.in/admin)) to display both **Cumulative Total** and **Today's Registrations** in the same card box (`Today: X | Total: Y`).
   - Counts are tied to Indian Standard Time (IST) dates and automatically reset at midnight every day.

6. **District Leader Hierarchy & Permission Architecture (`https://jbac.in/leaders`)**:
   - Designated the `d_in = 1` database flag in `signup_form` and `pastor_reg` as the official admin authorization for District-Level Leaders.
   - When an approved district leader visits `/leaders`, all subordinate leaders within their district (at constituency, mandal, and village/panchayat levels) are displayed in organized lists under **Believers Requests** and **Pastors Requests** with one-click calling and approval/rejection controls.

7. **Detailed Leader Status Badges & Wing Resolution (`https://jbac.in/leaders`)**:
   - Upgraded the 3rd column (*"నాయకత్వ స్థాయి / Leader Status"*) from generic placeholders (`నాయకుడు (Leader)`) to high-information, color-coded badges indicating exact wing, sub-wing, and local administrative tiers:
     - **Wing Leaders**: Resolves wing names (e.g. `స్టూడెంట్ వింగ్ (Student Wing)`, `సాఫ్ట్ వెర్ వింగ్`, `డ్రైవర్స్ వింగ్`) and specific wings roles (e.g. `మీడియా రిపోర్టర్స్ (Media)`, `సోషల్ మీడియా (Social Media)`, `పేపర్ మీడియా (Paper Media)`), e.g. `స్టూడెంట్ వింగ్ (Student Wing) - సోషల్ మీడియా లీడర్` with purple/violet badges (`#ede9fe` / `#6d28d9`).
     - **Ward / Sub-Ward Leaders**: Detailed indicators with ward and sub-ward designations (`వార్డు నెం. 1 లీడర్ (Ward Leader)`, `సబ్ వార్డు లీడర్ (Sub-Ward)`) in amber badges (`#fef3c7` / `#b45309`).
     - **Mandal & Panchayat Leaders**: Clear Telugu and English indicators (`మండల లీడర్ (Mandal Leader)` in teal badges, `గ్రామ / పంచాయితీ లీడర్ (Panchayat Leader)` in green badges).
     - **Backend SQL Query Enhancement**: Joined `wings` table (`LEFT JOIN wings w ON s.wingtype = w.id`) and queried `s.wingtype`, `s.wingtypes`, `s.wardnumber`, `s.subward` across both `signup_form` and `pastor_reg`.

---

## 📝 Multi-Language Changelog Snippets

### English (`en-US`)
```text
What's new in version 0.0.47:
• Detailed Leader Status Badges: Clear, informative badges for Student Wing, Media/Social Media, Ward, Sub-Ward, Mandal, and Panchayat leaders.
• Automated Ad Expiration: Meeting announcements display until their scheduled end date, then disappear automatically.
• Universal Ads Sidebar: Added right-side vertical scrolling ads across all member services pages.
• Cross-Category Autofill: Existing student/member details automatically populate when registering for other categories.
• Admin Daily Cockpit: Track today's new registrations alongside cumulative totals in each category card.
• District Leader Dashboard: Authorized leaders (d_in=1) can review and manage subordinate mandal and panchayat leaders.
• Cleaner Login: Removed demo login shortcuts for a secure production experience.
```

### Telugu (`te-IN`)
```text
వెర్షన్ 0.0.47 నూతన విశేషాలు:
• లీడర్ల నాయకత్వ స్థాయి పూర్తి వివరాలు: స్టూడెంట్ వింగ్, సోషల్ మీడియా, మీడియా రిపోర్టర్స్, వార్డు నెం., సబ్ వార్డు, మండల మరియు పంచాయితీ స్థాయి హోదాల స్పష్టమైన రంగుల బ్యాడ్జీలు.
• మీటింగ్ ప్రకటనల ఆటో ఎక్స్‌పైరీ: మీటింగ్ తేదీ ముగిసిన తర్వాత ప్రకటనలు ఆటోమేటిక్‌గా అదృశ్యమవుతాయి.
• అన్ని సర్వీసులలో ప్రకటనల సైడ్‌బార్: మ్యారేజెస్, జాబ్స్, ఆర్గనైజేషన్స్ మొదలైన పేజీలలో నిలువు ప్రకటనల స్క్రోలింగ్.
• ఆటోమేటిక్ వివరాల సేకరణ: గతంలో స్టూడెంట్‌గా రిజిస్టర్ అయినవారు ఇతర విభాగాలలో చేరేటప్పుడు ఫోన్ నంబర్ ద్వారా వివరాలు ఆటోమేటిక్‌గా నిండుతాయి.
• అడ్మిన్ కాక్‌పిట్: ప్రతి రిజిస్ట్రేషన్ బాక్స్‌లో ఈరోజు చేరిన వారి సంఖ్య మరియు మొత్తం సంఖ్య స్పష్టంగా కనిపిస్తాయి.
• జిల్లా లీడర్ల డాష్‌బోర్డ్: అడ్మిన్ ఆమోదించిన జిల్లా లీడర్లకు మండల, పంచాయితీ స్థాయి లీడర్ల జాబితా మరియు ఫోన్ కాల్ సదుపాయం.
• క్లీన్ లాగిన్ పేజీ: డెమో లాగిన్ బాక్స్ తొలగించబడింది.
```

---

## 🔧 Technical Details & Schema Changes

### Database Changes
```sql
-- adds_data enhancement for meeting event lifecycle
ALTER TABLE `adds_data` 
  ADD COLUMN IF NOT EXISTS `enddate` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `event_id` INT DEFAULT NULL;

-- Backfilled existing meeting entries joined from events table
UPDATE adds_data a
JOIN events e ON (
    (a.event_id IS NOT NULL AND a.event_id = e.id)
    OR a.title COLLATE utf8mb4_unicode_ci = e.orgname COLLATE utf8mb4_unicode_ci
    OR (a.number IS NOT NULL AND a.number != '' AND (a.number = e.evntphone OR a.number = e.orgphone))
)
SET a.enddate = e.enddate, a.event_id = e.id
WHERE a.type = 'Meetings' AND a.enddate IS NULL;
```

### New API Endpoints
1. `POST /dashboardapi/lookup-existing-user`: Cross-category user profile lookup by 10-digit phone or WhatsApp.
2. `GET /dashboardapi/admin-dashboard-stats`: Returns `{ believers, believers_today, pastors, pastors_today, ... }` grouped by IST calendar date.
3. `POST /dashboardapi/getUserMainData`: Checks district leader authorization (`d_in = 1`) across `pastor_reg` and `signup_form`.
4. `POST /dashboardapi/getLeaderswebsiteData`: Returns subordinates list with joined constituency (`const_dtl_t`), mandal (`mndls_lst_t`), panchayat (`pnchyt_lst_t`), and wings (`wings`) table data (including `wingtype`, `wingtypes`, `wardnumber`, `subward`, `wing_name`).

