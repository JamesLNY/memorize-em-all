import * as api from './api.js'

const MODE = "pokemon";

/**
 * Fires when the extension is first installed, the extension is
 * updated to a new verison, or when Chrome is updated to a new
 * version
 * 
 * Used to set the initial state using Storage API
 */
browser.runtime.onInstalled.addListener(() => {
  setInterval(spawnImage, 1000);
});

/**
 * Returns the currently selected tab in the form of a `tabs.Tab`
 * instance or `undefined`. This is used so that images do not
 * spawn on inactive tabs and because tabs.sendMessage requires
 */
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

/**
 * Sends a message to the content script to spawn an image.
 */
async function spawnImage() {
  let tab = await getCurrentTab();

  if (tab !== undefined) {
    let term, imageSrc;
    if (MODE === "pokemon") {
      term = await api.getRandomPokemon();
      imageSrc = await api.getPokemonImage(term);
    }

    // tabs.sendMessage is used to send messages to content scripts
    // browser.sendMessage is used to send messages to scripts in the
    // background context
    await browser.tabs.sendMessage(tab.id, {
      type: "spawn-image",
      term: term,
      imageSrc: imageSrc
    });
  }
}