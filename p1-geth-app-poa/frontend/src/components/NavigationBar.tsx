import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { SubmitUser } from '../pages/SubmitUser';
import { SubmitDocument } from '../pages/SubmitDocument';

export function NavigationBar() {
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const handleUserModalClose = () => {
        setShowUserModal(false);
    }

    const handleUserModalOpen = () => {
        setShowUserModal(true);
    };

    const handleDocumentModalClose = () => {
        setShowDocumentModal(false);
    }

    const handleDocumentModalOpen = () => {
        setShowDocumentModal(true);
    };

    return (
      <>
        <Navbar bg='light' variant='light'>
          <Container className='me-2'>
            <Navbar.Brand>
              <Link
                to='/'
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >Blockchain app</Link>
            </Navbar.Brand>
            <Navbar.Collapse>
              <ButtonGroup className='me-2'>
                  <Button
                    variant='outline-success'
                    onClick={() => handleUserModalOpen()}
                  >
                    + user
                  </Button>
              </ButtonGroup>
              <ButtonGroup className='me-2'>
                  <Button
                    variant='outline-success'
                    onClick={() => handleDocumentModalOpen()}
                  >
                    + document
                  </Button>
              </ButtonGroup>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <SubmitUser
            showModal={showUserModal}
            handleClose={handleUserModalClose}
        />
        <SubmitDocument
            showModal={showDocumentModal}
            handleClose={handleDocumentModalClose}
        />
      </>
    );
}