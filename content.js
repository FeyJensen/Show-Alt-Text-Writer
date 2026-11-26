chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateAltText') {
    generateAltTextForImages().then(sendResponse);
    return true;
  }
  if (request.action === 'enableRegionSelection') {
    enableRegionSelection(sendResponse);
    return true;
  }
  if (request.action === 'fillAltText') {
    fillAltTextInput(request.altText, sendResponse);
    return true;
  }
});

async function generateAltTextForImages() {
  try {
    // Get API key from storage
    const storage = await chrome.storage.sync.get(['geminiApiKey']);
    const apiKey = storage.geminiApiKey;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'API key not configured. Please go to settings.'
      };
    }
    
    // Find all images without alt text
    // This includes regular img tags, images in iframes, and lazy-loaded images
    let images = Array.from(document.querySelectorAll('img')).filter(img => {
      const alt = img.getAttribute('alt');
      const src = img.src || img.getAttribute('data-src');
      
      // Skip images with no src
      if (!src) return false;
      
      // Check if alt attribute is missing, empty, or only whitespace
      if (!alt || alt.trim() === '') return true;
      
      // Also skip images with generic/placeholder alt text that Showit might set
      const genericAltPatterns = [
        'untitled',
        'image',
        'photo',
        'picture',
        'graphic',
        'placeholder',
        'unnamed',
        'no title',
        'click to edit',
        '-'
      ];
      
      const altLower = alt.toLowerCase().trim();
      
      // If alt text is very short (1-2 chars) or matches generic patterns, treat as missing
      if (altLower.length <= 2) return true;
      if (genericAltPatterns.some(pattern => altLower === pattern || altLower.includes(pattern))) {
        return true;
      }
      
      return false;
    });
    
    console.log('Found images without real alt text:', images.length);
    
    // Also check iframes for images
    const iframes = document.querySelectorAll('iframe');
    console.log('Found iframes:', iframes.length);
    
    // Try to access images in accessible iframes
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const iframeImages = Array.from(iframeDoc.querySelectorAll('img')).filter(img => {
            const alt = img.getAttribute('alt');
            const src = img.src || img.getAttribute('data-src');
            return (!alt || alt.trim() === '') && src;
          });
          images = images.concat(iframeImages);
        }
      } catch (e) {
        // Cross-origin iframe - cannot access
        console.log('Cannot access iframe (cross-origin)');
      }
    }
    
    console.log('Total images to process:', images.length);
    
    if (images.length === 0) {
      return {
        success: true,
        message: 'No images without alt text found!',
        stats: { processed: 0, generated: 0, skipped: 0 }
      };
    }
    
    let generated = 0;
    const stats = { processed: images.length, generated: 0, skipped: 0 };
    
    for (const img of images) {
      try {
        const altText = await generateAltTextForImage(img, apiKey);
        if (altText) {
          img.setAttribute('alt', altText);
          generated++;
        }
      } catch (error) {
        console.error('Error generating alt text for image:', error);
      }
    }
    
    stats.generated = generated;
    stats.skipped = images.length - generated;
    
    // Store stats
    await chrome.storage.local.set({ lastStats: stats });
    
    return {
      success: true,
      message: `Generated alt text for ${generated} image(s)`,
      stats
    };
  } catch (error) {
    console.error('Error in generateAltTextForImages:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

async function generateAltTextForImage(img, apiKey) {
  // Get image data
  const src = img.src || img.getAttribute('data-src');
  
  if (!src) {
    return null;
  }
  
  try {
    // Convert image to base64
    const base64Data = await imageToBase64(src);
    
    if (!base64Data) {
      console.warn('Could not convert image to base64, skipping:', src);
      return null;
    }
    
    // Call Gemini API
    const altText = await callGeminiAPI(base64Data, apiKey);
    
    return altText;
  } catch (error) {
    console.error('Error in generateAltTextForImage:', error);
    return null;
  }
}

async function imageToBase64(src) {
  return new Promise((resolve) => {
    // Handle data URLs
    if (src.startsWith('data:')) {
      resolve(src.split(',')[1]);
      return;
    }
    
    // Try using canvas to get image data (works better with CORS)
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl.split(',')[1]);
      };
      
      img.onerror = function() {
        // Fall back to fetch if canvas fails
        fetchImage(src, resolve);
      };
      
      // Add crossOrigin attribute to allow CORS
      img.crossOrigin = 'anonymous';
      img.src = src;
      
      // Set timeout in case image never loads
      setTimeout(() => {
        if (!img.complete) {
          fetchImage(src, resolve);
        }
      }, 5000);
    } catch (error) {
      fetchImage(src, resolve);
    }
  });
}

function fetchImage(src, resolve) {
  // Handle blob URLs or direct image fetching
  fetch(src, { mode: 'cors' })
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    })
    .catch(error => {
      console.error('Error fetching image:', src, error);
      resolve(null);
    });
}

async function callGeminiAPI(base64Data, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: 'Generate a concise, descriptive alt text for this image. Keep it under 125 characters. Focus on what the image shows and its context. Only return the alt text, nothing else.'
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }
    ]
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  
  return null;
}

function enableRegionSelection(sendResponse) {
  sendResponse({ success: true });
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'alt-text-selection-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.3);
    cursor: crosshair;
  `;
  
  // Create selection box
  const selectionBox = document.createElement('div');
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px solid #667eea;
    background: rgba(102, 126, 234, 0.1);
    display: none;
    z-index: 1000000;
    pointer-events: none;
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  
  let isSelecting = false;
  let startX = 0;
  let startY = 0;
  
  overlay.addEventListener('mousedown', (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.display = 'block';
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
  });
  
  overlay.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    
    selectionBox.style.left = Math.min(startX, currentX) + 'px';
    selectionBox.style.top = Math.min(startY, currentY) + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  });
  
  overlay.addEventListener('mouseup', (e) => {
    if (!isSelecting) return;
    isSelecting = false;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    
    // Clean up
    overlay.remove();
    selectionBox.remove();
    
    // Send region data to popup
    if (width > 10 && height > 10) {
      chrome.runtime.sendMessage({
        action: 'regionSelected',
        region: { x, y, width, height }
      });
    }
  });
  
  // Allow escape to cancel
  const cancelHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      selectionBox.remove();
      document.removeEventListener('keydown', cancelHandler);
    }
  };
  
  document.addEventListener('keydown', cancelHandler);
}

function fillAltTextInput(altText, sendResponse) {
  // Find the si-text-area web component
  const siTextArea = document.querySelector('si-text-area[long-label=""]');
  
  if (siTextArea && siTextArea.shadowRoot) {
    // Access the textarea inside the shadow DOM
    const textarea = siTextArea.shadowRoot.querySelector('textarea.input__control');
    
    if (textarea) {
      // Set the value
      textarea.value = altText;
      
      // Trigger input event to notify Showit of the change
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      
      // Focus the textarea
      textarea.focus();
      
      sendResponse({ success: true, message: 'Alt text filled' });
      return;
    }
  }
  
  // Fallback: try generic textarea selector
  const textarea = document.querySelector('textarea[class*="input__control"]');
  if (textarea) {
    textarea.value = altText;
    textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    textarea.focus();
    sendResponse({ success: true, message: 'Alt text filled' });
    return;
  }
  
  sendResponse({ success: false, message: 'No alt text textarea found' });
}
