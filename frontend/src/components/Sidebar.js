import React from 'react';

const Sidebar = ({ diagrams, onNew, onLoad, onDelete }) => (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Diagrams</h3>
        <button onClick={onNew}>New Diagram</button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {diagrams.map(d => (
                <li key={d.id} style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{d.name}</span>
                    <div>
                        <button onClick={() => onLoad(d)}>Load</button>
                        <button onClick={() => onDelete(d.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default Sidebar;
