import mermaid from 'mermaid';

// Helper to parse style attributes from SVG elements
const parseStyle = (element) => {
    const style = {};
    const styleString = element.getAttribute('style');
    if (styleString) {
        styleString.split(';').forEach(declaration => {
            const [property, value] = declaration.split(':');
            if (property && value) {
                style[property.trim()] = value.trim();
            }
        });
    }
    return style;
};

const generateMxCell = (id, value, style, parent, isVertex, isEdge) => {
    let styleString = Object.entries(style).map(([key, val]) => `${key}=${val}`).join(';');
    let cell = `<mxCell id="${id}" value="${value}" style="${styleString}" parent="${parent}"`;
    if (isVertex) cell += ' vertex="1"';
    if (isEdge) cell += ' edge="1"';
    cell += '>';
    return cell;
};

const generateGeometry = (x, y, width, height) => {
    return `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />`;
};

export const translate = async (mermaidCode) => {
    mermaid.initialize({ startOnLoad: false, theme: 'base' });
    const { svg } = await mermaid.render('graphDiv', mermaidCode);

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, 'image/svg+xml');

    let xml = '<mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100">';
    xml += '<root><mxCell id="0" /><mxCell id="1" parent="0" />';

    // Process subgraphs first
    const subgraphs = svgDoc.querySelectorAll('.subgraph');
    subgraphs.forEach(subgraph => {
        const rect = subgraph.querySelector('rect');
        const label = subgraph.querySelector('.subgraph-label');
        const id = subgraph.id;
        const { x, y, width, height } = rect.getBBox();
        const style = parseStyle(rect);

        const mxStyle = {
            group: '1',
            verticalAlign: 'top',
            fontStyle: '1',
            align: 'center',
            fillColor: style.fill || '#f5f5f5',
        };

        xml += generateMxCell(id, label.textContent, mxStyle, '1', true, false);
        xml += generateGeometry(x, y, width, height);
        xml += '</mxCell>';
    });

    // Process nodes
    const nodes = svgDoc.querySelectorAll('.node');
    nodes.forEach(node => {
        const rect = node.querySelector('rect, circle, polygon');
        const label = node.querySelector('.nodeLabel');
        const id = node.id;
        const parentGroup = node.closest('.subgraph');
        const parentId = parentGroup ? parentGroup.id : '1';

        const { x, y, width, height } = rect.getBBox();
        const style = parseStyle(rect);

        const mxStyle = {
            fillColor: style.fill || '#ffffff',
            strokeColor: style.stroke || '#000000',
            strokeWidth: style['stroke-width'] || '1',
            html: '1',
        };

        xml += generateMxCell(id, label.innerHTML, mxStyle, parentId, true, false);
        xml += generateGeometry(x, y, width, height);
        xml += '</mxCell>';
    });

    // Process edges
    const edges = svgDoc.querySelectorAll('.edge-path');
    edges.forEach((edge, i) => {
        const id = `edge-${i + 1}`;
        const label = svgDoc.querySelector(`#${edge.id.replace('L', 'LT')}`);
        const sourceId = edge.getAttribute('marker-start').match(/url\(#(.*?)\)/)[1].split('-')[0];
        const targetId = edge.getAttribute('marker-end').match(/url\(#(.*?)\)/)[1].split('-')[0];

        const mxStyle = {
            endArrow: 'classic',
            html: '1',
            rounded: '0',
            labelBackgroundColor: '#F5F5F5',
            fontStyle: '3', // Italic
            noEdgeStyle: '1',
        };

        const labelValue = label ? label.innerHTML : '';
        xml += generateMxCell(id, labelValue, mxStyle, '1', false, true);
        xml += '<mxGeometry relative="1" as="geometry" />';
        xml += '</mxCell>';
    });

    xml += '</root></mxGraphModel>';
    return xml;
};
