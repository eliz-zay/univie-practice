import { Button, ListGroup, Modal } from 'react-bootstrap';
import { DocumentDto } from '../api/document/dto';

interface Param {
    document: DocumentDto;
    showModal: boolean;
    handleClose: () => void;
};

export function SignaturesModal({ document, showModal, handleClose }: Param) {
    return (
        <>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Document decision: '{document.title}'</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={document.isApproved ? 'text-success' : 'text-danger'}><b>{document.isApproved ? 'Approved' : 'Declined'}</b></div>
                <div className={document.isHashValid ? 'text-success' : 'text-danger'}><b>Hash check: {document.isHashValid ? 'ok' : 'not ok'}</b></div>
                
                <table className='table table-bordered mx-auto my-2 w-100'>
                <thead className='thead-light'>
                    <tr>
                    <th className='bg-light'>Signer</th>
                    <th className='bg-light'>Vote</th>
                    </tr>
                </thead>
                <tbody>
                    {document.signatures?.map((s) => (
                    <>
                        <tr>
                        <td>{s.signer.username}</td>
                        <td>{s.vote ? 'For' : 'Against'}</td>
                        </tr>
                    </>
                    ))}
                </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}
