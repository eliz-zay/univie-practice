import { useGetAccounts } from '../api/account/use';
import { CreateGenesisJsonModal } from '../components/CreateGenesisJsonModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function CreateGenesisJson({ showModal, handleClose }:  Param) {
    const { data: accounts } = useGetAccounts();

    if (!accounts) {
        return null;
    }

    return <CreateGenesisJsonModal
        accounts={accounts}
        showModal={showModal}
        handleClose={handleClose}
    />
}