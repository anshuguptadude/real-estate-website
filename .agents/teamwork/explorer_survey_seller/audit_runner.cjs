const { execSync } = require('child_process');

const WIN_ID = 50864;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runSafariJS(jsCode) {
  const escapedCode = jsCode.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const appleScript = `
    tell application "Safari"
      try
        set targetWin to (first window whose id is ${WIN_ID})
        set res to do JavaScript "${escapedCode}" in current tab of targetWin
        return res
      on error errMsg
        return "SAFARI_ERROR: " & errMsg
      end try
    end tell
  `;
  try {
    const output = execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return output.trim();
  } catch (err) {
    return 'EXEC_ERROR: ' + err.message;
  }
}

function navigateTo(url) {
  const appleScript = `
    tell application "Safari"
      try
        set targetWin to (first window whose id is ${WIN_ID})
        set URL of current tab of targetWin to "${url}"
      on error errMsg
        return "NAV_ERROR: " & errMsg
      end try
    end tell
  `;
  execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, { encoding: 'utf8' });
}

async function runFullSellerAudit() {
  console.log('====================================================');
  console.log('ROYAL AGRA ESTATE - COMPREHENSIVE SELLER JOURNEY AUDIT');
  console.log('====================================================\n');

  // STEP 0: Navigation & Entry Points Evaluation
  console.log('--- TEST 0: Navigating to Homepage to evaluate Entry Points ---');
  navigateTo('https://royalagraestate.in/');
  await sleep(3000);

  const entryPoints = JSON.parse(runSafariJS(`
    (() => {
      const navPostBtn = document.getElementById('nav-post-property-btn');
      const navSellRent = document.getElementById('nav-link-sell-rent');
      const footerSellRent = document.getElementById('footer-link-sell-rent');
      const footerSeoLink = Array.from(document.querySelectorAll('footer a')).find(a => a.href.includes('sell-property-in-agra'));
      
      const heroSections = Array.from(document.querySelectorAll('section')).map(s => s.innerText.slice(0, 100));
      
      return JSON.stringify({
        navbarPostPropertyBtn: navPostBtn ? {
          text: navPostBtn.innerText.trim(),
          href: navPostBtn.getAttribute('href'),
          classes: navPostBtn.className,
          computedStyles: {
            bg: window.getComputedStyle(navPostBtn).backgroundColor,
            color: window.getComputedStyle(navPostBtn).color,
            fontSize: window.getComputedStyle(navPostBtn).fontSize,
            borderRadius: window.getComputedStyle(navPostBtn).borderRadius
          }
        } : null,
        navbarSellRentLink: navSellRent ? {
          text: navSellRent.innerText.trim(),
          href: navSellRent.getAttribute('href')
        } : null,
        footerLink: footerSellRent ? {
          text: footerSellRent.innerText.trim(),
          href: footerSellRent.getAttribute('href')
        } : null,
        footerSeoLink: footerSeoLink ? {
          text: footerSeoLink.innerText.trim(),
          href: footerSeoLink.getAttribute('href')
        } : null,
        hasSellerHeroSection: heroSections.some(t => /sell with us|list your estate|seller advisory/i.test(t))
      }, null, 2);
    })()
  `));
  console.log('Entry Points Audit Result:', JSON.stringify(entryPoints, null, 2));

  // STEP 1: Direct navigation to Seller Listing Portal
  console.log('\n--- TEST 1: Step 1 (Basic Info & Location) ---');
  navigateTo('https://royalagraestate.in/?screen=sell-rent');
  await sleep(3000);

  const step1Data = JSON.parse(runSafariJS(`
    (() => {
      const h1 = document.querySelector('h1')?.innerText;
      const subtitle = document.querySelector('p.text-gray-600')?.innerText;
      const progressSteps = Array.from(document.querySelectorAll('.bg-\\\\[\\\\#0F382C\\\\] span, .bg-\\\\[\\\\#0F382C\\\\] div')).map(el => el.innerText.trim()).filter(Boolean);
      
      const propTypeOptions = Array.from(document.querySelectorAll('#property-type-select option')).map(o => o.value);
      const localityOptions = Array.from(document.querySelectorAll('#post-locality-select option')).map(o => o.value);

      const titleInput = document.getElementById('post-project-title');
      const addressInput = document.getElementById('post-confidential-address');
      const mapInput = document.getElementById('property-map-url-input');

      // Check confidentiality indicators
      const confidentialBadges = Array.from(document.querySelectorAll('.bg-amber-100, .bg-amber-200, .bg-amber-50\\\\/90, .text-amber-900, .text-emerald-700')).map(e => e.innerText.trim());

      return JSON.stringify({
        h1,
        subtitle,
        progressSteps: Array.from(new Set(progressSteps)),
        propTypeOptions,
        localityOptions,
        titleInput: titleInput ? { placeholder: titleInput.placeholder, required: titleInput.required, fontSize: window.getComputedStyle(titleInput).fontSize } : null,
        addressInput: addressInput ? { placeholder: addressInput.placeholder, required: addressInput.required, fontSize: window.getComputedStyle(addressInput).fontSize } : null,
        mapInput: mapInput ? { placeholder: mapInput.placeholder, fontSize: window.getComputedStyle(mapInput).fontSize } : null,
        confidentialBadges: Array.from(new Set(confidentialBadges))
      }, null, 2);
    })()
  `));
  console.log('Step 1 Audit Result:', JSON.stringify(step1Data, null, 2));

  // Test Custom Property Type and Locality
  console.log('\n--- TEST 1b: Testing Custom Property Type & Locality dynamic inputs ---');
  const customInputsTest = JSON.parse(runSafariJS(`
    (() => {
      const propSelect = document.getElementById('property-type-select');
      propSelect.value = 'Other (Custom Type)';
      propSelect.dispatchEvent(new Event('change', { bubbles: true }));

      const locSelect = document.getElementById('post-locality-select');
      locSelect.value = 'Other';
      locSelect.dispatchEvent(new Event('change', { bubbles: true }));

      const customPropInput = document.getElementById('custom-property-type-input');
      const customLocInput = document.getElementById('post-custom-locality-input');

      return JSON.stringify({
        customPropInputPresent: !!customPropInput,
        customPropPlaceholder: customPropInput?.placeholder,
        customLocInputPresent: !!customLocInput,
        customLocPlaceholder: customLocInput?.placeholder
      }, null, 2);
    })()
  `));
  console.log('Custom Inputs Result:', JSON.stringify(customInputsTest, null, 2));

  // Test Step 1 Validation Bypass
  console.log('\n--- TEST 1c: Testing Form Validation at Step 1 Transition ---');
  const step1ValidationTest = JSON.parse(runSafariJS(`
    (() => {
      // Clear inputs
      const titleInput = document.getElementById('post-project-title');
      const addressInput = document.getElementById('post-confidential-address');
      
      const setNative = (el, val) => {
        const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      setNative(titleInput, '');
      setNative(addressInput, '');

      // Click Continue to Specifications
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('CONTINUE TO SPECIFICATIONS'));
      const beforeH3 = document.querySelector('h3')?.innerText;
      continueBtn.click();
      const afterH3 = document.querySelector('h3')?.innerText;

      return JSON.stringify({
        titleValueBeforeClick: titleInput.value,
        addressValueBeforeClick: addressInput.value,
        beforeH3,
        afterH3,
        advancedToStep2WithoutValidation: afterH3.includes('Step 2')
      }, null, 2);
    })()
  `));
  console.log('Step 1 Validation Bypass Result:', JSON.stringify(step1ValidationTest, null, 2));

  // STEP 2: Specs & Price
  console.log('\n--- TEST 2: Step 2 (Area, Configuration & Pricing) ---');
  const step2Data = JSON.parse(runSafariJS(`
    (() => {
      const h3 = document.querySelector('h3')?.innerText;
      const unitButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Sq.')).map(b => b.innerText.trim());
      const areaInput = document.querySelector('input[type=\"number\"]');
      const areaConversionText = areaInput?.parentElement.querySelector('span.font-mono')?.innerText;
      
      const bhkOptions = Array.from(document.querySelectorAll('#post-bedrooms-select option')).map(o => o.value);
      const bathOptions = Array.from(document.querySelectorAll('#post-bathrooms-select option')).map(o => o.value);
      const furnishOptions = Array.from(document.querySelectorAll('#post-furnishing-select option')).map(o => o.value);

      const facingSelect = Array.from(document.querySelectorAll('select')).find(s => Array.from(s.options).some(o => o.value.includes('Vastu')));
      const facingOptions = facingSelect ? Array.from(facingSelect.options).map(o => o.value) : [];

      const possessionSelect = Array.from(document.querySelectorAll('select')).find(s => Array.from(s.options).some(o => o.value.includes('Ready to Move')));
      const possessionOptions = possessionSelect ? Array.from(possessionSelect.options).map(o => o.value) : [];

      const priceInput = Array.from(document.querySelectorAll('input[type=\"number\"]'))[1];
      const priceFormattedPreview = priceInput?.parentElement.querySelector('span.font-mono')?.innerText;

      return JSON.stringify({
        h3,
        unitButtons,
        superAreaDefault: areaInput?.value,
        areaConversionText,
        bhkOptions,
        bathOptions,
        furnishOptions,
        facingOptions,
        possessionOptions,
        priceDefault: priceInput?.value,
        priceFormattedPreview
      }, null, 2);
    })()
  `));
  console.log('Step 2 Audit Result:', JSON.stringify(step2Data, null, 2));

  // Test Unit Toggle & Live Price Formatting in Step 2
  console.log('\n--- TEST 2b: Testing Unit Selector & Live Indian Price Formatting ---');
  const step2InteractivityTest = JSON.parse(runSafariJS(`
    (() => {
      // Toggle to Sq. Yards
      const sqYardsBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sq. Yards'));
      sqYardsBtn?.click();
      
      const areaInput = document.querySelector('input[type=\"number\"]');
      const convertedSqYards = areaInput?.value;
      const convertedText = areaInput?.parentElement.querySelector('span.font-mono')?.innerText;

      // Update price to 45000000 (4.5 Cr)
      const priceInput = Array.from(document.querySelectorAll('input[type=\"number\"]'))[1];
      const setNative = (el, val) => {
        const proto = window.HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setNative(priceInput, '45000000');
      const updatedPricePreview = priceInput?.parentElement.querySelector('span.font-mono')?.innerText;

      return JSON.stringify({
        convertedSqYards,
        convertedText,
        updatedPricePreview
      }, null, 2);
    })()
  `));
  console.log('Step 2 Interactivity Result:', JSON.stringify(step2InteractivityTest, null, 2));

  // Advance to Step 3
  console.log('\n--- TEST 3: Step 3 (Amenities, Nearby Areas & Photos) ---');
  runSafariJS(`
    (() => {
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('CONTINUE TO AMENITIES'));
      continueBtn?.click();
    })()
  `);
  await sleep(1000);

  const step3Data = JSON.parse(runSafariJS(`
    (() => {
      const h3 = document.querySelector('h3')?.innerText;
      
      // Amenities
      const amenities = Array.from(document.querySelectorAll('button')).filter(b => {
        return ['Swimming Pool', 'Private Garden', '100% Power Backup', '24/7 Security', 'Home Theater', 'Private Gym / Spa', 'Servant Quarters', 'EV Charging Point', 'Vastu Compliant', 'Covered Car Garage'].some(a => b.innerText.includes(a));
      }).map(b => ({ name: b.innerText.trim(), selected: b.className.includes('emerald') }));

      // Landmark Presets
      const landmarkPresets = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('km') || b.innerText.includes('Taj Mahal') || b.innerText.includes('Metro')).map(b => b.innerText.trim());

      // Current Selected Landmarks
      const selectedLandmarkChips = Array.from(document.querySelectorAll('.shadow-2xs')).map(c => c.innerText.replace(/\\n/g, ' ').trim());

      // Photo Upload Box
      const dropzone = document.getElementById('upload-property-photos-dropzone');
      const fileInput = dropzone?.querySelector('input[type=\"file\"]');
      const emptyStateNotice = document.querySelector('.border-dashed.border-emerald-300')?.innerText.replace(/\\n/g, ' ').trim();

      return JSON.stringify({
        h3,
        amenitiesCount: amenities.length,
        selectedAmenitiesCount: amenities.filter(a => a.selected).length,
        landmarkPresetsCount: landmarkPresets.length,
        selectedLandmarkChips,
        dropzonePresent: !!dropzone,
        dropzoneText: dropzone?.innerText.replace(/\\n/g, ' ').trim(),
        fileInputAccept: fileInput?.getAttribute('accept'),
        fileInputMultiple: fileInput?.hasAttribute('multiple'),
        emptyStateNotice
      }, null, 2);
    })()
  `));
  console.log('Step 3 Audit Result:', JSON.stringify(step3Data, null, 2));

  // Test Landmark Addition & Image Upload Simulation
  console.log('\n--- TEST 3b: Testing Custom Landmark Addition & Photo Upload Simulation ---');
  const step3InteractivityTest = JSON.parse(runSafariJS(`
    (() => {
      // 1. Add Custom Landmark
      const customInputs = Array.from(document.querySelectorAll('input[type=\"text\"]'));
      const landmarkNameInput = customInputs.find(i => i.placeholder?.includes('School') || i.placeholder?.includes('Mall'));
      const landmarkDistInput = customInputs.find(i => i.placeholder?.includes('km'));
      const addLandmarkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ADD AREA'));

      const setNative = (el, val) => {
        const proto = window.HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      if (landmarkNameInput && landmarkDistInput && addLandmarkBtn) {
        setNative(landmarkNameInput, 'Agra Club & Polo Grounds');
        setNative(landmarkDistInput, '2.0 km');
        addLandmarkBtn.click();
      }

      // Check updated landmarks
      const updatedLandmarks = Array.from(document.querySelectorAll('.shadow-2xs')).map(c => c.innerText.replace(/\\n/g, ' ').trim());

      return JSON.stringify({
        customLandmarkAdded: updatedLandmarks.some(l => l.includes('Agra Club & Polo Grounds')),
        updatedLandmarks
      }, null, 2);
    })()
  `));
  console.log('Step 3 Interactivity Result:', JSON.stringify(step3InteractivityTest, null, 2));

  // Advance to Step 4
  console.log('\n--- TEST 4: Step 4 (Legal Verification & Owner Contact) ---');
  runSafariJS(`
    (() => {
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('CONTINUE TO LEGAL'));
      continueBtn?.click();
    })()
  `);
  await sleep(1000);

  const step4Data = JSON.parse(runSafariJS(`
    (() => {
      const h3 = document.querySelector('h3')?.innerText;
      const verifyToggles = ['verify-status-yes', 'verify-status-process', 'verify-status-no'].map(id => {
        const el = document.getElementById(id);
        return el ? { id, text: el.innerText.replace(/\\n/g, ' ').trim(), selected: el.className.includes('ring-2') } : null;
      });

      const authoritySelect = document.getElementById('verified-authority-select');
      const authorityOptions = authoritySelect ? Array.from(authoritySelect.options).map(o => o.value) : [];

      const docNumberInput = Array.from(document.querySelectorAll('input')).find(i => i.placeholder?.includes('ADA/') || i.placeholder?.includes('UPRERA'));

      const ownerNameInput = document.getElementById('post-owner-name');
      const ownerPhoneInput = document.getElementById('post-owner-phone');
      const ownerEmailInput = document.getElementById('post-owner-email');

      const discretionCard = document.querySelector('.bg-emerald-50.border-emerald-200')?.innerText.replace(/\\n/g, ' ').trim();
      const submitBtn = document.getElementById('submit-post-property-final-btn');

      return JSON.stringify({
        h3,
        verifyToggles,
        authorityOptions,
        docNumberInputPresent: !!docNumberInput,
        docNumberPlaceholder: docNumberInput?.placeholder,
        ownerInputs: {
          name: ownerNameInput ? { value: ownerNameInput.value, required: ownerNameInput.required, placeholder: ownerNameInput.placeholder } : null,
          phone: ownerPhoneInput ? { value: ownerPhoneInput.value, required: ownerPhoneInput.required, placeholder: ownerPhoneInput.placeholder } : null,
          email: ownerEmailInput ? { value: ownerEmailInput.value, required: ownerEmailInput.required, placeholder: ownerEmailInput.placeholder } : null
        },
        discretionCard,
        submitBtn: submitBtn ? { text: submitBtn.innerText.trim(), class: submitBtn.className } : null
      }, null, 2);
    })()
  `));
  console.log('Step 4 Audit Result:', JSON.stringify(step4Data, null, 2));

  // TEST 5: Form Submission & Post-Submission Experience
  console.log('\n--- TEST 5: Form Submission & Post-Submission Confirmation ---');
  const submissionResult = JSON.parse(runSafariJS(`
    (() => {
      const submitBtn = document.getElementById('submit-post-property-final-btn');
      if (!submitBtn) return JSON.stringify({ error: 'Submit button not found' });
      
      submitBtn.click();

      // Check immediate DOM state after submit click
      const h2 = document.querySelector('h2')?.innerText;
      const successCard = document.querySelector('.text-center.space-y-5');
      const successText = successCard?.innerText.replace(/\\n/g, ' ').trim();
      const postSubmitButtons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());

      return JSON.stringify({
        submittedH2: h2,
        successText,
        postSubmitButtons,
        hasWhatsAppConciergeBtn: postSubmitButtons.some(b => /whatsapp|concierge|chat/i.test(b)),
        hasReferenceId: /RAE-\\d{6}/.test(successText || ''),
        referenceIdMatch: (successText || '').match(/RAE-\\d{6}/)?.[0] || null
      }, null, 2);
    })()
  `));
  console.log('Submission Result:', JSON.stringify(submissionResult, null, 2));

  // Check if network request was logged
  console.log('\n--- TEST 6: Network API Health Check on /api/properties.php ---');
  try {
    const apiHealth = execSync('curl -s -X POST -H "Content-Type: application/json" -d "{\\"ping\\": true}" https://royalagraestate.in/api/properties.php', { encoding: 'utf8' });
    console.log('API /api/properties.php response:', apiHealth.slice(0, 300));
  } catch (err) {
    console.log('API call error:', err.message);
  }

  // TEST 7: Safari Layout, Responsive Font Sizes & Mobile Quirks
  console.log('\n--- TEST 7: Safari Layout & Viewport Font Audit ---');
  const layoutAudit = JSON.parse(runSafariJS(`
    (() => {
      const allInputs = Array.from(document.querySelectorAll('input, select, textarea'));
      const fontSizes = allInputs.map(el => {
        const computed = window.getComputedStyle(el);
        return {
          id: el.id || el.name || el.tagName,
          fontSize: computed.fontSize,
          fontSizePx: parseFloat(computed.fontSize),
          willTriggerMobileSafariAutoZoom: parseFloat(computed.fontSize) < 16
        };
      });

      return JSON.stringify({
        totalInputsTested: fontSizes.length,
        inputsUnder16px: fontSizes.filter(f => f.willTriggerMobileSafariAutoZoom),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      }, null, 2);
    })()
  `));
  console.log('Layout & Safari Font Audit:', JSON.stringify(layoutAudit, null, 2));

  console.log('\n=== AUDIT COMPLETE ===');
}

runFullSellerAudit().catch(console.error);
