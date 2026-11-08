async function getData(url) {
  try {
    const response = await fetch(url);
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