const collectionEle = document.getElementById("collection");

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
document.getElementById("back-btn").addEventListener("click", viewPrevious);

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
document.getElementById("fwd-btn").addEventListener("click", viewNext);

// Needs to be asynchronous so that displayStats isn't
// called twice while waiting for get-stats
async function displayStats(allStats) {
  if (allStats instanceof Event) {
    // Handles the case when the popup is just loaded
    // because addEventListener passes in the event
    // Kinda of a hacky way to do it though
    allStats = await browser.runtime.sendMessage({
      type: 'get-stats'
    })
  }

  if (Object.keys(allStats).length == 0) {
    collectionEle.innerText = "You haven't found any images yet!";
  } else {
    collectionEle.innerText = "";
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
      failures.textContent = `Failures: ${stats.successes}`;
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

/**
 * Popup should load most recent stats when it is first loaded,
 * and receive updates while it is open
 */
document.addEventListener('DOMContentLoaded', displayStats);
browser.runtime.onMessage.addListener(handleMessages);