import { Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { CreateNode } from '../pages/CreateNode';
import { Nodes } from '../pages/Nodes';
import { PeerNodes } from '../pages/PeerNodes';
import '../App.css';
import { useQueryClient } from 'react-query';

export function NodeTab() {
    const [showNodeModal, setShowNodeModal] = useState(false);
    const queryClient = useQueryClient();

    const handleNodeModalClose = () => {
        setShowNodeModal(false);
    };
    const handleNodeModalOpen = () => {
        setShowNodeModal(true);
    };
    const handleRefresh = () => {
        queryClient.invalidateQueries(['getNodes']);
        queryClient.invalidateQueries(['getNodePeers']);
    };

    return (
        <>
        <div className='node-tab mx-2 my-2'>
            <div className='flex-start'>
                <ButtonGroup className='mx-2'>
                    <Button
                        variant='success'
                        onClick={handleNodeModalOpen}
                    >
                        + Create node
                    </Button>
                </ButtonGroup>
                <ButtonGroup className='mx-2'>
                    <Button
                        variant='info'
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </ButtonGroup>
                <Nodes />
            </div>
            <PeerNodes />
        </div>
        <CreateNode
            showModal={showNodeModal}
            handleClose={handleNodeModalClose}
        />
        </>
    );
}