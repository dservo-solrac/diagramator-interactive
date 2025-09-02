import React from 'react';

const TopBar = ({ diagramName, setDiagramName, onSave, onMermaidOpen, onLogout }) => (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <input 
                type="text" 
                value={diagramName} 
                onChange={e => setDiagramName(e.target.value)} 
                placeholder="Diagram Name"
            />
        </div>
        <div>
            <button onClick={onSave}>Save</button>
            <button onClick={onMermaidOpen}>Mermaid Code</button>
            <button onClick={onLogout}>Logout</button>
        </div>
    </div>
);

export default TopBar;
