import * as api from './api.js'
import CONFIG from './config.json' with { type: 'json' };

let stats;

// Initializes a term in stats if it doesn't exist yet
async function initializeTerm(term, collection=stats["activeCollection"]) {
  stats[collection] ??= {};
  stats[collection][term] ??= {
    "successes": 0,
    "failures": 0
  };
}

export async function addSuccess(term, collection=stats["activeCollection"]) {
  await initializeTerm(term, collection);
  stats[collection][term].successes++;
  save();
}

export async function addFailure(term, collection=stats["activeCollection"]) {
  await initializeTerm(term, collection);
  stats[collection][term].failures++;
  save();
}

export async function getStats(collection=stats["activeCollection"]) {
  let output = stats[collection] || {};
  for (let [term, values] of Object.entries(output)) {
    values.src = await api.getImage(collection, term);
  }
  return output;
}

// Saves stats to local browser storage; Shouldn't cause
// any race conditions because extension reads only once
// before save is called
async function save() {
  await browser.storage.local.set({ "memorize-em-all": stats });
}

export async function initialize() {
  stats = await browser.storage.local.get("memorize-em-all")
  stats = stats["memorize-em-all"];
  if (true || stats === undefined) {
    stats = {
      "activeCollection": CONFIG.DEFAULT_COLLECTION
    };
    await save();
  }
}

export async function setActiveCollection(collection) {
  stats["activeCollection"] = collection;
  await save();
}

// Returns the collection the user currently has selected
export function getActiveCollection() {
  return stats["activeCollection"];
}