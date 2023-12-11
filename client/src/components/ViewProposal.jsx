import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import Loading from "./Loading";
import dayjs from "dayjs";
import { PencilFill } from "react-bootstrap-icons";

function ViewProposal(props) {
  const navigate = useNavigate();
  const { idView } = useParams();
  const [proposal, setProposal] = useState(undefined);
  const { handleToast } = useContext(MessageContext);

  if (!props.loggedIn || props.user.user_type !== "PROF")
    return API.redirectToLogin();

  const fetchThesis = async (thesisId) => {
    try {
      const response = await API.getThesisForProfessorById(thesisId);
      setProposal(response);
    } catch (err) {
      handleToast("Error while fetching Thesis", "error");
    }
  };

  useEffect(() => {
    props.setLoading(true);
    if (idView) fetchThesis(idView);
    props.setLoading(false);
  }, []);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return props.loading || !proposal ? (
    <Loading />
  ) : (
    <Container className="navbarMargin">
      <Table className="table-rounded">
        <thead>
          <tr>
            <th className="empty-col-mediumScreen"></th>
            <th colSpan="6" className="title-mediumScreen">
              {proposal.title}
            </th>
          </tr>
        </thead>
        <tbody>
          {proposal.supervisor_name && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Supervisor
              </td>
              <td className="rightText">{proposal.supervisor_name}</td>
            </tr>
          )}
          {proposal.list_cosupervisors.length > 0 && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Co-Supervisors
              </td>
              <td className="rightText">
                {proposal.list_cosupervisors.join(", ")}
              </td>
            </tr>
          )}
          {proposal.keywords && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Keywords
              </td>
              <td className="rightText">
                {proposal.keywords.map((element, index) => (
                  <React.Fragment key={index}>
                    {index !== 0 && <span>, </span>}
                    <u>{element}</u>
                  </React.Fragment>
                ))}
              </td>
            </tr>
          )}
          <tr>
            <td colSpan="2" className="leftText customLeftColumn">
              Type
            </td>
            <td className="rightText">{proposal.type_name}</td>
          </tr>
          {proposal.cod_group && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Group
              </td>
              {/* <td className="rightText">{proposal.cod_group.join(", ")}</td> */}
              <td className="rightText">{proposal.cod_group}</td>
            </tr>
          )}
          {!isMobile && proposal.description && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Description
              </td>
              <td className="rightText">{proposal.description}</td>
            </tr>
          )}
          {isMobile && proposal.description && (
            <tr>
              <td colSpan="3" className="custom-accordion-td">
                <Accordion defaultActiveKey="1">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Description</Accordion.Header>
                    <Accordion.Body>{proposal.description}</Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </td>
            </tr>
          )}
          {proposal.required_knowledge && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Required Knowledge
              </td>
              <td className="rightText">{proposal.required_knowledge}</td>
            </tr>
          )}
          {!isMobile && proposal.notes && (
            <tr>
              <td colSpan="2" className="leftText customLeftColumn">
                Notes
              </td>
              <td className="rightText">{proposal.notes}</td>
            </tr>
          )}
          {isMobile && proposal.notes && (
            <tr>
              <td colSpan="3" className="custom-accordion-td">
                <Accordion defaultActiveKey="1">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Notes</Accordion.Header>
                    <Accordion.Body>{proposal.notes}</Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-center table-footer">
              <Row className="justify-content-between">
                <Col>
                  <div className="table-footer">
                    <span className="bold">{proposal.thesis_level}</span>
                    <span> thesis</span>
                  </div>
                  <div className="table-footer">
                    <span>Valid until</span>
                    <span className="bold mx-1">
                      {dayjs(proposal.expiration).format("MM/DD/YYYY")}
                    </span>
                  </div>
                </Col>
                <Col className="text-end mx-2">
                  <Button
                    className="button-style mx-2"
                    onClick={() => {
                      navigate("/updateproposal/" + proposal.id);
                    }}
                  >
                    <span className="mx-2">Edit</span>
                    <PencilFill />
                  </Button>
                  <Button
                    className="button-style-cancel"
                    onClick={() => {
                      handleToast("Thesis copied", "success");
                      navigate("/copyproposal/" + proposal.id);
                    }}
                  >
                    <span className="mx-2">Copy</span>
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
                </Col>
              </Row>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
}

export default ViewProposal;
