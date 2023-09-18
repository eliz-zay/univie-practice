import { ButtonGroup } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import FillSQLButton from "./FillSQLButton";
import FillNoSQLButton from "./MigrateNoSQLButton";
import UserDropdown from "./UserDropdown";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              COOKBOOK
            </Link>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>
              <Link
                to="/friend"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Friends
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/recipe"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Recipe
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/cuisine"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Cuisine
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/ingredient"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Ingredient
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/report-one"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Report 1
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/report-two"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Report 2
              </Link>
            </Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <ButtonGroup className="me-2">
              <FillSQLButton />
              <FillNoSQLButton />
            </ButtonGroup>
            <UserDropdown />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
