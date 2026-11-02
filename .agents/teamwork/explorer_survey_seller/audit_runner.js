const { execSync } = require('child_process');

const WIN_ID = 50864;

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
    const output = execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, { encoding: 'utf8' });
    return output.trim();
  } catch (err) {
    return 'EXEC_ERROR: ' + err.message;
  }
}

async function runAudit() {
  console.log('=== STARTING SELLER AUDIT ON SAFARI WINDOW', WIN_ID, '===');

  // Check current status
  const statusRaw = runSafariJS(`
    JSON.stringify({
      url: window.location.href,
      h1: document.querySelector('h1')?.innerText,
      h3: document.querySelector('h3')?.innerText,
      stepNum: document.querySelector('.bg-[#E4D5B7]')?.innerText
    })
  `);
  console.log('Current status:', statusRaw);

  // 1. Step 1 Detailed Inspection
  const step1Inspection = runSafariJS(`
    (() => {
      const intentButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Sell') || b.innerText.includes('Rent')).map(b => ({ text: b.innerText.trim(), class: b.className }));
      const propTypes = Array.from(document.querySelectorAll('#property-type-select option')).map(o => o.value);
      const localities = Array.from(document.querySelectorAll('#post-locality-select option')).map(o => o.value);
      const titleInput = document.getElementById('post-project-title');
      const addressInput = document.getElementById('post-confidential-address');
      const mapInput = document.getElementById('property-map-url-input');
      const privacyNotes = Array.from(document.querySelectorAll('p, span')).filter(el => /privacy|confidential|admin only/i.test(el.innerText)).map(el => el.innerText.trim());
      
      return JSON.stringify({
        intentButtons,
        propTypesCount: propTypes.length,
        localitiesCount: localities.length,
        titleRequired: titleInput ? titleInput.required : false,
        addressRequired: addressInput ? addressInput.required : false,
        mapInputPresent: !!mapInput,
        privacyNotes: Array.from(new Set(privacyNotes))
      }, null, 2);
    })()
  `);
  console.log('Step 1 Inspection:', step1Inspection);
}

runAudit();
