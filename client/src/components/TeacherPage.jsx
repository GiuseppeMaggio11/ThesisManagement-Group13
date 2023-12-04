import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function TeacherPage(props) {
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
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default TeacherPage;
