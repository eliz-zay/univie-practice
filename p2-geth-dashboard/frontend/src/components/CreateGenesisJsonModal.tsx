import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { BaseSyntheticEvent, useState } from 'react';
import { usePostDataDir, usePostGenesisJson } from '../api/genesis-json/use';
import { AccountDto } from '../api/account/dto';
import { toasts } from '../infrastructure/toasts';

interface Param {
    accounts: AccountDto[];
    showModal: boolean;
    handleClose: () => void;   
}

export function CreateGenesisJsonModal({ accounts: aAccounts, showModal, handleClose }: Param) {
    const postGenesis = usePostGenesisJson();
    const postDataDir = usePostDataDir();

    const [name, setName] = useState<string | undefined>();
    const [networkId, setNetworkId] = useState<string | undefined>();
    const [cliquePeriod, setCliquePeriod] = useState<number>(5);
    const [gasLimit, setGasLimit] = useState<number | undefined>(80000);
    const [accounts, setAccounts] = useState<{ accountId: string | undefined; balance: string; isSigner: boolean; }[]>([
        { accountId: undefined, balance: '30000000000000000000000', isSigner: true }
    ]);
    const [createDir, setCreateDir] = useState(true);

    const [validated] = useState(false);

    const handleNameChange = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
    }
    const handleNetworkIdChange = (event: BaseSyntheticEvent) => {
        setNetworkId(event.target.value);
    }
    const handleCliquePeriodChange = (event: BaseSyntheticEvent) => {
        setCliquePeriod(event.target.value);
    }
    const handleGasLimitChange = (event: BaseSyntheticEvent) => {
        setGasLimit(event.target.value);
    }
    const handleOnWheel = (event: BaseSyntheticEvent) => {
        event.currentTarget.blur();
    }
    const handleAccountChange = (index: number, input: SingleValue<{ value: string; label: string; }>) => {
        const newAccounts = [...accounts];
        newAccounts[index].accountId = input?.value;
        setAccounts(newAccounts);
    }
    const handleBalanceChange = (index: number, event: BaseSyntheticEvent) => {
        const newAccounts = [...accounts];
        newAccounts[index].balance = event.target.value;
        setAccounts(newAccounts);
    }
    const handleIsSignerChange = (index: number, event: BaseSyntheticEvent) => {
        const newAccounts = [...accounts];
        newAccounts[index].isSigner = event.target.checked;
        setAccounts(newAccounts);
    }
    const handleAddFields = () => {
        setAccounts([...accounts, { accountId: undefined, balance: '30000000000000000000000', isSigner: false }]);
    }
    const handleDeleteFields = (index: number) => {
        const newAccounts = [...accounts];
        newAccounts.splice(index, 1);
        setAccounts(newAccounts);
    }
    const handleSetCreateDir = (event: BaseSyntheticEvent) => {
        setCreateDir(event.target.checked);
    }

    const handleSubmit = async (event: BaseSyntheticEvent) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }
        if (!accounts.find((a) => a.isSigner)) {
            toasts.error('Genesis must have at least 1 signer account');
            event.stopPropagation();
            return;
        }

        const response = await postGenesis({
            name: name!,
            networkId: networkId!,
            cliquePeriod: Number(cliquePeriod),
            gasLimit: String(gasLimit!),
            accounts: accounts as any
        });

        if (response && createDir) {
            await postDataDir({
                genesisId: response.id,
                name: 'dir #0'
            });
        }

        handleClose();

        setName(undefined);
        setNetworkId(undefined);
        setGasLimit(80000);
        setAccounts([{ accountId: undefined, balance: '30000000000000000000000', isSigner: true }]);
        setCreateDir(true);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create genesis.json</Modal.Title>
            </Modal.Header>
            <Form validated={validated}>
                <Modal.Body>
                    <Form.Label>Name<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleNameChange} value={name} type='text' required/>
                    <br />
                    <Form.Label>Network ID<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleNetworkIdChange} value={networkId} type='text' required/>
                    <br />
                    <Form.Label>Clique period (sec)<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control
                        onChange={handleCliquePeriodChange}
                        onWheel={handleOnWheel}
                        value={cliquePeriod}
                        type='number'
                        required
                    />
                    <br />
                    <Form.Label>Gas limit<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleGasLimitChange} value={gasLimit} type='text' required/>
                    <br />
                    {accounts.map((account, i) => (
                        <Card key={i} className='mb-3 card-color'>
                            <Card.Body>
                            <Form.Label>Account ID<span style={{ color: 'red' }}> *</span></Form.Label>
                            <Select
                                isClearable={true}
                                onChange={(input) => handleAccountChange(i, input)}
                                options={
                                    aAccounts
                                        .filter((a) => !accounts.find((picked) => picked.accountId === a.id))
                                        .map((a) => ({ value: a.id, label: a.name }))
                                }
                                required
                            />
                            <br />
                            <Form.Label>Balance<span style={{ color: 'red' }}> *</span></Form.Label>
                            <Form.Control
                                onChange={(event) => handleBalanceChange(i, event)}
                                onWheel={handleOnWheel}
                                value={account.balance}
                                type='number'
                                required
                            />
                            <br />
                            <Form.Group as={Row}>
                                <Col sm='6'>
                                <Form.Check
                                    onChange={(event) => handleIsSignerChange(i, event)}
                                    checked={account.isSigner}
                                    type='checkbox'
                                    label={<>Is signer<span style={{ color: 'red' }}> *</span></>}
                                    defaultChecked={true}
                                />
                                </Col>
                                <Col sm='6' className='text-end'>
                                    <Button
                                        variant='danger'
                                        onClick={() => handleDeleteFields(i)}
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Form.Group>
                            </Card.Body>
                        </Card>
                ))}
                <Button variant='primary' onClick={handleAddFields}>
                    Add Account
                </Button>
                <br />
                <br />
                <Form.Check
                    onChange={handleSetCreateDir}
                    checked={createDir}
                    type='switch'
                    label={<>Auto create first data directory<span style={{ color: 'red' }}> *</span></>}
                />
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
