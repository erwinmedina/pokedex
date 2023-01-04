import "./EvoChain.css"

import { useState, useEffect } from "react"
import * as pokemonService from "../../Utilities/pokemon-service"

export default function EvoChain({evo_chain, setEvo_chain, currentpokemon, setSelectedPokemon}) {
    const [evo_chain_info, setEvo_chain_info] = useState([]);
    const [temp_chain, setTemp_chain] = useState([]);

    function updateCurrentPokemon(event, pokemon) {
        setSelectedPokemon(pokemon.evo_poke.species.url.split('/')[6]);
    }

    // ------------------------------------------------------ //
    // Empties out the evo-chain with each new currentPokemon //
    // ------------------------------------------------------ //
    useEffect(function() {
        async function emptyEvoChain() {
            setEvo_chain_info([]);
        } emptyEvoChain();
    }, [currentpokemon])

    useEffect(function() {
        async function setUpTempChain() {
            setTemp_chain(evo_chain);
        } setUpTempChain();
    }, [evo_chain])

    // ---------------------------------------------------------- //
    // Handles creating the evo-chain array, readys it for output //
    // ---------------------------------------------------------- //
    useEffect(function() {
        async function getTempPokemon(temp_chain) {

            const tempPokeID = temp_chain.species.url.split('/')[6];
            const tempPoke = await pokemonService.getPokemon(tempPokeID);
            setEvo_chain_info([...evo_chain_info, tempPoke]);
            
            if (temp_chain.evolves_to != []) {
                setTemp_chain(temp_chain.evolves_to[0]);
                const tempPokeID = temp_chain.species.url.split('/')[6];
                const tempPoke = await pokemonService.getPokemon(tempPokeID);
                setEvo_chain_info([...evo_chain_info, tempPoke]);
            }
        } getTempPokemon(temp_chain);
    }, [temp_chain])

    return (
        <div className="evo_chain">
            <div className="evo_title">
                <h3>Evolution Chain</h3>
                <div className="evo_chain_sprites">
                    {evo_chain_info == null ? "" : evo_chain_info.map((evo_poke, i, arr) =>
                        <div className="evo_chain_solo">
                            <div onClick={(event) => updateCurrentPokemon(event, {evo_poke})} className="div_sprites">
                                <img src={evo_poke.sprites.front_default} alt={evo_poke.name} />
                                <p>{evo_poke.name}</p>
                            </div>
                            <div>
                                {arr.length - 1 === i ? "" : 
                                    <div className="div_arrow">
                                        <img className="arrow" src="https://cdn-icons-png.flaticon.com/512/724/724927.png" alt="" />
                                    </div>
                                }
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}