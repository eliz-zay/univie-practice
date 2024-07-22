import { Button, Modal } from 'react-bootstrap';
import { BaseSyntheticEvent, useState } from 'react';
import { usePostDocument } from '../api/document/use';

interface Param {
    showModal: boolean;
    handleClose: () => void;
};

export function SubmitDocumentModal({ showModal, handleClose }: Param) {
    const postDocument = usePostDocument();

    const [file, setFile] = useState<File>();
  
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('file', file as Blob);

        postDocument(formData);
        handleClose();
        setFile(undefined);
    };

    const handleFileChange = (event: BaseSyntheticEvent) => {
        setFile(event.target.files[0]);
    }

    return (
        <>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    onChange={handleFileChange}
                    type='file'
                    id='input'
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='success' onClick={handleSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}
