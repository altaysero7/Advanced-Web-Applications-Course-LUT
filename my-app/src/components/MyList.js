// Referencing week 10 lecture slides and source code

import React from 'react'

const MyList = (props) => {
    return (
        <div>
            {props.header}
            <ol>
                {props.items.map((item, index) => (
                    <li className='list-items' key={item.id} onClick={() => props.updateItem(item.id)} style={{ textDecoration: item.clicked ? 'line-through' : '' }}>
                    {item.text}
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default MyList