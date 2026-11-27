import { createInterface } from 'node:readline/promises'
import { writeFile } from 'node:fs/promises'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompts = [
  {
    key: "REST_COUNTRIES_API_KEY",
    question: "Enter your Countries API key: ",
    number: false
  },
  {
    key: "MIN_DELAY",
    question: "Enter the minimum delay between spawns (in seconds): ",
    default: 15,
    number: true
  },
  {
    key: "MAX_DELAY",
    question: "Enter the maximum delay between spawns (in seconds): ",
    default: 20,
    number: true
  },
  {
    key: "IMAGE_DURATION",
    question: "Enter the duration images remain on screen (in seconds): ",
    default: 10,
    number: true
  },
  {
    key: "FORM_DURATION",
    question: "Enter the duration forms remain on screen (in seconds): ",
    default: 5,
    number: true
  },
  {
    key: "DEFAULT_COLLECTION",
    question: "Enter your preferred default collection: ",
    default: "POKEMON",
    number: false
  }
]

// Initialize with true constants
let CONFIG = {
  "COLLECTIONS": [ // The collections that are currently supported
    "POKEMON",
    "COUNTRY_FLAGS"
  ]
};

for (const prompt of prompts) {
  if (prompt.key === "DEFAULT_COLLECTION") {
    console.log("Available Collections: ")
    for (let collection of CONFIG.COLLECTIONS) {
      console.log(collection);
    }
  }

  let response = await rl.question(prompt.question);

  if (response === "") {
    if (Object.hasOwn(prompt, "default")) {
      response = prompt.default;
      console.log(`No response given. Defaulting to ${response}`);
    } else {
      while (response === "") {
        console.log("Please enter a non-empty string.");
        response = await rl.question(prompt.question);
      }
    }
  }

  if (prompt.number) {
    response = Number.parseInt(response);
    while (Number.isNaN(response) || response <= 0) {
      console.log("Please enter a positive whole number.");
      response = await rl.question(prompt.question);
      response = Number.parseInt(response);
    }
  }

  if (prompt.key === "DEFAULT_COLLECTION") {
    response = response.toUpperCase();
    while (!CONFIG.COLLECTIONS.includes(response)) {
      console.log("Please enter one of the configurations listed above.")
      response = await rl.question(prompt.question);
      response = response.toUpperCase();
    }
  }

  CONFIG[prompt.key] = response;
}

rl.close();

await writeFile('config.json', JSON.stringify(CONFIG, null, 2));