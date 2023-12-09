import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import Loading from "./Loading";
import { useMediaQuery } from "react-responsive";
import API from "../API";
import MessageContext from "../messageCtx";
import { CheckLg, XLg } from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";

function Applications(props) {
  const [applications, setApplications] = useState(undefined);
  const [thesisTitles, setThesisTitles] = useState(undefined);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!props.loggedIn || props.user.user_type !== "PROF")
    return API.redirectToLogin();

  useEffect(() => {
    props.setLoading(true);
    //API CALL
    const getApplication = async () => {
      const result = await API.getPendingApplications();
      const uniqueThesisTitles = [
        ...new Set(result.map((entry) => entry.thesis_title)),
      ];
      setApplications(result);
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
        "success"
      );
      const result = await API.getPendingApplications();
      const uniqueThesisTitles = [
        ...new Set(result.map((entry) => entry.thesis_title)),
      ];
      setApplications(result);
      setThesisTitles(uniqueThesisTitles);
      props.setLoading(false);
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
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((appl, i) => {
                          return (
                            <StudentApplication
                              application={appl}
                              key={i}
                              handleApplication={handleApplication}
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState('');
  const [studentId, setStudentId] = useState('');
  const [thesisId, setThesisId] = useState('');

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
    <tr>
      {!props.isMobile && <td>{props.application.student_id}</td>}
      <td>{props.application.student_name}</td>
      <td>{formatDate(props.application.application_date)}</td>
      <td>
        <Button
          variant="success"
          onClick={() =>
            handleConfirmation(
              props.application.student_id,
              props.application.thesis_id,
              'Accepted'
            )
          }
        >
          <CheckLg size={20} />
        </Button>
      </td>
      <td>
        <Button
          variant="danger"
          onClick={() =>
            handleConfirmation(
              props.application.student_id,
              props.application.thesis_id,
              'Refused'
            )
          }
        >
          <XLg size={20} />
        </Button>
      </td>
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAction={confirmAction}
        action={action}
        body={`Are you sure you want to ${action.toLowerCase()} this application?`}
      />
    </tr>
  ) : null;
}

export default Applications;
