# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your API Key (2 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Select or create a new project
4. Click "Create API key in existing project"
5. Copy the key (it starts with `AIzaSy...`)

### Step 2: Load the Extension (2 minutes)

1. Open Chrome
2. Type `chrome://extensions/` in the address bar
3. Enable "Developer mode" (toggle on top-right)
4. Click "Load unpacked"
5. Navigate to this folder and select it
6. You should see the extension appear with an icon

### Step 3: Configure Your API Key (1 minute)

1. Click the extension icon in your Chrome toolbar (should show "ALT" icon)
2. Click "⚙️ Settings" or "API Key Setup"
3. Paste your API key into the field
4. Click "💾 Save API Key"
5. You'll see a success message

### Step 4: Use It! 

1. Go to any Showit website (e.g., your Showit editor)
2. Click the extension icon
3. Click "Generate Alt Text"
4. Watch it process images and add alt text!

---

## ✅ Verification Checklist

- [ ] API key obtained from Google AI Studio
- [ ] Extension loaded in Chrome (visible in `chrome://extensions/`)
- [ ] API key saved in extension settings
- [ ] Can see extension icon in toolbar
- [ ] Clicked "Generate Alt Text" on a Showit page
- [ ] Check if any images got alt text added

---

## 🐛 Something Not Working?

### No images processed?
- Make sure you're on a Showit website (must be https://showit.co/...)
- Right-click the extension icon > "Manage extension" and check permissions
- Check that images are actually loading on the page

### "API error" message?
- Verify your API key is correct (copy it again)
- Check your Google Cloud project has the Generative AI API enabled
- Check if you've hit your free tier rate limit

### Can't find the extension icon?
- In Chrome, go to `chrome://extensions/`
- Find "Alt Text Generator for Showit"
- Click the pin icon to show it in your toolbar

---

## 📝 How to Update the Extension

If you make changes to the code:

1. Go to `chrome://extensions/`
2. Find the extension
3. Click the refresh icon (↻)
4. Done! Changes take effect immediately

---

## 🔐 Security Notes

- Your API key is stored **only locally** on your computer
- It's kept in Chrome's encrypted sync storage
- It's **never** sent to any server except Google's
- Each image is sent to Google for analysis (required for AI processing)
- You can remove your API key anytime in Settings

---

## 🎓 What's Happening Behind the Scenes?

1. **Extension finds images** without alt text on the page
2. **Converts them to data** that Google can process
3. **Sends to Google Gemini API** (Google's AI vision model)
4. **Gets back a description** of what's in the image
5. **Adds the description** to the page as alt text
6. **Updates the page** so alt text is now there

---

## 🆘 Still Stuck?

Check the browser console for errors:
1. Right-click the page > "Inspect" (or press F12)
2. Go to the "Console" tab
3. Look for any red error messages
4. These can help diagnose the issue

---

## 📚 Learn More

- [Google AI Studio Docs](https://ai.google.dev/docs)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Showit Website](https://www.showit.co)

---

**You're all set! 🎉 Enjoy generating alt text!**
