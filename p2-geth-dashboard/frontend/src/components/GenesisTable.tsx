import { Button } from 'react-bootstrap';
import { BaseSyntheticEvent, useState } from 'react';
import '../App.css';
import { DataDirDto, GenesisJsonListDto } from '../api/genesis-json/dto';
import { useDeleteDataDir, useDeleteGenesisJson } from '../api/genesis-json/use';
import { GenesisContent } from '../pages/GenesisContent';
import { useNavigate } from 'react-router-dom';

interface Param {
    genesisList: GenesisJsonListDto[];
};

export function GenesisTable({ genesisList }: Param) {
    const deleteGenesis = useDeleteGenesisJson();
    const deleteDataDir = useDeleteDataDir();
    const navigate = useNavigate();

    const [genesisId, setGenesisId] = useState<string>();
    const [showGenesisModal, setShowGenesisModal] = useState(false);

    const handleGenesisModalClose = () => {
        setShowGenesisModal(false);
        setGenesisId(undefined);
    };

    const handleRowClick = (genesis: GenesisJsonListDto) => {
        return (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            setGenesisId(genesis.id);
            setShowGenesisModal(true);
        };
    }
    const handleDeleteGenesisClick = (genesis: GenesisJsonListDto) => {
        return async (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            await deleteGenesis(genesis.id);
        };
    }
    const handleDeleteDataDirClick = (dataDir: DataDirDto) => {
        return async (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            await deleteDataDir(dataDir.id);
        };
    }
    const handleNodeClick = (nodeId: string) => {
        return (event: BaseSyntheticEvent) => {
            event.stopPropagation();
            navigate('/nodes/' + nodeId);
        }
    }

    return (
        <>
        <table className='table table-bordered table-hover mx-2 my-2 flexible-width-80'>
            <thead>
                <tr className='col-widths-7 bg-light'>
                    <th className='bg-light'>Name</th>
                    <th className='bg-light'>Network ID</th>
                    <th className='bg-light'>Accounts</th>
                    <th className='bg-light min-width-10'>Data directories: [ name | path | node ]</th>
                    <th className='bg-light'>File path</th>
                    <th className='bg-light'></th>
                </tr>
            </thead>
            <tbody>
                {genesisList.map((genesis) => (
                    <tr key={genesis.id} onClick={handleRowClick(genesis)}>
                        <td className='bg-light table-bold-column min-width-5'>{genesis.name}</td>
                        <td className='bg-light'>{genesis.networkId}</td>
                        <td>
                            <table className='table'>
                                <tbody>
                                    {genesis.accounts.map((account) => (
                                        <tr key={account.id}>
                                            <td className='bg-light table-bold-column half-width min-width-5'>{account.account.name}</td>
                                            <td className='bg-light half-width'>{account.isSigner ? 'Signer' : 'Not signer'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table className='table'>
                                <tbody>
                                    {genesis.dataDirs.map((dir) => (
                                        <tr key={dir.id}>
                                            <td className='bg-light table-bold-column min-width-5'>{dir.name}</td>
                                            <td className='bg-light'>{dir.dir}</td>
                                            {dir.node
                                                ? <td
                                                    className='bg-light min-width-5 clickable-cell'
                                                    onClick={handleNodeClick(dir.node.id)}>
                                                        {dir.node.name}
                                                </td>
                                                : <td className='bg-light min-width-5'>
                                                    <Button
                                                        size='sm'
                                                        variant='outline-danger'
                                                        onClick={handleDeleteDataDirClick(dir)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        <td className='bg-light'>{genesis.filePath}</td>
                        <td className='bg-light'>
                            <Button
                                variant='outline-danger'
                                onClick={handleDeleteGenesisClick(genesis)}
                                disabled={!!genesis.dataDirs.find((d) => d.node)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {!genesisId
            ? <></>
            : <GenesisContent
                id={genesisId}
                showModal={showGenesisModal}
                handleClose={handleGenesisModalClose}
            />
        }
        </>
    );
}
