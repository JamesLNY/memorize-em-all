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
  initializeTerm(term, collection);
  stats[collection][term].successes++;
  await save();
}

export async function addFailure(term, collection) {
  initializeTerm(term, collection);
  stats[collection][term].failures++;
  await save();
}

export async function getStats(collection) {
  return stats[collection] || {};
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