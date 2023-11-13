import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function TeacherPage(props) {

  const navigate = useNavigate();

  return (
    <>
      {props.loading ? <Loading /> : ""}
      <Container>
        <Row>
            <Col
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            <Button
              onClick={() => navigate("/newproposal")}
            >
                New proposal
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TeacherPage;