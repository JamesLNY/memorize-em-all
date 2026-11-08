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