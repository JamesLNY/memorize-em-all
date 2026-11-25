## Design Choices
1. `content.js` is injected with a [static declaration](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#static-declarative) because it is page-agnostic.

## TODO
- [ ] Configure `getRandomCountry()` to also return the country name, for purposes of image-term matching
- [ ] Display the number of image-term pairs viewed out of the total number in a collection