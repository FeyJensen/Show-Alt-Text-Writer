# Project Files Overview

## 📋 Complete File Listing

### Core Extension Files (Required)

| File | Size | Purpose | Type |
|------|------|---------|------|
| **manifest.json** | 742 B | Extension configuration & permissions | JSON |
| **popup.html** | 3.4 KB | Popup UI | HTML |
| **popup.js** | 1.7 KB | Popup logic & event handling | JavaScript |
| **content.js** | 4.1 KB | Main processing logic | JavaScript |
| **background.js** | 180 B | Background service worker | JavaScript |
| **options.html** | 5.1 KB | Settings page UI | HTML |
| **options.js** | 1.7 KB | Settings logic | JavaScript |
| **icons/icon-16.png** | 1.2 KB | 16x16 icon | PNG |
| **icons/icon-48.png** | 1.8 KB | 48x48 icon | PNG |
| **icons/icon-128.png** | 4.5 KB | 128x128 icon | PNG |

**Total Core Size**: ~24 KB (without icons) or ~28 KB total

### Documentation Files (Reference)

| File | Size | Purpose | For Who |
|------|------|---------|---------|
| **README.md** | 4.8 KB | Complete documentation | Everyone |
| **QUICKSTART.md** | 3.3 KB | 5-minute setup guide | First-time users |
| **PROJECT_SUMMARY.md** | 8.8 KB | Architecture & overview | Developers |
| **TESTING.md** | 6.7 KB | Test cases & verification | QA & Developers |
| **TROUBLESHOOTING.md** | 10.6 KB | Problem solving | Users with issues |
| **MANIFEST_SPEC.md** | 3.2 KB | Manifest detailed reference | Developers |
| **FILES_OVERVIEW.md** | This file | File inventory | Developers |

---

## 🔧 Core Extension Files Detailed

### manifest.json
```
Purpose: Chrome extension configuration
Defines:
  - Extension metadata (name, version, description)
  - Required permissions (scripting, storage, etc.)
  - Target websites (host_permissions)
  - Entry points (popup, background worker, content scripts)
  - Icons for display
  - Settings page location

Changes Required: 
  - Version number when releasing updates
  - Host permissions if adding more websites
```

### popup.html / popup.js
```
Purpose: User interface shown when clicking extension icon

popup.html contains:
  - Title and status display
  - "Generate Alt Text" button
  - Settings link
  - Statistics display area
  - Styling for professional appearance

popup.js handles:
  - Button clicks
  - Message passing to content script
  - Display of results and stats
  - Settings page opening
```

### content.js
```
Purpose: Runs on Showit pages to process images

Main functions:
  - generateAltTextForImages() - Main entry point
  - generateAltTextForImage() - Process single image
  - imageToBase64() - Convert image for API
  - callGeminiAPI() - Call Google Gemini API

Flow:
  1. Find all <img> without alt text
  2. Convert each to base64
  3. Send to Google Gemini API
  4. Receive generated alt text
  5. Update DOM with new alt text
  6. Report stats back to popup
```

### background.js
```
Purpose: Background service worker

Handles:
  - Extension installation events
  - Opening settings page on first install

Modern Manifest v3 requirement:
  - Replaces old "background scripts"
  - Lightweight, runs only when needed
```

### options.html / options.js
```
Purpose: Settings page for API key configuration

options.html shows:
  - Instructions for getting API key
  - Secure password input field
  - Save and Clear buttons
  - Privacy information

options.js handles:
  - Saving API key to Chrome storage
  - Loading existing API key
  - Clearing API key with confirmation
  - Status messages and validation

Storage:
  - Uses Chrome's sync storage
  - Encrypted and cloud-synced
  - Persists across browser sessions
```

---

## 📚 Documentation Files Detailed

### README.md
**Length**: ~4.8 KB  
**Audience**: Everyone  
**Contains**:
- Feature overview
- Installation instructions
- Usage guide
- How it works explanation
- API limitations
- Troubleshooting basics
- Future enhancement ideas
- File structure

**When to Read**: First thing - gives complete overview

### QUICKSTART.md
**Length**: ~3.3 KB  
**Audience**: First-time users  
**Contains**:
- 5-minute setup steps
- Verification checklist
- Troubleshooting for common issues
- Learning resources

**When to Read**: Before installing for step-by-step guidance

### PROJECT_SUMMARY.md
**Length**: ~8.8 KB  
**Audience**: Developers  
**Contains**:
- Architecture explanation
- Component descriptions
- Data flow diagrams
- Security considerations
- API details
- Limitations and best practices
- Future enhancements

**When to Read**: Before modifying code or understanding design

### TESTING.md
**Length**: ~6.7 KB  
**Audience**: QA, Developers  
**Contains**:
- 23 detailed test cases
- Setup verification
- Functionality testing
- Edge cases
- Manual checklist
- Debugging tips
- Test report template

**When to Read**: Before releasing or verifying functionality

### TROUBLESHOOTING.md
**Length**: ~10.6 KB  
**Audience**: Users having issues  
**Contains**:
- Common problems with solutions
- Installation issues
- Configuration problems
- API errors
- Performance issues
- Privacy concerns
- Advanced debugging
- Quick fix checklist

**When to Read**: When something isn't working

### MANIFEST_SPEC.md
**Length**: ~3.2 KB  
**Audience**: Developers  
**Contains**:
- manifest.json field reference
- Permission explanations
- Manifest v3 changes
- File requirements
- Pattern matching rules
- Update process

**When to Read**: Before modifying manifest or understanding permissions

---

## 🎨 Icon Files

### icons/ Directory
Contains three PNG files for different sizes:

| Icon | Size | Use |
|------|------|-----|
| icon-16.png | 16×16 px | Tab/small displays |
| icon-48.png | 48×48 px | Extension list, context menu |
| icon-128.png | 128×128 px | Chrome Web Store |

**Format**: Purple gradient background with white "ALT" text  
**Design**: Simple, recognizable, accessible

---

## 📊 File Dependencies

```
manifest.json (ROOT)
├── popup.html
│   └── popup.js
├── options.html
│   └── options.js
├── content.js (injected on matching pages)
├── background.js (service worker)
└── icons/ (all three required)
```

**All files must be present** for extension to load properly.

---

## 💾 Total Project Size

| Category | Files | Size |
|----------|-------|------|
| Core Extension | 10 | ~28 KB |
| Documentation | 7 | ~41 KB |
| **Total** | **17** | **~69 KB** |

**Very lightweight!** Minimal download and storage.

---

## 🔄 Modification Guide

### To Update the Extension

1. **Change Logic**: Edit `content.js`
2. **Change UI**: Edit `popup.html` and `popup.js`
3. **Change Settings**: Edit `options.html` and `options.js`
4. **Change Permissions**: Edit `manifest.json`
5. **Update Version**: Edit `manifest.json` version field
6. **Reload in Chrome**: Go to chrome://extensions/ and click refresh

### To Add Documentation

1. Add new .md file in root directory
2. Link it from README.md
3. Keep it organized and well-formatted

### To Update Icons

1. Replace files in `icons/` directory
2. Ensure all three sizes present (16, 48, 128)
3. PNG format required
4. No need to restart extension

---

## 🚀 Deployment Checklist

Before releasing:

- [ ] All core files present (manifest + 7 JS/HTML files + 3 icons)
- [ ] manifest.json is valid JSON
- [ ] Version number incremented
- [ ] All documentation updated
- [ ] Testing checklist passed
- [ ] No hardcoded API keys
- [ ] No debug console.log statements

---

## 📝 Notes

- All files are plain text (except images)
- No build process required
- No dependencies to install
- Ready to load directly into Chrome
- Well-structured for future maintenance
- Comprehensive documentation for users and developers

---

## 📞 Support

For questions about files:
- See **README.md** for feature documentation
- See **PROJECT_SUMMARY.md** for architecture
- See **MANIFEST_SPEC.md** for technical details
- See **TROUBLESHOOTING.md** for problem solving
