import "./Home.css"

import * as pokemonService from "../../Utilities/pokemon-service"
import { useEffect, useState } from "react"
import EvoChain from "./EvoChain";
import { FadeIn } from "react-slide-fade-in";
import MoveList from "./MoveList";

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
    const [selectedPokemon, setSelectedPokemon] = useState(1)
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
    const [evo_chain, setEvo_chain] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [bookmarks, setBookmarks] = useState([
        {
            id:     1,
            name:   "evolution_chart",
            active: 0,
        },
        {
            id:     2,
            name:   "move_list",
            active: 0,
        }
    ])

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

    function handleRandom(event) {
        {event.preventDefault();
            setDisabled(true);
            setTimeout(() => {
                setDisabled(false);
            }, 1000)
        }
        setEvo_chain([]);
        var index = Math.floor(Math.random() * allPokemon.length);
        setSelectedPokemon(parseInt(allPokemon[index].url.split('/')[6]));
    }

    function handle_sidebar(event) {
        let tempBookmark = [...bookmarks];
        tempBookmark.forEach((bookmark) => {
            if (bookmark.active == 1) {
                bookmark.active = 0;
                return;
            }
            bookmark.active = 0;
            if (event.target.id == bookmark.id) {
                bookmark.active = 1;
            }
        })
        setBookmarks(tempBookmark);
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
            <div className="homePage_container">
                {/* ----------------------------------------- */}
                {/* This table handles the basic info portion */}
                {/* ----------------------------------------- */}
                <div className="total_table">
                    <div className="table_css table_basic">
                        <table class="table table-striped basic_info">
                            <thead className="table_sprite_row">
                                <tr>
                                    <th colspan="2" scope="row">{currentPokemon.sprites == null ? "" : <img className="pokeSprite" src={currentPokemon.sprites.front_default} alt="" />}
                                        <p>{currentPokemon == null ? "" : currentPokemon.name}</p>
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
                                
                                {currentPokemon.types == null ? 
                                    "" 
                                    : 
                                    currentPokemon.types[1] == null ? 
                                    "" 
                                    :
                                    <tr>    
                                        <th scope="row">Type 2</th>
                                        <td>
                                            {currentPokemon.types[1].type.name.toUpperCase()}
                                        </td>
                                    </tr>
                                }
                            </tbody>
                            <thead>
                                <tr>
                                    <th colspan="2" scope="col">Base Stats</th>
                                </tr>
                            </thead>
                            
                            <tbody className="base_stats">

                                {Object.keys(currentPokemon).length && currentPokemon.stats.map(currentPoke => 
                                    <tr>
                                        <th scope="row">{currentPoke.stat.name.toUpperCase()}</th>
                                        <td>{currentPoke.base_stat}</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                    <div onClick={handle_sidebar} className="table_sidebar">
                        <div id="1" className="sidebar_evoChain">
                            <p id="1" >Evolution Chain</p>
                        </div>
                        <div id="2" className="sidebar_moveList">
                            <p id="2">Move List</p>
                        </div>
                    </div>
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
                        <button disabled={disabled} className="btn btn-primary random_button" onClick={handleRandom}>RANDOM</button>

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
                    <div>
                        <div className="container poke_selector">
                            <div className="input-group mb-3">
                                <select className="form-select" id="inputGroupSelect01" onChange={handlePokemon}>
                                    {filteredPokemon && filteredPokemon.map(pokemon => 
                                    <option value={pokemon.url.split('/')[6]}>{pokemon.url.split('/')[6]} - {pokemon.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {bookmarks[0].active == 1 || bookmarks[1].active == 1 ?
                            <div className="bookmark_display">
                                {bookmarks[1].active == 1 ? 
                                    <MoveList
                                    currentPokemon={currentPokemon}
                                    />
                                :
                                bookmarks[0].active == 1 ?
                                    <EvoChain 
                                    evo_chain={evo_chain} 
                                    setEvo_chain={setEvo_chain} 
                                    currentpokemon={currentPokemon}
                                    setSelectedPokemon={setSelectedPokemon}
                                    />
                                :
                                ""
                                }
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            </div>
        </div>
            
    )
}