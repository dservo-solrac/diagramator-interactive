import React, { useRef, useEffect, useState } from 'react';

const MxGraphCanvas = ({ xml }) => {
    const containerRef = useRef(null);
    const graphRef = useRef(null);

    useEffect(() => {
        if (!xml || !containerRef.current) return;
        if (!window.mxGraph) {
            console.error('mxGraph library not found!');
            return;
        }

        const container = containerRef.current;
        container.innerHTML = '';

        const mx = window.mxGraph({ mxBasePath: '/' });
        const graph = new mx.mxGraph(container);
        graphRef.current = graph;

        graph.setTooltips(true);
        graph.setEnabled(true);
        graph.setCellsEditable(true);

        // Add a minimap (outline)
        const outline = new mx.mxOutline(graph, document.createElement('div'));
        outline.outline.style.position = 'absolute';
        outline.outline.style.bottom = '20px';
        outline.outline.style.right = '20px';
        outline.outline.style.width = '150px';
        outline.outline.style.height = '100px';
        outline.outline.style.background = 'white';
        outline.outline.style.border = '1px solid black';
        container.appendChild(outline.outline);

        const xmlDoc = mx.mxUtils.parseXml(xml);
        const codec = new mx.mxCodec(xmlDoc);
        const model = codec.decode(xmlDoc.documentElement.querySelector('diagram > mxGraphModel'));
        graph.setModel(model);

        return () => {
            graph.destroy();
            graphRef.current = null;
        };
    }, [xml]);

    const zoom = (factor) => {
        if (graphRef.current) {
            if (factor === 0) graphRef.current.zoomActual();
            else graphRef.current.zoom(factor);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={containerRef} className="mxgraph-canvas" />
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <button onClick={() => zoom(1.2)}>+</button>
                <button onClick={() => zoom(0.8)}>-</button>
                <button onClick={() => zoom(0)}>100%</button>
            </div>
        </div>
    );
};

export default MxGraphCanvas;