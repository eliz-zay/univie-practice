pragma solidity ^0.8.0;

contract DecisionContract {
    struct Signature {
        string signerId;
        bool vote;
    }

    string private documentId;
    string private documentHash;
    Signature[] signatures;

    constructor(string memory aDocumentId, string memory aDocumentHash, string[] memory aSignerIds, bool[] memory aVotes) {
        documentId = aDocumentId;
        documentHash = aDocumentHash;

        for (uint i = 0; i < aSignerIds.length; i++) {
            signatures.push(Signature(aSignerIds[i], aVotes[i]));
        }
    }

    function getId() public view returns (string memory) {
        return documentId;
    }

    function getHash() public view returns (string memory) {
        return documentHash;
    }

    function getSignatures() public view returns (Signature[] memory) {
        return signatures;
    }
}

contract MonitoringContract {
    struct Signature {
        string signerId;
        bool vote;
    }

    struct Document {
        string documentHash;
        Signature[] signatures;
        bool exists; // internal use
    }

    uint signerNumber;
    mapping(string => Document) documents; // document => { documentHash, signatures }

    event DecisionCreated(address decisionAddress, string id);

    constructor(uint aSignerNumber) {
        signerNumber = aSignerNumber;
    }

    function addSignature(string memory id, string memory signerId, bool vote) public {
        require(documents[id].exists, 'Document not found');
        checkIfSignatureExists(id, signerId);

        documents[id].signatures.push(Signature(signerId, vote));

        if (documents[id].signatures.length == signerNumber) {
            deployDecision(id);
            delete documents[id];
        }
    }

    function addDocument(string memory id, string memory documentHash) public {
        require(!documents[id].exists, 'Document already exists');

        Document storage document = documents[id];

        document.documentHash = documentHash;
        document.exists = true;
    }

    function deployDecision(string memory id) private {
        uint length = documents[id].signatures.length;

        string[] memory signerIds = new string[](length);
        bool[] memory votes = new bool[](length);

        for (uint i = 0; i < length; i++) {
            signerIds[i] = documents[id].signatures[i].signerId;
            votes[i] = documents[id].signatures[i].vote;
        }

        DecisionContract decisionContract = new DecisionContract(
            id, documents[id].documentHash, signerIds, votes
        );

        emit DecisionCreated(address(decisionContract), id);
    }

    function checkIfSignatureExists(string memory id, string memory signerId) private view {
        uint length = documents[id].signatures.length;

        for (uint i = 0; i < length; i++) {
            bool found = keccak256(abi.encodePacked(documents[id].signatures[i].signerId)) == keccak256(abi.encodePacked(signerId));
            require(!found, 'Signer already signed the document');
        }
    }
}
