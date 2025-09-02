import React, { useRef, useEffect } from 'react';

const MxGraphCanvas = ({ xml }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!xml || !containerRef.current) return;

        // Check if mxGraph is available
        if (!window.mxGraph) {
            console.error('mxGraph library not found!');
            return;
        }

        const container = containerRef.current;
        // Clear previous graph
        container.innerHTML = '';

        const mx = window.mxGraph({
            mxBasePath: '/',
        });

        const graph = new mx.mxGraph(container);
        graph.setTooltips(true);
        graph.setEnabled(true);

        // Disable editing for now
        graph.setCellsEditable(false);

        const xmlDoc = mx.mxUtils.parseXml(xml);
        const codec = new mx.mxCodec(xmlDoc);
        const model = codec.decode(xmlDoc.documentElement);
        graph.setModel(model);

        // Cleanup on unmount
        return () => {
            graph.destroy();
        };

    }, [xml]);

    return <div ref={containerRef} style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }} />;
};

export default MxGraphCanvas;
