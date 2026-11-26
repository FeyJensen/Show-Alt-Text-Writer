# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Extension Won't Load
**Problem**: Loading the extension fails with an error
**Solutions**:
1. Check that Developer mode is enabled (`chrome://extensions/`)
2. Verify the folder path contains all required files:
   - `manifest.json`
   - `popup.html`, `popup.js`
   - `content.js`
   - `options.html`, `options.js`
   - `background.js`
3. Check Chrome console for specific errors (Extensions > Errors)
4. Try loading from a different folder location
5. Restart Chrome and try again

#### Icon Not Showing in Toolbar
**Problem**: Extension installed but icon doesn't appear
**Solutions**:
1. Click extension icon (should show in top-right area)
2. Right-click extension icon > "Pin to toolbar"
3. If still hidden, go to `chrome://extensions/` and find the extension
4. Click the pin icon next to it

---

### Configuration Issues

#### "API key not configured" Message
**Problem**: Can't save or find API key
**Solutions**:
1. Click "API Key Setup" link in popup
2. Paste your Google Gemini API key
3. Click "💾 Save API Key"
4. Wait for success message
5. Try again on a Showit page

#### Can't Find Google Gemini API Key
**Problem**: Not sure how to get an API key
**Solutions**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. If not logged in, click "Sign in" and use your Google account
3. Click "Create API key"
4. Select "Create API key in a new Google Cloud project"
5. The key will be shown and copied automatically
6. If you lose it, generate a new one from the same page

#### API Key Not Saving
**Problem**: Settings page shows success but key doesn't persist
**Solutions**:
1. Check Chrome's sync storage is enabled:
   - Settings > Sync and Google services
   - Make sure "Sync everything" or "Extensions" is checked
2. Try clearing the extension data:
   - Right-click extension > "Manage extension"
   - Under "Storage", click "Clear data"
   - Set your API key again
3. Try a different browser profile
4. Restart Chrome

---

### API Issues

#### "API Error: Unauthorized"
**Problem**: Extension can't authenticate with Google
**Solutions**:
1. Verify API key is correct - copy it again from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check the API key hasn't expired (they don't, but re-generate if unsure)
3. Verify Generative AI API is enabled:
   - In Google Cloud Console, check the project has the API enabled
   - API list should show "Generative Language API"
4. Try with a fresh API key:
   - Delete current key in extension settings
   - Generate a new one in Google AI Studio
   - Add it to the extension

#### Rate Limit Errors
**Problem**: "429 Too Many Requests" or similar
**Solutions**:
1. This means you've exceeded your free tier quota
2. Wait a bit and try again later (quota resets daily)
3. Options to increase limit:
   - Create a new Google Cloud project (gets new quota)
   - Set up billing in Google Cloud Console
   - Request quota increase in Google Cloud Console

#### "API Error" Without Details
**Problem**: Generic API error message
**Solutions**:
1. Open browser console (F12 > Console tab) and run extension again
2. Look for detailed error message in console
3. Common causes:
   - Network connectivity issue
   - Google servers temporarily down
   - Invalid image format

---

### Functionality Issues

#### No Images Being Processed
**Problem**: Extension runs but doesn't process any images
**Solutions**:
1. Verify you're on a Showit page (must be `https://showit.co/...`)
2. Check if page actually has images:
   - Right-click page > Inspect
   - Search (Ctrl+F) for `<img` tags
   - Look for images without `alt=""` attribute
3. Some images might be:
   - Loaded via CSS background-image (can't process these)
   - Blocked by CORS (cross-origin restrictions)
   - In iframes (may not be accessible)
4. Try on a different Showit page to test

#### Some Images Not Getting Alt Text
**Problem**: Extension processes some images but skips others
**Solutions**:
1. This is usually normal - check the failed images:
   - Right-click page > Inspect
   - Find an image that wasn't processed
   - Check the `src` attribute
2. Possible reasons for skipping:
   - Image is blocked by CORS policy
   - Image didn't load properly
   - Image is very large
   - API hit rate limit mid-process
3. Try reloading the page and running again
4. Check browser console for specific error messages

#### Alt Text Disappears After Reload
**Problem**: Added alt text, but it's gone after page refresh
**Solutions**:
1. This is expected behavior - the extension:
   - Only modifies the page in your browser
   - Doesn't save changes to the actual website
   - Changes are lost when page reloads
2. To make changes persistent on the actual Showit page:
   - You'd need to manually save them in Showit's editor
   - Or a backend script to save changes to the server

#### Generated Alt Text is Generic or Wrong
**Problem**: Alt text doesn't accurately describe images
**Solutions**:
1. This is a limitation of AI - accuracy varies
2. The prompt could be improved (edit in `content.js` line ~90)
3. For important images, consider:
   - Letting AI generate it, then manually refining
   - Taking screenshots and providing context
   - Using more detailed images for better results

---

### Performance Issues

#### Extension is Slow
**Problem**: Takes a long time to generate alt text
**Solutions**:
1. This is normal - each image:
   - Is converted to base64
   - Sent to Google's servers
   - Processed by AI
   - Returned as text
2. With 10 images, expect 20-60 seconds depending on:
   - Internet speed
   - Image sizes
   - Google's response time
3. If it's very slow:
   - Check your internet connection
   - Try on a different network
   - Check if Google's servers are down

#### High Memory Usage
**Problem**: Extension uses a lot of memory/RAM
**Solutions**:
1. Normal for processing multiple large images
2. Memory should be released after processing completes
3. If memory stays high:
   - Close and reopen popup
   - Reload the page
   - Restart Chrome

---

### Browser-Specific Issues

#### Works in Chrome but Not Other Browsers
**Problem**: Extension only works in Chrome
**Solutions**:
1. This extension is built for Chrome only
2. For other browsers:
   - Firefox: Would need Firefox addon conversion
   - Safari: Would need Safari app extension conversion
   - Edge: Should work (Chromium-based), try loading it

#### Issues on Specific Showit Pages
**Problem**: Works on some Showit pages but not others
**Solutions**:
1. Some Showit pages use different image loading methods:
   - Regular `<img>` tags (works best)
   - Lazy-loaded images (may work)
   - CSS background images (won't work)
   - Canvas/SVG images (can't process)
2. Try on different pages to test
3. Check page structure:
   - Right-click > Inspect
   - Search for `<img>` tags
   - See if they're in iframes or shadow DOM

---

### Permission Issues

#### "Extension Blocked" or Permission Warnings
**Problem**: Chrome shows permission warnings
**Solutions**:
1. These are expected - the extension needs to:
   - Inject scripts on Showit pages (declared in manifest)
   - Access local storage (for API key)
2. To allow permissions:
   - Click on extension icon
   - Choose "This site" or "All sites on showit.co"
   - Permissions will be granted

#### Extension Disabled After Update
**Problem**: Extension was working, now it's disabled
**Solutions**:
1. Go to `chrome://extensions/`
2. Find the extension
3. Toggle it on (blue switch)
4. If still disabled, check for errors (see "Extensions Won't Load")

---

### Data Privacy Issues

#### Worried About Privacy
**Problem**: Concerned about sending images to Google
**Solutions**:
1. This is normal - images must be sent to Google's servers to process
2. Privacy considerations:
   - Google receives images but doesn't store them permanently
   - Processing is done by their AI servers
   - See Google's AI privacy policy
3. Alternatives:
   - Don't use the extension for sensitive images
   - Run locally on private server (requires backend setup)
   - Manually write alt text

#### How to Stop Sharing Data
**Solutions**:
1. Don't run the extension
2. Clear your API key (Extension > Settings > Clear)
3. Uninstall the extension
4. Delete your API key in [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Advanced Debugging

### View Console Logs
```javascript
// In browser console (F12 > Console tab), run:
chrome.storage.sync.get(['geminiApiKey'], (result) => {
  console.log('Stored API Key:', result.geminiApiKey ? '✓ Present' : '✗ Missing');
});
```

### Check if Content Script is Running
```javascript
// Visit a Showit page and run in console:
// If extension is working, you'll see messages in the console
console.log('Page ready for extension');
```

### Test API Connectivity
1. Get your API key from settings
2. Open browser console
3. Run this test:
```javascript
const apiKey = "YOUR_API_KEY_HERE";
const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

fetch(testUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: "What is 2+2?" }]
    }]
  })
})
.then(r => r.json())
.then(d => console.log('API works!', d))
.catch(e => console.error('API error:', e));
```

### View Stored Data
1. Right-click extension icon
2. Click "Manage extension"  
3. Scroll to "Storage" section
4. Click on each storage type to see what's saved

---

## Getting Help

### Still Having Issues?

1. **Check the logs**:
   - Right-click extension > Manage extension
   - Click "Errors" or "Background page"
   - Look for error messages

2. **Search for solutions**:
   - Google your error message
   - Check Chrome extension docs
   - Try GitHub issues

3. **Report the issue**:
   - Include Chrome version
   - Include error messages
   - Include steps to reproduce
   - Include which Showit page you tested on

---

## Quick Fix Checklist

✓ Reload the extension (`chrome://extensions/` > refresh icon)  
✓ Clear extension data (Manage Extension > Storage > Clear data)  
✓ Restart Chrome  
✓ Verify internet connection  
✓ Check API key is valid  
✓ Verify you're on a Showit page  
✓ Check if Showit is currently accessible  
✓ Try a different Showit page  
✓ Clear browser cache  
✓ Disable and re-enable extension  

If none of these work, there may be a deeper issue - check the browser console for specific error messages.
