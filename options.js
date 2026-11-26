document.getElementById('settingsForm').addEventListener('submit', saveSettings);
document.getElementById('clearBtn').addEventListener('click', clearSettings);

async function saveSettings(e) {
  e.preventDefault();
  
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }
  
  try {
    await chrome.storage.sync.set({ geminiApiKey: apiKey });
    showStatus('✓ API key saved successfully!', 'success');
    document.getElementById('apiKey').value = '';
    
    // Reload settings after a short delay
    setTimeout(() => loadSettings(), 500);
  } catch (error) {
    showStatus(`✗ Error saving: ${error.message}`, 'error');
  }
}

async function clearSettings() {
  if (confirm('Are you sure you want to remove your API key?')) {
    try {
      await chrome.storage.sync.set({ geminiApiKey: '' });
      showStatus('✓ API key cleared', 'success');
      document.getElementById('apiKey').value = '';
    } catch (error) {
      showStatus(`✗ Error clearing: ${error.message}`, 'error');
    }
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusEl.className = 'status';
  }, 3000);
}

async function loadSettings() {
  const storage = await chrome.storage.sync.get(['geminiApiKey']);
  if (storage.geminiApiKey) {
    document.getElementById('apiKey').placeholder = '••••••••••••••••••••';
  }
}

// Load settings on page load
window.addEventListener('load', loadSettings);
