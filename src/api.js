import CONFIG from './config.json' with { type: 'json' };

async function getData(url, options={}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(url);
    console.error(options);
    console.error(error.message);
    return {};
  }
}

// Returns the name of a random pokemon species
async function getRandomPokemon() {
  let allPokemon = await getData("https://pokeapi.co/api/v2/pokedex/national");
  
  // pokemon_entries holds an array of pokemon objects
  let count = allPokemon.pokemon_entries.length;
  let randomIdx = Math.floor(Math.random() * count);

  return allPokemon.pokemon_entries[randomIdx].pokemon_species.name;
}

/**
 * Returns the url corresponding the artwork of the pokemon-species of name
 * name (image url must be returned rather than the pure image because of how
 * img tags in html function)
 * 
 * @param {*} type The category of artwork desired. official-artwork is larger
 * (intended for displaying on the user's screen) while sprite is smaller and
 * pixelated (intended for displaying on the collection screen).
 */
async function getPokemonImage(name, type="official-artwork") {
  const species = await getData(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);

  // The pokemon-species endpoint doesn't contain
  // images, so we must call the pokemon endpoint
  // A single pokemon species may have different
  // forms, with are stored with different ids
  let pokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${species.id}/`);

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

// Returns the common name of a random country
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

  return randomCountry.data.objects[0].names.common;
}

// Returns the url corresponding to the country's flag
async function getCountryFlag(name) {
  let country = await getData(
    `https://api.restcountries.com/countries/v5?names.common=${name}`,
    { headers: { 'Authorization': `Bearer ${CONFIG.REST_COUNTRIES_API_KEY}` } }
  );
  return country.data.objects[0].flag.url_png;
}

// Returns a random term in a specified collection
export async function getRandomTerm(collection) {
  switch (collection) {
    case "POKEMON":
      return await getRandomPokemon();
    case "COUNTRY_FLAGS":
      return await getRandomCountry();
  }
}

// Returns the url of the image associated with a term in a specified collection
export async function getImage(collection, term) {
  switch (collection) {
    case "POKEMON":
      return await getPokemonImage(term);
    case "COUNTRY_FLAGS":
      return await getCountryFlag(term);
  }
}