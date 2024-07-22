import { NodeCardDto } from '../api/node/dto';
import { formatDate } from '../infrastructure/date';
import '../App.css';

interface Param {
    node: NodeCardDto;
}

export function NodeCard({ node }: Param) {
    return (
        <div className='mx-4 my-4'>
            <h1>{node.name}</h1>
            <h3>Configuration</h3>
            <table className='table table-bordered table-fixed width-90'>
                <thead>
                    <tr className='col-widths-7 bg-light'>
                        <th className='bg-light'>PID</th>
                        <th className='bg-light'>Data directory</th>
                        <th className='bg-light'>Status</th>
                        <th className='bg-light'>Endpoints</th>
                        <th className='bg-light'>Bootnode</th>
                        <th className='bg-light'>Miner account</th>
                        <th className='bg-light'>Port</th>
                        <th className='bg-light'>Auth RPC port</th>
                        <th className='bg-light'>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={node.id}>
                        <td className='bg-light'>{node.pid}</td>
                        <td className='bg-light'>{`${node.dataDir.name} (genesis: ${node.dataDir.genesis.name})`}</td>
                        <td className={node.isRunning ? 'cell-success' : 'cell-danger'}>
                            {node.isRunning ? 'Running' : 'Inactive'}
                        </td>
                        <td className='bg-light'>{node.endpoints.map((e) => `${e.protocol} ${e.port}`).join('; ')}</td>
                        <td className='bg-light'>{node.bootnode?.name ?? '-'}</td>
                        <td className='bg-light'>{node.minerAccount?.name ?? '-'}</td>
                        <td className='bg-light'>{node.port}</td>
                        <td className='bg-light'>{node.authRpcPort}</td>
                        <td className='bg-light'>{formatDate(node.createdAt)}</td>
                    </tr>
                </tbody>
            </table>
            <br />
            {
                !node.ethInfo
                    ? <></>
                    : <>
                        <h3>Node state</h3>
                        <table className='table table-bordered width-90'>
                            <thead>
                            <tr className='bg-light'>
                                <th className='bg-light'>Is mining?</th>
                                <th className='bg-light'>Discovery port</th>
                                <th className='bg-light'>Listener port</th>
                                <th className='bg-light col-width-50'>enr</th>
                                <th className='bg-light col-width-20'>Ethereum node ID</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr key={node.id}>
                                    <td className={node.ethInfo.isMining ? 'cell-success' : 'cell-danger'}>
                                        {node.ethInfo.isMining ? 'true' : 'false'}
                                    </td>
                                    <td className='bg-light'>{node.ethInfo.node.ports.discovery}</td>
                                    <td className='bg-light'>{node.ethInfo.node.ports.listener}</td>
                                    <td className='bg-light'>{node.ethInfo.node.enr}</td>
                                    <td className='bg-light'>{node.ethInfo.node.id}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <h3>Transaction logs</h3>
                        <table className='table table-bordered table-fixed width-90'>
                            <thead>
                            <tr className='col-widths-7 bg-light'>
                                <th className='bg-light'>Block number</th>
                                <th className='bg-light'>Block hash</th>
                                <th className='bg-light'>Log</th>
                                <th className='bg-light'>Address</th>
                                <th className='bg-light'>Topics</th>
                                {/* <th className='bg-light'>Data</th> */}
                                <th className='bg-light'>Transaction index</th>
                                <th className='bg-light'>Transaction hash</th>
                                <th className='bg-light'>Log index</th>
                                <th className='bg-light'>Removed</th>
                            </tr>
                            </thead>
                            <tbody>
                                {node.ethInfo.transactionLogs.map((log, i) => (
                                    <tr className='col-widths-7 bg-light wordwrap' key={i}>
                                        <td className='bg-light'>{log.blockNumber ?? '-'}</td>
                                        <td className='bg-light'>{log.blockHash ?? '-'}</td>
                                        <td className='bg-light'>{log.stringLog ?? '-'}</td>
                                        <td className='bg-light'>{log.address ?? '-'}</td>
                                        <td className='bg-light'>{log.topics?.join(', ') ?? '-'}</td>
                                        {/* <td className='bg-light'>{log.data}</td> */}
                                        <td className='bg-light'>{log.transactionIndex ?? '-'}</td>
                                        <td className='bg-light'>{log.transactionHash ?? '-'}</td>
                                        <td className='bg-light'>{log.logIndex ?? '-'}</td>
                                        <td className='bg-light'>{log.removed ? 'true' : 'false'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                    </>
            }
            <h3>Process logs</h3>
            <p className='text-with-newlines'>{node.logs}</p>
        </div>
    );
}
