// Referencing week 11 lecture slides and source code
// Referencing https://dev.to/antdp425/react-fetch-data-from-api-with-useeffect-27le

import React, {useState, useEffect} from 'react'

function About() {
    let [poems, setPoems] = useState([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((data) => {
            setPoems(data);
        });
    }, []);


    return (
        <div>
            <h1>ABOUT PAGE</h1>
            <ul>
                {poems.map((poem) => (
                    <li key={poem.id}>{poem.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default About