function createLsatButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l'; // update this if changed on x.com
  button.style.color = '#ffffff';
  button.innerHTML = 'LSAT';
  button.setAttribute('role', 'button');
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