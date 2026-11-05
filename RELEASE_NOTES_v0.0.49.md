# Release Notes - JBAC Web & Mobile App v0.0.49

## Release Metadata
- **Release Version**: `0.0.49` (Version Code: `49`)
- **Release Date**: November 5, 2026
- **Web App URL**: [https://jbac.in](https://jbac.in)
- **Admin Database Cockpit**: [https://jbac.in/admin](https://jbac.in/admin)
- **Entrepreneur Registration**: [https://jbac.in/entrepreneurregister](https://jbac.in/entrepreneurregister)
- **Investor Registration**: [https://jbac.in/investorregister](https://jbac.in/investorregister)
- **AWS S3 Production Bucket**: `jbac-web-production-298363284024`
- **AWS CloudFront Distribution**: `EOBBU8SU7H3BI` (`d2wtiz94oy03oy.cloudfront.net`)
- **AWS Lambda Backend API**: `jbac-backend-api` (Node.js 18.x, `ap-southeast-2`)
- **Database**: AWS RDS MySQL 8.4 (`jbac_jbac` on `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`)
- **Mobile Target SDK**: `36` (Android 15 / 16 — API level 36 or above)

---

## 🌟 Key Features & Updates in Version 0.0.49

### 1. Entrepreneur Registration Module (`/entrepreneurregister`)
Designed for aspiring Christian entrepreneurs seeking startup capital, mentorship, and investor partnerships:
- **Comprehensive Fields**:
  - Full Name (`పేరు`)
  - Mobile Number (`మొబైల్ నంబర్`)
  - Email Address (`ఈమెయిల్`)
  - **Personal Address Cascade**: State $\rightarrow$ District $\rightarrow$ Constituency $\rightarrow$ Mandal $\rightarrow$ Panchayat/Village.
  - **Business Setup Location Cascade**: Independent State $\rightarrow$ District $\rightarrow$ Constituency $\rightarrow$ Mandal $\rightarrow$ Panchayat/Village.
  - **Strict Cascading Rule**: Subordinate dropdowns (District to Panchayat) remain disabled until their parent level (State/District/Constituency/Mandal) is explicitly selected.
  - **Business Sector**: Dynamic dropdown populated from the dedicated `business_types` database table.
  - **Christian Denomination**: Dropdown populated from existing church denominations table.
  - **Financial Metrics**: Self Fund Invested / Available (`స్వంత పెట్టుబడి`) and Capital Need Required (`కావలసిన పెట్టుబడి సహాయం`).
  - **Business Concept & Idea Summary**: Detailed description textarea (`వ్యాపార ఆలోచన & ప్రణాళిక వివరాలు`).
- **Database Table**: Dedicated `entrepreneur_reg` table with complete location keys, financial amounts, and approval status tracking.
- **Bilingual Interface**: Full Telugu & English localization across all labels, placeholders, helper text, and validation feedback.

---

### 2. Investor Registration Module (`/investorregister`)
Tailored for Christian community investors wishing to support and fund viable Christian businesses:
- **Comprehensive Fields**:
  - Full Name (`పేరు`)
  - Mobile Number (`మొబైల్ నంబర్`)
  - Email Address (`ఈమెయిల్`)
  - **Personal / Firm Address Cascade**: State $\rightarrow$ District $\rightarrow$ Constituency $\rightarrow$ Mandal $\rightarrow$ Panchayat/Village with parent-selection enforcement.
  - **Interested Business Sector**: Dropdown of sectors the investor wishes to fund (from `business_types` table).
  - **Christian Denomination**: Dropdown from church denomination master table.
  - **Capital to Invest**: Investment amount planned (`పెట్టుబడి పెట్టదలచిన మొత్తం (రూ.)`).
  - **Investment Preferences & Focus**: Detailed notes textarea (`పెట్టుబడి ప్రాధాన్యతలు & మార్గదర్శకాలు`).
- **Database Table**: Dedicated `investor_reg` table with full contact, sector interest, capital figures, and review flags.
- **Bilingual Interface**: Seamless Telugu & English dual-language layout.

---

### 3. Business Types Master Table & API
- **New Table**: `business_types` table seeded with 16 bilingual industries:
  - Agriculture & Dairy (వ్యవసాయం & పాడి పరిశ్రమ)
  - Information Technology & Software (ఇన్ఫర్మేషన్ టెక్నాలజీ)
  - Manufacturing & Industry (తయారీ & పరిశ్రమలు)
  - Retail & Wholesale (రిటైల్ & హోల్‌సేల్)
  - Healthcare & Pharmaceuticals (వైద్యం & ఫార్మా)
  - Food Processing & Restaurants (ఫుడ్ ప్రాసెసింగ్ & రెస్టారెంట్లు)
  - Solar & Renewable Energy (సోలార్ & పునరుత్పాదక శక్తి)
  - Real Estate & Construction (రియల్ ఎస్టేట్ & నిర్మాణం)
  - Transportation & Logistics (రవాణా & లాజిస్టిక్స్)
  - Textiles & Garments (వస్త్ర పరిశ్రమ & దుస్తులు)
  - Education & Training (విద్య & శిక్షణ)
  - Tourism & Hospitality (పర్యాటకం & ఆతిథ్యం)
  - Automobile & Services (ఆటోమొబైల్ & సర్వీసింగ్)
  - Financial Services (ఆర్థిక సేవలు)
  - Media & Entertainment (మీడియా & వినోదం)
  - General Trading & Services (ఇతర వ్యాపారాలు)
- **API Endpoints**:
  - `GET /dashboardapi/business-types` & `/api/business-types`
  - `POST /dashboardapi/entrepreneur-register` & `/api/entrepreneur-register`
  - `POST /dashboardapi/investor-register` & `/api/investor-register`

---

### 4. Admin Management Cockpit (`jbac.in/admin`)
- **Prominent Hero Overview Box**:
  - Positioned on the Admin Dashboard with real-time statistics:
    - **Total Entrepreneurs** registered
    - **Total Capital Needed** (formatted in Crores / Lakhs)
    - **Total Investors** registered
    - **Total Capital Available to Invest** (formatted in Crores / Lakhs)
  - **"Open Matching Panel ➔"** interactive action trigger.
- **Interactive Review & Approval Console (`#businessMatchModal`)**:
  - **Dual Tabs**: Switch between `🚀 Entrepreneurs (వ్యాపారవేత్తలు)` and `💰 Investors (పెట్టుబడిదారులు)`.
  - **State Filter**: `[All States]` | `[Andhra Pradesh (AP)]` | `[Telangana (TG)]`.
  - **Business Sector Filter**: Instant filtering by any registered business industry.
  - **Search Bar**: Real-time filtering by applicant name, mobile number, or location.
  - **Admin Action Controls**:
    - `✓ Approve`: Sets `approval_ind = 1`.
    - `✕ Reject`: Sets `approval_ind = 2`.
    - `↺ Reset`: Sets `approval_ind = 0`.
  - **Live Update API**:
    - `GET /dashboardapi/admin-entrepreneurs` & `GET /dashboardapi/admin-investors`
    - `POST /dashboardapi/admin-update-entrepreneur` & `POST /dashboardapi/admin-update-investor`

---

### 5. Mobile Application Parity (`jbac_app` v0.0.49)
- **New Mobile Pages**:
  - `EntrepreneurPage` (`src/pages/entrepreneur/`): Full registration form with dual location cascading (personal & business setup) and bilingual labels.
  - `InvestorPage` (`src/pages/investor/`): Full investor profile form with interested sectors, capital inputs, and cascading geographic selectors.
- **Service Integration**: Added `getBusinessTypes()`, `registerEntrepreneur()`, and `registerInvestor()` in `Service` provider.
- **Forms Hub Navigation**: Added intuitive launch cards in `src/pages/forms/forms.html` (`gotopage(9)` and `gotopage(10)`).
- **Target SDK Upgrade**: Locked to **API 36** (`android-targetSdkVersion="36"`).
- **Signed Release Binaries**:
  - `jbacApp-0.0.49.apk` (`130.5 MB`) — Fully zipaligned and signed with Apksigner Scheme v2 + v3.
  - `jbacApp-0.0.49.aab` (`127.5 MB`) — Signed with production keystore (`SHA256withRSA`).
  - `appreleasesigned.aab` (`127.5 MB`) — Ready for immediate upload to Google Play Console.

---

## 📱 Google Play Console Release Notes

### English (`en-US`):
```text
- Added Entrepreneur Registration to support Christian business startups and fund seekers.
- Added Investor Registration to connect investors with verified Christian entrepreneurs.
- Dual-language support in English and Telugu for all business registration forms.
- Upgraded target SDK to Android API 36 for improved performance and security.
- General performance improvements and bug fixes.
```

### Telugu (`te-IN`):
```text
- వ్యాపారం ప్రారంభించి పెట్టుబడి సహాయం పొందాలనుకునే వారి కోసం 'ఎంటర్‌ప్రెన్యూర్ రిజిస్ట్రేషన్' ప్రారంభించబడింది.
- క్రైస్తవ వ్యాపార ఆలోచనలలో పెట్టుబడి పెట్టాలనుకునే వారి కోసం 'ఇన్వెస్టర్ రిజిస్ట్రేషన్' జోడించబడింది.
- తెలుగు మరియు ఇంగ్లీష్ ద్విభాషా రూపకల్పన మరియు సులభమైన వివరాల సమర్పణ.
- మరింత మెరుగైన భద్రత మరియు వేగం కోసం Android API 36 కు అప్‌గ్రేడ్ చేయబడింది.
- సాధారణ పనితీరు మెరుగుదలలు మరియు బగ్ పరిష్కారాలు.
```

---

## 🚀 Verification & Deployment Status

| Component | Target / Environment | Status | Verification Details |
| :--- | :--- | :--- | :--- |
| **AWS RDS MySQL** | `jbac_jbac` on RDS 8.4 | **Verified** | Created `business_types`, `entrepreneur_reg`, `investor_reg` tables and seeded |
| **AWS Lambda** | `jbac-backend-api` (`ap-southeast-2`) | **Deployed** | Bundled `server.js` and `public.html`; tested live via API Gateway HTTP 200 |
| **AWS S3** | `jbac-web-production-298363284024` | **Deployed** | Angular production build and assets synced to bucket |
| **AWS CloudFront** | `EOBBU8SU7H3BI` | **Invalidated** | Cache invalidation `I12KWOODURD71432G84RNB1TKP` |
| **Android APK** | `jbacApp-0.0.49.apk` | **Built & Signed** | Dual-signed (v1, v2, v3), zipaligned, verified |
| **Android AAB** | `jbacApp-0.0.49.aab` / `appreleasesigned.aab` | **Built & Signed** | Signed with production keystore; AAPT verified `versionCode='49'`, `targetSdkVersion='36'` |
| **Web Git Repo** | `dr-mjoseph/jbac_web` | **Ready** | Branch `main` |
| **Mobile Git Repo** | `dr-mjoseph/jbac_app` | **Ready** | Branch `main` |
