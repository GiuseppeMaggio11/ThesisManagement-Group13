import { useEffect, useState } from "react";
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

  const handleApplication = (student_id, thesis_id, status) => {
    console.log(
      "STUDENT: " + student_id + " THESIS: " + thesis_id + " STATUS: " + status
    );
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
                    handleApplication={handleApplication}
                    isMobile={isMobile}
                  />
                );
              })}
            </tbody>
          </Table>
        ) : (
          <Row>
            <Col>
              <Row className="fs-5 w-100">
                <Col>Student ID</Col>
                <Col>Thesis Name</Col>
              </Row>
              <div style={{ borderBottom: "1px solid gray" }}></div>
              <Accordion className="mx-1">
                {applications.map((appl, i) => {
                  return (
                    <StudentApplication
                      application={appl}
                      key={i}
                      handleApplication={handleApplication}
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
            props.handleApplication(
              props.application.student_id,
              props.application.thesis_id,
              "Accepted"
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
            props.handleApplication(
              props.application.student_id,
              props.application.thesis_id,
              "Refused"
            )
          }
        >
          Reject
        </Button>
      </td>
    </tr>
  ) : (
    <Accordion.Item
      eventKey={props.index}
      className="my-3 custom-accordion-item"
    >
      <Accordion.Header>
        <Row className="py-3 w-100">
          <Col>
            <span style={{ fontWeight: "450" }}>
              {props.application.student_id}
            </span>
          </Col>
          <Col>
            <span style={{ fontWeight: "450" }}>
              {props.application.thesis_title}
            </span>
          </Col>
        </Row>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          <Col className="text-end">
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
              Accept
            </Button>
          </Col>
          <Col className="text-start">
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
              Reject
            </Button>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default Applications;
