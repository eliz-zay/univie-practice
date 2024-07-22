import { Button, Form, Modal } from 'react-bootstrap';
import { BaseSyntheticEvent, useState } from 'react';
import { GenesisJsonListDto } from '../api/genesis-json/dto';
import { usePostDataDir } from '../api/genesis-json/use';
import Select from 'react-select';

interface Param {
    genesisList: GenesisJsonListDto[];
    showModal: boolean;
    handleClose: () => void;
}

export function CreateDataDirModal({ genesisList, showModal, handleClose }: Param) {
    const postDataDir = usePostDataDir();

    const [name, setName] = useState<string | undefined>();
    const [genesis, setGenesis] = useState<{ value: string; label: string; } | null>();

    const [validated] = useState(false);

    const handleNameChange = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
    }

    const handleSubmit = async (event: BaseSyntheticEvent) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        await postDataDir({
            genesisId: genesis!.value,
            name: name!,
        });

        handleClose();

        setName(undefined);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <div className='modal-title-container'>
                    <Modal.Title>Create data directory</Modal.Title>
                    <code className='modal-subtitle'>{'geth init --datadir <value> <genesis-json-path>'}</code>
                </div>
            </Modal.Header>
            <Form validated={validated}>
                <Modal.Body>
                    <Form.Label>Name<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleNameChange} value={name} type='text' required/>
                    <br />
                    <Form.Label>Genesis JSON<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Select
                        isClearable={true}
                        onChange={setGenesis}
                        options={genesisList.map((g) => ({ value: g.id, label: g.name }))}
                        required
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
