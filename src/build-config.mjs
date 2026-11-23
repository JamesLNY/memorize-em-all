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
    key: "MAX_DELAY",
    question: "Enter the maximum delay between spawns (in seconds): ",
    number: true
  },
  {
    key: "MIN_DELAY",
    question: "Enter the minimum delay between spawns (in seconds): ",
    number: true
  },
  {
    key: "DURATION",
    question: "Enter the duration images remain on screen (in seconds): ",
    number: true
  }
]

let CONFIG = {};

for (const prompt of prompts) {
  let response = await rl.question(prompt.question);
  if (prompt.number) {
    response = Number.parseInt(response);
    while (Number.isNaN(response)) {
      console.log("Please enter a whole number.");
      response = await rl.question(prompt.question);
      response = Number.parseInt(response);
    }
  }
  CONFIG[prompt.key] = response;
}

rl.close();

await writeFile('config.json', JSON.stringify(CONFIG, null, 2));