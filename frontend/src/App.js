
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MermaidModal from './components/MermaidModal';
import MxGraphCanvas from './components/MxGraphCanvas';
import { translate } from './services/mermaidToMxGraph';
import * as api from './services/api';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [diagrams, setDiagrams] = useState([]);
    const [currentDiagram, setCurrentDiagram] = useState(null);
    const [mermaidCode, setMermaidCode] = useState('');
    const [xml, setXml] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDiagrams();
        }
    }, [isAuthenticated]);

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
        setCurrentDiagram(null);
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
            await api.createDiagram(payload);
        }
        fetchDiagrams();
    };

    const handleGenerate = async () => {
        try {
            const generatedXml = await translate(mermaidCode);
            setXml(generatedXml);
            setIsModalOpen(false);
        } catch (e) {
            alert('Failed to parse Mermaid code.');
        }
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
                onMermaidOpen={() => setIsModalOpen(true)}
                onLogout={handleLogout}
            />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar 
                    diagrams={diagrams}
                    onNew={handleNewDiagram}
                    onLoad={handleLoadDiagram}
                    onDelete={handleDeleteDiagram}
                />
                <div style={{ flex: 1, padding: '10px' }}>
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
