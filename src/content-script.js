async function spawnImage(src, term) {
  const image = document.createElement('img');
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

  // Dynamically import because
  // a) content-script.js is not a module
  // b) eventually, users may change duration
  const url = chrome.runtime.getURL("config.json");
  const res = await fetch(url);
  const CONFIG = await res.json();

  // CONFIG.IMAGE_DURATION is in seconds; we must convert it to milliseonds
  const timeoutId = setTimeout(() => image.remove(), CONFIG.IMAGE_DURATION * 1000);

  image.addEventListener("click", function() {
    clearTimeout(timeoutId);
    image.remove();
    buildForm(image, term);
  });
}

function buildForm(image, term) {
  // Clear event listeners and applied styles
  image = image.cloneNode();
  image.style.cssText = null;

  const form = document.createElement("form");
  form.id = "memorize-em-all"
  const progress = document.createElement("progress");
  progress.max = 100;
  progress.value = 0;
  const label = document.createElement("label");
  label.innerText = "What is this image?";
  label.htmlFor = "term";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "term";
  input.name = "term";
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Submit";

  form.append(progress, image, label, input, submit);
  
  const intervalId = setInterval(function() {
    progress.value++;
    if (progress.value == 100) {
      clearInterval(intervalId)
      form.remove();
    }
  }, 50)

  form.onsubmit = function (e) {
    clearInterval(intervalId);
    form.remove();
    // Prevents the page from refreshing
    e.preventDefault();
    submitForm(e, input, term);
  }

  document.body.appendChild(form);
}

function submitForm(input, term) {
  if (input.value === term) {
    alert("SUCCESS!");
  } else {
    alert("FAIL!");
  }
}

function handleMessages(message, sender, sendResponse) {
  if (message.type === 'spawn-image') {
    spawnImage(message.imageSrc, message.term);
  }
  sendResponse('OK');
}

browser.runtime.onMessage.addListener(handleMessages);