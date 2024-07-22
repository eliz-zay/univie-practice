import { useGetGenesisJsonList } from '../api/genesis-json/use';
import { CreateDataDirModal } from '../components/CreateDataDirModal';

interface Param {
    showModal: boolean;
    handleClose: () => void;
}

export function CreateDataDir({ showModal, handleClose }:  Param) {
    const { data } = useGetGenesisJsonList({ availableDirsOnly: false });

    if (!data) {
        return null;
    }

    return <CreateDataDirModal
        genesisList={data}
        handleClose={handleClose}
        showModal={showModal}
    />;
}