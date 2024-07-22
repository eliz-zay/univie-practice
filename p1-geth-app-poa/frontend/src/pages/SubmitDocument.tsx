import { SubmitDocumentModal } from '../components/SubmitDocumentModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function SubmitDocument({ showModal, handleClose }:  Param) {
    return <SubmitDocumentModal
        showModal={showModal}
        handleClose={handleClose}
    />;
}