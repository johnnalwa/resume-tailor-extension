# Extension Icons

## 🎨 Design

The Resume Tailor Extension icon features:
- **Navy blue circle** (#0c4a6e) - Professional background
- **Gold ring** (#eab308) - Premium accent
- **White document** - Represents resume/cover letter
- **Gold sparkles** - AI magic/automation
- **Gold pen** - Editing/tailoring

## 📏 Required Sizes

Chrome extensions require three icon sizes:
- **16×16** - Extension toolbar icon
- **48×48** - Extension management page
- **128×128** - Chrome Web Store listing

## 🔧 How to Generate Icons

### Option 1: Use the HTML Generator (Recommended)

1. Open `generate-icons.html` in your browser
2. Click "Download All Icons" button
3. Save the files as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
4. Place them in this folder (`public/icons/`)
5. Rebuild: `npm run build`

### Option 2: Use Online Tools

1. Go to https://www.figma.com or https://www.canva.com
2. Import `icon.svg`
3. Export at 16×16, 48×48, and 128×128 pixels
4. Save as PNG files

### Option 3: Use Command Line (ImageMagick)

```bash
# Install ImageMagick first
# Then run:
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## 📁 Files

- `icon.svg` - Source SVG file (scalable)
- `generate-icons.html` - Browser-based PNG generator
- `icon16.png` - 16×16 toolbar icon (to be generated)
- `icon48.png` - 48×48 management icon (to be generated)
- `icon128.png` - 128×128 store icon (to be generated)

## ✅ Checklist

- [x] SVG source created
- [x] Generator tool created
- [ ] Generate icon16.png
- [ ] Generate icon48.png
- [ ] Generate icon128.png
- [ ] Rebuild extension
- [ ] Test in Chrome

## 🎨 Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Navy | #0c4a6e |
| Accent Ring | Gold | #eab308 |
| Document | Off-White | #fefefe |
| Lines | Gray | #64748b |
| Pen Dark | Dark Gold | #ca8a04 |

## 📝 Notes

- Icons use the extension's brand colors
- Design is simple and recognizable at small sizes
- Gold accents make it stand out in the toolbar
- Document + sparkles clearly communicate "AI-powered resume tool"
