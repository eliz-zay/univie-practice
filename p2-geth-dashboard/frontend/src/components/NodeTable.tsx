import { formatDate } from '../infrastructure/date'; 
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { BaseSyntheticEvent, useState } from 'react';
import { NodeListDto } from '../api/node/dto';
import { useDeleteNode } from '../api/node/use';
import '../App.css';

interface Param {
    nodes: NodeListDto[];
};

export function NodeTable({ nodes }: Param) {
    const deleteNode = useDeleteNode();
    const navigate = useNavigate();

    const [loadingNodes, setLoadingNodes] = useState<string[]>([]);

    const handleRowClick = (node: NodeListDto) => {
        return (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            navigate('/nodes/' + node.id);
        };
    }
    const handleDeleteClick = (node: NodeListDto) => {
        return async (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            setLoadingNodes([...loadingNodes, node.id]);
            await deleteNode(node.id);
            setLoadingNodes(loadingNodes.filter((id) => id !== node.id));
        };
    }

    return (
        <table className='table table-bordered table-hover layout-fixed my-2 mx-2'>
            <thead>
                <tr className='col-widths-7 bg-light'>
                    <th className='bg-light'>PID</th>
                    <th className='bg-light'>Data directory</th>
                    <th className='bg-light'>Name</th>
                    <th className='bg-light'>Status</th>
                    <th className='bg-light'>Endpoints</th>
                    <th className='bg-light'>Bootnode</th>
                    <th className='bg-light'>Miner account</th>
                    <th className='bg-light'>Port</th>
                    <th className='bg-light'>Auth RPC port</th>
                    <th className='bg-light'>Created at</th>
                    <th className='bg-light'></th>
                </tr>
            </thead>
            <tbody>
                {nodes.map((node) => (
                    <tr key={node.id} onClick={handleRowClick(node)}>
                        <td className='bg-light'>{node.pid}</td>
                        <td className='bg-light'>{`${node.dataDir.name} (genesis: ${node.dataDir.genesis.name})`}</td>
                        <td className='bg-light table-bold-column'>{node.name}</td>
                        <td className={node.isRunning ? 'cell-success' : 'cell-danger'}>
                            {node.isRunning ? 'Running' : 'Inactive'}
                        </td>
                        <td className='bg-light'>{node.endpoints.map((e) => `${e.protocol} ${e.port}`).join('; ')}</td>
                        <td className='bg-light'>{node.bootnode?.name ?? '-'}</td>
                        <td className='bg-light'>{node.minerAccount?.name ?? '-'}</td>
                        <td className='bg-light'>{node.port}</td>
                        <td className='bg-light'>{node.authRpcPort}</td>
                        <td className='bg-light'>{formatDate(node.createdAt)}</td>
                        <td className='bg-light'>
                            <Button
                                variant='outline-danger'
                                onClick={handleDeleteClick(node)}
                                disabled={loadingNodes.includes(node.id)}
                            >
                                {loadingNodes.includes(node.id)
                                    ? <>
                                        <Spinner
                                            as='span'
                                            animation='border'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                        <span className='sr-only'> Deleting...</span>
                                    </>
                                    : ('Delete')
                                }
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
