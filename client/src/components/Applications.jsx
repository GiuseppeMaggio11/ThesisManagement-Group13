import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  ModalBody,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import Loading from "./Loading";
import { useMediaQuery } from "react-responsive";
import API from "../API";
import MessageContext from "../messageCtx";
import {
  CheckLg,
  XLg,
  Download,
  Folder,
  FileEarmarkPdf,
  FileEarmarkPdfFill,
} from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";
import NoFileFound from "./NoFileFound";
import { motion } from "framer-motion";
import randomColor from "randomcolor";

function Applications(props) {
  const [applications, setApplications] = useState([]);
  const [thesisTitles, setThesisTitles] = useState([]);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (!props.loggedIn || props.user.user_type !== "PROF") {
      return API.redirectToLogin();
    }
    props.setLoading(true);
    //API CALL
    const getApplication = async () => {
      const result = await API.getPendingApplications();
      const promises = result.map(async (element) => {
        const files = await API.listApplicationFiles(
          element.student_id,
          element.thesis_id
        );
        return Object.assign({}, element, { files: files });
      });
      const updatedResult = await Promise.all(promises);
      const uniqueThesisTitles = [
        ...new Set(updatedResult.map((entry) => entry.thesis_title)),
      ];
      setApplications(updatedResult);
      setThesisTitles(uniqueThesisTitles);
      /* setApplications((old) => old.concat(updatedResult));
      setApplications((old) => old.concat(updatedResult));
      setApplications((old) => old.concat(updatedResult));
      setApplications((old) => old.concat(updatedResult));
      setThesisTitles((old) => old.concat(uniqueThesisTitles));
      setThesisTitles((old) => old.concat(uniqueThesisTitles));
      setThesisTitles((old) => old.concat(uniqueThesisTitles));
      setThesisTitles((old) => old.concat(uniqueThesisTitles)); */
      props.setLoading(false);
    };
    getApplication();
  }, []);

  const handleApplication = async (student_id, thesis_id, status) => {
    props.setLoading(true);
    try {
      const response = await API.updateApplictionStatus(
        thesis_id,
        student_id,
        status
      );
      handleToast(
        "Student application " +
          (status === "Accepted" ? " accepted " : " rejected ") +
          "correctly",
        "success"
      );
      const result = await API.getPendingApplications();
      const promises = result.map(async (element) => {
        const files = await API.listApplicationFiles(
          element.student_id,
          element.thesis_id
        );
        return Object.assign({}, element, { files: files });
      });
      const updatedResult = await Promise.all(promises);
      const uniqueThesisTitles = [
        ...new Set(updatedResult.map((entry) => entry.thesis_title)),
      ];
      setApplications(updatedResult);
      setThesisTitles(uniqueThesisTitles);
      props.setLoading(false);
    } catch (err) {
      handleToast(err, "error");
    }
  };

  const handleDownloadZip = async (student_id, thesis_id) => {
    try {
      await API.downloadStudentApplicationAllFiles(student_id, thesis_id);
    } catch (err) {
      handleToast(err, "error");
    }
  };

  const handleDownloadPDF = async (student_id, thesis_id, file_name) => {
    try {
      await API.downloadStudentApplicationFile(
        student_id,
        thesis_id,
        file_name
      );
    } catch (err) {
      handleToast(err, "error");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      {props.loading && <Loading />}
      <Container className="width-80 margin-custom">
        <Row className="d-flex align-items-center">
          <Col
            xs={4}
            className="d-flex justify-content-between align-items-center"
          >
            <h1
              className={`margin-titles-custom ${
                props.isMobile ? "smaller-heading" : ""
              }`}
            >
              Applications
            </h1>
          </Col>
        </Row>

        {!applications || applications.length === 0 ? (
          <>
            <NoFileFound message={"No Applications found"} />
          </>
        ) : (
          <Row>
            {thesisTitles.map((title, i) => {
              return (
                <ApplicationCard
                  key={i}
                  title={title}
                  isMobile={isMobile}
                  applications={applications}
                  handleApplication={handleApplication}
                  handleDownloadZip={handleDownloadZip}
                  handleDownloadPDF={handleDownloadPDF}
                />
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
}

function ApplicationCard(props) {
  const [isClicked, setIsClicked] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setIsClicked(true);
    setCardPosition({ x: rect.left, y: rect.top });
  };

  const handleModalClick = (e) => {
    // If the click occurs outside the expanded card, close it
    if (e.target === e.currentTarget) {
      setIsClicked(false);
    }
  };

  const studentApplyed = props.applications.filter(
    (appl) => props.title === appl.thesis_title
  ).length;

  const redPalette = ["#FF0000", "#CC0000", "#990000", "#660000", "#330000"];

  return (
    <Col xs={12} md={6} lg={4} className="mt-4 h-100">
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Card style={{ padding: 20 }} className="custom-card-applications">
          <Row>
            <Col
              className="col-8"
              style={{
                fontWeight: "400",
                fontSize: 20,
              }}
            >
              {props.title}
            </Col>
            <Col className="text-end">
              <div
                className="student-number-applyed"
                style={{
                  backgroundColor: randomColor({
                    seed: studentApplyed,
                    luminosity: "bright",
                    format: "rgba",
                    alpha: 1,
                    hue: "red",
                    palette: redPalette,
                  }).replace(/1(?=\))/, "0.1"),
                  color: randomColor({
                    seed: studentApplyed,
                    luminosity: "bright",
                    format: "rgba",
                    alpha: 1,
                    hue: "red",
                    palette: redPalette,
                  }),
                }}
              >
                {studentApplyed}
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>
      {isClicked && (
        <motion.div
          initial={{
            opacity: 0,
            x: cardPosition.x - 100,
            y: cardPosition.y,
            width: "120%",
            height: "30%",
          }}
          animate={{ opacity: 1, x: 0, y: 0, width: "100%", height: "100%" }}
          exit={{
            opacity: 0,
            x: cardPosition.x,
            y: cardPosition.y,
            width: "100%",
            height: "100%",
          }}
          transition={{ opacity: { duration: 0 }, default: { duration: 0 } }}
          /* onClick={() => setIsClicked(false)} */
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
            /* onClick={handleModalClick} */
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
              style={{ padding: 20, width: "70%" }}
              className="custom-card-proposals"
            >
              <Row>
                <Col
                  style={{
                    fontWeight: "400",
                    fontSize: 25,
                  }}
                >
                  {props.title}
                </Col>
              </Row>
              <Row style={{ overflowY: "auto" }} className="mt-4">
                <Col xs={12} md={12} lg={12} xl={12}>
                  {props.applications
                    .filter((appl) => props.title === appl.thesis_title)
                    .map((application, i) => {
                      return (
                        <StudentApplicationThesis
                          key={i}
                          application={application}
                          isMobile={props.isMobile}
                          handleApplication={props.handleApplication}
                          handleDownloadZip={props.handleDownloadZip}
                          handleDownloadPDF={props.handleDownloadPDF}
                        />
                      );
                    })}
                </Col>
              </Row>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </Col>
  );
}

function StudentApplicationThesis(props) {
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState("");
  const [studentId, setStudentId] = useState("");
  const [thesisId, setThesisId] = useState("");
  const [hoveredRow, setHoveredRow] = useState(undefined);
  function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${month}/${day}/${year} ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  function handleConfirmation(studentId, thesisId, action) {
    setStudentId(studentId);
    setThesisId(thesisId);
    setAction(action);
    setShowConfirmation(true);
  }

  function confirmAction() {
    props.handleApplication(studentId, thesisId, action);
    setShowConfirmation(false);
  }

  return (
    <>
      <Row
        className="m-2 p-2"
        style={{ borderRadius: "20px", background: "#f3f3f3" }}
      >
        <Col>{props.application.student_id}</Col>
        <Col>{props.application.student_name}</Col>
        <Col>{formatDate(props.application.application_date)}</Col>
        <Col>
          {props.application.files && props.application.files.length > 0 ? (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-top">See application files</Tooltip>
              }
            >
              <Button variant="secondary" onClick={handleShow}>
                <Folder size={20} />
              </Button>
            </OverlayTrigger>
          ) : (
            ""
          )}
        </Col>
        <Col>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Accept application</Tooltip>}
          >
            <Button
              variant="success"
              onClick={() =>
                handleConfirmation(
                  props.application.student_id,
                  props.application.thesis_id,
                  "Accepted"
                )
              }
            >
              <CheckLg size={20} />
            </Button>
          </OverlayTrigger>
        </Col>
        <Col>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Reject application</Tooltip>}
          >
            <Button
              variant="danger"
              onClick={() =>
                handleConfirmation(
                  props.application.student_id,
                  props.application.thesis_id,
                  "Rejected"
                )
              }
            >
              <XLg size={20} />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Application files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <div style={{ marginRight: "1rem" }}>
              <Table hover>
                <tbody>
                  {props.application.files.map((element, index) => {
                    return (
                      <tr
                        key={index}
                        onMouseEnter={() => handleRowHover(index)}
                        onMouseLeave={() => handleRowHover(undefined)}
                      >
                        <td>
                          {hoveredRow === index ? (
                            <FileEarmarkPdfFill />
                          ) : (
                            <FileEarmarkPdf />
                          )}{" "}
                          {element}
                        </td>
                        <td>
                          {/*<OverlayTrigger overlay={
                        <Tooltip id="tooltip-top">Download file</Tooltip>
                      }>*/}
                          <Button
                            className="button-style"
                            onClick={() =>
                              props.handleDownloadPDF(
                                props.application.student_id,
                                props.application.thesis_id,
                                element
                              )
                            }
                          >
                            <Download size={20} />
                          </Button>
                          {/*</td></OverlayTrigger>*/}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Download zip folder</Tooltip>}
          >
            <Button
              className="button-style"
              onClick={() =>
                props.handleDownloadZip(
                  props.application.student_id,
                  props.application.thesis_id
                )
              }
            >
              Download all
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAction={confirmAction}
        action={action}
        body={`Are you sure you want to ${action.toLowerCase()} this application?`}
      />
    </>
  );
}

/* function StudentApplication(props) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState("");
  const [studentId, setStudentId] = useState("");
  const [thesisId, setThesisId] = useState("");

  const [show, setShow] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${month}/${day}/${year} ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  }

  function handleConfirmation(studentId, thesisId, action) {
    setStudentId(studentId);
    setThesisId(thesisId);
    setAction(action);
    setShowConfirmation(true);
  }

  function confirmAction() {
    props.handleApplication(studentId, thesisId, action);
    setShowConfirmation(false);
  }

  return props.title === props.application.thesis_title ? (
    <>
      <tr>
        {!props.isMobile && <td>{props.application.student_id}</td>}
        <td>{props.application.student_name}</td>
        <td>{formatDate(props.application.application_date)}</td>
        <td>
          {props.application.files && props.application.files.length > 0 && (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-top">See application files</Tooltip>
              }
            >
              <Button variant="secondary" onClick={handleShow}>
                <Folder size={20} />
              </Button>
            </OverlayTrigger>
          )}
        </td>
        <td>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Accept application</Tooltip>}
          >
            <Button
              variant="success"
              onClick={() =>
                handleConfirmation(
                  props.application.student_id,
                  props.application.thesis_id,
                  "Accepted"
                )
              }
            >
              <CheckLg size={20} />
            </Button>
          </OverlayTrigger>
        </td>
        <td>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Reject application</Tooltip>}
          >
            <Button
              variant="danger"
              onClick={() =>
                handleConfirmation(
                  props.application.student_id,
                  props.application.thesis_id,
                  "Rejected"
                )
              }
            >
              <XLg size={20} />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>

      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Application files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <div style={{ marginRight: "1rem" }}>
              <Table hover>
                <tbody>
                  {props.application.files.map((element, index) => {
                    return (
                      <tr
                        key={index}
                        onMouseEnter={() => handleRowHover(index)}
                        onMouseLeave={() => handleRowHover(undefined)}
                      >
                        <td>
                          {hoveredRow === index ? (
                            <FileEarmarkPdfFill />
                          ) : (
                            <FileEarmarkPdf />
                          )}{" "}
                          {element}
                        </td>
                        <td>
                          <Button
                            className="button-style"
                            onClick={() =>
                              props.handleDownloadPDF(
                                props.application.student_id,
                                props.application.thesis_id,
                                element
                              )
                            }
                          >
                            <Download size={20} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-top">Download zip folder</Tooltip>}
          >
            <Button
              className="button-style"
              onClick={() =>
                props.handleDownloadZip(
                  props.application.student_id,
                  props.application.thesis_id
                )
              }
            >
              Download all
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAction={confirmAction}
        action={action}
        body={`Are you sure you want to ${action.toLowerCase()} this application?`}
      />
    </>
  ) : null;
} */

export default Applications;
