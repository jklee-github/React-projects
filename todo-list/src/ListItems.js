import React from "react";
import './ListItems.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FlipMove from "react-flip-move";

const ListItems = ({ items, deleteItem, setUpdate }) => {

    const listItmes = items.map(item => {
        return (
            <div className="list" key={item.id}>
                <p>
                    <input type="text"
                        id={item.id}
                        value={item.value}
                        onChange={e => setUpdate(e.target.value, item.id)} />
                    <span>
                        <FontAwesomeIcon
                            className="faicons"
                            icon='trash'
                            onClick={() => deleteItem(item.id)} />
                    </span>
                </p>
            </div>
        )
    })
    return (
        <div>
            <FlipMove duration={300} easing="ease-in-out">
                {listItmes}
            </FlipMove>
        </div>
    )
}

export default ListItems;