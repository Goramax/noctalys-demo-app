import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as sass from 'sass';

// === CONSTANTS ===
const CONFIG_PATH = 'config.json';
const PUB_DIR = 'public/assets';
const CSS_DIR = path.join(PUB_DIR, 'css');
const MANIFEST_PATH = path.join(PUB_DIR, 'manifest.json');
const COMBINED_FILE_NAME = '_NoctalysCombined.scss';

// === LOADING CONFIGURATION ===
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Could not find config.json. Please create it in the root directory.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const assetSources = config.assets?.sources ?? [];
const styleEntries = config.assets?.styles ?? ['main.scss'];
const pageSources = config.router?.page_scan ?? [];

// === FIND THE FIRST STYLES FOLDER ===
const stylesFolder = (() => {
  for (const src of assetSources) {
    const dir = path.join(src.path, src.folder_name, 'styles');
    if (fs.existsSync(dir)) return dir;
  }
  console.error('No styles folder found in asset sources.');
  process.exit(1);
})();

// === CLEAR DESTINATION FOLDER ===
if (fs.existsSync(CSS_DIR)) {
  // Remove all CSS files but keep the directory structure
  for (const file of fs.readdirSync(CSS_DIR)) {
    const filePath = path.join(CSS_DIR, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }
} else {
  // Create the directory if it doesn't exist
  fs.mkdirSync(CSS_DIR, { recursive: true });
}

// === GENERATE COMBINED CONTENT ===
const combinedLines = [];

// 1. Include files defined in config.assets.styles using @use instead of @import
for (const styleFile of styleEntries) {
  for (const src of assetSources) {
    const filePath = path.join(src.path, src.folder_name, 'styles', styleFile);
    if (fs.existsSync(filePath)) {
      const rel = path.relative(stylesFolder, filePath).replace(/\\/g, '/');
      // Convert filename to namespace by removing extension and converting special chars to underscores
      const namespace = path.basename(rel, path.extname(rel))
        .replace(/[^a-zA-Z0-9_]/g, '_');
      combinedLines.push(`@use "./${rel}" as ${namespace};`);
      break;
    }
  }
}

// 2. Inject .scss files from pages, encapsulated in [data-view=...]
// Page styles don't need @use as they're directly embedded in the combined file
function scanPagesRecursively(pagesRoot, relativePath = '') {
  if (!fs.existsSync(pagesRoot)) return;

  for (const item of fs.readdirSync(pagesRoot)) {
    const itemPath = path.join(pagesRoot, item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      // Recursively scan subdirectories
      const currentRelativePath = relativePath ? `${relativePath}/${item}` : item;
      scanPagesRecursively(itemPath, currentRelativePath);
    } else if (item.endsWith('.view.php')) {
      // Found a view file, extract the base name and look for corresponding SCSS
      const baseName = item.replace('.view.php', '');
      const scssFile = path.join(pagesRoot, `${baseName}.scss`);
      
      if (fs.existsSync(scssFile)) {
        const content = fs.readFileSync(scssFile, 'utf-8');
        // Use the base name as string (quoted for numeric values)
        const dataViewName = baseName;
        const currentRelativePath = relativePath ? `${relativePath}/${baseName}` : baseName;
        combinedLines.push(`\n/* Styles for ${currentRelativePath} */\n[data-view="${dataViewName}"] {\n${content}\n}`);
      }
    }
  }
}

for (const pageScan of pageSources) {
  const pagesRoot = path.join(pageScan.path, pageScan.folder_name);
  scanPagesRecursively(pagesRoot);
}

// 3. Write the _combined.scss file
const combinedPath = path.join(stylesFolder, COMBINED_FILE_NAME);
fs.mkdirSync(stylesFolder, { recursive: true });
fs.writeFileSync(combinedPath, combinedLines.join('\n'));

// === SCSS COMPILATION ===
const result = sass.compile(combinedPath, {
  style: 'compressed',
  loadPaths: [stylesFolder]
});
const hash = crypto.createHash('md5').update(result.css).digest('hex').substring(0, 8);
const outputFile = `main.${hash}.css`;
const outputPath = path.join(CSS_DIR, outputFile);

// Write the compiled CSS file
fs.writeFileSync(outputPath, result.css);

// Remove the temporary _combined.scss file
try {
  fs.unlinkSync(combinedPath);
} catch (error) {
  console.warn(`Could not remove temporary file: ${error.message}`);
}

// === WRITE UNIFIED MANIFEST ===
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

// Update manifest with CSS asset - only change the CSS entries, preserve others
manifest['main.css'] = `css/${outputFile}`;

// Ensure parent directory exists
fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

// Write updated manifest
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`✅ Compilation successful → ${outputFile}`);
console.log(`📝 Manifest updated in ${MANIFEST_PATH}`);
