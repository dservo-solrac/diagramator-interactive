import React from 'react';
import './TopBar.css';

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const TopBar = ({ 
    diagramName, 
    setDiagramName, 
    onSave, 
    onExport, 
    onMermaidOpen, 
    onLogout, 
    onNewDiagram,
    onToggleSidebar,
    theme,
    onToggleTheme
}) => {
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <button onClick={onToggleSidebar} className="icon-btn"><MenuIcon /></button>
                <button onClick={onNewDiagram}>New Diagram</button>
            </div>
            <div className="top-bar-center">
                <input 
                    type="text" 
                    value={diagramName} 
                    onChange={(e) => setDiagramName(e.target.value)} 
                    placeholder="Untitled Diagram"
                />
                <button onClick={onSave}>Save</button>
            </div>
            <div className="top-bar-right">
                <button onClick={() => onExport('PNG')}>Export PNG</button>
                <button onClick={() => onExport('SVG')}>Export SVG</button>
                <button onClick={onMermaidOpen}>Mermaid Code</button>
                <button onClick={onToggleTheme} className="icon-btn">
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default TopBar;
