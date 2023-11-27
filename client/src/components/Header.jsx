import { useState } from "react";
import {
  Col,
  Container,
  Dropdown,
  Nav,
  NavDropdown,
  Navbar,
  Row,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { NavLink, useNavigate } from "react-router-dom";

function Header(props) {
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const navigate = useNavigate();

  const handleLogout = () => {
    if (isSmallScreen) setExpanded((old) => !old);
    props.logout();
    navigate("/");
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
          Thesis management
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
              to="/"
              onClick={() => {
                if (isSmallScreen) setExpanded((old) => !old);
              }}
              className="fs-5"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={
                props.user && props.user.user_type === "STUD"
                  ? "proposal"
                  : props.user && props.user.user_type === "PROF"
                  ? "teacher"
                  : "/"
              }
              onClick={() => {
                if (isSmallScreen) setExpanded((old) => !old);
              }}
              className="fs-5"
            >
              {props.user && props.user.user_type === "STUD"
                ? "Student Dashboard"
                : props.user && props.user.user_type === "PROF"
                ? "Teacher Dashboard"
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
                  {
                    "Hi, " /*+
                     props.user.username.split(".")[0].charAt(0).toUpperCase() +
                    props.user.username.split(".")[0].slice(1) */
                  }
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
                  <Dropdown.Item
                    className="link-style"
                    onClick={() => {
                      if (isSmallScreen) setExpanded((old) => !old);
                      if (props.user && props.user.user_type === "STUD")
                        navigate("/proposal");
                      else if (props.user && props.user.user_type === "PROF")
                        navigate("/teacher");
                    }}
                  >
                    {props.user && props.user.user_type === "STUD"
                      ? "Student Dashboard"
                      : props.user && props.user.user_type === "PROF"
                      ? "Teacher Dashboard"
                      : ""}
                  </Dropdown.Item>
                  <Dropdown.Item className="link-style" onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link
                as={NavLink}
                to="/login"
                onClick={() => {
                  if (isSmallScreen) setExpanded((old) => !old);
                }}
              >
                <Container>
                  <Row className="align-items-center">
                    <Col>
                      <PersonCircle size={45} />
                    </Col>
                  </Row>
                </Container>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;
