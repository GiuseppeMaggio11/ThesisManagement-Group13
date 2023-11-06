import { Button, Container } from "react-bootstrap";
import Loading from "./Loading";

function TeacherPage(props) {
  return (
    <>
      {props.loading ? <Loading /> : ""}
      <Container>
        <Button href="/newproposal">
            New proposal
        </Button>
      </Container>
    </>
  );
}

export default TeacherPage;