# Project Name

Chrome extension which helps you memorize image-term pairs!

## The Problem

I've wasted hundreds of hours memorizing things--tree species, Pokemon names, flags of countries--which I then forget. Most memorization tools require the user to actively decide to periodically use them, so it is easy stop without motivation.

## How It Works

This extension takes a dataset of images and words corresponding with them (either sourced from an API or from the user). The extension will periodically display one of the images, and when the user clicks on them, they can type the matching word to "collect" the image. The extension will store and display user statistics.

![System diagram](docs/system-diagram.png)

## Tech Stack

- **Language:** JavaScript / HTML / CSS
- **External tools:**

  Chrome Extensions API (https://developer.chrome.com/docs/extensions/reference/api)
  
  REST Countries API (https://restcountries.com)
  
  PokéAPI (https://pokeapi.co/)

## Setup

## Usage

## Roadmap

- [ ] Pull images and corresponding terms from an API
- [ ] Display images at random intervals
- [ ] Open form when user clicks on an image
- [ ] Display an indication if response matches
- [ ] Track and display images user has collected
- [ ] Store and include user-uploaded image-term pairs
- [ ] Setting to adjust time between pop ups
- [ ] Streaks, point system to buy power ups (e.g. streak freezes)

## Author

James Lei, [https://github.com/JamesLNY](https://github.com/JamesLNY)