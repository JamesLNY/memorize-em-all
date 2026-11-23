function spawnImage(src, term) {
  const image = new Image();
  image.src = src;

  // Overlays the image on top of existing content
  image.style.position = "fixed";
  image.style.top = "50px";
  image.style.left = "50px";

  document.body.appendChild(image);
}

function handleMessages(message) {
  if (message.type === 'spawn-image') {
    spawnImage(message.imageSrc, message.term);
  }
  return true;
}

browser.runtime.onMessage.addListener(handleMessages);