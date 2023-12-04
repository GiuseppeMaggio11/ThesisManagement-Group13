import { useContext, useEffect, useState } from "react";
import API from "../API";
import Loading from "./Loading";
import { Alert, Col, Container, Row } from "react-bootstrap";
import MessageContext from "../messageCtx";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const { handleToast } = useContext(MessageContext);

  if (!props.loggedIn || !props.user.user_type === "PROF") {
    return API.redirectToLogin();
  }

  useEffect(() => {
    const getActiveProposals = async () => {
      try {
        props.setLoading(true);
        const response = await API.getProposalsProfessor();
        console.log(response);
        setActiveProposals(response);
        props.setLoading(false);
      } catch (err) {
        handleToast("Error while fetching active proposals", "error");
      }
    };

    getActiveProposals();
  }, []);

  return props.loading ? (
    <Loading />
  ) : (
    <Container>
      <Row className="mb-3">
        <Col className="fs-2">Active thesis proposals</Col>
      </Row>

      {!activeProposals || activeProposals.length === 0 ? (
        <Alert variant="danger" style={{ maxWidth: "300px" }}>
          No active thesis proposals found
        </Alert>
      ) : (
        "ok"
      )}
    </Container>
  );
}

export default ProfessorActiveProposals;
