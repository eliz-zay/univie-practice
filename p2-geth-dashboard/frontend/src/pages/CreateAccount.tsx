import { CreateAccountModal } from '../components/CreateAccountModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function CreateAccount({ showModal, handleClose }:  Param) {
    return <CreateAccountModal
        showModal={showModal}
        handleClose={handleClose}
    />;
}