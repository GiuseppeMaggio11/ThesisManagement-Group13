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
import { CheckLg, XLg, Download, Folder, FileEarmarkPdf, FileEarmarkPdfFill } from "react-bootstrap-icons";

function Applications(props) {
  const [applications, setApplications] = useState(undefined);
  const [thesisTitles, setThesisTitles] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  useEffect(() => {
    props.setLoading(true);
    //API CALL
    const getApplication = async () => {
      const result = await API.getPendingApplications();
      const promises = result.map(async (element) => {
        const files = await API.listApplicationFiles(element.student_id, element.thesis_id);
        return Object.assign({}, element, {files: files});
      });
      const updatedResult = await Promise.all(promises);
      const uniqueThesisTitles = [
        ...new Set(updatedResult.map((entry) => entry.thesis_title)),
      ];
      setApplications(updatedResult);
      setThesisTitles(uniqueThesisTitles);
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
        status === "Accepted" ? "success" : "error"
      );
      const result = await API.getPendingApplications();
      const promises = result.map(async (element) => {
        const files = await API.listApplicationFiles(element.student_id, element.thesis_id);
        return Object.assign({}, element, {files: files});
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
      await API.downloadStudentApplicationFile(student_id, thesis_id, file_name);
    } catch (err) {
      handleToast(err, "error");
    } 
  };

  return (
    <>
      {props.loading && <Loading />}
      <Container>
        <Row className="mb-3">
          <Col className="fs-2">Students Pending Applications</Col>
        </Row>

        {!applications || applications.length === 0 ? (
          <Alert variant="danger" style={{ maxWidth: "300px" }}>
            No Applications found
          </Alert>
        ) : (
          <Accordion>
            {thesisTitles.map((title, i) => {
              return (
                <Accordion.Item key={i} eventKey={i}>
                  <Accordion.Header>
                    <span style={{ color: "#4682B4", fontSize: 18 }}>
                      {title}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table>
                      <thead>
                        <tr>
                          {!isMobile && <th>Student ID</th>}
                          <th>Student Name</th>
                          <th>Application Date</th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((appl, i) => {
                          return (
                            <StudentApplication
                              application={appl}
                              key={i}
                              handleApplication={handleApplication}
                              handleDownloadZip={handleDownloadZip}
                              handleDownloadPDF={handleDownloadPDF}
                              isMobile={isMobile}
                              title={title}
                            />
                          );
                        })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Container>
    </>
  );
}

function StudentApplication(props) {
  const [show, setShow] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRowHover = (index) => {
    setHoveredRow(index);
  };

  function formatDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return `${day}/${month}/${year} ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  }

  return props.title === props.application.thesis_title ? (
    <>
      <tr>
        {!props.isMobile && <td>{props.application.student_id}</td>}
        <td>{props.application.student_name}</td>
        <td>{formatDate(props.application.application_date)}</td>
        <td>
          <OverlayTrigger overlay={
            <Tooltip id="tooltip-top">See application files</Tooltip>
          }>
            <Button
              variant="secondary"
              onClick={handleShow}
            >
              <Folder size={20} />
            </Button>
          </OverlayTrigger>
        </td>
        <td>
          <OverlayTrigger overlay={
            <Tooltip id="tooltip-top">Accept application</Tooltip>
          }>
            <Button
              variant="success"
              onClick={() =>
                props.handleApplication(
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
          <OverlayTrigger overlay={
            <Tooltip id="tooltip-top">Reject application</Tooltip>
          }>
            <Button
              variant="danger"
              onClick={() =>
                props.handleApplication(
                  props.application.student_id,
                  props.application.thesis_id,
                  "Refused"
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
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                          {hoveredRow === index ? <FileEarmarkPdfFill/> : <FileEarmarkPdf/>} {element}
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
                              }>
                              <Download size={20} />
                            </Button>
                          {/*</td></OverlayTrigger>*/}
                        </td>
                      </tr>
                    )}
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <OverlayTrigger overlay={
            <Tooltip id="tooltip-top">Download zip folder</Tooltip>
          }>
            <Button 
              className="button-style" 
              onClick={() =>
                props.handleDownloadZip(
                  props.application.student_id,
                  props.application.thesis_id
                )}>
              Download all 
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    </>
  ) : null;
}

export default Applications;
