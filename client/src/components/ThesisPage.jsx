import {
  Container,
  Table,
  Accordion,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import React, { useEffect, useState, useContext } from "react";
import API from "../API";
import MessageContext from "../messageCtx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style.css";
import { useMediaQuery } from "react-responsive";
import Loading from "./Loading";
import FileDropModal from "./FileModal";

function ThesisPage(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { handleToast } = useContext(MessageContext);
  const [pageData, setPageData] = useState({});
  const [openPanel, setOpenPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { state } = useLocation();
  const [flag, setFlag] = useState(0);
  const from = state?.from;

  if (!props.loggedIn || props.user.user_type !== "STUD") {
    return API.redirectToLogin();
  }

  useEffect(() => {
    const init = async () => {
      try {
        props.setLoading(true);
        const thesisData = await API.getThesisProposalsById(params.id);
        //console.log(thesisData.cosupervisors);
        setPageData({
          title: thesisData.title,
          description: thesisData.description,
          supervisor: `${thesisData.name} ${thesisData.surname}`,
          coSupervisor: thesisData.cosupervisors,
          keywords: thesisData.keywords.length !== 0 && thesisData.keywords,
          type: thesisData.thesis_type,
          groups: thesisData.group_name.map((element) => {
            return element.group;
          }),
          requiredKnowledge: thesisData.required_knowledge,
          ...(thesisData.notes !== "None" && { notes: thesisData.notes }),
          expiration: dayjs(thesisData.expiration).format("MM/DD/YYYY"),
          level: thesisData.thesis_level,
        });
        const isApplied = await API.isApplied();
        setFlag(isApplied);
        // console.log(thesisData);
        setIsLoading(false);
      } catch (error) {
        handleToast(error, "center", "error");
      }
    };
    init();
  }, []);

  const handleApplication = () => {
    submitApplication(params.id, props.virtualClock);
    handleUpload(params.id);
  };

  const handleUpload = (thesis_id) => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`file`, selectedFiles[i]);
    }
    API.sendFiles(formData, thesis_id)
      .then(() => {
        handleToast("Application submitted correctly", "success");
        navigate("/proposal");
      })
      .catch((err) => {
        handleToast(err, "error");
      });
  };

  const closeModal = () => {
    setOpenPanel(false);
    setSelectedFiles([]);
  };

  const submitApplication = (idThesis, date) => {
    API.applicationThesis(idThesis, date)
      .then(() => {
        // console.log("tutto ok");
      })
      .catch((err) => {
        handleToast(err, "error");
      });
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container className="navbarMargin">
            <Table className="table-rounded">
              <thead>
                <tr>
                  <th className="empty-col-mediumScreen"></th>
                  <th colSpan="6" className="title-mediumScreen">
                    {pageData.title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.supervisor && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      {" "}
                      Supervisor
                    </td>
                    <td className="rightText">{pageData.supervisor}</td>
                  </tr>
                )}

                {pageData.coSupervisor.length > 0 && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Co-Supervisors
                    </td>
                    <td className="rightText">
                      {pageData.coSupervisor.join(", ")}
                    </td>
                  </tr>
                )}

                {pageData.keywords && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Keywords
                    </td>
                    <td className="rightText">
                      {pageData.keywords.map((element, index) => (
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
                  <td className="rightText">{pageData.type}</td>
                </tr>

                {pageData.groups && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Groups
                    </td>
                    <td className="rightText">{pageData.groups.join(", ")}</td>
                  </tr>
                )}
                {!isMobile && pageData.description && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Description
                    </td>
                    <td className="rightText">{pageData.description}</td>
                  </tr>
                )}

                {isMobile && pageData.description && (
                  <tr>
                    <td colSpan="3" className="custom-accordion-td">
                      <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Description</Accordion.Header>
                          <Accordion.Body>
                            {pageData.description}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </td>
                  </tr>
                )}

                {pageData.requiredKnowledge && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Required Knowledge
                    </td>
                    <td className="rightText">{pageData.requiredKnowledge}</td>
                  </tr>
                )}

                {!isMobile && pageData.notes && (
                  <tr>
                    <td colSpan="2" className="leftText customLeftColumn">
                      Notes
                    </td>
                    <td className="rightText">{pageData.notes}</td>
                  </tr>
                )}
                {isMobile && pageData.notes && (
                  <tr>
                    <td colSpan="3" className="custom-accordion-td">
                      <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Notes</Accordion.Header>
                          <Accordion.Body>{pageData.notes}</Accordion.Body>
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
                          <span className="bold">{pageData.level}</span>
                          <span> thesis</span>
                        </div>
                        <div className="table-footer">
                          <span>Valid until</span>
                          <span className="bold"> {pageData.expiration}</span>
                        </div>
                      </Col>
                      {!(from === "applications") && (
                        <Col>
                          <div className="button-apply">
                            {flag === 0 ? (
                              <Button
                                className="button-style"
                                onClick={() => setOpenPanel(true)}
                              >
                                APPLY
                              </Button>
                            ) : (
                              <></>
                            )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Container>

          <FileDropModal
            showModal={openPanel}
            closeModal={closeModal}
            handleSave={() => {
              handleApplication();
            }}
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
        </>
      )}
    </>
  );
}

export default ThesisPage;
