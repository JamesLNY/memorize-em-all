import { CONFIG } from './config.js';

async function getData(url, options={}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
    return {};
  }
}

// Returns the name of a random pokemon
async function getRandomPokemon() {
  let allPokemmon = await getData("https://pokeapi.co/api/v2/pokemon/");
  let count = allPokemmon.count;

  // Pokemon are 1-indexed
  let randomId = Math.floor(Math.random() * count) + 1;

  let randomPokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${randomId}/`);

  return randomPokemon.name;
}

/**
 * Returns the url corresponding the artwork of the pokemon of name name
 * (image url must be returned rather than the pure image because of how
 * img tags in html function)
 * 
 * @param {*} type The category of artwork desired. official-artwork is larger
 * (intended for displaying on the user's screen) while sprite is smaller and
 * pixelated (intended for displaying on the collection screen).
 */
async function getPokemonImage(name, type="official-artwork") {
  let pokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${name}/`);

  let imageUrl;

  if (type == "official-artwork") {
    imageUrl = pokemon.sprites.other["official-artwork"].front_default;
  } else if (type == "sprite") {
    imageUrl = pokemon.sprites.front_default;
  } else {
    throw new Error("Invalid Argument");
  }

  return imageUrl;
}

// Returns the ISO alpha-3 code of a random country
async function getRandomCountry() {
  // Having a limit is required by the API
  let allCountries = await getData(
    'https://api.restcountries.com/countries/v5?limit=1',
    { headers: { 'Authorization': `Bearer ${CONFIG.REST_COUNTRIES_API_KEY}` } }
  );

  let count = allCountries.data.meta.total;
  let randomId = Math.floor(Math.random() * count);

  // Sort of hacky workaround for getting the country
  // at an index; Couldn't find a better endpoint
  let randomCountry = await getData(
    `https://api.restcountries.com/countries/v5?limit=1&offset=${randomId}`,
    { headers: { 'Authorization': `Bearer ${CONFIG.REST_COUNTRIES_API_KEY}` } }
  );

  return randomCountry.data.objects[0].codes.alpha_3;
}

// Returns the url corresponding to the country's flag
async function getCountryFlag(iso) {
  let country = await getData(
    `https://api.restcountries.com/countries/v5/codes.alpha_3/${iso}`,
    { headers: { 'Authorization': `Bearer ${CONFIG.REST_COUNTRIES_API_KEY}` } }
  );
  return country.data.objects[0].flag.url_png;
}