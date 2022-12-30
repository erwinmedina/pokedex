import "./Home.css"

import * as pokemonService from "../../Utilities/pokemon-service"
import { useEffect, useState } from "react"
import EvoChain from "./EvoChain";

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
    const [selectedPokemon, setSelectedPokemon] = useState(746)
    const [currentPokemon, setCurrentPokemon] = useState([]);
    const [filteredPokeObject, setFilteredPokeObject] = useState([])
    const [listOfTypes, setListOfTypes] = useState([]);
    const [buttonChoices, setButtonChoices] = useState([
        {
            name: "Generation",
            selected: 0
        },
        {
            name: "Type",
            selected: 0
        },
        {
            name: "Both",
            selected: 0
        },
        {
            name: "None",
            selected: 1
        }
    ]);
    const [pokeSpecies, setPokeSpecies] = useState([]);
    const [evo_chain, setEvo_chain] = useState([])

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
        setEvo_chain([]);
        var index = Math.floor(Math.random() * allPokemon.length);
        setSelectedPokemon(parseInt(allPokemon[index].url.split('/')[6]));
    }

    function handleButtons(event) {
        let tempArray = [...buttonChoices];
        tempArray.forEach((buttonChoice) => {
            buttonChoice.selected = 0;
            if (event.target.value === buttonChoice.name) {
                buttonChoice.selected = 1;
            }
        });
        setButtonChoices(tempArray);
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

    // --------------------------------------------- //
    // This fills in the PokemonSpecies array/object //
    // --------------------------------------------- //
    useEffect(function() {
        async function getPokeSpecies(selectedPokemon) {
            const evo_pokeSpecies = await pokemonService.getPokemonSpecies(selectedPokemon);
            setPokeSpecies(evo_pokeSpecies);
        } getPokeSpecies(selectedPokemon);
        
    }, [selectedPokemon])

    useEffect(function() {
        async function getEvoChain(pokeSpecies) {
            const evo_chain = await pokemonService.getEvolutionChain(pokeSpecies.evolution_chain.url);
            setEvo_chain(evo_chain.chain);
        } getEvoChain(pokeSpecies);
    }, [pokeSpecies])

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
            let tempPokeObject = [...filteredPokeObject];
            for (let i = 0; i < generation.length; i++) {
                if (generation[i].selected === 1) {
                    for (let j = generation[i].start; i < generation[i].end + 1; i++) {
                        console.log("k")
                        // tempPokeObject.push({
                        //     value: tempPokeArray[generation[i]]
                        //     label: 
                        // })
                    }
                    tempPokeArray = tempPokeArray.slice(generation[i].start, generation[i].end + 1);
                }
            }
            setFilteredPokemon(tempPokeArray);
        } filterPokemon();
    }, [generation])


    return (
        <div className="homePage">

            {/* ----------------------------------------- */}
            {/* This container holds the top of the page: */}
            {/* Basic Info, Base Stats, and Buttons       */}
            {/* ----------------------------------------- */}
            <div className="container">
            {/* ----------------------------------------- */}
            {/* This table handles the basic info portion */}
            {/* ----------------------------------------- */}
                <div className="table_css table_basic">
                    <table class="table table-striped basic_info">
                        <thead className="table_sprite_row">
                            <tr>
                                <th scope="row">{currentPokemon.sprites == null ? "" : <img className="pokeSprite" src={currentPokemon.sprites.front_default} alt="" />}</th>
                                <th scope="row">
                                    {currentPokemon == null ? "" : currentPokemon.name}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            
                            <tr>
                                <th scope="row">ID #</th>
                                <td>
                                    {currentPokemon == null ? "" : currentPokemon.id}
                                </td>
                            </tr>
                            
                            <tr>
                                <th scope="row">Type 1</th>
                                <td>
                                    {currentPokemon.types == null ? "" : currentPokemon.types[0].type.name.toUpperCase()}
                                </td>
                            </tr>
                            
                            <tr>
                                <th scope="row">Type 2</th>
                                <td>
                                    {currentPokemon.types == null ? "" : currentPokemon.types[1] == null ? "N/A" : currentPokemon.types[1].type.name.toUpperCase()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ----------------------------------------- */}
                {/* This table handles the Base Stats portion */}
                {/* ----------------------------------------- */}
                <div className="table_css table_base_stats">
                    <table class="table table-striped basic_info base_stats">
                        <thead>
                            <tr>
                                <th colspan="2" scope="col">Base Stats</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Object.keys(currentPokemon).length && currentPokemon.stats.map(currentPoke => 
                                <tr>
                                    <th scope="row">{currentPoke.stat.name.toUpperCase()}</th>
                                    <td>{currentPoke.base_stat}</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
                
                <div className="div_for_buttons">
                    {/* -------------------------------------- */}
                    {/* This handles the buttons and filtering */}
                    {/* -------------------------------------- */}
                    <div>
                        {/* <h3>Filter By:</h3>
                        <input type="text" placeholder="Search.."></input> */}
                        <br/>
                        <br />
                        {/* <button value="Generation" onClick={handleButtons}>Generation</button> */}
                        {/* <button value="Type" onClick={handleButtons}>Type</button> */}
                        {/* <button value="Both" onClick={handleButtons}>Both</button> */}
                        {/* <button value="None" onClick={handleButtons}>None</button> */}
                        <br />
                        <button className="btn btn-primary random_button" onClick={handleRandom}>RANDOM</button>

                    </div>
                
                    <br />
                    
                    {/* ---------------------------------------------- */}
                    {/* This handles which generation we're looking at */}
                    {/* ---------------------------------------------- */}
                    {buttonChoices[0].selected === 1 || buttonChoices[2].selected === 1 ?
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
                        :
                        ""
                    }

                    {/* ----------------------------- */}
                    {/* This handles the pokemon type */}
                    {/* ----------------------------- */}
                    {buttonChoices[1].selected === 1 || buttonChoices[2].selected === 1 ?
                        <div >
                            <select >
                                {listOfTypes.length && listOfTypes.map(type =>
                                    <option>{type.name}</option>)}
                            </select>
                        </div>
                        :
                        ""
                    }

                    {/* ------------------------------------------------ */}
                    {/* This handles the dropdown pokemon selector thing */}
                    {/* ------------------------------------------------ */}
                    <div className="container poke_selector">
                        <div className="input-group mb-3">
                            <select className="form-select" id="inputGroupSelect01" onChange={handlePokemon}>
                                {filteredPokemon && filteredPokemon.map(pokemon => 
                                <option value={pokemon.url.split('/')[6]}>{pokemon.url.split('/')[6]} - {pokemon.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
               
            </div>
            
            {/* -------------------------------------- */}
            {/* This will handle the evolution portion */}
            {/* -------------------------------------- */}
            <EvoChain 
                evo_chain={evo_chain} 
                setEvo_chain={setEvo_chain} 
                currentpokemon={currentPokemon}
                setSelectedPokemon={setSelectedPokemon}
            />

            {/* ----------------------------------------- */}
            {/* This table handles the Moves List portion */}
            {/* ----------------------------------------- */}
            <div className="container"> 
                <div className="move_list_buttons">
                    <button className="btn btn-primary">Egg</button>
                    <button className="btn btn-success">Machine</button>
                    <button className="btn btn-warning">Tutor</button>
                    <button className="btn btn-danger">Level</button>
                </div>
                
                {/* ---------------------------------- */}
                {/* This handles the move list portion */}
                {/* ---------------------------------- */}
                <div className="table_css table_moves_list">
                    <table class="table table-striped basic_info moves_list">
                        <thead>
                            <tr>
                                <th colspan="3" scope="col">Moves List</th>
                            </tr>
                            <tr>
                                <th>Move Name</th>
                                <th>Level Learned</th>
                                <th>Learned By</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Object.keys(currentPokemon).length && currentPokemon.moves.map(moveItem => 
                                <tr>
                                    <td scope="row">{moveItem.move.name}</td>
                                    <td>{moveItem.version_group_details[0].level_learned_at}</td>
                                    <td>{moveItem.version_group_details[0].move_learn_method.name}</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>

           

        </div>
            
    )
}