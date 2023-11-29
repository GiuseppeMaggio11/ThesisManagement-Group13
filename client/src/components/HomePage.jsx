import { Button, Container, Image } from "react-bootstrap";
import Loading from "./Loading";
import { Link } from "react-router-dom";

function HomePage(props) {
  return (
    <>
      <Container>
        <Container className="mt-4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/it/archive/4/47/20210407201938%21Logo_PoliTo_dal_2021_blu.png"
            alt="logo polito"
            fluid
          />
        </Container>
      </Container>
    </>
  );
}

export default HomePage;
