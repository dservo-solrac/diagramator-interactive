import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MermaidModal from './components/MermaidModal';
import MxGraphCanvas from './components/MxGraphCanvas';
import { translate } from './services/mermaidToMxGraph';
import * as api from './services/api';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [diagrams, setDiagrams] = useState([]);
    const [currentDiagram, setCurrentDiagram] = useState(null);
    const [mermaidCode, setMermaidCode] = useState('');
    const [xml, setXml] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (isAuthenticated) {
            fetchDiagrams();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        document.body.className = `theme-${theme}`;
    }, [theme]);

    const fetchDiagrams = async () => {
        const data = await api.getDiagrams();
        setDiagrams(data);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const handleNewDiagram = () => {
        setCurrentDiagram({ name: 'New Diagram' });
        setMermaidCode('graph TD\n  A --> B');
        setXml('');
    };

    const handleLoadDiagram = (diagram) => {
        setCurrentDiagram(diagram);
        setMermaidCode(diagram.mermaid_script || '');
        setXml(diagram.xml_script || '');
    };

    const handleDeleteDiagram = async (id) => {
        await api.deleteDiagram(id);
        fetchDiagrams();
    };

    const handleSaveDiagram = async () => {
        if (!currentDiagram?.name) {
            alert('Please enter a diagram name.');
            return;
        }
        const payload = { 
            name: currentDiagram.name, 
            mermaid_script: mermaidCode, 
            xml_script: xml 
        };
        if (currentDiagram.id) {
            await api.updateDiagram(currentDiagram.id, payload);
        } else {
            const newDiagram = await api.createDiagram(payload);
            setCurrentDiagram(newDiagram);
        }
        fetchDiagrams();
    };

    const handleGenerate = async () => {
        try {
            const generatedXml = await translate(mermaidCode);
            setXml(generatedXml);
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Failed to parse Mermaid code.');
        }
    };

    const handleExport = (format) => {
        // This is a placeholder. Export functionality requires access to the graph instance.
        alert(`Exporting as ${format} is not fully implemented yet.`);
    };
    
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar 
                diagramName={currentDiagram?.name || ''}
                setDiagramName={(name) => setCurrentDiagram(prev => ({ ...prev, name }))}
                onSave={handleSaveDiagram}
                onExport={handleExport}
                onMermaidOpen={() => setIsModalOpen(true)}
                onLogout={handleLogout}
            />
            <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 50px)' }}>
                <Sidebar 
                    diagrams={diagrams}
                    onNew={handleNewDiagram}
                    onLoad={handleLoadDiagram}
                    onDelete={handleDeleteDiagram}
                />
                <div style={{ flex: 1, padding: '10px', position: 'relative' }}>
                    <button onClick={toggleTheme} style={{position: 'absolute', top: 20, left: 20, zIndex: 10}}>
                        Toggle Theme
                    </button>
                    <MxGraphCanvas xml={xml} />
                </div>
            </div>
            {isModalOpen && (
                <MermaidModal 
                    code={mermaidCode}
                    setCode={setMermaidCode}
                    onGenerate={handleGenerate}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default App;