import React from 'react';
import './MermaidModal.css';

const MermaidModal = ({ code, setCode, onGenerate, onCancel }) => {
    return (
        <div className="mermaid-modal">
            <h2>Edit Mermaid Code</h2>
            <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
            />
            <div className="modal-actions">
                <button onClick={onGenerate}>Generate</button>
                <button onClick={() => setCode('')}>Clear</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default MermaidModal;
