import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minify } from 'terser';

// === CONSTANTS ===
const CONFIG_PATH = 'config.json';
const PUB_DIR = 'public/assets';
const JS_DIR = path.join(PUB_DIR, 'js');
const MANIFEST_PATH = path.join(PUB_DIR, 'manifest.json');

// === LOADING CONFIGURATION ===
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Could not find config.json. Please create it in the root directory.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const assetSources = config.assets?.sources ?? [];
const jsEntries = config.assets?.scripts ?? [];

// === FIND JS SOURCE FILES ===
const jsFiles = [];

// Collect all JavaScript entries from asset sources
for (const entry of jsEntries) {
  let found = false;
  
  for (const src of assetSources) {
    const scriptDir = path.join(src.path, src.folder_name, 'scripts');
    const filePath = path.join(scriptDir, entry);
    
    if (fs.existsSync(filePath)) {
      jsFiles.push({
        name: entry,
        path: filePath
      });
      found = true;
      console.log(`Found JavaScript file: ${filePath}`);
      break;
    }
  }
  
  if (!found) {
    console.warn(`JavaScript file not found: ${entry}`);
  }
}

// === CLEAR DESTINATION FOLDER ===
console.log(`Clearing destination folder: ${JS_DIR}`);
if (fs.existsSync(JS_DIR)) {
  // Remove all JS files but keep the directory structure
  for (const file of fs.readdirSync(JS_DIR)) {
    const filePath = path.join(JS_DIR, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }
} else {
  // Create the directory if it doesn't exist
  fs.mkdirSync(JS_DIR, { recursive: true });
}

// === MINIFY JS FILES ===
async function minifyFiles() {
  // Read existing manifest if it exists, or create a new one
  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch (e) {
      console.warn(`Could not parse existing manifest: ${e.message}`);
      // Continue with empty manifest
    }
  }
  
  // Process each JavaScript file
  for (const file of jsFiles) {
    const sourceCode = fs.readFileSync(file.path, 'utf-8');
    
    try {
      const result = await minify(sourceCode, {
        compress: {
          drop_console: false, // Keep console logs in development
          dead_code: true
        },
        mangle: true
      });
      
      // Generate hash based on the minified content
      const hash = crypto.createHash('md5').update(result.code).digest('hex').substring(0, 8);
      
      // Determine output filename with hash
      const fileName = path.basename(file.name, path.extname(file.name));
      const fileExt = path.extname(file.name);
      const outputFile = `${fileName}.${hash}${fileExt}`;
      const outputPath = path.join(JS_DIR, outputFile);
      
      // Write the minified file
      fs.writeFileSync(outputPath, result.code);
      console.log(`Minified: ${file.name} → ${outputFile}`);
      
      // Update manifest entry - only update JS entries, preserve others
      const originalName = path.basename(file.name);
      manifest[originalName] = `js/${outputFile}`;
      
    } catch (error) {
      console.error(`Error minifying ${file.name}: ${error.message}`);
    }
  }
  
  // Write updated manifest
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest updated in ${MANIFEST_PATH}`);
}

// Run the async minification process
minifyFiles().catch(error => {
  console.error(`Minification failed: ${error.message}`);
  process.exit(1);
});