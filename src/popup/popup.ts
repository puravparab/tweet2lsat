import '../styles/styles.css'

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
  const apiStatus = document.getElementById('api-status')!;

  // Load saved API key
  try {
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['groqApiKey'], (result) => {
        if (result.groqApiKey) {
          apiKeyInput.value = result.groqApiKey;
          apiStatus.textContent = '✓';
        }
      });

      // Add input event listener for real-time validation
      apiKeyInput.addEventListener('input', () => {
        const apiKey = apiKeyInput.value.trim();
        
        if (apiKey.length > 0) {
          chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
            apiStatus.textContent = '✓';
          });
        } else {
          apiStatus.textContent = '';
        }
      });
    }
  } catch (error) {
    console.error('Error accessing chrome storage:', error);
  }
});