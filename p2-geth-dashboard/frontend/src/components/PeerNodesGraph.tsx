import Plot from 'react-plotly.js';
import Select, { SingleValue } from 'react-select';
import { NodePeersDto, NodePeersNodeDto } from '../api/node/dto';
import { useState } from 'react';
import '../App.css';
import { useGetNodePeers } from '../api/node/use';

export function PeerNodesGraph() {
    const [networks, setNetworks] = useState<NodePeersDto[]>([]);
    const [networkNodes, setNetworkNodes] = useState<NodePeersNodeDto[]>([]);
    const [selectedNetwork, setSelectedNetwork] = useState<{ value: string; label: string; } | null>(null);

    const generateNetworkLabel = (n: NodePeersDto) => `${n.genesisName}, network ID: ${n.networkId}`;

    useGetNodePeers({
        onSuccess: (data) => {
            setNetworks(data);
            setNetworkNodes(data[0]?.nodes ?? []);
            setSelectedNetwork({
                value: data[0]?.networkId ?? '',
                label: data[0] ? generateNetworkLabel(data[0]) : ''
            });
        }
    });

    const handleNetworkChange = (input: SingleValue<{ value: string; label: string; }>) => {
        if (!input) {
            return;
        }

        setSelectedNetwork(input);
        setNetworkNodes(networks.find((n) => n.networkId === input.value)!.nodes);
    };
    
    // Graph
    
    const links = networkNodes.flatMap((node) => node.peers.map(
        (peer) => ({ source: node.ethId, target: peer.id })
    ));

    const nodeIds = networkNodes.map(node => node.ethId);
    const angleStep = (2 * Math.PI) / nodeIds.length;
    const nodeX: any[] = [];
    const nodeY: any[] = [];

    // Generate circular layout positions for nodes
    nodeIds.forEach((_, i) => {
        const angle = i * angleStep;
        nodeX.push(Math.cos(angle) * 100);
        nodeY.push(Math.sin(angle) * 100);
    });

    const linkX: any[] = [];
    const linkY: any[] = [];

    // Generate link coordinates
    links.forEach(link => {
        const sourceIndex = nodeIds.indexOf(link.source);
        const targetIndex = nodeIds.indexOf(link.target);

        linkX.push(nodeX[sourceIndex], nodeX[targetIndex], null);
        linkY.push(nodeY[sourceIndex], nodeY[targetIndex], null);
    });

    const data: Plotly.Data[] = [
        {
            type: 'scatter',
            x: linkX,
            y: linkY,
            mode: 'lines',
            line: { width: 1, color: '#888' },
            hoverinfo: 'none'
        },
        {
            type: 'scatter',
            x: nodeX,
            y: nodeY,
            mode: 'markers+text' as any,
            text: networkNodes.map((node) => node.name),
            textposition: 'bottom center',
            marker: { size: 12, color: '#191970' },
            textfont: { family: 'Arial, sans-serif', size: 16 },
            hoverinfo: 'text'
        }
    ];

    const layout: Partial<Plotly.Layout> = {
        showlegend: false,
        hovermode: 'closest',
        margin: { t: 4, r: 10, b: 10, l: 10 },
        xaxis: { showgrid: false, zeroline: false, showticklabels: false, fixedrange: true },
        yaxis: { showgrid: false, zeroline: false, showticklabels: false, fixedrange: true },
        width: 600,
        height: 600,
        plot_bgcolor: 'whitesmoke'
    };

    return (
        <div>
            <div className='mx-2 mt-3'>
                <h3 className='title'>Network peer nodes</h3>
                <Select
                    onChange={handleNetworkChange}
                    options={networks.map((n) => ({
                        value: n.networkId,
                        label: generateNetworkLabel(n)
                    }))}
                    value={selectedNetwork}
                />
                <br />
            </div>
            <Plot
                data={data as any}
                layout={layout as any}
            />
        </div>
    );
}
