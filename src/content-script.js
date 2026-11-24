async function spawnImage(src, term) {
  const image = new Image();
  image.src = src;

  // Overlays the image on top of existing content
  image.style.position = "fixed";
  // Move the image to the front (arbitrarily large z)
  image.style.zIndex = 2147483647;

  image.onload = function() {
    // Wait for the image to load so we can find its dimensions

    let maxLeft = window.innerWidth - this.naturalWidth;
    this.style.left = `${Math.floor(Math.random() * maxLeft)}px`;
    let maxTop = window.innerHeight - this.naturalHeight;
    this.style.top = `${Math.floor(Math.random() * maxTop)}px`;

    document.body.appendChild(this);
  }

  image.addEventListener("click", clickImage.bind(image, term));

  // Dynamically import because
  // a) content-script.js is not a module
  // b) eventually, users may change duration
  const url = chrome.runtime.getURL("config.json");
  const res = await fetch(url);
  const CONFIG = await res.json();

  // CONFIG.IMAGE_DURATION is in seconds; we must convert it to milliseonds
  setTimeout(despawnImage, CONFIG.IMAGE_DURATION * 1000, image);
}

function clickImage(term) {
  despawnImage(this);

  let input = prompt("What's is this image?");

  if (input === term) {
    alert("Success!");
  } else {
    alert("Fail!");
  }  
}

function despawnImage(image) {
  image.remove();
}

function handleMessages(message) {
  if (message.type === 'spawn-image') {
    spawnImage(message.imageSrc, message.term);
  }
  return true;
}

browser.runtime.onMessage.addListener(handleMessages);