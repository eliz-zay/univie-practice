import { Modal } from 'react-bootstrap';
import { GenesisJsonDto } from '../api/genesis-json/dto';
import '../App.css';

interface Param {
    genesis: GenesisJsonDto;
    showModal: boolean;
    handleClose: () => void;   
}

export function GenesisContentModal({ genesis, showModal, handleClose }: Param) {
    return (
        <Modal show={showModal} onHide={handleClose} dialogClassName='wide-modal'>
            <Modal.Header closeButton>
                <Modal.Title>{genesis.name}: genesis.json</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='text-with-newlines'>{genesis.content}</p>
            </Modal.Body>
        </Modal>
    )
}