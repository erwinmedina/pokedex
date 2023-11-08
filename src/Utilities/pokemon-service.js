const BASE_URL = "https://pokeapi.co/api/v2";

export function getAllPokemon() {
    return fetch(`${BASE_URL}/pokemon?limit=809&offset=0`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching all of the pokemon:', error))
}

export function getGenerationPokemon(start, end) {
    return fetch(`${BASE_URL}/pokemon?limit=${end}&offset=${start}`)
    .then(res => res.json())
    .catch(error => console.log(`Error while fetching the generation range of ${start} and ${start + end} pokemon: `, error))
}

export function getPokemon(name) {
    return fetch(`${BASE_URL}/pokemon/${name}`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching an individual pokemon:', name, error))
}

export function getPokemonTypes() {
    return fetch(`${BASE_URL}/type`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching Pokemon Types:', error))
}

export function getAllPokemonWithTypes(typeID) {
    return fetch(`${BASE_URL}/type/${typeID}`)
    .then(res => res.json())
    .catch(error => console.log("Error while fetching all Pokemon with specific type:", error))
}

export function getPokemonSpecies(name) {
    return fetch(`${BASE_URL}/pokemon-species/${name}`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching Pokemon Species:', error))
}

export function getEvolutionChain(path) {
    return fetch(`${path}`)
    .then(res => res.json())
    .catch(error => console.log("Error while fetching Evo Chain:", error))
}