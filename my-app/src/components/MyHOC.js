// Referencing week 11 lecture slides and source code
// Referencing https://www.freecodecamp.org/news/higher-order-functions-what-they-are-and-a-react-example-1d2579faf101/

import React from 'react'

function MyHOC(OGComponent) {
    return function NewComponent(props) {
        const { name, ...otherProps } = props;
        return (
            <div className='wrapper'>
                <OGComponent name={name} {...otherProps}/>
            </div>
        );
    };
}

export default MyHOC