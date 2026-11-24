async function getConfig(property) {
  // Dynamically import because
  // a) content-script.js is not a module
  // b) eventually, users may change duration
  const url = chrome.runtime.getURL("config.json");
  const res = await fetch(url);
  const CONFIG = await res.json();
  return CONFIG[property];
}

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

    document.body.append(this);
  }

  // CONFIG.IMAGE_DURATION is in seconds; we must convert it to milliseonds  
  let duration = await getConfig("IMAGE_DURATION") * 1000;
  const timeoutId = setTimeout(() => image.remove(), duration);

  image.addEventListener("click", function() {
    clearTimeout(timeoutId);
    image.remove();
    buildForm(image, term);
  });
}

async function buildForm(image, term) {
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
  
  // Gets duration of form in milliseconds and divide
  // by 100 to find the delay between 1% ticks
  let delay = await getConfig("FORM_DURATION") * 1000 / 100;
  const intervalId = setInterval(function() {
    progress.value++;
    if (progress.value == 100) {
      clearInterval(intervalId)
      form.remove();
    }
  }, delay)

  form.onsubmit = function (e) {
    clearInterval(intervalId);
    form.remove();
    // Prevents the page from refreshing
    e.preventDefault();
    submitForm(input, term);
  }

  document.body.append(form);
}

function submitForm(input, term) {
  const message = document.createElement("p");
  message.id = "memorize-em-all"

  if (input.value.toUpperCase() === term.toUpperCase()) {
    message.innerText = "Correct!";
    message.style.backgroundColor = "#e0ffcd"
  } else {
    message.innerText = "Wrong!"
    message.style.backgroundColor = "#ffcab0"
  }

  message.style.width = '100px';

  setTimeout(() => message.remove(), 1000);

  document.body.append(message);
}

function handleMessages(message, sender, sendResponse) {
  if (message.type === 'spawn-image') {
    spawnImage(message.imageSrc, message.term);
  }
  sendResponse('OK');
}

browser.runtime.onMessage.addListener(handleMessages);