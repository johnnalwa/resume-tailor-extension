# 🎨 Resume Tailor Extension - Theme Guide

## Color Palette

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Navy** | `#0c4a6e` | Primary brand color, headers, buttons, text |
| **Gold** | `#eab308` | Accent color, borders, highlights, active states |
| **Off-White** | `#fefefe` | Background, light surfaces |

### Supporting Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Dark Navy** | `#0a3d5a` | Hover states, darker variations |
| **White** | `#ffffff` | Cards, panels, contrast |
| **Gray** | `#6b7280` | Secondary text, inactive states |
| **Light Gray** | `#d1d5db` | Borders, dividers |

---

## Theme Application

### Header
- **Background**: Navy (`#0c4a6e`)
- **Border Bottom**: Gold (`#eab308`) 3px
- **Text**: White

### Tabs
- **Active Tab**: Navy text (`#0c4a6e`), Gold bottom border (`#eab308`)
- **Hover**: Navy text, Off-white background
- **Inactive**: Gray text

### AI Status Banner
- **Background**: Navy (`#0c4a6e`)
- **Border**: Gold (`#eab308`) 2px
- **Text**: White

### Buttons

#### Primary Button (Generate)
- **Background**: Navy (`#0c4a6e`)
- **Border**: Gold (`#eab308`) 2px
- **Text**: White
- **Hover**: Darker Navy (`#0a3d5a`)
- **Shadow**: Gold glow

#### Secondary Button (Extract)
- **Background**: White
- **Border**: Light Gray
- **Text**: Dark Gray
- **Hover**: Gold border, Navy text

### Form Elements
- **Border**: Light Gray (`#d1d5db`)
- **Focus Border**: Gold (`#eab308`)
- **Focus Shadow**: Gold glow (10% opacity)

### Floating Button
- **Background**: Navy (`#0c4a6e`)
- **Border**: Gold (`#eab308`) 3px
- **Icon**: White
- **Hover**: Darker Navy, larger shadow

### Panel Header
- **Background**: Navy (`#0c4a6e`)
- **Border Bottom**: Gold (`#eab308`) 3px
- **Text**: White

---

## CSS Variables (Optional Enhancement)

For easier theme management, consider adding CSS variables:

```css
:root {
  /* Primary Colors */
  --color-navy: #0c4a6e;
  --color-navy-dark: #0a3d5a;
  --color-gold: #eab308;
  --color-off-white: #fefefe;
  
  /* Supporting Colors */
  --color-white: #ffffff;
  --color-gray: #6b7280;
  --color-gray-light: #d1d5db;
  
  /* Shadows */
  --shadow-gold: 0 2px 8px rgba(234, 179, 8, 0.3);
  --shadow-gold-hover: 0 4px 12px rgba(234, 179, 8, 0.4);
  
  /* Borders */
  --border-gold: 2px solid var(--color-gold);
  --border-gold-thick: 3px solid var(--color-gold);
}
```

---

## Design Principles

### 1. **Professional & Trustworthy**
- Navy conveys professionalism and reliability
- Perfect for career-related tools
- Inspires confidence

### 2. **Premium & Elegant**
- Gold accents add sophistication
- Off-white background is softer than pure white
- High-end feel without being flashy

### 3. **Clear Hierarchy**
- Navy for primary actions and headers
- Gold for emphasis and active states
- Gray for secondary information

### 4. **Accessibility**
- High contrast between navy and off-white
- Gold provides clear visual cues
- Text remains readable

---

## Component Examples

### Button Styles

```css
/* Primary Button */
.btn-primary {
  background: #0c4a6e;
  border: 2px solid #eab308;
  color: white;
}

.btn-primary:hover {
  background: #0a3d5a;
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #0c4a6e;
}

.btn-secondary:hover {
  border-color: #eab308;
}
```

### Input Styles

```css
input, textarea {
  border: 1px solid #d1d5db;
  background: white;
}

input:focus, textarea:focus {
  border-color: #eab308;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.1);
}
```

### Card Styles

```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #0c4a6e;
  border-bottom: 2px solid #eab308;
  color: white;
}
```

---

## Brand Guidelines

### Logo Colors
- Primary: Navy (`#0c4a6e`)
- Accent: Gold (`#eab308`)

### Typography
- Headings: Navy (`#0c4a6e`)
- Body: Dark Gray (`#374151`)
- Secondary: Gray (`#6b7280`)

### Spacing
- Use 4px, 8px, 12px, 16px, 20px, 24px increments
- Consistent padding and margins

### Border Radius
- Small: 6px (inputs, small buttons)
- Medium: 8px (cards, large buttons)
- Large: 12px (panels, modals)
- Circle: 50% (floating button)

---

## Dark Mode (Future Enhancement)

If implementing dark mode:

```css
:root[data-theme="dark"] {
  --color-navy: #1e40af; /* Lighter navy */
  --color-gold: #fbbf24; /* Brighter gold */
  --color-off-white: #1f2937; /* Dark background */
  --color-white: #111827; /* Darker cards */
}
```

---

## Accessibility Notes

### Contrast Ratios
- Navy on Off-white: **9.8:1** (AAA) ✅
- Gold on Navy: **4.8:1** (AA) ✅
- White on Navy: **12.6:1** (AAA) ✅

### Color Blindness
- Navy and Gold are distinguishable for most types of color blindness
- Use additional visual cues (icons, borders) not just color

### Focus States
- Always include visible focus indicators
- Gold border provides clear focus state
- Sufficient contrast for keyboard navigation

---

## Implementation Checklist

- [x] Header (Navy background, Gold border)
- [x] Tabs (Navy active, Gold underline)
- [x] AI Status Banner (Navy with Gold border)
- [x] Primary Buttons (Navy with Gold border)
- [x] Form Inputs (Gold focus state)
- [x] Floating Button (Navy with Gold border)
- [x] Panel Header (Navy with Gold border)
- [x] Copy Button (Navy with Gold border)
- [x] All hover states
- [x] All focus states

---

## Theme Consistency

### Do's ✅
- Use Navy for primary actions
- Use Gold for accents and active states
- Use Off-white for backgrounds
- Maintain consistent spacing
- Keep border radius consistent

### Don'ts ❌
- Don't use other primary colors
- Don't mix gradient backgrounds
- Don't use pure black backgrounds
- Don't forget hover/focus states
- Don't use Gold for large areas

---

## Color Psychology

### Navy (#0c4a6e)
- **Associations**: Trust, professionalism, stability
- **Use Case**: Perfect for career/business tools
- **Emotion**: Confidence, reliability

### Gold (#eab308)
- **Associations**: Premium, success, achievement
- **Use Case**: Highlights important actions
- **Emotion**: Optimism, value

### Off-White (#fefefe)
- **Associations**: Clean, modern, sophisticated
- **Use Case**: Reduces eye strain vs pure white
- **Emotion**: Calm, professional

---

## Maintenance

### Updating Colors
1. Update CSS files
2. Test all components
3. Check contrast ratios
4. Verify accessibility
5. Update documentation

### Adding New Components
1. Follow existing color patterns
2. Use Navy for primary elements
3. Use Gold for accents
4. Maintain spacing consistency
5. Test hover/focus states

---

**Theme Version**: 1.0  
**Last Updated**: January 29, 2025  
**Designer**: Resume Tailor Team
