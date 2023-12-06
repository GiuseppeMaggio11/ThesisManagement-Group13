import { useContext, useEffect, useState } from "react";
import API from "../API";
import Loading from "./Loading";
import { Accordion, Alert, Col, Container, Row, Table } from "react-bootstrap";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
    <Container className="p-4">
      <Row className="mb-3">
        <Col className="fs-2">Active thesis proposals</Col>
      </Row>

      {!activeProposals || activeProposals.length === 0 ? (
        <Alert variant="danger" style={{ maxWidth: "300px" }}>
          No active thesis proposals found
        </Alert>
      ) : !isMobile ? (
        <ActiveProposalsLargeScreen activeProposals={activeProposals} />
      ) : (
        <ActiveProposalsMobile activeProposals={activeProposals} />
      )}
    </Container>
  );
}

function ActiveProposalsLargeScreen(props) {
  return (
    <Row>
      <Col>
        <Row
          style={{
            border: "1px solid rgb(240,240,240)",
            borderRadius: "8px",
            fontWeight: "bold",
            background: "rgb(245, 245, 245)",
            fontSize: "larger",
          }}
          className="py-3"
        >
          <Col md={6} lg={6} xl={6} xxl={6}>
            Title
          </Col>
          <Col md={2} lg={2} xl={2} xxl={2}>
            Level
          </Col>
          <Col md={2} lg={2} xl={2} xxl={2}>
            Type
          </Col>
          <Col md={2} lg={2} xl={2} xxl={2}>
            Expiration Date
          </Col>
          {/*ADD COLUMNS FOR BUTTONS HERE (fix md, lg, xl, xxl)*/}
        </Row>
        <Row
          className="mt-2"
          style={{
            border: "1px solid rgb(240,240,240)",
            borderRadius: "8px",
            boxShadow: "5px 5px rgb(245, 245, 245)",
          }}
        >
          <Col>
            {props.activeProposals.map((proposal, i) => {
              return <ElementProposalLargeScreen proposal={proposal} key={i} />;
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function ElementProposalLargeScreen(props) {
  const navigation = useNavigate();
  return (
    <Row
      className="py-3 active-proposal-row-custom"
      onClick={() => {
        /*REDIRECT TO THESIS' PAGE*/
      }}
    >
      <Col md={6} lg={6} xl={6} xxl={6}>
        <div
          style={{
            color: "#4682B4",
            fontSize: 18,
            textDecoration: "none",
          }}
        >
          <span style={{ cursor: "pointer" }}>{props.proposal.title}</span>
        </div>
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {props.proposal.thesis_level}
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {props.proposal.thesis_type}
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {dayjs(props.proposal.expiration).format("DD/MM/YYYY")}
      </Col>
      {/*ADD COLUMNS FOR BUTTONS HERE (fix md, lg, xl, xxl)*/}
    </Row>
  );
}

function ActiveProposalsMobile(props) {
  return (
    <Row style={{ marginBottom: "5rem" }}>
      <Accordion>
        {props.activeProposals.map((proposal, i) => {
          return (
            <ElementProposalMobile proposal={proposal} key={i} index={i} />
          );
        })}
      </Accordion>
    </Row>
  );
}

function ElementProposalMobile(props) {
  const navigation = useNavigate();
  return (
    <Accordion.Item eventKey={props.index}>
      <Accordion.Header>
        <span
          onClick={() => {
            /*REDIRECT TO THESIS' PAGE*/
          }}
        >
          <div
            style={{ color: "#4682B4", fontSize: 18, textDecoration: "none" }}
          >
            {props.proposal.title}
          </div>
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          <Col>
            <p>
              Level: <b>{props.proposal.thesis_level}</b>
            </p>
          </Col>
          <Col>{/*ADD BUTTON HERE*/}</Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <p>
              Type: <b>{props.proposal.thesis_type}</b>
            </p>
          </Col>
          <Col>{/*ADD BUTTON HERE*/}</Col>
        </Row>
        <Row>
          <Col>
            <p>
              Expiration date:{" "}
              <b>{dayjs(props.proposal.expiration).format("DD/MM/YYYY")}</b>
            </p>
          </Col>
          <Col>{/*ADD BUTTON HERE*/}</Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ProfessorActiveProposals;
