import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Accordion,
  Alert,
  Badge,
} from "react-bootstrap";
import Loading from "./Loading";
import { useMediaQuery } from "react-responsive";
import MessageContext from "../messageCtx";
import API from "../API";

import dayjs from "dayjs";
import NoFileFound from "./NoFileFound";

function StudentApplications(props) {
  const [applications, setApplications] = useState(undefined);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { handleToast } = useContext(MessageContext);

  useEffect(() => {
    if (!props.loggedIn || props.user.user_type !== "STUD") {
      return API.redirectToLogin();
    }
    props.setLoading(true);
    try {
      const getApplications = async () => {
        const result = await API.getStudentApplications();
        setApplications(result);
        props.setLoading(false);
      };
      getApplications();
    } catch (err) {
      handleToast(err, "error");
    }
  }, []);

  return (
    <div className="d-flex justify-content-center">
      {props.loading && <Loading />}
      <Container className="width-80 margin-custom">
        <Row className="align-items-center">
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-center"
          >
            <h1
              className={`margin-titles-custom ${
                props.isMobile ? "smaller-heading" : ""
              }`}
            >
              My applications
            </h1>
          </Col>
        </Row>
        {!applications || applications.length === 0 ? (
          <NoFileFound message={"No application found"} />
        ) : !isMobile ? (
          <Table>
            <thead>
              <tr>
                <th>Thesis</th>
                <th>Supervisor</th>
                <th>Application Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((element, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      style={{ color: "#4682B4", fontSize: 18 }}
                      to={`/proposals/${element.id}`}
                      state={{ from: "applications" }}
                    >
                      {element.title}
                    </Link>
                  </td>
                  <td>{element.name + " " + element.surname}</td>
                  <td>
                    {dayjs(element.application_date).format("MM/DD/YYYY")}
                  </td>
                  <td>
                    <ApplicationStatus status={element.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Row>
            <Col>
              <Row className="fs-5 w-100">
                <Col>Thesis</Col>
                <Col>Status</Col>
              </Row>
              <div style={{ borderBottom: "1px solid gray" }}></div>
              <Accordion className="mx-1">
                {applications.map((element, index) => {
                  return (
                    <MobileApplication
                      application={element}
                      index={index}
                      key={index}
                    />
                  );
                })}
              </Accordion>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

function MobileApplication(props) {
  return (
    <Accordion.Item
      eventKey={props.index}
      className="my-3 custom-accordion-item"
    >
      <Accordion.Header>
        <Row className="py-3 w-100">
          <Col>
            <Link
              style={{ color: "#4682B4", fontSize: 18 }}
              to={`/proposals/${props.application.id}`}
              state={{ from: "applications" }}
            >
              {props.application.title}
            </Link>
          </Col>
          <Col>
            <ApplicationStatus status={props.application.status} />
          </Col>
        </Row>
      </Accordion.Header>
      <Accordion.Body style={{ position: "relative" }}>
        <p>
          Application date:{" "}
          <b>
            {dayjs(props.application.application_date).format("MM/DD/YYYY")}
          </b>
        </p>
        <p>
          Supervisor:{" "}
          <b>{props.application.name + " " + props.application.surname}</b>
        </p>
        <p>
          Expiration date:{" "}
          <b>{dayjs(props.application.expiration).format("MM/DD/YYYY")}</b>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  );
}

function ApplicationStatus(props) {
  return props.status === "Rejected" || props.status === "Cancelled" ? (
    <Badge bg="danger" style={{ maxWidth: "100px" }}>
      {props.status}
    </Badge>
  ) : props.status === "pending" ? (
    <Badge bg="secondary" style={{ maxWidth: "100px" }}>
      Pending
    </Badge>
  ) : (
    <Badge bg="success" style={{ maxWidth: "100px" }}>
      Accepted
    </Badge>
  );
}

/*<tr key={index}>
  <td>
    <Accordion.Item eventKey={index}>
      <Accordion.Header style={{ fontSize: 18 }}>
        {element.title}
      </Accordion.Header>
      <Accordion.Body style={{ position: "relative" }}>
        <p>
          Supervisor: <b>{element.supervisor}</b>
        </p>
        <p>
          Expiration date:{" "}
          <b>{dayjs(element.expiration).format("MM/DD/YYYY")}</b>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  </td>
  <td style={{ fontSize: 18 }}>{element.status}</td>
</tr>*/

export default StudentApplications;
