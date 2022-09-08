const BASE_URL = "https://pokeapi.co/api/v2";

export function getAllPokemon() {
    return fetch(`${BASE_URL}/pokemon?limit=809&offset=0`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching:', error))
}

export function getInitialPokemon() {
    return fetch(`${BASE_URL}/pokemon?limit=151&offset=0`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching:', error))
}

export function getPokemon(name) {
    return fetch(`${BASE_URL}/pokemon/${name}`)
    .then(res => res.json())
    .catch(error => console.log('Error while fetching:', error))
}