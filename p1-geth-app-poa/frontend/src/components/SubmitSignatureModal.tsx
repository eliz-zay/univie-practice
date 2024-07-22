import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { DocumentTableDto } from '../api/document/dto';
import { usePostSignature } from '../api/signature/use';
import { BaseSyntheticEvent, useState } from 'react';
import { UserDto } from '../api/user/dto';

interface Param {
    document?: DocumentTableDto;
    users: UserDto[];
    showModal: boolean;
    handleClose: () => void;
};

export function SubmitSignatureModal({ document, users, showModal, handleClose }: Param) {
    const postSignature = usePostSignature();

    const [user, setUser] = useState<string>(users[0].id);
    const [vote, setVote] = useState(true);

    if (!document) {
      return null;
    }
  
    const handleSubmit = () => {
        postSignature({ documentId: document.id, userId: user, vote });
        handleClose();
        setUser(users[0].id);
        setVote(true);
    };

    const handleUserChange = (event: BaseSyntheticEvent) => {
        setUser(event.target.value);
    }

    const handleVoteChange = (event: BaseSyntheticEvent) => {
        setVote(!!Number(event.target.value));
    }

    return (
        <>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Submit signature: '{document.title}'</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>User</Form.Label>
                <Form.Select aria-label='User' onChange={handleUserChange}>
                    {users.map((user) => (
                        <option value={user.id}>{user.username}</option>
                    ))}
                </Form.Select>
                <br />
                <Form.Label>Vote</Form.Label>
                <Form.Select aria-label='Vote' onChange={handleVoteChange}>
                    <option value='1'>For</option>
                    <option value='0'>Against</option>
                </Form.Select>
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
