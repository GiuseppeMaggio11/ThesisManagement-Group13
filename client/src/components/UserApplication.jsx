import { Container, Table, Accordion, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import API from '../API';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style.css'
import { useMediaQuery } from 'react-responsive';
import Loading from "./Loading";
import FileDropModal from './FileModal';
import VirtualClock from "./VirtualClock";

function UserApplication(props) {
    const [pageData, setPageData] = useState({
        id: "6",
        title: "Navigating the Digital Labyrinth: Understanding the Impact of Technological Convergence on Human Cognition",
        supervisor: "LUCA POLLONI",
        coSupervisor: ["Muro Loii", "Adato Gooli", "Laura Poll"],
        keywords: ["AUTOMATATION", "RESOLT"],
        type: "Sperimentale",
        groups: ["Gruppo 1", "Gruppo2"],
        requiredKnowledge: ["Python", "Java"],
        description: "This thesis delves into the intricate interplay between rapidly converging technologies and the human mind, exploring the profound implications for cognition in the digital age. By examining the fusion of artificial intelligence, augmented reality, and neurotechnology, the study investigates how these advancements shape cognitive processes, perception, and decision-making. Through a multidisciplinary lens, it aims to uncover the cognitive challenges and opportunities presented by this convergence, shedding light on the complex relationship between humans and emerging technologies. The research combines cognitive science, neuroscience, and technology studies to provide a nuanced understanding of the cognitive landscape in the era of technological convergence.",
        notes: "This groundbreaking thesis illuminates the intricate dance between evolving technologies and human cognition, unraveling the complexities of our digital future. It offers valuable insights for scholars, policymakers, and technologists seeking to navigate the uncharted terrain of technological convergence. The multidisciplinary approach ensures a comprehensive exploration, encouraging a holistic understanding of the profound impact these advancements have on how we think, perceive, and interact in an increasingly interconnected world.",
        expired: "2023/11/11",
        level: "Bachelor"
    })
    const [openPanel, setOpenPanel] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    useEffect(() => {
        const init = async () => {
            try {
                //API TO RECEIVE DATA
            } catch (error) {
              //ERROR
            }
        }
        init()
        // setLoading(false)
    }, [])

    const handleApplication = () => {
        submitApplication(pageData.id, props.virtualClock);
        handleUpload();
    }

    const handleUpload = () => {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append(`file${i + 1}`, selectedFiles[i]);
        }
        API.sendFiles(formData).then(
            () => { console.log("tutto ok") }
        ).catch((err) => { console.log(err) });
    }

        const closeModal=()=>{
            setOpenPanel(false)
            setSelectedFiles([])
        }


    const submitApplication = (idThesis, date) => {
        API.applicationThesis(idThesis, date).then(
            () => { console.log("tutto ok") }
        ).catch((err) => { console.log(err) });
    }
    return (
        <>
            {props.loading ? <Loading /> : ""}
            <Container className="navbarMargin">
                <Table className="table-rounded">
                    <thead >
                        <tr>
                            <th colSpan="6" className="title-mediumScreen" >{pageData.title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.supervisor && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn"> Supervisor</td>
                                <td className="rightText">{pageData.supervisor}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.length > 1 && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Co-Supervisors</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.lengt == 1 && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Co-Supervisor</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.keywords && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Keywords</td>
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
                            <td colSpan="2" className="leftText customLeftColumn">Type</td>
                            <td className="rightText">{pageData.type}</td>
                        </tr>

                        {pageData.groups && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Groups</td>
                                <td className="rightText">{pageData.groups.join(', ')}</td>
                            </tr>
                        )}
                        {!isMobile && pageData.description && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Description</td>
                                <td className="rightText">{pageData.description}</td>
                            </tr>
                        )}

                        {isMobile && pageData.description && (
                            <tr>
                                <td colSpan="3" className="accordion-td">
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
                                <td colSpan="2" className="leftText customLeftColumn">Required Knowledge</td>
                                <td className="rightText">{pageData.requiredKnowledge.join(', ')}</td>
                            </tr>
                        )}

                        {!isMobile && pageData.notes && (
                            <tr>
                                <td colSpan="2" className="leftText customLeftColumn">Notes</td>
                                <td className="rightText">{pageData.notes}</td>
                            </tr>
                        )}
                        {isMobile && pageData.notes && (
                            <tr>
                                <td colSpan="3" className="accordion-td">
                                    <Accordion defaultActiveKey="1">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Notes</Accordion.Header>
                                            <Accordion.Body>
                                                {pageData.notes}
                                            </Accordion.Body>
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
                                            <span className="bold">{pageData.level}</span><span> thesis</span>
                                        </div>
                                        <div className="table-footer">
                                            <span>Valid until</span><span className="bold"> {pageData.expired}</span>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="button-apply">
                                            <Button className="button-style" onClick={() => setOpenPanel(true)}>
                                                APPLY
                                            </Button>
                                        </div>
                                    </Col>
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
    );
}

export default UserApplication;