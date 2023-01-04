import "./MoveList.css"
import { useState, useEffect } from "react"
import * as pokemonService from "../../Utilities/pokemon-service"



export default function MoveList({currentPokemon}) {

    const [moveListButtons, setMoveListButtons] = useState([
        {
            id: 1,
            name: "Egg",
            active: 0,
        },
        {
            id: 2,
            name: "Machine",
            active: 0,
        },
        {
            id: 3,
            name: "Tutor",
            active: 0,
        },
        {
            id: 4,
            name: "Level",
            active: 1
        }
    ])
    const [moveListEgg, setMoveListEgg] = useState([])
    const [moveListMachine, setMoveListMachine] = useState([])
    const [moveListTutor, setMoveListTutor] = useState([])
    const [moveListLevel, setMoveListLevel] = useState([])

    function handleMoveListButtons(event) {
        let tempButtons = [...moveListButtons];
        tempButtons.forEach((button) => {
            button.active = 0;
            if (event.target.id == button.id) {
                button.active = 1;
            }
        });
        setMoveListButtons(tempButtons);
    }

    useEffect(function() {
        async function gatherMoves() {
            setMoveListEgg([]);
            setMoveListMachine([]);
            setMoveListTutor([]);
            setMoveListLevel([]);
            let tempPokemon = currentPokemon;
            tempPokemon.moves.forEach(move => {
                if (move.version_group_details[0].move_learn_method.name == "egg") {
                    setMoveListEgg(moveListEgg => [...moveListEgg, move])
                }
                else if (move.version_group_details[0].move_learn_method.name == "machine") {
                    setMoveListMachine(moveListMachine => [...moveListMachine, move])
                }
                else if (move.version_group_details[0].move_learn_method.name == "tutor") {
                    setMoveListTutor(moveListTutor => [...moveListTutor, move])
                }
                else if (move.version_group_details[0].move_learn_method.name == "level-up") {
                    setMoveListLevel(moveListLevel => [...moveListLevel, move])
                }
            })
        } gatherMoves();
    }, [currentPokemon])

    return (
        
        <div className="container"> 
        <div className="move_list_buttons">
            <button onClick={handleMoveListButtons} id="1" className="btn btn-primary">Egg</button>
            <button onClick={handleMoveListButtons} id="2" className="btn btn-success">Machine</button>
            <button onClick={handleMoveListButtons} id="3" className="btn btn-warning">Tutor</button>
            <button onClick={handleMoveListButtons} id="4" className="btn btn-danger">Level</button>
        </div>
    
        {/* ---------------------------------- */}
        {/* This handles the move list portion */}
        {/* ---------------------------------- */}
        <div className="table_css table_moves_list">
            <table class="table table-striped basic_info moves_list">
                <thead>
                    <tr>
                        <th colspan="3" scope="col">Move List</th>
                    </tr>
                    <tr>
                        <th>Move Name</th>
                        <th>Level Learned</th>
                        <th>Learned By</th>
                    </tr>
                </thead>
                <tbody>
                    {moveListButtons[0].active == 1 ? 
                        moveListEgg.map(moveEgg => 
                            <tr>
                                <td>{moveEgg.move.name}</td>
                                <td>{moveEgg.version_group_details[0].level_learned_at}</td>
                                <td>{moveEgg.version_group_details[0].move_learn_method.name}</td>
                            </tr>   
                        )
                    :
                    moveListButtons[1].active == 1 ?
                        moveListMachine.map(moveMachine => 
                            <tr>
                                <td>{moveMachine.move.name}</td>
                                <td>{moveMachine.version_group_details[0].level_learned_at}</td>
                                <td>{moveMachine.version_group_details[0].move_learn_method.name}</td>
                            </tr>   
                        )
                    :
                    moveListButtons[2].active == 1 ?
                        moveListTutor.map(moveTutor => 
                            <tr>
                                <td>{moveTutor.move.name}</td>
                                <td>{moveTutor.version_group_details[0].level_learned_at}</td>
                                <td>{moveTutor.version_group_details[0].move_learn_method.name}</td>
                            </tr>   
                        )
                    : 
                    moveListButtons[3].active == 1 ?
                        moveListLevel.map(moveLevel => 
                            <tr>
                                <td>{moveLevel.move.name}</td>
                                <td>{moveLevel.version_group_details[0].level_learned_at}</td>
                                <td>{moveLevel.version_group_details[0].move_learn_method.name}</td>
                            </tr>   
                        )
                    :
                    ""
                    }
                </tbody>
            </table>
        </div>
    </div>
    )
}