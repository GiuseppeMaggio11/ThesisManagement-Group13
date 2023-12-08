import { useContext, useEffect, useState } from "react";
import API from "../API";
import Loading from "./Loading";
import { Accordion, Alert, Col, Container, Row, Button } from "react-bootstrap";
import { Trash3, Archive } from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!props.loggedIn || !props.user.user_type === "PROF") {
    return API.redirectToLogin();
  }

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

  useEffect(() => {
    getActiveProposals();
  }, []);

  const archiveProposal = async (thesis_id) => {
    try {
      await API.updateThesisArchivation(thesis_id);
      getActiveProposals();
    } catch (err) {
      handleToast("Error while archiving a proposal", "error");
    }
  }

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
        <ActiveProposalsLargeScreen 
          activeProposals={activeProposals} 
          archiveProposal={archiveProposal}
        />
      ) : (
        <ActiveProposalsMobile 
          activeProposals={activeProposals}
          archiveProposal={archiveProposal}
        />
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
          <Col md={4} lg={4} xl={4} xxl={4}>
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
          <Col md={2} lg={2} xl={2} xxl={2}>
            Actions
          </Col>
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
              return <ElementProposalLargeScreen proposal={proposal} key={i} archiveProposal={props.archiveProposal}/>;
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function ElementProposalLargeScreen(props) {
  const [showArchive, setShowArchive] = useState(false);

  const handleCloseArchive = () => setShowArchive(false);
  const handleShowArchive = () => setShowArchive(true);

  return (
    <>
    <Row
      className="py-3 active-proposal-row-custom"
      onClick={() => {
        /*REDIRECT TO THESIS' PAGE*/
      }}
    >
      <Col md={4} lg={4} xl={4} xxl={4}>
        <Link
          style={{
            color: "#4682B4",
            fontSize: 18,
            textDecoration: "none",
          }}
          to={`/proposals/${props.proposal.id}`}
          state={{ from: "applications" }}
        >
          {props.proposal.title}
        </Link>
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
      <Col md={2} lg={2} xl={2} xxl={2} style={{ display:"flex", flexWrap: "wrap", padding:"1px"}}>
        <Button 
          className="button-delete" 
          onClick={() => {
            /*DELETE PROPOSAL API*/
          }}>
          <span style={{ marginRight: '5px' }}>Delete</span>
          <Trash3 cursor="pointer"></Trash3>
        </Button>
        <Button 
          className="button-archive"
          onClick={handleShowArchive}
        >
          <span style={{ marginRight: '5px' }}>Archive</span>
          <Archive cursor="pointer"></Archive>
        </Button>   
      </Col>
    </Row>
    <ConfirmationModal
      show={showArchive} 
      handleClose={handleCloseArchive} 
      body={"Are you sure you want to archive this proposal ?"}
      action={"Archive"}
      handleAction={props.archiveProposal}
      thesis_id={props.proposal.id}
    />
    </>
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
  const [showArchive, setShowArchive] = useState(false);

  const handleCloseArchive = () => setShowArchive(false);
  const handleShowArchive = () => setShowArchive(true);

  return (
    <>
    <Accordion.Item eventKey={props.index}>
      <Accordion.Header>
        <Link
              style={{ color: "#4682B4", fontSize: 18, textDecoration: "none" }}
              to={`/proposals/${props.proposal.id}`}
              state={{ from: "applications" }}
            >
              {props.proposal.title}
          </Link>
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
        <Row>
          <Col style={{display:"flex"}}>
            <Button 
              className="button-delete" 
              onClick={() => {
                /*DELETE PROPOSAL API*/
              }}>
              <span style={{ marginRight: '5px' }}>Delete</span>
              <Trash3 cursor="pointer"></Trash3>
            </Button>
            <Button 
              className="button-archive"
              onClick={handleShowArchive}
            >
              <span style={{ marginRight: '5px' }}>Archive</span>
              <Archive cursor="pointer"></Archive>
            </Button>  
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
    <ConfirmationModal
      show={showArchive} 
      handleClose={handleCloseArchive} 
      body={"Are you sure you want to archive this proposal ?"}
      action={"Archive"}
      handleAction={props.archiveProposal}
      thesis_id={props.proposal.id}
    />
    </>
  );
}

export default ProfessorActiveProposals;
