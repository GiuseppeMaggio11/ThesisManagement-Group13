import { useContext, useEffect, useState } from "react";
import { Accordion, Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API";
import MessageContext from "../messageCtx";
import { useMediaQuery } from "react-responsive";
import Loading from "./Loading";

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
      console.log(response);
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
    <>
      <Container>
        <Button
          onClick={() => {
            navigate("/updateproposal/" + proposal.id);
          }}
        >
          Update
        </Button>
      </Container>
      <Container className="navbarMargin">
        <Table className="table-rounded">
          <thead>
            <tr>
              <th colSpan="6" className="title-mediumScreen">
                {proposal.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {proposal.supervisor_id && (
              <tr>
                <td colSpan="2" className="leftText customLeftColumn">
                  Supervisor
                </td>
                <td className="rightText">{proposal.supervisor_id}</td>
              </tr>
            )}
            {proposal.cosupervisors_external.length >
              0 /*da fixare con l'internal*/ && (
              <tr>
                <td colSpan="2" className="leftText customLeftColumn">
                  Co-Supervisors
                </td>
                <td className="rightText">
                  {proposal.cosupervisors_external.join(", ")}
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
                      <span className="bold"> {proposal.expiration}</span>
                    </div>
                  </Col>
                </Row>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>
    </>
  );
}

export default ViewProposal;
