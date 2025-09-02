import mermaid from 'mermaid';

// This is a simplified representation of the draw.io strategy.
// A production version would require a much more robust SVG parser.

const styleMap = {
    'fill': 'fillColor',
    'stroke': 'strokeColor',
    'stroke-width': 'strokeWidth',
};

const parseNodeStyle = (element) => {
    const style = { html: 1 };
    const styleString = element.getAttribute('style');
    if (styleString) {
        styleString.split(';').forEach(declaration => {
            const [property, value] = declaration.split(':');
            if (property && value && styleMap[property.trim()]) {
                style[styleMap[property.trim()]] = value.trim();
            }
        });
    }
    return style;
};

const getElementCenter = (bbox) => {
    return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
}

export const translate = async (mermaidCode) => {
    // Ensure a unique ID for each render to avoid mermaid cache issues
    const renderId = `mermaid-render-${Date.now()}`;
    const { svg } = await mermaid.render(renderId, mermaidCode);

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, 'image/svg+xml');

    let xmlCells = '';
    const nodeElements = {};

    // Process Groups (Subgraphs)
    const subgraphs = svgDoc.querySelectorAll('.subgraph');
    subgraphs.forEach(subgraph => {
        const id = subgraph.id;
        const rect = subgraph.querySelector('rect');
        const label = subgraph.querySelector('.subgraph-label');
        if (!rect || !label) return;

        const { x, y, width, height } = rect.getBBox();
        const style = parseNodeStyle(rect);
        const mxStyle = {
            ...style,
            group: 1,
            verticalAlign: 'top',
            fontStyle: 1,
            align: 'center',
        };
        const styleString = Object.entries(mxStyle).map(([k, v]) => `${k}=${v}`).join(';');

        xmlCells += `<mxCell id="${id}" value="${label.innerHTML}" style="${styleString}" vertex="1" parent="1">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;
    });

    // Process Nodes
    const nodes = svgDoc.querySelectorAll('.node');
    nodes.forEach(node => {
        const id = node.id;
        const rect = node.querySelector('rect, circle, polygon, ellipse');
        const label = node.querySelector('.nodeLabel');
        if (!rect || !label) return;

        const parentGroup = node.closest('.subgraph');
        const parentId = parentGroup ? parentGroup.id : '1';
        const { x, y, width, height } = rect.getBBox();
        nodeElements[id] = rect.getBBox();

        const style = parseNodeStyle(rect);
        const styleString = Object.entries(style).map(([k, v]) => `${k}=${v}`).join(';');

        xmlCells += `<mxCell id="${id}" value="${label.innerHTML}" style="${styleString}" vertex="1" parent="${parentId}">
            <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />
        </mxCell>`;
    });

    // Process Edges
    const edgePaths = svgDoc.querySelectorAll('.edge-path');
    edgePaths.forEach((path, i) => {
        const edgeGroup = path.parentElement;
        const classes = edgeGroup.className.baseVal.split(' ');
        const sourceId = classes.find(c => c.startsWith('LS-'))?.replace('LS-', '');
        const targetId = classes.find(c => c.startsWith('LE-'))?.replace('LE-', '');
        
        if (!sourceId || !targetId) return;

        const edgeLabel = edgeGroup.querySelector('.edgeLabel');
        const labelValue = edgeLabel ? edgeLabel.innerHTML : '';

        const style = {
            endArrow: 'classic',
            html: 1,
            rounded: 0,
            labelBackgroundColor: '#f5f5f5',
            fontStyle: 3, // Italic for edge labels as per spec
            noEdgeStyle: 1,
        };
        const styleString = Object.entries(style).map(([k, v]) => `${k}=${v}`).join(';');

        xmlCells += `<mxCell id="edge-${i}" value="${labelValue}" style="${styleString}" edge="1" parent="1" source="${sourceId}" target="${targetId}">
            <mxGeometry relative="1" as="geometry" />
        </mxCell>`;
    });

    const finalXml = `<mxfile host="app.diagrams.net">
        <diagram id="diagram-1" name="Page-1">
            <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
                <root>
                    <mxCell id="0" />
                    <mxCell id="1" parent="0" />
                    ${xmlCells}
                </root>
            </mxGraphModel>
        </diagram>
    </mxfile>`;

    return finalXml;
};
