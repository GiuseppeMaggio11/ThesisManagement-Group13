import { Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function TeacherPage(props) {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col className="fs-1">Teacher Dashboard</Col>
      </Row>
      <Row>
        <Col>
          <Link to="/newproposal">
            <Button className="button-style">New proposal</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherPage;
