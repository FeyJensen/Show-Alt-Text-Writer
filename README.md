# Alt Text Generator for Showit

A Chrome extension that automatically generates AI-powered alt text for images without alt attributes on Showit web builder pages.

## Features

**Automatic Alt Text Generation**: Uses Google Gemini AI to generate descriptive alt text for images

**Smart Filtering**: Only targets images without existing alt text

**DOM-Based**: Alt text is written directly to the page's images

**Secure**: API key stored locally in Chrome's sync storage

**Fast**: Processes multiple images efficiently  

## Installation

### 1. Get a Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key"
3. Select or create a new Google Cloud project
4. Copy your API key (looks like: `AIzaSy...`)

### 2. Install the Extension

**Development Mode (Manual Installation):**

1. Clone or download this repository to your computer
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `AltTextGoogleExtension` folder
6. The extension should now appear in your extensions list

**To use the extension:**

1. Click the extension icon in your Chrome toolbar
2. Click **Settings** (or **API Key Setup**)
3. Paste your Google Gemini API key
4. Click **Save API Key**
5. Navigate to any Showit website
6. Click the extension icon and select **Generate Alt Text**
7. The extension will find all images without alt text and generate descriptions for them

## Usage

1. Open a Showit page (https://showit.co/...)
2. Click the extension icon in your toolbar
3. Click **Generate Alt Text**
4. The extension will:
   - Find all images without alt text
   - Send them to Google Gemini API
   - Add the generated alt text directly to the images
5. See stats on how many images were processed

## How It Works

1. **Content Script**: Runs on Showit pages and identifies images without alt attributes
2. **Image Processing**: Converts images to base64 for API transmission
3. **Gemini API**: Uses Google's Gemini Vision model to understand and describe images
4. **DOM Update**: Writes the generated alt text directly to the image's `alt` attribute

## API Limitations

- **Free Tier**: Limited to a certain number of requests per day
- **Image Size**: Large images may take longer to process
- **Quality**: Generated alt text varies depending on image complexity
- **Language**: Text is generated in English

## Keyboard Shortcuts

Currently no keyboard shortcuts configured. You can add them by opening `manifest.json` and adding a `commands` section.

## Privacy

- Your API key is stored locally in Chrome's sync storage
- Images are sent to Google's servers for processing
- No data is logged or stored by this extension
- Each request is independent

## Troubleshooting

### "API key not configured"
- Go to Settings and add your Google Gemini API key
- Make sure you're on a Showit page (https://showit.co/...)

### "API error"
- Check your API key is valid and active
- Verify you haven't exceeded your API rate limit
- Ensure the Gemini API is enabled in your Google Cloud project

### No alt text generated
- Check browser console (F12) for error messages
- Verify images are actually loading on the page
- Try a different image to test the API

### Cross-origin image errors
- Some images may be blocked by CORS policies
- These will be skipped automatically

## Technical Details

- **Manifest Version**: 3 (Chrome's latest standard)
- **API Used**: Google Generative AI (Gemini 1.5 Flash)
- **Storage**: Chrome's sync storage (encrypted, cloud-synced)
- **Compatibility**: Chrome 88+

## File Structure

```
AltTextGoogleExtension/
├── manifest.json          # Extension configuration
├── popup.html             # Popup UI
├── popup.js              # Popup logic
├── content.js            # Page content script
├── background.js         # Background service worker
├── options.html          # Settings page
├── options.js            # Settings logic
├── icons/                # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md            # This file
```

## Future Enhancements

- [ ] Batch processing with progress bar
- [ ] Export alt text as CSV
- [ ] Custom alt text templates
- [ ] Support for video descriptions
- [ ] Multiple language options
- [ ] Image caching to reduce API calls
- [ ] Keyboard shortcuts

## Contributing

Feel free to submit issues or improvements!

## License

MIT License - feel free to use and modify

## Support

For issues with the Google Gemini API, see [Google's Documentation](https://ai.google.dev/docs)

For Chrome extension questions, see [Chrome Developer Documentation](https://developer.chrome.com/docs/extensions/)
# Show-Alt-Text-Writer
