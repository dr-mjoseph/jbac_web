const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const WEB_DIST = path.join(__dirname, '..', 'dist', 'churchwebsite');
const MOBILE_DIST = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function createSpaServer(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      
      let filePath = path.join(rootDir, reqPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        // SPA Fallback to index.html
        filePath = path.join(rootDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end(`Server Error: ${err.message}`);
          return;
        }
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      });
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(`[SERVER] Started server on http://127.0.0.1:${port} serving ${rootDir}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

// All web routes from app-routing.module.ts
const WEB_ROUTES = [
  '',
  'about',
  'events',
  'services',
  'gallery',
  'colleges',
  'profile',
  'login',
  'attacks',
  'injustice',
  'marriages',
  'jobs',
  'business',
  'church_timings',
  'contactus',
  'signup',
  'institute',
  'supp-reg',
  'leaders',
  'update',
  'downloads',
  'help',
  'news',
  'ourhelp',
  'videospage',
  'attack',
  'privacypolicy',
  'terms',
  'wings',
  'organization',
  'webhelp',
  'newspage',
  'josephview',
  'techsol',
  'church-pastor-search',
  'believerregister',
  'studentregister',
  'ministryregister',
  'pastorregister',
  'churchregister',
  'organisationregister',
  'pastorassociationregister',
  'addads',
  'addattacks',
  'addbusiness',
  'addchurchtimings',
  'addinstitute',
  'addjobs',
  'addmarriages',
  'addmeetings',
  'survey-news',
  'churchgo',
  'apchristianpolitics',
  'christianattackvideo',
  'entry',
  'namodu',
  'wish'
];

async function runAutomation() {
  console.log('===========================================================');
  console.log('  STARTING FULL END-TO-END AUTOMATED TESTING RUNNER');
  console.log('===========================================================');

  const webServer = await createSpaServer(WEB_DIST, 4200);
  let mobileServer = null;
  if (fs.existsSync(MOBILE_DIST)) {
    mobileServer = await createSpaServer(MOBILE_DIST, 8100);
  } else {
    console.log('[WARN] Mobile www folder not found at', MOBILE_DIST);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const fullReport = {
    timestamp: new Date().toISOString(),
    webApp: {
      routesTested: 0,
      routesWithErrors: 0,
      totalDropdownsTested: 0,
      emptyDropdowns: 0,
      totalButtonsTested: 0,
      totalFormsTested: 0,
      totalFileUploadsTested: 0,
      details: []
    },
    mobileApp: {
      bootSuccess: false,
      consoleErrors: [],
      networkFailures: [],
      elements: {}
    }
  };

  // -------------------------------------------------------------
  // TEST WEB APPLICATION
  // -------------------------------------------------------------
  console.log('\n--- TESTING WEB APPLICATION ROUTES (57 routes) ---');
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('auth_ind', '1');
    sessionStorage.setItem('usr_id', '1');
    sessionStorage.setItem('name', 'Admin');
    sessionStorage.setItem('role', '1');
    sessionStorage.setItem('tableid', '1');
  });

  for (let i = 0; i < WEB_ROUTES.length; i++) {
    const route = WEB_ROUTES[i];
    const url = `http://127.0.0.1:4200/${route}`;
    const routeDetail = {
      route: `/${route}`,
      url,
      consoleErrors: [],
      networkErrors: [],
      dropdowns: [],
      buttons: [],
      forms: [],
      fileUploads: [],
      issues: []
    };

    const onConsole = msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore favicon or non-critical resource 404s
        if (!text.includes('favicon.ico')) {
          routeDetail.consoleErrors.push(text);
        }
      }
    };
    const onPageError = err => {
      routeDetail.consoleErrors.push(`Uncaught Exception: ${err.message}`);
    };
    const onRequestFailed = req => {
      routeDetail.networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText || 'Failed'}`);
    };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);
    page.on('requestfailed', onRequestFailed);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Allow Angular components and change detection 1.5s to finish async HTTP requests
      await new Promise(r => setTimeout(r, 1500));

      // Inspect Dropdowns
      const dropdownsData = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select, ng-select'));
        return selects.map(s => {
          const isNgSelect = s.tagName.toLowerCase() === 'ng-select';
          let options = [];
          if (isNgSelect) {
            options = Array.from(s.querySelectorAll('.ng-option')).map(o => o.innerText.trim());
          } else {
            options = Array.from(s.querySelectorAll('option')).map(o => ({
              text: o.innerText.trim(),
              value: o.value
            }));
          }
          const formControlName = s.getAttribute('formcontrolname') || s.getAttribute('name') || s.id || 'unnamed';
          return {
            tagName: s.tagName.toLowerCase(),
            name: formControlName,
            optionCount: options.length,
            options: options.slice(0, 10), // sample first 10
            isEmpty: options.length === 0 || (options.length === 1 && (options[0].text === '' || options[0].text.includes('ఎంచుకోండి') || options[0].text.includes('Select') || options[0].value === ''))
          };
        });
      });

      routeDetail.dropdowns = dropdownsData;
      fullReport.webApp.totalDropdownsTested += dropdownsData.length;

      for (const d of dropdownsData) {
        if (d.isEmpty) {
          fullReport.webApp.emptyDropdowns++;
          routeDetail.issues.push(`Empty Dropdown: '${d.name}' has no available options!`);
        }
      }

      // Inspect Forms and Inputs
      const formsData = await page.evaluate(() => {
        const forms = Array.from(document.querySelectorAll('form'));
        return forms.map((f, idx) => {
          const inputs = Array.from(f.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea, select'));
          return {
            formIndex: idx,
            inputCount: inputs.length,
            fields: inputs.map(i => i.getAttribute('formcontrolname') || i.name || i.placeholder || i.type || 'field')
          };
        });
      });
      routeDetail.forms = formsData;
      fullReport.webApp.totalFormsTested += formsData.length;

      // Inspect Buttons
      const buttonsData = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
        return btns.map(b => ({
          text: b.innerText.trim() || b.value || b.getAttribute('aria-label') || 'Icon Button',
          type: b.getAttribute('type') || 'button',
          disabled: b.disabled
        }));
      });
      routeDetail.buttons = buttonsData;
      fullReport.webApp.totalButtonsTested += buttonsData.length;

      // Inspect File Uploads
      const fileUploadsData = await page.evaluate(() => {
        const uploads = Array.from(document.querySelectorAll('input[type="file"]'));
        return uploads.map(u => ({
          name: u.getAttribute('formcontrolname') || u.name || u.id || 'file-upload',
          accept: u.accept || 'all',
          disabled: u.disabled
        }));
      });
      routeDetail.fileUploads = fileUploadsData;
      fullReport.webApp.totalFileUploadsTested += fileUploadsData.length;

      // Test Clickables (test clicking visible non-submit buttons to verify no crash)
      const clickableErrors = await page.evaluate(() => {
        const errs = [];
        const nonSubmitButtons = Array.from(document.querySelectorAll('button:not([type="submit"]):not([disabled])'));
        for (const btn of nonSubmitButtons.slice(0, 5)) {
          try {
            // Check if element has onclick or angular click handler
            const clickText = btn.innerText.trim();
            // skip modals or navigation triggers that navigate away
            if (clickText && !clickText.includes('లాగౌట్') && !clickText.includes('Delete')) {
              btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
          } catch (e) {
            errs.push(`Click error on '${btn.innerText.trim()}': ${e.message}`);
          }
        }
        return errs;
      });
      if (clickableErrors.length > 0) {
        routeDetail.issues.push(...clickableErrors);
      }

      // Check if page threw console errors
      if (routeDetail.consoleErrors.length > 0) {
        fullReport.webApp.routesWithErrors++;
        routeDetail.issues.push(`Console Errors: ${routeDetail.consoleErrors.join(' | ')}`);
      }

      console.log(`[TESTED ${i + 1}/${WEB_ROUTES.length}] /${route} -> ${dropdownsData.length} dropdowns, ${buttonsData.length} buttons, ${fileUploadsData.length} uploads, ${routeDetail.issues.length} issues`);

    } catch (err) {
      routeDetail.issues.push(`Navigation failed: ${err.message}`);
      fullReport.webApp.routesWithErrors++;
      console.error(`[ERROR] /${route} navigation error:`, err.message);
    } finally {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
    }

    fullReport.webApp.routesTested++;
    fullReport.webApp.details.push(routeDetail);
  }

  // -------------------------------------------------------------
  // DEDICATED MARRIAGE MODULE VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- VERIFYING MARRIAGES MODULE & REQUIREMENTS ---');
  const marriageVerification = {
    addMarriagesMinistryVisible: false,
    addMarriagesMinistryCount: 0,
    marriagesMinistryVisible: false,
    marriagesMinistryCount: 0,
    searchSuccessfulWithData: false,
    dataCardCount: 0,
    searchEmptyStateShowsMessage: false,
    emptyStateMessageText: ''
  };

  try {
    // 1. Verify /addmarriages ministry dropdown
    console.log('[MARRIAGE CHECK] Testing /addmarriages ministry dropdown visibility...');
    await page.goto('http://127.0.0.1:4200/addmarriages', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const addMinistryInfo = await page.evaluate(() => {
      const select = document.querySelector('select[formcontrolname="ministry_id"]');
      if (!select) return { found: false };
      const options = Array.from(select.querySelectorAll('option')).filter(o => o.value !== '');
      const visibleTexts = options.map(o => o.innerText.trim()).filter(t => t.length > 0);
      return {
        found: true,
        count: options.length,
        visibleCount: visibleTexts.length,
        samples: visibleTexts.slice(0, 5)
      };
    });
    marriageVerification.addMarriagesMinistryCount = addMinistryInfo.count || 0;
    marriageVerification.addMarriagesMinistryVisible = (addMinistryInfo.visibleCount || 0) > 0;
    console.log('[MARRIAGE CHECK] /addmarriages Ministry Dropdown:', addMinistryInfo);

    // 2. Verify /marriages ministry dropdown & searching
    console.log('[MARRIAGE CHECK] Testing /marriages ministry dropdown & searching...');
    await page.goto('http://127.0.0.1:4200/marriages', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2500));

    const searchMinistryInfo = await page.evaluate(() => {
      const select = document.querySelector('select[formcontrolname="ministry_id"]');
      if (!select) return { found: false };
      const options = Array.from(select.querySelectorAll('option')).filter(o => o.value !== '');
      const visibleTexts = options.map(o => o.innerText.trim()).filter(t => t.length > 0);
      return {
        found: true,
        count: options.length,
        visibleCount: visibleTexts.length,
        samples: visibleTexts.slice(0, 5)
      };
    });
    marriageVerification.marriagesMinistryCount = searchMinistryInfo.count || 0;
    marriageVerification.marriagesMinistryVisible = (searchMinistryInfo.visibleCount || 0) > 0;
    console.log('[MARRIAGE CHECK] /marriages Ministry Dropdown:', searchMinistryInfo);

    // 3. Test Search with existing data (Default / initial cards)
    const initialCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card-title, .card.h-100');
      return cards.length;
    });
    console.log(`[MARRIAGE CHECK] Initial marriage cards loaded: ${initialCards}`);
    if (initialCards > 0) {
      marriageVerification.searchSuccessfulWithData = true;
      marriageVerification.dataCardCount = initialCards;
    }

    // 4. Test Search with filter that returns NO records (e.g. Gender: Female)
    console.log('[MARRIAGE CHECK] Testing search filter with NO records (Gender: Female)...');
    await page.evaluate(() => {
      const genderSelect = document.querySelector('select[formcontrolname="gender"]');
      if (genderSelect) {
        genderSelect.value = 'Female';
        genderSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 500));
    
    // Click Search button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const searchBtn = btns.find(b => b.innerText.includes('Search'));
      if (searchBtn) searchBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // Verify empty state message in DOM
    const emptyStateCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const targetMatch = bodyText.toLowerCase().includes('you have no records / no records found') ||
                         bodyText.toLowerCase().includes('no records found');
      const alertEl = document.querySelector('.alert-warning');
      const alertText = alertEl ? alertEl.innerText.trim() : '';
      return {
        matched: targetMatch,
        alertText: alertText
      };
    });
    marriageVerification.searchEmptyStateShowsMessage = emptyStateCheck.matched;
    marriageVerification.emptyStateMessageText = emptyStateCheck.alertText;
    console.log('[MARRIAGE CHECK] Empty state verification result:', emptyStateCheck);

    // 5. Test Search with filter that HAS records (Gender: Male)
    console.log('[MARRIAGE CHECK] Testing search filter WITH records (Gender: Male)...');
    await page.evaluate(() => {
      const genderSelect = document.querySelector('select[formcontrolname="gender"]');
      if (genderSelect) {
        genderSelect.value = 'Male';
        genderSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const searchBtn = btns.find(b => b.innerText.includes('Search'));
      if (searchBtn) searchBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const maleCards = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.card-title')).map(t => t.innerText.trim());
      return {
        count: titles.length,
        names: titles
      };
    });
    if (maleCards.count > 0) {
      marriageVerification.searchSuccessfulWithData = true;
      marriageVerification.dataCardCount = maleCards.count;
    }
    console.log('[MARRIAGE CHECK] Male search results:', maleCards);

  } catch (mErr) {
    console.error('[MARRIAGE CHECK ERROR]', mErr.message);
    marriageVerification.error = mErr.message;
  }
  fullReport.marriageVerification = marriageVerification;

  // -------------------------------------------------------------
  // TEST MOBILE APPLICATION
  // -------------------------------------------------------------
  if (mobileServer) {
    console.log('\n--- TESTING MOBILE APPLICATION (Ionic 3 Native UI) ---');
    const mobilePage = await browser.newPage();
    // Simulate Mobile Viewport (Pixel 5)
    await mobilePage.setViewport({ width: 393, height: 851, isMobile: true, hasTouch: true });

    const mobileConsole = [];
    const mobileNetwork = [];
    mobilePage.on('console', msg => {
      if (msg.type() === 'error') mobileConsole.push(msg.text());
    });
    mobilePage.on('pageerror', err => mobileConsole.push(`Uncaught: ${err.message}`));
    mobilePage.on('requestfailed', req => mobileNetwork.push(`${req.url()} (${req.failure()?.errorText})`));

    try {
      await mobilePage.goto('http://127.0.0.1:8100', { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));

      const mobileState = await mobilePage.evaluate(() => {
        const ionApp = document.querySelector('ion-app');
        const header = document.querySelector('ion-header');
        const content = document.querySelector('ion-content');
        const cards = Array.from(document.querySelectorAll('ion-card, .grid, [ion-item], ion-item')).map(c => c.innerText.trim().slice(0, 30));
        const buttons = Array.from(document.querySelectorAll('button, ion-button')).map(b => b.innerText.trim() || 'button');
        const selects = Array.from(document.querySelectorAll('ion-select, select')).map(s => s.getAttribute('formcontrolname') || s.name || 'mobile-select');
        return {
          hasIonApp: !!ionApp,
          headerText: header ? header.innerText.trim().replace(/\s+/g, ' ') : null,
          hasContent: !!content,
          cardCount: cards.length,
          buttonCount: buttons.length,
          selectCount: selects.length,
          buttonsSample: buttons.slice(0, 10),
          cardsSample: cards.slice(0, 10)
        };
      });

      fullReport.mobileApp.bootSuccess = mobileState.hasIonApp;
      fullReport.mobileApp.elements = mobileState;
      fullReport.mobileApp.consoleErrors = mobileConsole;
      fullReport.mobileApp.networkFailures = mobileNetwork;

      console.log('[MOBILE TEST RESULT]', JSON.stringify(mobileState, null, 2));
      console.log(`[MOBILE CONSOLE ERRORS] (${mobileConsole.length}):`, mobileConsole);
      console.log(`[MOBILE NETWORK FAILURES] (${mobileNetwork.length}):`, mobileNetwork);

    } catch (err) {
      fullReport.mobileApp.bootSuccess = false;
      fullReport.mobileApp.error = err.message;
      console.error('[MOBILE TEST ERROR]', err.message);
    }
  }

  await browser.close();
  webServer.close();
  if (mobileServer) mobileServer.close();

  const reportPath = path.join(__dirname, 'full_automation_test_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));

  console.log('\n===========================================================');
  console.log('  AUTOMATION RUN COMPLETE! Report saved to:');
  console.log(`  ${reportPath}`);
  console.log('===========================================================');
  console.log(`Web Routes Tested: ${fullReport.webApp.routesTested}`);
  console.log(`Web Routes with Issues/Errors: ${fullReport.webApp.routesWithErrors}`);
  console.log(`Total Web Dropdowns: ${fullReport.webApp.totalDropdownsTested} (Empty: ${fullReport.webApp.emptyDropdowns})`);
  console.log(`Total Web Buttons Tested: ${fullReport.webApp.totalButtonsTested}`);
  console.log(`Total Web Forms Tested: ${fullReport.webApp.totalFormsTested}`);
  console.log(`Total Web File Uploads Tested: ${fullReport.webApp.totalFileUploadsTested}`);
  console.log(`Mobile Boot Success: ${fullReport.mobileApp.bootSuccess}`);
}

runAutomation().catch(err => {
  console.error('Fatal automation runner failure:', err);
  process.exit(1);
});
