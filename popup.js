document.getElementById('generateBtn').addEventListener('click', captureAndGenerateAltText);
document.getElementById('selectRegionBtn').addEventListener('click', startRegionSelection);
document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('openSettings').addEventListener('click', openSettings);
document.getElementById('copyBtn').addEventListener('click', copyAltText);

let currentAltText = '';
let selectionActive = false;

async function captureAndGenerateAltText() {
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  
  showStatus('Capturing screen...', 'info');
  
  try {
    // Get the API key from storage
    const storage = await chrome.storage.sync.get(['geminiApiKey']);
    if (!storage.geminiApiKey) {
      showStatus('Error: API key not configured. Please set it in Settings.', 'error');
      btn.disabled = false;
      return;
    }

    // Capture the visible tab
    const canvas = await chrome.tabs.captureVisibleTab();
    
    showStatus('Generating alt text from screenshot...', 'info');
    
    // Convert canvas to blob and then to base64
    const base64Image = canvas.split(',')[1];
    
    // Call Google's Vision API
    const altText = await generateAltTextFromImage(base64Image, storage.geminiApiKey);
    
    if (altText) {
      currentAltText = altText;
      displayAltText(altText);
      showStatus('Alt text generated successfully!', 'success');
      document.getElementById('copyBtn').style.display = 'block';
      
      // Send to content script to auto-fill on Showit
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { 
        action: 'fillAltText', 
        altText: altText 
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Content script not available, alt text copied to clipboard');
        } else if (response && response.success) {
          showStatus('Alt text auto-filled in Showit!', 'success');
        }
      });
    } else {
      showStatus('Failed to generate alt text', 'error');
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
  } finally {
    btn.disabled = false;
  }
}

async function generateAltTextFromImage(base64Image, apiKey) {
  // Only use models confirmed available on free tier
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview'];
  
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Generate a concise, descriptive alt text for this image. Keep it under 125 characters. Only return the alt text, nothing else.',
                  },
                  {
                    inline_data: {
                      mime_type: 'image/png',
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.warn(`Model ${model} failed:`, error.error?.message);
        continue;
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const altText = result.candidates[0].content.parts[0].text.trim();
        return altText || 'An image';
      }
      
      return 'An image';
    } catch (error) {
      console.warn(`Model ${model} error:`, error.message);
      continue;
    }
  }
  
  throw new Error('All models unavailable. Please try again later.');
}

function displayAltText(altText) {
  const output = document.getElementById('altTextOutput');
  const p = document.createElement('p');
  p.textContent = altText;
  output.innerHTML = '';
  output.appendChild(p);
  output.classList.add('show');
}

function copyAltText() {
  if (currentAltText) {
    navigator.clipboard.writeText(currentAltText).then(() => {
      showStatus('Alt text copied to clipboard!', 'success');
      setTimeout(() => {
        document.getElementById('status').style.display = 'none';
      }, 2000);
    });
  }
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function updateStats(stats) {
  const statsEl = document.getElementById('stats');
  if (stats) {
    statsEl.innerHTML = `
      <strong>Results:</strong><br>
      Images processed: ${stats.processed}<br>
      Alt text generated: ${stats.generated}<br>
      Already had alt text: ${stats.skipped}
    `;
  }
}

async function startRegionSelection() {
  const btn = document.getElementById('selectRegionBtn');
  btn.disabled = true;
  
  showStatus('Capturing screen...', 'info');
  
  try {
    // Get the API key from storage
    const storage = await chrome.storage.sync.get(['geminiApiKey']);
    if (!storage.geminiApiKey) {
      showStatus('Error: API key not configured. Please set it in Settings.', 'error');
      btn.disabled = false;
      return;
    }

    // Capture the visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab();
    
    // Display canvas for selection
    const canvas = document.getElementById('selectionCanvas');
    const regionSelector = document.getElementById('regionSelector');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Draw selection rectangle
      let isSelecting = false;
      let startX = 0;
      let startY = 0;
      let selection = { x: 0, y: 0, width: 0, height: 0 };
      
      const redrawSelection = () => {
        ctx.drawImage(img, 0, 0);
        if (selection.width > 0 && selection.height > 0) {
          ctx.strokeStyle = '#667eea';
          ctx.lineWidth = 2;
          ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
          ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
          ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
        }
      };
      
      canvas.addEventListener('mousedown', (e) => {
        const canvasRect = canvas.getBoundingClientRect();
        startX = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);
        startY = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height);
        isSelecting = true;
      });
      
      canvas.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const currentX = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);
        const currentY = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height);
        
        selection.x = Math.min(startX, currentX);
        selection.y = Math.min(startY, currentY);
        selection.width = Math.abs(currentX - startX);
        selection.height = Math.abs(currentY - startY);
        
        redrawSelection();
      });
      
      canvas.addEventListener('mouseup', async (e) => {
        if (!isSelecting || selection.width < 10 || selection.height < 10) {
          isSelecting = false;
          return;
        }
        
        isSelecting = false;
        
        // Crop the image
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = selection.width;
        croppedCanvas.height = selection.height;
        
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(
          img,
          selection.x,
          selection.y,
          selection.width,
          selection.height,
          0,
          0,
          selection.width,
          selection.height
        );
        
        // Convert to base64
        const croppedBase64 = croppedCanvas.toDataURL('image/png').split(',')[1];
        
        // Hide selection canvas
        regionSelector.style.display = 'none';
        btn.disabled = false;
        
        showStatus('Generating alt text from selected region...', 'info');
        
        try {
          // Generate alt text
          const altText = await generateAltTextFromImage(croppedBase64, storage.geminiApiKey);
          
          if (altText) {
            currentAltText = altText;
            displayAltText(altText);
            showStatus('Alt text generated successfully!', 'success');
            document.getElementById('copyBtn').style.display = 'block';
            
            // Send to content script to auto-fill on Showit
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.tabs.sendMessage(tab.id, { 
              action: 'fillAltText', 
              altText: altText 
            }, (response) => {
              if (!chrome.runtime.lastError && response && response.success) {
                showStatus('Alt text auto-filled in Showit!', 'success');
              }
            });
          } else {
            showStatus('Failed to generate alt text', 'error');
          }
        } catch (error) {
          showStatus(`Error: ${error.message}`, 'error');
          console.error('Error:', error);
        }
      });
      
      regionSelector.style.display = 'block';
      showStatus('Click and drag on the screenshot to select a region', 'info');
    };
    
    img.src = dataUrl;
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
    console.error('Error:', error);
    btn.disabled = false;
  }
}

// Load and display stats on popup open
window.addEventListener('load', async () => {
  const storage = await chrome.storage.local.get(['lastStats']);
  if (storage.lastStats) {
    updateStats(storage.lastStats);
  }
});
