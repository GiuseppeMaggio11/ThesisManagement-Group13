import { useContext, useEffect, useState } from "react";
import API from "../API";
import Loading from "./Loading";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Calendar, PencilFill } from "react-bootstrap-icons";
import randomcolor from "randomcolor";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!props.loggedIn || props.user.user_type !== "PROF") {
    return API.redirectToLogin();
  }

  const getActiveProposals = async () => {
    try {
      props.setLoading(true);
      const response = await API.getProposalsProfessor();
      setActiveProposals(response);
      props.setLoading(false);
    } catch (err) {
      handleToast("Error while fetching active proposals", "error");
    }
  };

  useEffect(() => {
    getActiveProposals();
  }, []);

  return props.loading ? (
    <Loading />
  ) : (
    <Container className="p-4">
      <Row>
        <Col className="fs-2">Active thesis proposals</Col>
      </Row>

      {!activeProposals || activeProposals.length === 0 ? (
        <Alert variant="danger" style={{ maxWidth: "300px" }}>
          No active thesis proposals found
        </Alert>
      ) : (
        <ActiveProposalsLargeScreen
          activeProposals={activeProposals}
          handleToast={handleToast}
          isMobile={isMobile}
          getActiveProposals={getActiveProposals}
        />
      )}
    </Container>
  );
}

function ActiveProposalsLargeScreen(props) {
  return (
    <Row>
      <Col>
        <Row>
          {props.activeProposals.map((proposal, i) => {
            return (
              <ElementProposalLargeScreen
                proposal={proposal}
                key={i}
                handleToast={props.handleToast}
                isMobile={props.isMobile}
                getActiveProposals={props.getActiveProposals}
              />
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}

function ElementProposalLargeScreen(props) {
  const archiveProposal = async (thesis_id) => {
    try {
      await API.updateThesisArchivation(thesis_id);
      props.handleToast("Proposal archived correctly", "success");
      props.getActiveProposals();
    } catch (err) {
      props.handleToast("Error while archiving a proposal", "error");
    }
  };

  const deleteProposal = async (thesis_id) => {
    try {
      API.deleteProposal(thesis_id).then((result) => {
        //result or deletion is not always positive. we receive a JSON object either in form {result : ... [success case]} or {error: ... [error message]}
        //so we have to check the content of packet we received from back-end and if it's really removed from database, we can update the page
        if (
          result[Object.keys(result)[0]] ===
          "The proposal has been deleted successfully"
        ) {
          props.handleToast("Proposal deleted correctly", "success");
          props.getActiveProposals();
        } else {
          props.handleToast(result[Object.keys(result)[0]], "error");
        }
      });
    } catch (err) {
      handleToast("Error while deleting a proposal", "error");
    }
  };

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit Thesis
    </Tooltip>
  );

  const renderTooltipCopy = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Copy Thesis
    </Tooltip>
  );

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Thesis
    </Tooltip>
  );

  const renderTooltipArchive = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Archive Thesis
    </Tooltip>
  );

  const navigate = useNavigate();
  return (
    <Col xs={12} md={12} lg={12} xl={12} xxl={12} className="mt-4">
      <Card style={{ padding: 20 }} className="custom-card-proposals">
        <Row>
          <Col style={{ minWidth: "300px" }}>
            <div
              className="title-custom-proposals"
              onClick={() => navigate("/viewproposal/" + props.proposal.id)}
              style={{
                fontWeight: "medium",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {props.proposal.title}
            </div>
          </Col>
          <Col className="text-end mx-2">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipEdit}
            >
              <Button
                variant="light"
                className="mx-2"
                onClick={() => {
                  navigate("/updateproposal/" + props.proposal.id);
                }}
              >
                {!props.isMobile && <span className="mx-2">Edit</span>}
                <PencilFill />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipCopy}
            >
              <Button
                variant="light"
                onClick={() => {
                  props.handleToast("Thesis copied", "success");
                  navigate("/copyproposal/" + props.proposal.id);
                }}
              >
                {!props.isMobile && <span className="mx-2">Copy</span>}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipDelete}
            >
              <Button variant="light" className="mx-2" onClick={deleteProposal}>
                {!props.isMobile && <span className="mx-2">Delete</span>}
                <PencilFill />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipArchive}
            >
              <Button
                variant="light"
                className="mx-2"
                onClick={archiveProposal}
              >
                {!props.isMobile && <span className="mx-2">Archive</span>}
                <PencilFill />
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
        <div
          className="hide-scrollbar"
          style={{
            fontWeight: "semi-bold",
            fontSize: 14,
            height: !props.isMobile ? 25 : 40,
            marginTop: 5,
          }}
        >
          {props.proposal.keywords &&
            props.proposal.keywords.split(", ").map((key, index) => (
              <span
                key={index}
                className="badge"
                style={{
                  backgroundColor: randomcolor({
                    seed: key,
                    luminosity: "bright",
                    format: "rgba",
                    alpha: 1,
                  }).replace(/1(?=\))/, "0.1"),
                  color: randomcolor({
                    seed: key,
                    luminosity: "bright",
                    format: "rgba",
                    alpha: 1,
                  }),
                  padding: "0.5em 1.2em",
                  borderRadius: "0.25rem",
                  marginRight: 10,
                }}
              >
                {key}
              </span>
            ))}
        </div>
        <div
          style={{
            fontSize: 16,
            marginTop: 16,
            minHeight: 50,
          }}
        >
          {props.proposal.description}
        </div>
        <Row
          style={{
            fontSize: 16,
            marginTop: 16,
          }}
        >
          <Col style={{ maxWidth: "110px" }}>
            <span>Thesis Level</span>
          </Col>
          <Col>
            <span
              style={{
                color: "black",
              }}
              className="badge"
            >
              {props.proposal.thesis_level.toUpperCase()}
            </span>
          </Col>
        </Row>
        <Row
          style={{
            fontSize: 16,
            marginTop: 16,
          }}
        >
          <Col style={{ maxWidth: "110px" }}>
            <span>Thesis Type</span>
          </Col>
          <Col>
            <span
              style={{
                color: "black",
              }}
              className="badge"
            >
              {props.proposal.thesis_type.toUpperCase()}
            </span>
          </Col>
        </Row>
        <Row
          style={{
            fontSize: 16,
            marginTop: 16,
          }}
        >
          <Col style={{ maxWidth: "110px" }}>
            <span>Expire at</span>
          </Col>
          <Col>
            <span className="badge" style={{ color: "black" }}>
              {dayjs(props.proposal.expiration).format("MM/DD/YYYY")}
            </span>
            <Calendar />
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default ProfessorActiveProposals;
