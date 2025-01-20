import { handleLsatButtonClick, mockResponse } from "./questions";
import { generateLsatQuestion } from "../service/groq";

function createLsatButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l'; // update this if changed on x.com
  button.style.color = '#838383';
	button.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  button.innerHTML = 'LSAT';
  button.setAttribute('role', 'button');

	button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const tweet = (e.target as HTMLElement).closest('article[data-testid="tweet"]');
    if (tweet) {
      try {
        // Get tweet text
        const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent;
        if (!tweetText) {
          throw new Error('Could not find tweet text');
        }

        // Show loading state (optional)
        button.textContent = 'Loading...';
        button.disabled = true;

        // Generate LSAT question
        const response = await generateLsatQuestion(tweetText);
        
        // Handle the response
        handleLsatButtonClick(tweet, response);

      } catch (error) {
        console.error('Error generating LSAT question:', error);
        // Optionally show error to user
        alert(error instanceof Error ? error.message : 'Failed to generate LSAT question. Retry');
      } finally {
        // Reset button state
        button.textContent = 'LSAT';
        button.disabled = false;
      }
    }
  });
	
  return button;
}

function injectLsatButton() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  
  tweets.forEach(tweet => {
    // Check if button already exists
    if (tweet.querySelector('.lsat-button')) return;

    // Find the Grok/XAI icon container
    const grokContainer = tweet.querySelector('[aria-label="Grok actions"]')?.closest('.css-175oi2r.r-18u37iz.r-1h0z5md');
    
    if (grokContainer) {
      const lsatButton = createLsatButton();
      lsatButton.classList.add('lsat-button');
      grokContainer.parentElement?.insertBefore(lsatButton, grokContainer);
    }
  });
}

// Initial injection
injectLsatButton();

// Create observer for dynamically loaded tweets
const observer = new MutationObserver(() => {
  injectLsatButton();
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});