# Manifest Specification

This document describes the Chrome extension manifest and what each field does.

## manifest.json Reference

```json
{
  "manifest_version": 3
}
```
- **Latest Chrome standard** - Required for Chrome 88+
- Must be version 3 for modern Chrome

```json
  "name": "Alt Text Generator for Showit",
  "version": "1.0.0",
  "description": "Automatically generates AI-powered alt text for images without alt attributes on Showit."
}
```
- **name**: Displayed in Chrome extension store
- **version**: For tracking updates (semantic versioning)
- **description**: Shows in extension details

```json
  "permissions": [
    "scripting",
    "activeTab",
    "storage"
  ]
}
```
- **scripting**: Inject content scripts into pages
- **activeTab**: Access current active tab
- **storage**: Save/retrieve data from Chrome storage

```json
  "host_permissions": [
    "https://*.showit.co/*"
  ]
}
```
- **host_permissions**: Specifies which websites the extension can run on
- **https://*.showit.co/\***: Matches all Showit URLs
  - `*` = any subdomain
  - `/*` = any path on domain

```json
  "action": {
    "default_popup": "popup.html",
    "default_title": "Generate Alt Text"
  }
}
```
- **action**: Defines the browser action button
- **default_popup**: HTML file shown when user clicks icon
- **default_title**: Tooltip text when hovering over icon

```json
  "background": {
    "service_worker": "background.js"
  }
}
```
- **service_worker**: Runs in background to handle events
- Replaces old "background scripts" in Manifest v2

```json
  "content_scripts": [
    {
      "matches": ["https://*.showit.co/*"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ]
}
```
- **matches**: Which URLs to run the script on
- **js**: JavaScript files to inject
- **run_at**: When to run (document_end = after DOM loads)

```json
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```
- **icons**: Extension icons in different sizes
- Used throughout Chrome UI

```json
  "options_page": "options.html"
}
```
- **options_page**: Settings page shown when user clicks "Options"

## Manifest v3 Changes from v2

| Feature | v2 | v3 |
|---------|----|----|
| Background Scripts | `"scripts": []` | `"service_worker": "file.js"` |
| Permissions | Optional for most | Required explicitly |
| Host Permissions | In permissions | Separate `host_permissions` |
| Content Scripts | Yes | Yes (same) |
| Storage API | `chrome.storage` | `chrome.storage` (same) |
| Message Passing | Yes | Yes (same) |

## File Requirements

For this extension to load, Chrome requires:

✅ **manifest.json** - Must be valid JSON  
✅ **popup.html** - Defined in action.default_popup  
✅ **popup.js** - Referenced in popup.html  
✅ **content.js** - Defined in content_scripts  
✅ **background.js** - Defined in background service_worker  
✅ **options.html** - Defined in options_page  
✅ **options.js** - Referenced in options.html  
✅ **icons/** - Directory with icon files  

Missing files will cause load errors.

## Permissions Explained

### scripting
- Allows injecting and executing JavaScript on web pages
- Required to inject content.js

### activeTab
- Allows extension to access the currently active tab
- Required to send messages to content script

### storage
- Allows saving data in Chrome storage
- Required to save and retrieve API key

### host_permissions: "https://*.showit.co/*"
- Allows accessing content on Showit pages
- Required to find and modify images
- Uses pattern matching:
  - `*` = any subdomain
  - `showit.co` = exact domain
  - `/*` = any path
  - `https://` = only secure connections

## Pattern Matching

The pattern `https://*.showit.co/*` matches:

✅ `https://www.showit.co/`  
✅ `https://app.showit.co/portfolio`  
✅ `https://editor.showit.co/my-site`  
✅ `https://any-subdomain.showit.co/any/path`  

❌ `http://showit.co/` (not HTTPS)  
❌ `https://showit.com/` (wrong domain)  
❌ `https://user.example.com/` (not Showit)  

## Update Process

To update the extension:

1. Increment `"version"` in manifest.json
2. Make code changes
3. Reload in Chrome (refresh button in extensions)
4. Test changes
5. Changes take effect immediately

## Version Format

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

Current: **1.0.0** - Initial release
