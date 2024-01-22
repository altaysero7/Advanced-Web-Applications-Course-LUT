// Referencing week 10 lecture slides and source code

import React from 'react'
import MyList from './MyList'
import { useState } from 'react'

const MyContainer = () => {
    const [items, setItems] = useState([
        { id: 1, text: "This is an item", clicked: false },
        { id: 2, text: "Also this", clicked: false },
    ]);
    const [inputText, setInputText] = useState('');

    const addItem = () => {
        setItems(currentItems => [
            ...currentItems,
            { id: currentItems.length + 1, text: inputText, clicked: false }
        ]);
        setInputText('');
    };

    const updateItem = (id) => {
        setItems(currentItems => currentItems.map(item => {
            return item.id === id ? { ...item, clicked: !item.clicked } : item;
        }));
    }

    return (
        <div>
            <MyList
                header="Really epic list component"
                items={items}
                updateItem={updateItem}
            />
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={addItem}>Add Item</button>
        </div>
    )
}

export default MyContainer