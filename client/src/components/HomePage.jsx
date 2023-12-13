import { useEffect } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage(props) {
  const navigate = useNavigate();

  /*useEffect(() => {
    navigate("/proposals");
  }, []);*/ 
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
