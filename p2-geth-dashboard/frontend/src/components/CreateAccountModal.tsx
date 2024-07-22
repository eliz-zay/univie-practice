import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { usePostAccount } from '../api/account/use';
import { BaseSyntheticEvent, useState } from 'react';

interface Param {
    showModal: boolean;
    handleClose: () => void;   
}

export function CreateAccountModal({ showModal, handleClose }: Param) {
    const postAccount = usePostAccount();

    const [name, setName] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const [validated] = useState(false);

    const handleNameChange = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
    }
    const handlePasswordChange = (event: BaseSyntheticEvent) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event: BaseSyntheticEvent) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        setLoading(true);

        await postAccount({
            name: name!,
            password: password!
        });

        setLoading(false);
        handleClose();

        setName(undefined);
        setPassword(undefined);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <div className='modal-title-container'>
                    <Modal.Title>Create account</Modal.Title>
                    <code className='modal-subtitle'>geth account new</code>
                </div>
            </Modal.Header>
            <Form validated={validated}>
                <Modal.Body>
                    <Form.Label>Name<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleNameChange} value={name} type='text' required/>
                    <br />
                    <Form.Label>Password<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handlePasswordChange} value={password} type='text' required/>
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' onClick={handleSubmit}>
                        {loading
                            ? <>
                                <Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true'
                                />
                                <span className='sr-only'> Submitting...</span>
                            </>
                            : ('Submit')
                        }
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
