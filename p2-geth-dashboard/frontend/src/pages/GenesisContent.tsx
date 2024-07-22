import { useGetGenesisJson } from '../api/genesis-json/use';
import { GenesisContentModal } from '../components/GenesisContentModal';

interface Param {
    id: string;
    showModal: boolean;
    handleClose: () => void;
}

export function GenesisContent({ id, showModal, handleClose }:  Param) {
    const { data } = useGetGenesisJson(id);

    if (!data) {
        return null;
    }

    return <GenesisContentModal
        genesis={data}
        showModal={showModal}
        handleClose={handleClose}
    />
}
