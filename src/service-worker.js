import * as api from './api.js'
import CONFIG from './config.json' with { type: 'json' };

const MODE = "pokemon";

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
 * updated to a new verison, or when Chrome is updated to a new
 * version
 * 
 * Used to set the initial state using Storage API and set a timer
 * for the first spawn
 */
browser.runtime.onInstalled.addListener(() => {
  setTimeout(spawnImage, getDelay());
});

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

  console.log("Sent");

  if (tab !== undefined) {
    let term, imageSrc;
    if (MODE === "pokemon") {
      term = await api.getRandomPokemon();
      imageSrc = await api.getPokemonImage(term);
    }

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