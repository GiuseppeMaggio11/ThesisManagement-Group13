import { useState } from "react";
import {
  Col,
  Container,
  Dropdown,
  Nav,
  Image,
  Navbar,
  Row,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../API";

function Header(props) {
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const navigate = useNavigate();

  const handleLogin = () => {
    API.redirectToLogin();
  };

  const handleLogout = () => {
    if (isSmallScreen) setExpanded((old) => !old);
    props.logout();
    API.redirectToLogin();
  };

  return (
    <Navbar
      expanded={expanded}
      expand="md"
      variant="dark"
      style={{ background: "#215884" }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fs-1">
          <Image
            src="https://upload.wikimedia.org/wikipedia/it/archive/4/47/20210407201938%21Logo_PoliTo_dal_2021_blu.png"
            alt="logo polito"
            width={200} 
            height={200}
            style={{
              filter: 'grayscale(100%) brightness(0) invert(100%)',
            }}
            fluid
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            if (isSmallScreen) setExpanded((old) => !old);
          }}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to={
                props.user && (props.user.user_type === "STUD")
                  ? "studproposals"
                  : props.user && props.user.user_type === "PROF" ?
                  "/profproposals" : 
                  ""
              }
              onClick={() => {
                if (isSmallScreen) setExpanded((old) => !old);
              }}
              className="fs-5"
            >
              {props.user && (props.user.user_type === 'STUD' || props.user.user_type === 'PROF') ? (
                "Thesis proposals"
              ) : ""}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={
                props.user && props.user.user_type === "STUD"
                  ? "studentapplications"
                  : props.user && props.user.user_type === "PROF"
                  ? "applications"
                  : ""
              }
              onClick={() => {
                if (isSmallScreen) setExpanded((old) => !old);
              }}
              className="fs-5"
            >
              {props.user && props.user.user_type === "STUD"
                ? "My applications"
                : props.user && props.user.user_type === "PROF"
                ? "Applications"
                : ""}
            </Nav.Link>
          </Nav>
          <Nav className="me-0">
            {props.user ? (
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  style={{
                    background: "white",
                    borderColor: "white",
                    color: "black",
                  }}
                >
                  {"Hi, " + props.user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-navdropdown">
                  <Dropdown.Item
                    className="link-style"
                    onClick={() => {
                      if (isSmallScreen) setExpanded((old) => !old);
                      navigate("/virtualclock");
                    }}
                  >
                    Virtual Clock
                  </Dropdown.Item>
                  <Dropdown.Item className="link-style" onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Container>
                <Row className="align-items-center">
                  <Col>
                    <PersonCircle
                      size={45}
                      color="white"
                      onClick={handleLogin}
                      style={{ cursor: "pointer" }}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;
