import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";
import Loading from "./Loading";

function LoginForm(props) {
  const [username, setUsername] = useState("mario.rossi@polito.it");
  const [password, setPassword] = useState("P123456");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    props.setLoading(true);
    API.logIn(credentials)
      .then((user) => {
        setErrorMessage("");
        props.loginSuccessful(user);
      })
      .catch((err) => {
        setErrorMessage("Wrong username or password");
        props.setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (username === "") {
      setErrorMessage("Please, insert an email.");
    } else if (password === "") {
      setErrorMessage("Please, insert a password.");
    } else {
      doLogIn({ username, password });
    }
  };

  return (
    <>
      <Container>
        {props.loading ? <Loading /> : ""}
        <Row>
          <Col
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              className="mt-3"
              style={{ maxWidth: "500px", margin: "0 auto" }}
            >
              <Card.Header className="fs-4">Login</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {errorMessage ? (
                    <Alert
                      variant="danger"
                      dismissible
                      onClick={() => setErrorMessage("")}
                    >
                      {errorMessage}
                    </Alert>
                  ) : (
                    ""
                  )}
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Text here your email"
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                    />
                  </Form.Group>
                  <Button className="my-2" type="submit">
                    Login
                  </Button>
                  <Button
                    className="my-2 mx-2"
                    variant="secondary"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginForm;
