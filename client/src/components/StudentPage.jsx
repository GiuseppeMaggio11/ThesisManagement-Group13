import { Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function StudentPage(props) {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col className="fs-1">Student Dashboard</Col>
      </Row>
      <Row>
        <Col>
          <Link to="/proposals">
            <Button className="button-style">Search Thesis Proposal</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentPage;
