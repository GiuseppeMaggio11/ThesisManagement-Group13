import { Container } from "react-bootstrap";
import Loading from "./Loading";

function HomePage(props) {
  return (
    <>
      {props.loading ? <Loading /> : ""}
      <Container>HomePage</Container>
    </>
  );
}

export default HomePage;
