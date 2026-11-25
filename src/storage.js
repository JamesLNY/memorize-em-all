import * as api from './api.js'

let stats;

// Initializes a term in stats if it doesn't exist yet
async function initializeTerm(term, collection) {
  stats[collection] ??= {};
  stats[collection][term] ??= {
    "successes": 0,
    "failures": 0
  };
}

export async function addSuccess(term, collection) {
  await initializeTerm(term, collection);
  stats[collection][term].successes++;
  save();
}

export async function addFailure(term, collection) {
  await initializeTerm(term, collection);
  stats[collection][term].failures++;
  save();
}

export async function getStats(collection) {
  let output = stats[collection] || {};
  for (let [term, values] of Object.entries(output)) {
    if (collection === "pokemon") {
      values.src = await api.getPokemonImage(term);
    }
  }
  return output;
}

// Saves stats to local browser storage; Shouldn't cause
// any race condiitons because extension reads only once
// before save is called
async function save() {
  await browser.storage.local.set({ "memorize-em-all": stats });
}

export async function initialize() {
  stats = await browser.storage.local.get("memorize-em-all");
  if (stats === undefined) {
    stats = {};
    await save();
  }
}