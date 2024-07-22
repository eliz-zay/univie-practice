import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { EProtocol, NodeListDto } from '../api/node/dto';
import { AccountDto } from '../api/account/dto';
import { usePostNode } from '../api/node/use';
import { DataDirDto, GenesisJsonListDto } from '../api/genesis-json/dto';
import { toasts } from '../infrastructure/toasts';

interface Param {
    nodes: NodeListDto[];
    genesisList: GenesisJsonListDto[];
    showModal: boolean;
    handleClose: () => void;
}

interface DataDirState {
    value: {
        dir: DataDirDto;
        genesis: GenesisJsonListDto;
    };
    label: string;
}

function generatePorts(portsInUse: number[]): {
    defaultHttpPort: number;
    defaultWsPort: number;
    defaultPort: number;
    defaultAuthRpcPort: number;
} {
    let defaultHttpPort = 8001;
    let defaultWsPort = 3001;
    let defaultPort = 30301;
    let defaultAuthRpcPort = 8551;
    while (true) {
        if (!portsInUse.includes(defaultHttpPort)) {
            break;
        }
        defaultHttpPort++;
    }
    while (true) {
        if (!portsInUse.includes(defaultWsPort)) {
            break;
        }
        defaultWsPort++;
    }
    while (true) {
        if (!portsInUse.includes(defaultPort)) {
            break;
        }
        defaultPort++;
    }
    while (true) {
        if (!portsInUse.includes(defaultAuthRpcPort)) {
            break;
        }
        defaultAuthRpcPort++;
    }

    return { defaultHttpPort, defaultWsPort, defaultPort, defaultAuthRpcPort };
}

export function CreateNodeModal({ nodes, genesisList, showModal, handleClose }: Param) {
    const portsInUse = nodes.flatMap(
        (n) => [...n.endpoints.map((e) => e.port), n.port, n.authRpcPort]
    );
    const ports = generatePorts(portsInUse);

    const postNode = usePostNode();

    const [networkNodes, setNetworkNodes] = useState<NodeListDto[]>([]);
    const [name, setName] = useState<string | undefined>();
    const [httpPort, setHttpPort] = useState<number | undefined>(ports.defaultHttpPort);
    const [wsPort, setWsPort] = useState<number | undefined>(ports.defaultWsPort);
    const [dataDir, setDataDir] = useState<DataDirState | null>();
    const [port, setPort] = useState<number | undefined>(ports.defaultPort);
    const [authRpcPort, setAuthRpcPort] = useState<number | undefined>(ports.defaultAuthRpcPort);
    const [bootnode, setBootnode] = useState<{ value: string; label: string; } | null>();
    const [minerAccount, setMinerAccount] = useState<{ value: string; label: string; } | null>();
    const [accountOptions, setAccountOptions] = useState<AccountDto[]>([]);

    const [validated] = useState(false);

    useEffect(() => {
        const portsInUse = nodes.flatMap(
            (n) => [...n.endpoints.map((e) => e.port), n.port, n.authRpcPort]
        );
        const ports = generatePorts(portsInUse);

        setHttpPort(ports.defaultHttpPort);
        setWsPort(ports.defaultWsPort);
        setPort(ports.defaultPort);
        setAuthRpcPort(ports.defaultAuthRpcPort);
    }, [nodes]);

    const handleNameChange = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
    }
    const handleHttpPortChange = (event: BaseSyntheticEvent) => {
        if (portsInUse.includes(Number(event.target.value))) {
            toasts.warning(`Port ${event.target.value} is already in use`);
        }
        setHttpPort(event.target.value);
    }
    const handleWsPortChange = (event: BaseSyntheticEvent) => {
        if (portsInUse.includes(Number(event.target.value))) {
            toasts.warning(`Port ${event.target.value} is already in use`);
        }
        setWsPort(event.target.value);
    }
    const handleDaraDirChange = (input: SingleValue<DataDirState>) => {
        if (!input) {
            setDataDir(undefined);
            setNetworkNodes([]);
            setAccountOptions([]);
        } else {
            setDataDir(input);

            const newNetworkNodes = nodes.filter(
                (node) => node.dataDir.genesis.networkId === input.value.genesis.networkId
            );
            setNetworkNodes(newNetworkNodes);
            setAccountOptions(
                input.value.genesis.accounts
                    .filter((a) => a.isSigner && !newNetworkNodes.find((n) => n.minerAccount?.id === a.account.id))
                    .map((a) => a.account)
            );
        }
    }
    const handlePortChange = (event: BaseSyntheticEvent) => {
        if (portsInUse.includes(Number(event.target.value))) {
            toasts.warning(`Port ${event.target.value} is already in use`);
        }
        setPort(event.target.value);
    }
    const handleAuthRpcPortChange = (event: BaseSyntheticEvent) => {
        if (portsInUse.includes(Number(event.target.value))) {
            toasts.warning(`Port ${event.target.value} is already in use`);
        }
        setAuthRpcPort(event.target.value);
    }
    const handleOnWheel = (event: BaseSyntheticEvent) => {
        event.currentTarget.blur();
    }
     
    const handleSubmit = async (event: BaseSyntheticEvent) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        const endpoints = [{ port: Number(httpPort!), protocol: EProtocol.Http }];
        if (wsPort) {
            endpoints.push({ port: Number(wsPort), protocol: EProtocol.WebSocket });
        }

        await postNode({
            name: name!,
            endpoints, 
            dataDirId: dataDir!.value.dir.id,
            port: Number(port!),
            authRpcPort: Number(authRpcPort!),
            bootnodeId: bootnode ? bootnode.value : undefined,
            minerAccountId: minerAccount ? minerAccount.value : undefined
        });

        handleClose();

        setNetworkNodes([]);
        setName(undefined);
        setDataDir(undefined);
        setAccountOptions([]);
        setBootnode(null);
        setMinerAccount(null);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <div className='modal-title-container'>
                    <Modal.Title>Create node</Modal.Title>
                    <code className='modal-subtitle'>{'geth <flags>'}</code>
                </div>
            </Modal.Header>
            <Form validated={validated}>
                <Modal.Body>
                    <Form.Label>Node name<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleNameChange} value={name} type='text' required/>
                    <br />
                    <Form.Label>HTTP port<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleHttpPortChange} onWheel={handleOnWheel} value={httpPort} type='number' required/>
                    <br />
                    <Form.Label>WebSocket port</Form.Label>
                    <Form.Control onChange={handleWsPortChange} onWheel={handleOnWheel} value={wsPort} type='number'/>
                    <br />
                    <Form.Label>Data directory<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Select
                        isClearable={true}
                        onChange={handleDaraDirChange}
                        options={genesisList.flatMap(
                            (g) => g.dataDirs.map(
                                (dir) => ({
                                    value: { dir, genesis: g },
                                    label: `${dir.name} (genesis.json: ${g.name})`
                                }
                            ))
                        )}
                    />
                    <br />
                    <Form.Label>Port<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handlePortChange} onWheel={handleOnWheel} value={port} type='number' required/>
                    <br />
                    <Form.Label>Auth RPC port<span style={{ color: 'red' }}> *</span></Form.Label>
                    <Form.Control onChange={handleAuthRpcPortChange} onWheel={handleOnWheel} value={authRpcPort} type='number' required/>
                    <br />
                    <Form.Label>Bootstrap node</Form.Label>
                    <Select
                        isClearable={true}
                        onChange={setBootnode}
                        options={networkNodes.map((n) => ({ value: n.id, label: n.name }))}
                        noOptionsMessage={() => 'No nodes found in the selected network'}
                    />
                    <br />
                    <OverlayTrigger
                        placement='right'
                        overlay={
                            <Tooltip id='tooltip-right'>
                                A signer account saved in the selected genesis JSON
                            </Tooltip>
                        }
                    >
                        <Form.Label>Miner account</Form.Label>
                    </OverlayTrigger>
                    <Select
                        isClearable={true}
                        onChange={setMinerAccount}
                        options={accountOptions.map((a) => ({ value: a.id, label: a.name }))}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
