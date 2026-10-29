# Release Notes - JBAC Web Platform & API Server v0.0.48

## Release Metadata
- **Release Version**: `0.0.48`
- **Release Date**: October 29, 2026
- **Web App URL**: [https://jbac.in](https://jbac.in)
- **Leaders Portal**: [https://jbac.in/leaders](https://jbac.in/leaders)
- **Jobs Portal**: [https://jbac.in/jobs](https://jbac.in/jobs)
- **Login Portal**: [https://jbac.in/login](https://jbac.in/login)
- **AWS S3 Production Bucket**: `jbac-web-production-298363284024`
- **AWS CloudFront Distribution**: `EOBBU8SU7H3BI` (`d2wtiz94oy03oy.cloudfront.net`)
- **AWS Lambda Backend API**: `jbac-backend-api` (Node.js 18.x, `ap-southeast-2`)
- **Database**: AWS RDS MySQL 8.4 (`jbac_jbac` on `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`)

---

## 📋 Release Highlights & Summary

Version 0.0.48 introduces strict hierarchical delegation for church and community leaders, complete removal of redundant top hero banners, modern styling of the horizontal scrolling announcement bar, and elevated UI beautification for search filters, registration forms, and the login card:

### 1. Strict Leadership Hierarchy & Rejection Filtering (`https://jbac.in/leaders`)
- **One-Level-Down Visibility Model**:
  - **District Leaders (`generaltype == 1`)**: See only subordinate **Constituency Leaders (`generaltype == 2`)** within their district.
  - **Constituency Leaders (`generaltype == 2`)**: See only subordinate **Mandal Leaders (`generaltype == 3`)** within their constituency.
  - **Mandal Leaders (`generaltype == 3`)**: See only subordinate **Village/Panchayat & Ward Leaders (`generaltype IN (4, 5, 6)`)** within their mandal.
- **Immediate Disappearance of Rejected Applications**:
  - Whenever a leader rejects an application (`approval_ind = 2`), the rejected applicant disappears immediately from the list on both the backend SQL query and frontend reactive state.
  - Only **Approved (`approval_ind = 1`)** and **Unapproved/Pending (`approval_ind = 0` / `NULL`)** leaders remain visible.
- **Dynamic Hierarchy Subtitles**:
  - Table headers automatically display specific Telugu subtitles:
    - District Level: *నియోజకవర్గాల వారిగా (Constituency-wise)*
    - Constituency Level: *మండలాల వారిగా (Mandal-wise)*
    - Mandal Level: *గ్రామ / వార్డు వారిగా (Village / Ward-wise)*

### 2. Complete Removal of The Top Banner (Hero Banner / Header Image)
- Removed `.top_panel_title` (the large graphic area with laptops, hands, breadcrumbs, and page titles) across every single page.
- Page content, announcement bars, and search tools now flow cleanly directly beneath the main navigation bar without vertical clutter.

### 3. Modern Horizontal Scrolling Announcement Bar (Marquee / Updates Bar)
- Styled `.latest-news-block` with a dark slate/navy gradient (`#0b192c` to `#1e3e62`), a subtle blue border, and a vibrant pill badge (`📢 UPDATES` in crimson red gradient).
- Clean horizontal marquee scrolling for updates, ads, and photo gallery links with golden hover highlights.

### 4. Comprehensive Beautification of Filter Tables, Registration Tables & Login
- **Jobs & Services Filter Cards**:
  - Overhauled search cards with clean Bootstrap 12-column grid layout, eliminating awkward pixel widths (`width: 273px`) and overlapping inputs.
  - Form controls dynamically stretch 100% of column width with soft rounded corners (`8px`), custom SVG select arrows, and crisp `#00548F` focus rings.
- **Login Card Modernization (`/login`)**:
  - Replaced outdated `burlywood` background with a frosted modern card featuring a deep blue gradient header (`🔐 LOGIN HERE`), high-contrast form fields, and full-width gradient login button.
- **Registration Tables & Grids**:
  - Unified input heights, consistent form labels, responsive padding, and high-legibility table headers across all registration and directory views.

---

## 📝 Multi-Language Changelog Snippets

### English (`en-US`)
```text
What's new in version 0.0.48:
• Strict Leadership Hierarchy: District leaders view constituency leaders; constituency leaders view mandal leaders; mandal leaders view ward and panchayat leaders.
• Rejection Clean-Up: Rejected applications disappear immediately from the list; only approved and pending applications remain visible.
• Removed Hero Banners: Removed large graphic header banners across all pages for a clean, distraction-free layout.
• Scrolling Announcement Bar: Redesigned the horizontal updates marquee with modern navy gradient and prominent updates badge.
• Beautiful Form Design: Redesigned login card, filter tables, and registration inputs with responsive 100% column widths and modern styling.
```

### Telugu (`te-IN`)
```text
వెర్షన్ 0.0.48 నూతన విశేషాలు:
• నాయకత్వ స్థాయి నియమాలు: జిల్లా లీడర్‌కు నియోజకవర్గ లీడర్లు మాత్రమే కనిపిస్తారు; నియోజకవర్గ లీడర్‌కు మండల లీడర్లు మాత్రమే కనిపిస్తారు; మండల లీడర్‌కు గ్రామ/వార్డు లీడర్లు మాత్రమే కనిపిస్తారు.
• తిరస్కరించిన లీడర్ల తొలగింపు: తిరస్కరించిన దరఖాస్తులు వెంటనే జాబితా నుండి అదృశ్యమవుతాయి; ఆమోదించినవి మరియు పెండింగ్‌లో ఉన్నవి మాత్రమే కనిపిస్తాయి.
• టాప్ బ్యానర్స్ తొలగింపు: ప్రతి పేజీలో అనవసరమైన పెద్ద గ్రాఫిక్ హెడర్ బ్యానర్లు తొలగించబడ్డాయి.
• స్క్రోలింగ్ ప్రకటనల బార్: ఆకర్షణీయమైన బ్లూ గ్రేడియంట్ మరియు ఎరుపు బ్యాడ్జితో అప్‌డేట్స్ మార్క్యూ పునర్నిర్మించబడింది.
• ఆకర్షణీయమైన ఫిల్టర్లు & లాగిన్: జాబ్స్ సెర్చ్ ఫిల్టర్లు, రిజిస్ట్రేషన్ ఫారమ్‌లు మరియు లాగిన్ పేజీ ఆధునిక మరియు ఆకర్షణీయ శైలిలో నవీకరించబడ్డాయి.
```

---

## 🔧 Technical Details & Schema Verification

### SQL Hierarchy Resolution in `getLeaderswebsiteData`
```sql
-- District Leader (genType = 1) -> Constituency Subordinates
SELECT ... FROM signup_form s
WHERE s.district_id = ? AND s.generaltype = '2' AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?;

-- Constituency Leader (genType = 2) -> Mandal Subordinates
SELECT ... FROM signup_form s
WHERE s.constituency_id = ? AND s.generaltype = '3' AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?;

-- Mandal Leader (genType = 3) -> Panchayat / Ward Subordinates
SELECT ... FROM signup_form s
WHERE s.mandal_id = ? AND (s.generaltype IN ('4', '5', '6') OR s.wardnumber IS NOT NULL OR s.subward IS NOT NULL)
  AND COALESCE(s.approval_ind, 0) != 2 AND s.id != ?;
```

