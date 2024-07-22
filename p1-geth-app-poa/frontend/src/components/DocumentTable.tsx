import { Button, Table } from 'react-bootstrap';
import { useState } from 'react';
import { DocumentTableDto } from '../api/document/dto';
import { formatDate } from '../infrastructure/date'; 
import { Signatures } from '../pages/Signatures';
import { deleteDocument, downloadDocument } from '../api/document/api';
import { SubmitSignature } from '../pages/SubmitSignature';

interface Param {
    documents: DocumentTableDto[];
};

export function DocumentTable({ documents }: Param) {
    const [showSignaturesModal, setShowSignaturesModal] = useState(false);
    const [showSubmitSignatureModal, setShowSubmitSignatureModal] = useState(false);
    const [document, setDocument] = useState<DocumentTableDto>();

    const handleSignaturesModalClose = () => {
        setDocument(undefined);
        setShowSignaturesModal(false);
    }

    const handleSignaturesModalOpen = (document: DocumentTableDto) => {
        setDocument(document);
        setShowSignaturesModal(true);
    };

    const handleSubmitSignatureModalClose = () => {
        setDocument(undefined);
        setShowSubmitSignatureModal(false);
    }

    const handleSubmitSignatureModalOpen = (document: DocumentTableDto) => {
        setDocument(document);
        setShowSubmitSignatureModal(true);
    };

    const handleDownload = (document: DocumentTableDto) => {
        downloadDocument(document.id, document.title);
    };

    const handleDelete = (document: DocumentTableDto) => {
        deleteDocument(document.id);
    }

    return (
        <div>
        <table className='table table-bordered mx-auto my-2 w-50'>
            <thead>
                <tr>
                    <th className='bg-light'>Title</th>
                    <th className='bg-light'>Created at</th>
                    <th className='bg-light'>Action</th>
                    <th className='bg-light'></th>
                    <th className='bg-light'></th>
                </tr>
            </thead>
            <tbody>
                {documents.map((document) => (
                    <tr key={document.id}>
                        <td className='bg-light'>{document.title}</td>
                        <td className='bg-light'>{formatDate(document.createdAt)}</td>
                        <td className='bg-light'>
                            {document.contractAddress
                                ? <Button
                                    variant='info'
                                    onClick={() => handleSignaturesModalOpen(document)}
                                    disabled={!document.contractAddress}
                                >
                                    Check decision
                                </Button>
                                : <Button
                                    variant='success'
                                    onClick={() => handleSubmitSignatureModalOpen(document)}
                                >
                                    Submit signature
                                </Button>
                            }
                        </td>
                        <td className='bg-light'>
                            <Button
                                variant='outline-dark'
                                onClick={() => handleDownload(document)}
                            >
                                Download
                            </Button>
                        </td>
                        <td className='bg-light'>
                            <Button
                                variant='outline-dark'
                                onClick={() => handleDelete(document)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {document
            ? <Signatures
                id={document.id}
                showModal={showSignaturesModal}
                handleClose={handleSignaturesModalClose}
            />
            : null
        }
        {document
            ? <SubmitSignature
                document={document}
                showModal={showSubmitSignatureModal}
                handleClose={handleSubmitSignatureModalClose}
            />
            : null
        }
        </div>
    );
}
