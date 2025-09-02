
import React, { useState } from 'react';
import { translate } from './services/mermaidToMxGraph';
import MxGraphCanvas from './components/MxGraphCanvas';

const sampleMermaid = `
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
`;

function App() {
    const [mermaidCode, setMermaidCode] = useState(sampleMermaid);
    const [xml, setXml] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        try {
            setError('');
            const generatedXml = await translate(mermaidCode);
            setXml(generatedXml);
        } catch (e) {
            console.error(e);
            setError('Failed to parse Mermaid code. Please check the syntax.');
            setXml('');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '30%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                <h2>Mermaid Code</h2>
                <textarea
                    value={mermaidCode}
                    onChange={(e) => setMermaidCode(e.target.value)}
                    style={{ flex: 1, width: '100%', fontFamily: 'monospace' }}
                />
                <button onClick={handleGenerate} style={{ marginTop: '10px' }}>Generate</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div style={{ width: '70%', padding: '10px' }}>
                <h2>Interactive Diagram</h2>
                <MxGraphCanvas xml={xml} />
            </div>
        </div>
    );
}

export default App;
