import { SubmitUserModal } from '../components/SubmitUserModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function SubmitUser({ showModal, handleClose }:  Param) {
    return <SubmitUserModal
        showModal={showModal}
        handleClose={handleClose}
    />;
}