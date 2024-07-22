import { DocumentTableDto } from '../api/document/dto';
import { useGetUsers } from '../api/user/use';
import { SubmitSignatureModal } from '../components/SubmitSignatureModal';

interface Param {
    document: DocumentTableDto;
    showModal: boolean;
    handleClose: () => void;
}

export function SubmitSignature({ document, showModal, handleClose }:  Param) {
    const { data: userData } = useGetUsers();

    if (!userData) {
        return null;
    }

    return <SubmitSignatureModal
        document={document}
        users={userData}
        showModal={showModal}
        handleClose={handleClose}
    />;
}