/**
 * Post-build script
 * Copies necessary files to dist folder and validates build
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const distDir = join(rootDir, 'dist');
const publicDir = join(rootDir, 'public');

console.log('🔧 Running post-build tasks...\n');

/**
 * Copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`✓ Copied: ${entry.name}`);
    }
  }
}

/**
 * Validate required files exist
 */
function validateBuild() {
  const requiredFiles = [
    'manifest.json',
    'popup.html',
    'service-worker.js',
    'content.js',
    'content.css'
  ];

  console.log('\n📋 Validating build...\n');

  let allValid = true;

  for (const file of requiredFiles) {
    const filePath = join(distDir, file);
    if (existsSync(filePath)) {
      const stats = statSync(filePath);
      console.log(`✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
      console.error(`✗ Missing: ${file}`);
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Main execution
 */
try {
  // Copy icons if they exist
  const iconsDir = join(publicDir, 'icons');
  if (existsSync(iconsDir)) {
    console.log('📁 Copying icons...\n');
    copyDirectory(iconsDir, join(distDir, 'icons'));
  } else {
    console.log('⚠️  No icons directory found. You may need to add icons manually.\n');
  }

  // Validate build
  const isValid = validateBuild();

  if (isValid) {
    console.log('\n✅ Build completed successfully!');
    console.log('\n📦 Extension is ready in the dist/ folder');
    console.log('\n🚀 To load in Chrome:');
    console.log('   1. Open chrome://extensions/');
    console.log('   2. Enable "Developer mode"');
    console.log('   3. Click "Load unpacked"');
    console.log('   4. Select the dist/ folder\n');
  } else {
    console.error('\n❌ Build validation failed!');
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Post-build error:', error.message);
  process.exit(1);
}
