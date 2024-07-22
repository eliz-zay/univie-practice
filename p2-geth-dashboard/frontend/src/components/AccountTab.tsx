import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Accounts } from '../pages/Accounts';
import { CreateAccount } from '../pages/CreateAccount';

export function AccountTab() {
    const [showAccountModal, setShowAccountModal] = useState(false);

    const handleAccountModalClose = () => {
        setShowAccountModal(false);
    };
    const handleAccountModalOpen = () => {
        setShowAccountModal(true);
    };

    return (
        <>
        <div className='mx-2 my-2'>
            <ButtonGroup className='mx-2'>
                <Button
                    variant='success'
                    onClick={handleAccountModalOpen}
                >
                    + Create account
                </Button>
            </ButtonGroup>
            <Accounts />
        </div>
        <CreateAccount
            showModal={showAccountModal}
            handleClose={handleAccountModalClose}
        />
        </>
    );
}