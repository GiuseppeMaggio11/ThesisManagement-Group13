import { useContext, useEffect, useState } from "react";
import API from "../API";
import Loading from "./Loading";
import {
  Accordion,
  Alert,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Clipboard2Check } from "react-bootstrap-icons";

function ProfessorActiveProposals(props) {
  const [activeProposals, setActiveProposals] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!props.loggedIn || props.user.user_type !== "PROF") {
    return API.redirectToLogin();
  }

  useEffect(() => {
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

    getActiveProposals();
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Copy Thesis
    </Tooltip>
  );

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
          handleToast={handleToast}
          renderTooltip={renderTooltip}
        />
      ) : (
        <ActiveProposalsMobile
          activeProposals={activeProposals}
          handleToast={handleToast}
          renderTooltip={renderTooltip}
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
          <Col md={5} lg={5} xl={5} xxl={5}>
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
          <Col md={1} lg={1} xl={1} xxl={1}></Col>
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
              return (
                <ElementProposalLargeScreen
                  proposal={proposal}
                  key={i}
                  handleToast={props.handleToast}
                  renderTooltip={props.renderTooltip}
                />
              );
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function ElementProposalLargeScreen(props) {
  const navigate = useNavigate();
  return (
    <Row
      className="py-3 active-proposal-row-custom"
      onClick={() => {
        /*REDIRECT TO THESIS' PAGE*/
      }}
    >
      <Col md={5} lg={5} xl={5} xxl={5}>
        <div
          style={{
            color: "#4682B4",
            fontSize: 18,
            textDecoration: "none",
          }}
        >
          <span
            onClick={() => {
              navigate("/viewproposal/" + props.proposal.id);
            }}
            style={{ cursor: "pointer" }}
          >
            {props.proposal.title}
          </span>
        </div>
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {props.proposal.thesis_level}
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {props.proposal.thesis_type}
      </Col>
      <Col md={2} lg={2} xl={2} xxl={2} style={{ fontSize: 18 }}>
        {dayjs(props.proposal.expiration).format("MM/DD/YYYY")}
      </Col>
      <Col md={1} lg={1} xl={1} xxl={1}>
        {/* <Link to={"/copyproposal/" + props.proposal.id}>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={props.renderTooltip}
          >
            <Clipboard2Check
              onClick={() => {
                props.handleToast("Thesis copied successfully", "success");
              }}
            />
          </OverlayTrigger>
        </Link> */}
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
            <ElementProposalMobile
              proposal={proposal}
              key={i}
              index={i}
              handleToast={props.handleToast}
              renderTooltip={props.renderTooltip}
            />
          );
        })}
      </Accordion>
    </Row>
  );
}

function ElementProposalMobile(props) {
  const navigate = useNavigate();
  return (
    <Accordion.Item eventKey={props.index}>
      <Accordion.Header>
        <div
          style={{
            color: "#4682B4",
            fontSize: 18,
            textDecoration: "none",
          }}
        >
          <span
            onClick={() => {
              navigate("/viewproposal/" + props.proposal.id);
            }}
            style={{ cursor: "pointer" }}
          >
            {props.proposal.title}
          </span>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          <Col>
            <p>
              Level: <b>{props.proposal.thesis_level}</b>
            </p>
          </Col>
          <Col className="text-end">
            {/* <Link to={"/copyproposal/" + props.proposal.id}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={props.renderTooltip}
              >
                <Clipboard2Check
                  onClick={() => {
                    props.handleToast("Thesis copied successfully", "success");
                  }}
                />
              </OverlayTrigger>
            </Link> */}
          </Col>
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
              <b>{dayjs(props.proposal.expiration).format("MM/DD/YYYY")}</b>
            </p>
          </Col>
          <Col>{/*ADD BUTTON HERE*/}</Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ProfessorActiveProposals;
