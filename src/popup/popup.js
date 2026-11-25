function displayStats() {
  browser.runtime.sendMessage({
    type: 'get-stats'
  }).then(result => {
    console.log(result);
  })
};

function handleMessages(message, sender, sendResponse) {
  if (message.type === 'refresh-stats') {
    displayStats(message.stats);
  }
  sendResponse('OK');
}

/**
 * Popup should load most recent stats when it is first loaded,
 * and receive updates while it is open
 */
document.addEventListener('DOMContentLoaded', displayStats);
browser.runtime.onMessage.addListener(handleMessages);