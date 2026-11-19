function handleMessages(message, sender, sendResponse) {
  if (message === 'spawn-image') {
    console.log("Temporary testing message.");
  }
  return true;
}

browser.runtime.onMessage.addListener(handleMessages);