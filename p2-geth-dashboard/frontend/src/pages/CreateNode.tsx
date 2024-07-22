import { useGetGenesisJsonList } from '../api/genesis-json/use';
import { useGetNodes } from '../api/node/use';
import { CreateNodeModal } from '../components/CreateNodeModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function CreateNode({ showModal, handleClose }:  Param) {
    const { data: nodes } = useGetNodes();
    const { data: genesisList } = useGetGenesisJsonList({ availableDirsOnly: true });

    if (!nodes || !genesisList) {
        return null;
    }

    return <CreateNodeModal
        nodes={nodes}
        genesisList={genesisList}
        showModal={showModal}
        handleClose={handleClose}
    />;
}