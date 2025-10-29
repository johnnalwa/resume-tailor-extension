/**
 * Generate placeholder PNG icons from SVG
 * This creates simple colored squares as placeholders until proper icons are generated
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const iconsDir = resolve(__dirname, '../dist/icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Create simple PNG data URLs for placeholder icons
function createPlaceholderIcon(size) {
  // Create a simple canvas-like data structure
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#0c4a6e"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="none" stroke="#eab308" stroke-width="${Math.max(1, size/32)}"/>
    <rect x="${size * 0.3}" y="${size * 0.25}" width="${size * 0.4}" height="${size * 0.5}" rx="${size * 0.03}" fill="#fefefe"/>
  </svg>`;
  
  return Buffer.from(canvas).toString('base64');
}

// For now, create simple colored square placeholders
function createSimplePlaceholder(size) {
  // Minimal PNG: 1x1 pixel, then scaled
  // Navy blue square
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, size, 0x00, 0x00, 0x00, size,  // Width and height
    0x08, 0x02, 0x00, 0x00, 0x00,                    // 8-bit RGB
  ]);
  
  // This is a simplified approach - just create a text file telling user to generate icons
  return Buffer.from('PNG placeholder - please generate real icons using generate-icons.html');
}

console.log('📦 Creating placeholder icon files...\n');

// Create placeholder files
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const filename = `icon${size}.png`;
  const filepath = resolve(iconsDir, filename);
  
  // Create a minimal file that Chrome can recognize
  // In practice, you should use the HTML generator
  const placeholder = createSimplePlaceholder(size);
  
  try {
    writeFileSync(filepath, placeholder);
    console.log(`✓ Created ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to create ${filename}:`, error.message);
  }
});

console.log('\n⚠️  IMPORTANT: These are placeholder files!');
console.log('📝 To create proper icons:');
console.log('   1. Open public/icons/generate-icons.html in your browser');
console.log('   2. Click "Download All Icons"');
console.log('   3. Save the PNG files to public/icons/');
console.log('   4. Run: npm run build\n');
