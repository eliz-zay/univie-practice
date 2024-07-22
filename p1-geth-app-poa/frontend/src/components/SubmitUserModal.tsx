import { Button, Form, Modal } from 'react-bootstrap';
import { BaseSyntheticEvent, useState } from 'react';
import { usePostUser } from '../api/user/use';

interface Param {
    showModal: boolean;
    handleClose: () => void;
};

export function SubmitUserModal({ showModal, handleClose }: Param) {
    const postUser = usePostUser();

    const [username, setUsername] = useState('');
  
    const handleSubmit = () => {
        postUser({ username });
        handleClose();
        setUsername('');
    };

    const handleUsernameChange = (event: BaseSyntheticEvent) => {
        setUsername(event.target.value);
    }

    return (
        <>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    onChange={handleUsernameChange}
                    value={username}
                    type='text'
                    aria-describedby='commentArea'
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
