import { Button, Container } from "react-bootstrap";
import Loading from "./Loading";
import { Link } from "react-router-dom";

function HomePage(props) {
  return (
    <>
      {props.loading ? <Loading /> : ""}
      <Container className="margin-custom">
        <h1 className="margin-titles-custom">HomePage</h1>
        <Link to="/proposals" className="m-1">
          <Button className="margin-buttons-custom">Search Thesis Proposal</Button>
        </Link>
      </Container>
    </>
  );
}

export default HomePage;
