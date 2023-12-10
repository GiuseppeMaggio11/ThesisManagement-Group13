import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../API";

function TeacherPage(props) {
  if (!props.loggedIn || props.user.user_type !== "PROF")
    return API.redirectToLogin();

  return (
    <div className="d-flex justify-content-center">
        <Container className="width-80 margin-custom">
          <Row className="d-flex align-items-center">
            <Col
              xs={4}
              className="d-flex justify-content-between align-items-center"
            >
          <h1
            className={`margin-titles-custom ${
              props.isMobile ? "smaller-heading" : ""
            }`}
          >
            Thesis Proposals
          </h1>
        </Col>
      </Row>
      <Row style={{disply:'flex', justifyContent:'right'}}>
        <Col  className="fs-1">
          <Link to="/newproposal">
            <Button className="button-style">
              <i className="bi bi-plus-square" style={{marginRight: "10px"}}></i>
              New proposal
            </Button>
          </Link>
          <Link to="/activeproposals">
            <Button className="button-style">My active proposals</Button>
          </Link>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default TeacherPage;
