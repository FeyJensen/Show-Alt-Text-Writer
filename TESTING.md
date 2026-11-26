# Testing Guide

## Test Cases

### Setup Tests

#### Test 1: Extension Installation
- [ ] Load extension via `chrome://extensions/` with Developer mode on
- [ ] Extension appears in list
- [ ] Extension icon appears in toolbar
- **Expected**: Extension loads without errors

#### Test 2: First Run
- [ ] Click extension icon after installation
- [ ] Should prompt to open settings (or show "API key not configured")
- [ ] Click "API Key Setup" link
- **Expected**: Settings page opens in new tab

#### Test 3: Save API Key
- [ ] Go to settings page
- [ ] Enter a valid Google Gemini API key
- [ ] Click "💾 Save API Key"
- [ ] See success message
- **Expected**: Message says "API key saved successfully"

#### Test 4: Clear API Key
- [ ] In settings, click "🗑️ Clear"
- [ ] Confirm in dialog
- [ ] See "API key cleared" message
- **Expected**: Settings are cleared and can enter new key

---

### Functionality Tests

#### Test 5: Generate Alt Text (Simple)
- [ ] Go to a Showit website with images
- [ ] Click extension icon
- [ ] Click "Generate Alt Text"
- [ ] Check the popup for results
- **Expected**: Shows number of images processed and alt text generated

#### Test 6: Detect Images Without Alt Text
- [ ] On a Showit page, right-click an image > Inspect
- [ ] Check if `<img alt="">` or `<img>` (no alt attribute)
- [ ] Run the extension
- **Expected**: Extension only processes images without meaningful alt text

#### Test 7: DOM Updates
- [ ] After running extension, inspect an image that was processed
- [ ] Look for the new `alt="..."` attribute
- [ ] The alt text should be descriptive and under 125 characters
- **Expected**: Image now has alt attribute with generated text

#### Test 8: Multiple Images
- [ ] Find a Showit page with 5+ images without alt text
- [ ] Run the extension
- [ ] Check the stats in the popup
- **Expected**: Shows all images were processed

#### Test 9: Skip Images With Alt Text
- [ ] Find images with existing alt text on Showit
- [ ] Run the extension
- [ ] Check stats - these should not be in "generated" count
- **Expected**: Only images without alt text are processed

#### Test 10: Error Handling - No API Key
- [ ] Go to settings and clear API key
- [ ] Go back to Showit page
- [ ] Run extension
- **Expected**: Shows error "API key not configured"

#### Test 11: Error Handling - Invalid API Key
- [ ] Go to settings
- [ ] Enter an invalid/fake API key
- [ ] Run extension on a Showit page
- **Expected**: Shows "API error: Unauthorized" or similar

#### Test 12: Cross-Origin Images
- [ ] Find a Showit page with images from different domains
- [ ] Run extension
- **Expected**: Either processes or gracefully skips blocked images

---

### Browser Compatibility Tests

#### Test 13: Chrome Latest
- [ ] Run all tests above on latest Chrome version
- **Expected**: All features work

#### Test 14: Different Showit Pages
- [ ] Test on Showit home page (if accessible)
- [ ] Test on a Showit portfolio/editor
- [ ] Test on different Showit user sites
- **Expected**: Extension works consistently

---

### Performance Tests

#### Test 15: Large Number of Images
- [ ] Find or create a Showit page with 20+ images
- [ ] Run extension
- [ ] Time how long it takes
- **Expected**: Processes within reasonable time (should be ~2-5 seconds total)

#### Test 16: Memory Usage
- [ ] Open DevTools > Performance
- [ ] Record while running extension
- [ ] Check memory doesn't spike dramatically
- **Expected**: Memory remains stable

---

### UI/UX Tests

#### Test 17: Popup Display
- [ ] Click extension icon
- [ ] Check all elements are visible and styled correctly
- [ ] Check buttons are clickable
- **Expected**: Clean, professional appearance

#### Test 18: Settings Page
- [ ] Open settings page
- [ ] Check all form elements work
- [ ] Check links are functional
- **Expected**: Settings page is responsive and intuitive

#### Test 19: Status Messages
- [ ] Try various operations
- [ ] Verify status messages appear and disappear
- **Expected**: Clear feedback for all actions

---

### Edge Cases

#### Test 20: Empty Page
- [ ] Go to a Showit page with no images
- [ ] Run extension
- **Expected**: Shows "No images without alt text found!"

#### Test 21: Very Large Images
- [ ] Test with large image files
- [ ] Check if processing is slow
- **Expected**: Either processes or shows appropriate error

#### Test 22: Images with Only Whitespace Alt
- [ ] Find image with `alt="  "` (spaces only)
- [ ] Run extension
- **Expected**: Treated as missing alt text and processed

#### Test 23: Reload Page After Alt Text Added
- [ ] Add alt text to images
- [ ] Reload page (Cmd+R)
- [ ] Check if alt text persists
- **Expected**: Alt text should stay (it's in the DOM)

---

## Manual Test Checklist

```
SETUP
[ ] Extension installs without errors
[ ] Extension icon visible in toolbar
[ ] Settings page accessible
[ ] Can save and load API key
[ ] Can clear API key

FUNCTIONALITY
[ ] Finds images without alt text
[ ] Generates appropriate descriptions
[ ] Only processes images needing alt text
[ ] Updates DOM correctly
[ ] Shows accurate statistics
[ ] Handles errors gracefully

PERFORMANCE
[ ] Processes images in reasonable time
[ ] Memory usage is acceptable
[ ] No browser hangs or crashes

UI/UX
[ ] Popup is clean and readable
[ ] All buttons are responsive
[ ] Status messages are clear
[ ] Settings page is user-friendly

SHOWIT COMPATIBILITY
[ ] Works on Showit pages
[ ] Respects page layout
[ ] Doesn't interfere with page functionality
```

---

## Debugging Tips

### View Extension Logs
1. Go to `chrome://extensions/`
2. Find the extension
3. Click "Errors" to see any JavaScript errors
4. Click "Background page" to see logs

### View Content Script Logs
1. Right-click on page > Inspect
2. Go to Console tab
3. Run extension and watch for messages

### Test API Directly
Use curl to test your API key:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "What is in this image?"
      }]
    }]
  }'
```

### View Storage
1. Right-click extension icon > Manage extension
2. Scroll to "Storage"
3. Click on "Sync storage" to see saved API key

---

## Test Report Template

```
Date: ___________
Tester: ___________
Chrome Version: ___________

Tests Passed: _____ / 23
Tests Failed: _____ / 23

Failed Tests:
- 
- 
- 

Notes:
_______________________
_______________________
_______________________

Issues Found:
_______________________
_______________________
_______________________
```
