const collectionEle = document.getElementById("collection");
const backBtn = document.getElementById("back-btn");
const fwdBtn = document.getElementById("fwd-btn")

// The card which is currently being shown
let curr;

function viewPrevious() {
  if (curr === undefined) {
    return;
  }
  let prev = curr.previousElementSibling;
  if (prev === null) {
    return;
  }
  curr.style.display = "none";
  prev.style.display = "block";
  curr = prev;
}
backBtn.addEventListener("click", viewPrevious);

function viewNext() {
  if (curr === undefined) {
    return;
  }
  let next = curr.nextElementSibling;
  if (next === null) {
    return;
  }
  curr.style.display = "none";
  next.style.display = "block";
  curr = next;
}
fwdBtn.addEventListener("click", viewNext);

function switchCollection(event) {
  browser.runtime.sendMessage({
    type: 'switch-collection',
    collection: event.target.value
  })
  displayStats();
}
document.getElementById("collection-select").addEventListener("change", switchCollection)

// Needs to be asynchronous so that displayStats isn't
// called twice while waiting for get-stats
async function displayStats(allStats) {
  if (allStats === undefined) {
    allStats = await browser.runtime.sendMessage({
      type: 'get-stats'
    })
  }

  if (Object.keys(allStats).length == 0) {
    collectionEle.innerText = "You haven't found any images yet!";
    backBtn.style.display = "none";
    fwdBtn.style.display = "none";
  } else {
    collectionEle.innerText = "";
    backBtn.style.display = "inline-block";
    fwdBtn.style.display = "inline-block";
    let currTerm;
    for (let [term, stats] of Object.entries(allStats)) {
      // First card is displayed if the popup hasn't been opened yet;
      // otherwise defaults to the previous card that was shown.
      if (curr === undefined) {
        currTerm = term;
      } else {
        currTerm = curr.dataset.term;
      }

      const card = document.createElement("div");    
      card.classList.add("card");
      const img = document.createElement("img");
      img.src = stats.src;
      img.width = 100;
      const header = document.createElement("h4");
      header.textContent = term;
      const successes = document.createElement("p");
      successes.textContent = `Successes: ${stats.successes}`;
      const failures = document.createElement("p");
      failures.textContent = `Failures: ${stats.failures}`;
      card.append(header, img, successes, failures);
      collectionEle.append(card);
      card.dataset.term = term;

      if (term === currTerm) {
        curr = card;
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  }
};

function handleMessages(message, sender, sendResponse) {
  if (message.type === 'refresh-stats') {
    displayStats(message.stats);
  }
  sendResponse('OK');
}

async function initialize() {
  const collectionSelect = document.getElementById("collection-select");
  const {active, collections} = await browser.runtime.sendMessage({
    type: 'get-collections',
  });
  for (let collection of collections) {
    let option = document.createElement("option");
    option.value = collection;
    option.innerText = collection.replaceAll("_", " ").toLowerCase();
    collectionSelect.append(option);
  }
  collectionSelect.value = active;
  displayStats();
}

/**
 * Popup should load most recent stats when it is first loaded,
 * and receive updates while it is open
 */
document.addEventListener('DOMContentLoaded', initialize);
browser.runtime.onMessage.addListener(handleMessages);