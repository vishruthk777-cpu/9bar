const fs = require('fs');
const path = require('path');

console.log('=== Starting 9Bar Site Automated Validation ===');
let errors = 0;
let warnings = 0;

function checkFileExists(filePath, isRequired = true) {
  const absolutePath = path.resolve(__dirname, filePath);
  if (fs.existsSync(absolutePath)) {
    console.log(`[PASS] File exists: ${filePath}`);
    return true;
  } else {
    if (isRequired) {
      console.error(`[FAIL] Required file missing: ${filePath}`);
      errors++;
    } else {
      console.warn(`[WARN] Recommended file missing: ${filePath}`);
      warnings++;
    }
    return false;
  }
}

// 1. Check Core Files
console.log('\n--- Checking Core Files ---');
checkFileExists('index.html');
checkFileExists('styles.css');
checkFileExists('app.js');

// 2. Parse HTML and Validate Assets
console.log('\n--- Validating HTML Sourcing and Assets ---');
try {
  const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

  // Check SEO metadata
  if (htmlContent.includes('<title>') && htmlContent.includes('</title>')) {
    console.log('[PASS] SEO Title tag present.');
  } else {
    console.error('[FAIL] SEO Title tag missing.');
    errors++;
  }

  if (htmlContent.includes('name="description"')) {
    console.log('[PASS] SEO Description meta tag present.');
  } else {
    console.error('[FAIL] SEO Description meta tag missing.');
    errors++;
  }

  if (htmlContent.includes('name="viewport"')) {
    console.log('[PASS] Responsive Viewport meta tag present.');
  } else {
    console.error('[FAIL] Responsive Viewport meta tag missing.');
    errors++;
  }

  // Regex to find all src="assets/..." or src='assets/...'
  const assetRegex = /src=["'](assets\/[^"']+)["']/g;
  let match;
  const assetsFound = new Set();
  
  while ((match = assetRegex.exec(htmlContent)) !== null) {
    assetsFound.add(match[1]);
  }

  console.log(`\nFound ${assetsFound.size} unique asset references in HTML. Validating files...`);
  assetsFound.forEach(asset => {
    checkFileExists(asset);
  });

  // Verify all link tags referencing css
  if (htmlContent.includes('href="styles.css"')) {
    console.log('[PASS] styles.css link reference correct.');
  } else {
    console.error('[FAIL] styles.css link reference missing or incorrect.');
    errors++;
  }

  // Verify app.js script tag
  if (htmlContent.includes('src="app.js"')) {
    console.log('[PASS] app.js script reference correct.');
  } else {
    console.error('[FAIL] app.js script reference missing or incorrect.');
    errors++;
  }

} catch (err) {
  console.error(`[FAIL] Could not parse index.html: ${err.message}`);
  errors++;
}

// 3. Validation Summary
console.log('\n--- Validation Summary ---');
if (errors === 0) {
  console.log(`\x1b[32mSUCCESS: Validation completed with 0 errors and ${warnings} warnings.\x1b[0m`);
} else {
  console.error(`\x1b[31mFAILURE: Validation completed with ${errors} errors and ${warnings} warnings.\x1b[0m`);
  process.exit(1);
}
