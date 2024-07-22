import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export function NavigationBar() {
    const location = useLocation();

    return (
      <>
        <Navbar expand='lg' className='bg-body-tertiary'>
        <Container>
            <Navbar.Brand>Geth Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto' defaultActiveKey='/nodes' as='ul' variant='underline'>
            <Nav.Item as='li'>
              <Link
                to='/nodes'
                className={`nav-link ${location.pathname === '/nodes' ? 'active' : ''}`}>
                Nodes
              </Link>
            </Nav.Item>
            <Nav.Item as='li'>
              <Link
                to='/genesis'
                className={`nav-link ${location.pathname === '/genesis' ? 'active' : ''}`}
              >
                Genesis JSON
              </Link>
            </Nav.Item>
            <Nav.Item as='li'>
              <Link
                to='/accounts'
                className={`nav-link ${location.pathname === '/accounts' ? 'active' : ''}`}
              >
                Accounts
              </Link>
            </Nav.Item>
          </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </>
    );
}