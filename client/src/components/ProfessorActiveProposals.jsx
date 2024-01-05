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
  Tooltip,
} from "react-bootstrap";
import MessageContext from "../messageCtx";
import ConfirmationModal from "./ConfirmationModal";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Calendar,
  Pencil,
  Trash3,
  Archive,
  Trash,
  PlusLg,
} from "react-bootstrap-icons";
import Toggle from "react-toggle";
import "react-toggle/style.css"; 
import randomcolor from "randomcolor";
import NoFileFound from "./NoFileFound";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const [isArchived, setIsArchived] = useState(false);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  //if (!props.loggedIn || props.user.user_type !== "PROF") {
  //  return API.redirectToLogin();
  //}

  useEffect(() => {
    if (props.user && props.user.user_type !== "PROF") {
      return API.redirectToLogin();
    }
  }, [props.user]);

  const getActiveProposals = async () => {
    try {
      props.setLoading(true);
      const response = await API.getProposalsProfessor();
      const active_proposals = response.filter(proposal => proposal.is_archived === 0)
      setActiveProposals(active_proposals);
      props.setLoading(false);
    } catch (err) {
      handleToast("Error while fetching active proposals", "error");
    }
  };

  const getArchiveProposals = async () => {
    try {
      props.setLoading(true);
      const response = await API.getProposalsProfessor();
      const archive_proposals = response.filter(proposal => proposal.is_archived === 1)
      setActiveProposals(archive_proposals);
      props.setLoading(false);
    } catch (err) {
      handleToast("Error while fetching archive proposals", "error");
    }
  };

  const handleChange = (e) => {
    setIsArchived(e.target.checked);
    e.target.checked ? 
      getArchiveProposals() : getActiveProposals();
  }

  const renderTooltipNew = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      New proposal
    </Tooltip>
  );

  useEffect(() => {
    getActiveProposals();
  }, []);

  return props.loading ? (
    <Loading />
  ) : (
    <Container className="p-4">
      <Row className="justify-content-between">
        <Col xs={8} className="fs-2">
          Active thesis proposals
        </Col>
        <Col xs={4} className="d-flex justify-content-between align-items-center">
          <Col className="d-flex align-items-start">
            <span style={{marginRight:"8px"}}> See archived proposals</span>
            <Toggle
              id="archived"
              name="archived"
              checked={isArchived}
              onChange={handleChange}
            />
          </Col>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipNew}
          >
            <Button variant="light" onClick={() => navigate("/newproposal/")}>
              <PlusLg style={{ fontSize: "xx-large" }} />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>

      {!activeProposals || activeProposals.length === 0 ? (
        <NoFileFound message={"No proposals found"} />
      ) : (
        <ActiveProposalsLargeScreen
          activeProposals={activeProposals}
          handleToast={handleToast}
          isMobile={isMobile}
          getActiveProposals={getActiveProposals}
          isArchived={isArchived}
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
                isArchived={props.isArchived}
              />
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}

function ElementProposalLargeScreen(props) {
  const [showArchive, setShowArchive] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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
      const result = await API.deleteProposal(thesis_id);
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
              onClick={() => props.isArchived ? 
                navigate("/proposals/" + props.proposal.id) : 
                navigate("/viewproposal/" + props.proposal.id)}
              style={{
                fontWeight: "medium",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {props.proposal.title}
            </div>
          </Col>
          {!props.isArchived && (
          <Col className="text-end mx-2">
            <Row>
              <Col xs={6} md={6} lg={3}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltipEdit}
                >
                  <Button
                    variant="light"
                    onClick={() => {
                      navigate("/updateproposal/" + props.proposal.id);
                    }}
                  >
                    {!props.isMobile && <span className="mx-2">Edit</span>}
                    <Pencil />
                  </Button>
                </OverlayTrigger>
              </Col>
              <Col xs={6} md={6} lg={3}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltipCopy}
                >
                  <Button
                    variant="light"
                    onClick={() => {
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
              </Col>
              <Col xs={6} md={6} lg={3}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltipDelete}
                >
                  <Button variant="light" onClick={() => setShowDelete(true)}>
                    {!props.isMobile && <span className="mx-2">Delete</span>}
                    <Trash3 />
                  </Button>
                </OverlayTrigger>
              </Col>
              <Col xs={6} md={6} lg={3}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltipArchive}
                >
                  <Button variant="light" onClick={() => setShowArchive(true)}>
                    {!props.isMobile && <span className="mx-2">Archive</span>}
                    <Archive />
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
          </Col> )}
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
          {props.proposal.description.length > (props.isMobile ? 100 : 600) ? (
            <>
              <span>
                {props.proposal.description.substring(
                  0,
                  props.isMobile ? 100 : 600
                ) + "..... "}
              </span>
              <span
                className="description-read-more"
                onClick={() => navigate("/viewproposal/" + props.proposal.id)}
              >
                Read more
              </span>
            </>
          ) : (
            props.proposal.description
          )}
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
      <ConfirmationModal
        show={showArchive}
        handleClose={() => setShowArchive(false)}
        body={"Are you sure you want to archive this proposal ?"}
        action={"Archive"}
        handleAction={() => archiveProposal(props.proposal.id)}
      />
      <ConfirmationModal
        show={showDelete}
        handleClose={() => setShowDelete(false)}
        body={"Are you sure you want to delete this proposal ?"}
        action={"Delete"}
        handleAction={() => deleteProposal(props.proposal.id)}
      />
    </Col>
  );
}

export default ProfessorActiveProposals;
