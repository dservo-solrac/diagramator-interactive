import React from 'react';
import './Sidebar.css';

const Sidebar = ({ diagrams, onNew, onLoad, onDelete }) => {
    return (
        <div className="sidebar">
            <button onClick={onNew}>New Diagram</button>
            <h3>My Diagrams</h3>
            <ul className="diagram-list">
                {diagrams.map(d => (
                    <li key={d.id} className="diagram-item">
                        <span onClick={() => onLoad(d)}>{d.name}</span>
                        <button onClick={() => onDelete(d.id)} className="delete-btn">X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
