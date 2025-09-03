import React from 'react';
import './TopBar.css';

const TopBar = ({ diagramName, setDiagramName, onSave, onExport, onMermaidOpen, onLogout }) => {
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                {/* Future menu button can go here */}
            </div>
            <div className="top-bar-center">
                <input 
                    type="text" 
                    value={diagramName} 
                    onChange={(e) => setDiagramName(e.target.value)} 
                    placeholder="Diagram Name"
                />
                <button onClick={onSave}>Save</button>
                <button onClick={() => onExport('PNG')}>Export PNG</button>
                <button onClick={() => onExport('SVG')}>Export SVG</button>
            </div>
            <div className="top-bar-right">
                <button onClick={onMermaidOpen}>Mermaid Code</button>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default TopBar;
