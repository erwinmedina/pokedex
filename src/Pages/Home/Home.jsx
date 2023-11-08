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
            end: 151,
            selected: 1
            
        },
        {
            generation: "G2",
            start: 151,
            end: 251,
            selected: 0
        },
        {
            generation: "G3",
            start: 251,
            end: 386,
            selected: 0
        },
        {
            generation: "G4",
            start: 386,
            end: 493,
            selected: 0
        },
        {
            generation: "G5",
            start: 493,
            end: 649,
            selected: 0
        },
        {
            generation: "G6",
            start: 649,
            end: 721,
            selected: 0
        },
        {
            generation: "G7",
            start: 721,
            end: 809,
            selected: 0
        }
    ]);
    const [activeGeneration, setActiveGeneration] = useState({
        generation: "G1",
        start: 0,
        end: 151,
        selected: 1
        })
    const [allPokemon, setAllPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(1)
    const [currentPokemon, setCurrentPokemon] = useState([]);
    const [filteredPokeObject, setFilteredPokeObject] = useState([])
    const [listOfTypes, setListOfTypes] = useState([]);
    const [currentType, setCurrentType] = useState(7);
    const [buttonChoices, setButtonChoices] = useState([
        {
            name: "Generation",
            selected: 1
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
            selected: 0
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
                setActiveGeneration(tempGen[i]);
            }
        }
        setGeneration(tempGen);

    }

    function handleTypeChange(event) {
        setCurrentType(parseInt(event.target.value));
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
            if (allPokemon.length == 0) {
                const allThePokemon = await pokemonService.getAllPokemon();
                setAllPokemon(allThePokemon.results);
            }
        } getAllPokemon();
    
    // ----------------------------------- //
    // This gets the initial 1-151 pokemon //
    // ----------------------------------- //
        // async function getInitialPokemon() {
        //     const initialPoke = await pokemonService.getInitialPokemon();
        //     setFilteredPokemon(initialPoke.results);
        // } getInitialPokemon();

        async function getPokemonType() {
            if (listOfTypes.length == 0) {
                const pokeTypes = await pokemonService.getPokemonTypes();
                pokeTypes.results.pop(-1);
                pokeTypes.results.pop(-1);
                pokeTypes.results.sort((a,b) => a.name > b.name ? 1:-1);
                setListOfTypes(pokeTypes.results);
            }
        } getPokemonType();
    }, [])

    // ----------------------------------------------------------------------------------- //
    // This filters the list from 809 values to just that generation, to simplify the list //
    // ----------------------------------------------------------------------------------- //
    useEffect(function() {
        if (buttonChoices[2].selected != 1) {
            async function newGeneration() {
                const newGenPokemon = await pokemonService.getGenerationPokemon(activeGeneration.start, activeGeneration.end - activeGeneration.start);
                setFilteredPokemon(newGenPokemon.results)
            } newGeneration();
        }
    }, [buttonChoices, generation])

    // ------------------------------------------------------ //
    // This filters the poke type from the current generation //
    // ------------------------------------------------------ //\
    useEffect(function() {
        async function listPokemonWithTypeSelected() {
            let tempFilteredPoke = [];

            // ----------------------------------------------- //
            // This will show all pokemon with a specific type //
            // ----------------------------------------------- //
            if (buttonChoices[1].selected == 1) {
                const pokeTypeList = await pokemonService.getAllPokemonWithTypes(currentType);
                setFilteredPokeObject(pokeTypeList.pokemon);
                pokeTypeList.pokemon.forEach(poke => {
                    if (parseInt(poke.pokemon.url.split('/')[6]) <= generation[6].end) {
                        tempFilteredPoke = [...tempFilteredPoke, poke.pokemon];
                    }
                })
                setFilteredPokemon(tempFilteredPoke);
            }

            // ------------------------------------------------------------------------ //
            // This shows all pokemon with a specific type within a specific generation //
            // ------------------------------------------------------------------------ //
            else if (buttonChoices[2].selected == 1) {
                const newGenPokemon = await pokemonService.getGenerationPokemon(activeGeneration.start, activeGeneration.end - activeGeneration.start);
                setFilteredPokemon(newGenPokemon.results)
                const pokeTypeList = await pokemonService.getAllPokemonWithTypes(currentType);
                setFilteredPokeObject(pokeTypeList.pokemon);
                pokeTypeList.pokemon.forEach(poke => {
                    if (parseInt(poke.pokemon.url.split('/')[6]) >= activeGeneration.start && parseInt(poke.pokemon.url.split('/')[6]) <= activeGeneration.end) {
                        tempFilteredPoke = [...tempFilteredPoke, poke.pokemon];
                    }
                })
                setFilteredPokemon(tempFilteredPoke);
            }

        } listPokemonWithTypeSelected();
    }, [buttonChoices, generation, currentType])


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
                    <div className="buttonFilterSection">
                        {/* <h3>Filter By:</h3>
                        <input type="text" placeholder="Search.."></input> */}
                        <div className="userSearch">
                            <div className="userFilter">
                                <label className="filter_label form-check-label">Select a filter..</label>
                                <div className="buttonFilterSection_buttons">
                                    <button className="btn btn-dark" value="Generation" onClick={handleButtons}>Generation</button>
                                    <button className="btn btn-dark" value="Type" onClick={handleButtons}>Type</button>
                                    <button className="btn btn-dark" value="Both" onClick={handleButtons}>Gen + Type</button>
                                    {/* <button className="btn btn-primary" value="None" onClick={handleButtons}>None</button> */}
                                    {/* <button disabled={disabled} className="btn btn-primary random_button" onClick={handleRandom}>RANDOM</button> */}
                                </div>
                            </div>

                            <div className="selectorsAfterFilter">
                                {/* ---------------------------------------------- */}
                                {/* This handles which generation we're looking at */}
                                {/* ---------------------------------------------- */}
                                {buttonChoices[0].selected === 1 || buttonChoices[2].selected === 1 ?
                                    <div>
                                        <label className="form-check-label">Select a generation..</label>
                                        <div className="input-group mb-3">
                                            <select className="form-select" onChange={handleGen}>
                                                <option value="G1">Generation 1</option>
                                                <option value="G2">Generation 2</option>
                                                <option value="G3">Generation 3</option>
                                                <option value="G4">Generation 4</option>
                                                <option value="G5">Generation 5</option>
                                                <option value="G6">Generation 6</option>
                                                <option value="G7">Generation 7</option>
                                            </select>
                                        </div>
                                    </div>
                                    :
                                    ""
                                }

                                {/* ----------------------------- */}
                                {/* This handles the pokemon type */}
                                {/* ----------------------------- */}
                                {buttonChoices[1].selected === 1 || buttonChoices[2].selected === 1 ?
                                    <div>
                                        <label className="form-check-label">Select a type..</label>
                                        <div className="input-group mb-3">
                                            <select onChange={handleTypeChange} className="form-select">
                                                {listOfTypes.length && listOfTypes.map(type =>
                                                    <option value={type.url.split('/')[6]}>{type.name}</option>)}
                                            </select>
                                        </div>

                                    </div>
                                    :
                                    ""
                                }
                                <div className="poke_selector">
                                    <div className="labelRandom">
                                        <label className="form-check-label">Select a pokemon..</label>
                                
                                    </div>
                                    <div className="input-group mb-3">
                                        <select className="form-select" id="inputGroupSelect01" onChange={handlePokemon}>
                                            {filteredPokemon && filteredPokemon.map(pokemon => 
                                            <option value={pokemon.url.split('/')[6]}>{pokemon.url.split('/')[6]} - {pokemon.name}</option>)}
                                        </select>
                                        <button disabled={disabled} className="btn btn-sm btn-primary random_button" onClick={handleRandom}>RANDOM</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                            {/* ------------------------------------------------ */}
                            {/* This handles the dropdown pokemon selector thing */}
                            {/* ------------------------------------------------ */}
                            <div>
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
        </div>
            
    )
}