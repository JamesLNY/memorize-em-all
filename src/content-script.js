async function spawnImage(src, term) {
  const image = new Image();
  image.src = src;

  // Overlays the image on top of existing content
  image.style.position = "fixed";
  image.style.top = "50px";
  image.style.left = "50px";

  document.body.appendChild(image);

  // Dynamically import because
  // a) content-script.js is not a module
  // b) eventually, users may change duration
  const configUrl = chrome.runtime.getURL("config.js");
  const { CONFIG } = await import(configUrl);

  // CONFIG.DURATION is in seconds; we must convert it to milliseonds
  setTimeout(despawnImage, CONFIG.DURATION * 1000, image);
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