import React, { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ListItems from './ListItems'
import './App.css';

library.add(faTrash);

const App = () => {
  // state hook
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);

  // helper function

  const addItem = (e) => {

    e.preventDefault();

    if (!newItem) return;

    const item = {
      id: Date.now(),
      value: newItem
    };

    setItems(oldList => [...oldList, item]);

    setNewItem("");
  }

  const deleteItem = (id) => {
    const newArray = items.filter(item => item.id !== id)
    setItems(newArray);
  }

  const setUpdate = (value, id) => {
    items.map(item => {
      if (item.id === id) {
        item.value = value
      }
    })
    setItems([...items])

  }

  return (
    <div className="App-container">
      <header className="title">Todo List App</header>
      <div className="App">
        {/* input*/}
        <form id="to-do-form" onSubmit={(e) => addItem(e)}>
          <input
            type="text"
            placeholder='Add an item'
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {/* list of items */}
        <ListItems
          items={items}
          deleteItem={deleteItem}
          setUpdate={setUpdate}
        ></ListItems>
      </div>
    </div>
  );
}

export default App;
