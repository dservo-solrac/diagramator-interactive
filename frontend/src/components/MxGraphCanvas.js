import React, { useRef, useEffect, useState } from 'react';

const MxGraphCanvas = ({ xml }) => {
    const containerRef = useRef(null);
    const graphRef = useRef(null);
    const [isMxGraphLoaded, setIsMxGraphLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.mxGraph) {
                setIsMxGraphLoaded(true);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!xml || !containerRef.current || !isMxGraphLoaded) return;

        const container = containerRef.current;
        container.innerHTML = '';

        const { mxGraph, mxUtils, mxCodec, mxOutline } = window;

        const graph = new mxGraph(container);
        graphRef.current = graph;

        graph.setTooltips(true);
        graph.setEnabled(true);
        graph.setCellsEditable(true);

        // Add a minimap (outline)
        const outlineContainer = document.createElement('div');
        outlineContainer.style.position = 'absolute';
        outlineContainer.style.bottom = '20px';
        outlineContainer.style.right = '20px';
        outlineContainer.style.width = '150px';
        outlineContainer.style.height = '100px';
        outlineContainer.style.background = 'white';
        outlineContainer.style.border = '1px solid black';
        container.appendChild(outlineContainer);
        const outline = new mxOutline(graph, outlineContainer);

        const xmlDoc = mxUtils.parseXml(xml);
        const codec = new mxCodec(xmlDoc);
        const model = codec.decode(xmlDoc.documentElement.querySelector('diagram > mxGraphModel'));
        graph.setModel(model);

        return () => {
            graph.destroy();
            graphRef.current = null;
        };
    }, [xml, isMxGraphLoaded]);

    const zoom = (factor) => {
        if (graphRef.current) {
            if (factor === 0) graphRef.current.zoomActual();
            else graphRef.current.zoom(factor);
        }
    };

    if (!isMxGraphLoaded) {
        return <div>Loading diagram library...</div>;
    }

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