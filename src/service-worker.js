import * as api from './api.js'
import * as storage from './storage.js'
import CONFIG from './config.json' with { type: 'json' };

/**
 * Returns a random delay between spawns (in milliseconds) based
 * on the user's config. Time is between max and min, inclusive
 */
function getDelay() {
  const max = CONFIG.MAX_DELAY;
  const min = CONFIG.MIN_DELAY;
  let rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand * 1000;
}

/**
 * Fires when the extension is first installed, the extension is
 * updated to a new version, or when Chrome is updated to a new
 * version; Useful when debugging and manually reloading extension
 */
browser.runtime.onInstalled.addListener(initialize);

// Fires whenever Chrome is opened
browser.runtime.onStartup.addListener(initialize);

// Sets the initial stats in storage.js and spawns the first image
async function initialize() {
  await storage.initialize();
  setTimeout(spawnImage, getDelay());
}

/**
 * Returns the currently selected tab in the form of a `tabs.Tab`
 * instance or `undefined`. This is used so that images do not
 * spawn on inactive tabs and because tabs.sendMessage requires
 * a tab ID
 */
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

/**
 * Sends a message to the content script to spawn an image
 */
async function spawnImage() {
  let tab = await getCurrentTab();

  if (tab !== undefined) {
    let collection = storage.getActiveCollection();
    let term = await api.getRandomTerm(collection);
    let imageSrc = await api.getImage(collection, term);

    try {
      // tabs.sendMessage is used to send messages to content scripts
      // browser.sendMessage is used to send messages to scripts in the
      // background context
      await browser.tabs.sendMessage(tab.id, {
        type: "spawn-image",
        term: term,
        imageSrc: imageSrc
      });
    } catch (error) {
      // Handles error when content-script hasn't fully loaded
    }
  }

  // Sets timer for the next spawn
  setTimeout(spawnImage, getDelay());
}

/**
 * Handles updates on whether the user succeeded at recalling
 * the term corresponding to the image; Sends a message to the
 * popup to update stats
 */
async function handleMessages(message, sender, sendResponse) {
  switch (message.type) {
    case "success":
      sendResponse('OK');
      storage.addSuccess(message.term);
      browser.runtime.sendMessage({
        type: 'refresh-stats',
        stats: await storage.getStats()
      }).catch(error => {
        // Handles error if popup hasn't been opened yet
      });
      break;
    case "failure":
      sendResponse('OK');
      storage.addFailure(message.term);
      browser.runtime.sendMessage({
        type: 'refresh-stats',
        stats: await storage.getStats()
      }).catch(error => {
        // Handles error if popup hasn't been opened yet
      });
      break;
    case "switch-collection":
      storage.setActiveCollection(message.collection);
      sendResponse('OK');
      break;
    case "get-stats":
      sendResponse(await storage.getStats());
      break;
  }
}

browser.runtime.onMessage.addListener(handleMessages);