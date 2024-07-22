import { useGetDocument } from '../api/document/use';
import { SignaturesModal } from '../components/SignaturesModal';

interface Param {
    id: string;
    showModal: boolean;
    handleClose: () => void;
}

export function Signatures({ id, showModal, handleClose }:  Param) {
    const { data } = useGetDocument(id);

    if (!data) {
        return null;
    }

    return <SignaturesModal
        document={data}
        showModal={showModal}
        handleClose={handleClose}
    />;
}