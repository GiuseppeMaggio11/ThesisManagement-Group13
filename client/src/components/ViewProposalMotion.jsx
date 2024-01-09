import { Button, Card, Col, OverlayTrigger, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { Calendar, Pencil, Trash3, Archive } from "react-bootstrap-icons";
import randomcolor from "randomcolor";
import { motion } from "framer-motion";

function ViewProposalMotion(props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: props.cardPosition.x - 100,
        y: props.cardPosition.y,
        width: "120%",
        height: "30%",
      }}
      animate={{ opacity: 1, x: 0, y: 0, width: "100%", height: "100%" }}
      exit={{
        opacity: 0,
        x: props.cardPosition.x,
        y: props.cardPosition.y,
        width: "100%",
        height: "100%",
      }}
      transition={{ opacity: { duration: 0 }, default: { duration: 0 } }}
      onClick={() => props.setIsClicked(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={props.handleModalClick}
        style={{
          width: "90%", // Adjust the width as per your requirement
          height: "90%", // Adjust the height as per your requirement
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{ padding: 20, height: "fit-content" }}
          className="custom-card-proposals-big"
        >
          <Row>
            <Col xs={6}>
              <div
                style={{
                  fontWeight: "medium",
                  fontSize: 20,
                }}
              >
                {props.proposal.title}
              </div>
            </Col>
            <Col className="text-end mx-2">
              <Row>
                <Col xs={6} md={6} lg={3}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={props.renderTooltipEdit}
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
                    overlay={props.renderTooltipCopy}
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
                    overlay={props.renderTooltipDelete}
                  >
                    <Button
                      variant="light"
                      onClick={() => props.setShowDelete(true)}
                    >
                      {!props.isMobile && <span className="mx-2">Delete</span>}
                      <Trash3 />
                    </Button>
                  </OverlayTrigger>
                </Col>
                <Col xs={6} md={6} lg={3}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={props.renderTooltipArchive}
                  >
                    <Button
                      variant="light"
                      onClick={() => setShowArchive(true)}
                    >
                      {!props.isMobile && <span className="mx-2">Archive</span>}
                      <Archive />
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Col>
          </Row>
          {props.proposal.keywords && (
            <div
              className="hide-scrollbar"
              style={{
                fontWeight: "semi-bold",
                fontSize: 14,
                height: !props.isMobile ? 25 : 40,
                marginTop: 5,
              }}
            >
              {props.proposal.keywords.split(", ").map((key, index) => (
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
          )}
          <div
            style={{
              fontSize: 16,
              marginTop: 16,
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <span>{props.proposal.description}</span>
          </div>
          <Row
            style={{
              fontSize: 16,
              marginTop: "2em",
            }}
          >
            <Col
              className={
                props.isMobile ? "col-5" : props.isTablet ? "col-3" : "col-2"
              }
            >
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
            <Col
              className={
                props.isMobile ? "col-5" : props.isTablet ? "col-3" : "col-2"
              }
            >
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
            <Col
              className={
                props.isMobile ? "col-5" : props.isTablet ? "col-3" : "col-2"
              }
            >
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
      </motion.div>
    </motion.div>
  );
}

export default ViewProposalMotion;
