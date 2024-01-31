import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { API_URL } from './constants';


function OneCharacter() {

    const navigate = useNavigate()

    const { name } = useParams()

    const [character, setCharacter] = useState({
        debutFilm: "",
        debutYear: 0
    })

    // 1A. the true/ false value that users can control - initially false, because reading info goes before editing 
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetch(`${API_URL}/oneMcu/${name}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(async res => {
            let result = await res.json()
            setCharacter(result.payload)
        })
    }, [name, isEditing])

    function toggleIsEditing() {
        isEditing ? setIsEditing(false) : setIsEditing(true)
    }

    function updateCharacter({target}) {
        setCharacter((prevState) => {
            return {
                ...prevState,
                [target.name]: target.value
            }
        })

    }

    function handleOnSubmit(e) {
        e.preventDefault()

        console.log("submitted")

        fetch(`${API_URL}/updateOneMcu/${name}`, {
            method: "put",
            body: JSON.stringify(character),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(() => {
            setIsEditing(false)
        })
    }

    function handleDelete(){
        fetch(`${API_URL}/deleteOneMcu/${name}`, {
            method: "delete",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(() => {
            navigate('/mcu')
        })
    }

    return ( 
        <>
            <h1>{name}</h1>
            <form onSubmit={(e) => handleOnSubmit(e)}>
            <p>
                Debuted in the film&nbsp;
                {
                    isEditing 
                    ? 
                    <input type="text" name="debutFilm" value={character.debutFilm} onChange={updateCharacter}/>
                    :
                    <span>{character.debutFilm}</span>
                }
            </p>

            <p>
                Released in the year&nbsp;
                {
                    isEditing 
                    ? 
                    <input type="text" name="debutYear" value={character.debutYear} onChange={updateCharacter} />
                    :
                    <span>{character.debutYear}</span>
                }
               
            </p>
            {isEditing ? <button type="submit">Save Changes</button> : <br />}
            </form>
            <button onClick={toggleIsEditing}>
                {
                    isEditing 
                    ? 
                    <span>Discard Change</span>
                    :
                    <span>Edit Character Details</span>
                }
            </button>
            <br />
            <button onClick={handleDelete}>
                ONE CLICK DELETE THIS CHARACTER
            </button>
        </>
     );
}

export default OneCharacter;
