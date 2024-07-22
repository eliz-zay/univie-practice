import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Genesis } from '../pages/Genesis';
import { CreateDataDir } from '../pages/CreateDataDir';
import { CreateGenesisJson } from '../pages/CreateGenesisJson';

export function GenesisTab() {
    const [showGenesisModal, setShowGenesisModal] = useState(false);
    const [showDataDirModal, setShowDataDirModal] = useState(false);

    const handleGenesisModalClose = () => {
        setShowGenesisModal(false);
    };
    const handleGenesisModalOpen = () => {
        setShowGenesisModal(true);
    };
    const handleDataDirModalClose = () => {
        setShowDataDirModal(false);
    };
    const handleDataDirModalOpen = () => {
        setShowDataDirModal(true);
    };

    return (
        <>
        <div className='mx-2 my-2'>
            <ButtonGroup className='mx-2'>
                <Button
                    variant='success'
                    onClick={handleGenesisModalOpen}
                >
                    + Create genesis.json
                </Button>
            </ButtonGroup>
            <ButtonGroup className='mx-2'>
                <Button
                    variant='success'
                    onClick={handleDataDirModalOpen}
                >
                    + Create data directory
                </Button>
            </ButtonGroup>
            <Genesis />
        </div>
        <CreateGenesisJson
            showModal={showGenesisModal}
            handleClose={handleGenesisModalClose}
        />
        <CreateDataDir
            showModal={showDataDirModal}
            handleClose={handleDataDirModalClose}
        />
        </>
    );
}