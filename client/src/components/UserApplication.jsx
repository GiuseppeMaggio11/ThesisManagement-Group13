import { Container, Table, Accordion, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import API from '../API';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style.css'
import { useMediaQuery } from 'react-responsive';
import Loading from "./Loading";

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

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        // Filter only pdf's files
        const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');

        // Add the new file
        setSelectedFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    };
    const isMobile = useMediaQuery({ maxWidth: 767 });


    const handleRemoveFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    useEffect(() => {
        const init = async () => {
            try {
                //API TO RECEIVE DATA
            } catch (error) {

            }
        }
        init()
        // setLoading(false)
    }, [])

    const handleApplication = (event) => {
        event.preventDefault();
        submitApplication(pageData.id);
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



    const submitApplication = (idThesis) => {
        API.applicationThesis(idThesis).then(
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
                                <td colSpan="2" className="leftText"> Supervisor</td>
                                <td className="rightText">{pageData.supervisor}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.length > 1 && (
                            <tr>
                                <td colSpan="2" className="leftText">Co-Supervisors</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.lengt == 1 && (
                            <tr>
                                <td colSpan="2" className="leftText">Co-Supervisor</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.keywords && (
                            <tr>
                                <td colSpan="2" className="leftText">Keywords</td>
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
                            <td colSpan="2" className="leftText">Type</td>
                            <td className="rightText">{pageData.type}</td>
                        </tr>

                        {pageData.groups && (
                            <tr>
                                <td colSpan="2" className="leftText">Groups</td>
                                <td className="rightText">{pageData.groups.join(', ')}</td>
                            </tr>
                        )}
                        {!isMobile && pageData.description && (
                            <tr>
                                <td colSpan="2" className="leftText">Description</td>
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
                                <td colSpan="2" className="leftText">Required Knowledge</td>
                                <td className="rightText">{pageData.requiredKnowledge.join(', ')}</td>
                            </tr>
                        )}

                        {!isMobile && pageData.notes && (
                            <tr>
                                <td colSpan="2" className="leftText">Notes</td>
                                <td className="rightText">{pageData.notes}</td>
                            </tr>
                        )}
                        {isMobile && pageData.notes && (
                            <tr>
                                <td colSpan="3" className="accordion-td">
                                    <Accordion defaultActiveKey="0">
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
            <Modal show={openPanel}>
                <Modal.Header>
                    <Modal.Title>Application confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="fileInput">Select PDF files that supervisor has to considering in your application:</label>
                        <input
                            type="file"
                            id="fileInput"
                            accept=".pdf"
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                    <div>
                        {selectedFiles.map((file, index) => (
                            <div key={index}>
                                {file.name}
                                <Button variant="outline-danger" onClick={() => handleRemoveFile(index)}>
                                    <i class="bi bi-x-circle"></i>
                                </Button>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="confirmation_application_div">Confirm application for {pageData.title} thesis?</div>
                    <Form onSubmit={handleApplication}>
                        <Button variant="danger" onClick={() => setOpenPanel(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Apply
                        </Button>
                    </Form>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default UserApplication;