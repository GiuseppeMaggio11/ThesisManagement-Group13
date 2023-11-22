import { useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import Loading from "./Loading";
import { useMediaQuery } from "react-responsive";

function Applications(props) {
  const [applications, setApplications] = useState(undefined);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  useEffect(() => {
    props.setLoading(true);
    //API CALL
    setApplications([
      {
        student_id: "S123456",
        student_name: "Luca Esposito",
        thesis_id: 1,
        thesis_title: "Development of a Secure Web Application",
        application_date: "2023-11-22",
      },
      {
        student_id: "S654321",
        student_name: "Alessandra Moretti",
        thesis_id: 1,
        thesis_title: "Development of a Secure Web Application",
        application_date: "2023-10-10",
      },
      {
        student_id: "S123456",
        student_name: "Luca Esposito",
        thesis_id: 2,
        thesis_title: "IoT-Based Smart Home Automation",
        application_date: "2023-11-15",
      },
      {
        student_id: "S654321",
        student_name: "Alessandra Moretti",
        thesis_id: 3,
        thesis_title: "Network Traffic Analysis",
        application_date: "2023-11-22",
      },
    ]);
    props.setLoading(false);
  }, []);

  const handleApplicationAccept = (student_id, thesis_id) => {
    console.log(
      "STUDENT: " + student_id + " THESIS: " + thesis_id + " ACCEPTED"
    );
  };

  const handleApplicationReject = (student_id, thesis_id) => {
    console.log(
      "STUDENT: " + student_id + " THESIS: " + thesis_id + " REJECTED"
    );
  };

  return (
    <>
      {props.loading && <Loading />}
      <Container>
        <Row className="mb-3">
          <Col className="fs-3">Students Pending Applications</Col>
        </Row>

        {!applications || applications.length === 0 ? (
          <Alert variant="danger" style={{ maxWidth: "300px" }}>
            No Applications found
          </Alert>
        ) : !isMobile ? (
          <Table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Thesis Title</th>
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
                    handleApplicationAccept={handleApplicationAccept}
                    handleApplicationReject={handleApplicationReject}
                    isMobile={isMobile}
                  />
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Row>
            <Col>
              <Accordion>
                {applications.map((appl, i) => {
                  return (
                    <StudentApplication
                      application={appl}
                      key={i}
                      handleApplicationAccept={handleApplicationAccept}
                      handleApplicationReject={handleApplicationReject}
                      isMobile={isMobile}
                      index={i}
                    />
                  );
                })}
              </Accordion>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

function StudentApplication(props) {
  return !props.isMobile ? (
    <tr>
      <td>{props.application.student_id}</td>
      <td>{props.application.student_name}</td>
      <td>{props.application.thesis_title}</td>
      <td>{props.application.application_date}</td>
      <td>
        <Button
          variant="success"
          onClick={() =>
            props.handleApplicationAccept(
              props.application.student_id,
              props.application.thesis_id
            )
          }
        >
          Accept
        </Button>
      </td>
      <td>
        <Button
          variant="danger"
          onClick={() =>
            props.handleApplicationReject(
              props.application.student_id,
              props.application.thesis_id
            )
          }
        >
          Reject
        </Button>
      </td>
    </tr>
  ) : (
    <Accordion.Item eventKey={props.index} className="my-3">
      <Accordion.Header>
        <Row className="my-3">
          <Col>
            <span>{props.application.student_id}</span>
          </Col>
          <Col>
            <span>{props.application.student_name}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>{props.application.thesis_title}</span>
          </Col>
        </Row>
      </Accordion.Header>
      <Accordion.Body style={{ position: "relative" }}>body</Accordion.Body>
    </Accordion.Item>
  );
}

export default Applications;
