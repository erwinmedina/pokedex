import "./Home.css"

import * as pokemonService from "../../Utilities/pokemon-service"
import { useEffect, useState } from "react"

export default function Home() {
    const [generation, setGeneration] = useState([
        {
            generation: "G1",
            start: 0,
            end: 150,
            selected: 1
            
        },
        {
            generation: "G2",
            start: 151,
            end: 250,
            selected: 0
        },
        {
            generation: "G3",
            start: 251,
            end: 385,
            selected: 0
        },
        {
            generation: "G4",
            start: 386,
            end: 492,
            selected: 0
        },
        {
            generation: "G5",
            start: 493,
            end: 648,
            selected: 0
        },
        {
            generation: "G6",
            start: 649,
            end: 720,
            selected: 0
        },
        {
            generation: "G7",
            start: 721,
            end: 808,
            selected: 0
        }
    ]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState("bulbasaur")
    const [currentPokemon, setCurrentPokemon] = useState([]);
    const [listOfTypes, setListOfTypes] = useState([]);

    // -------------------------------------- //
    // This handles which generation we're on //
    // -------------------------------------- //
    function handleGen(event) {
        let tempGen = [...generation];
        for (let i = 0; i < tempGen.length; i++) {
            tempGen[i].selected = 0;
            if (event.target.value === tempGen[i].generation) {
                tempGen[i].selected = 1;
            }
        }
        setGeneration(tempGen);
    }
    
    // ------------------------------------------------------ //
    // This handles the updated value of the pokemon dropdown //
    // ------------------------------------------------------ //
    function handlePokemon(event) {
        setSelectedPokemon(event.target.value);
    }

    function handleRandom() {
        var index = Math.floor(Math.random() * allPokemon.length);
        console.log(allPokemon[index])
        setSelectedPokemon(allPokemon[index].name);
    }
    
    useEffect(function() {
        async function getPokemon(selectedPokemon) {
            setCurrentPokemon([]);
            const pokemonObject = await pokemonService.getPokemon(selectedPokemon);
            pokemonObject.moves.sort((a,b) => a.version_group_details[0].level_learned_at > b.version_group_details[0].level_learned_at ? 1:-1);
            pokemonObject.moves.sort((a,b) => {
                if (a.version_group_details[0].level_learned_at === b.version_group_details[0].level_learned_at) {
                    return a.version_group_details[0].move_learn_method.name > b.version_group_details[0].move_learn_method.name ? 1:-1
                }
            });
            pokemonObject.moves.sort((a,b) => {
                if (a.version_group_details[0].level_learned_at === b.version_group_details[0].level_learned_at && a.version_group_details[0].move_learn_method.name === b.version_group_details[0].move_learn_method.name) {
                    return a.move.name > b.move.name ? 1:-1
                }
            });

            setCurrentPokemon(pokemonObject);
        } getPokemon(selectedPokemon);
    }, [selectedPokemon])

    // ------------------------------------------------- //
    // This gets all of the pokemon, at least from 1-810 //
    // ------------------------------------------------- //
    useEffect(function() {
        async function getAllPokemon() {
            const allThePokemon = await pokemonService.getAllPokemon();
            setAllPokemon(allThePokemon.results);
        } getAllPokemon();
    
    // ----------------------------------- //
    // This gets the initial 1-151 pokemon //
    // ----------------------------------- //
        async function getInitialPokemon() {
            const initialPoke = await pokemonService.getInitialPokemon();
            setFilteredPokemon(initialPoke.results);
        } getInitialPokemon();

        async function getPokemonType() {
            const pokeTypes = await pokemonService.getPokemonTypes();
            pokeTypes.results.sort((a,b) => a.name > b.name ? 1:-1);
            setListOfTypes(pokeTypes.results);
        } getPokemonType();
    }, [])

    // ----------------------------------------------------------------------------------- //
    // This filters the list from 809 values to just that generation, to simplify the list //
    // ----------------------------------------------------------------------------------- //
    useEffect(function() {
        async function filterPokemon() {
            let tempPokeArray = [...allPokemon];
            for (let i = 0; i < generation.length; i++) {
                if (generation[i].selected === 1) {
                    tempPokeArray = tempPokeArray.slice(generation[i].start, generation[i].end + 1);
                }
            }
            setFilteredPokemon(tempPokeArray);
        } filterPokemon();
    }, [generation])


    return (
        <div>
            <div>
                <h3>Filter By:</h3>
                <input type="text" placeholder="Search.."></input>
                <br/>
                <button>Generation</button>
                <button>Type</button>
                <button>Both</button>
                <button>None</button>
                <button onClick={handleRandom}>RANDOM</button>

            </div>
            <br />
            <div>
                <select onChange={handleGen}>
                    <option value="G1">Generation 1</option>
                    <option value="G2">Generation 2</option>
                    <option value="G3">Generation 3</option>
                    <option value="G4">Generation 4</option>
                    <option value="G5">Generation 5</option>
                    <option value="G6">Generation 6</option>
                    <option value="G7">Generation 7</option>
                </select>
            </div>
            
            <div>
                <select>
                    {listOfTypes.length && listOfTypes.map(type =>
                        <option>{type.name}</option>)}
                </select>
            </div>

            <div>
                <select onChange={handlePokemon}>
                    {filteredPokemon && filteredPokemon.map(pokemon => 
                    <option value={pokemon.name}>{pokemon.name}</option>)}
                </select>
            </div>
            <div>
                {currentPokemon.sprites == null ? "" : <img src={currentPokemon.sprites.front_default} alt="" />}
                <h3>Basic Info:</h3>
                {currentPokemon == null ? "" : <p>Name: {currentPokemon.name}</p>}
                {currentPokemon == null ? "" : <p>ID: {currentPokemon.id}</p>}
                {currentPokemon.types == null ? "" : <p>Type 1: {currentPokemon.types[0].type.name}</p>}
                {currentPokemon.types == null ? "" : currentPokemon.types[1] == null ? "" : <p>Type 2: {currentPokemon.types[1].type.name}</p>}
            </div>
            <div>
                <h3>Base Stats:</h3>
                    {Object.keys(currentPokemon).length && currentPokemon.stats.map(currentPoke => 
                    <p>{currentPoke.stat.name} | {currentPoke.base_stat}</p>
                    )}
            </div>
            <div>
                <h3>Move List:</h3>
                    {Object.keys(currentPokemon).length && currentPokemon.moves.map(moveItem => 
                    <p>{moveItem.move.name} | {moveItem.version_group_details[0].level_learned_at} | {moveItem.version_group_details[0].move_learn_method.name}</p>
                    )}
            </div>
        </div>
    )
}