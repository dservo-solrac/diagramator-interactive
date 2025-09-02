import React from 'react';

const MermaidModal = ({ code, setCode, onGenerate, onCancel }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', width: '60%', height: '70%', display: 'flex', flexDirection: 'column' }}>
            <h3>Mermaid Code</h3>
            <textarea 
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ flex: 1, width: '100%' }}
            />
            <div>
                <button onClick={onGenerate}>Generate</button>
                <button onClick={() => setCode('')}>Clear</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>
);

export default MermaidModal;
