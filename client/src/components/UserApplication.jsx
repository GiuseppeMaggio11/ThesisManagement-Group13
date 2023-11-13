import { Container, Table, Accordion, Button, Modal, Form, Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import API from '../API';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../style.css'
import Loading from "./Loading";

function UserApplication(props) {
    const [pageData, setPageData] = useState({
        id: "6",
        title: "TITOLO TESI",
        supervisor: "LUCA POLLONI",
        coSupervisor: ["Muro Loii", "Adato Gooli", "Laura Poll"],
        keywords: ["AUTOMATATION", "RESOLT"],
        type: "Sperimentale",
        groups: ["Gruppo 1", "Gruppo2"],
        requiredKnowledge: ["Python", "Java"],
        description: "Questa è la descrizione",
        notes: "Queste sono le note",
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
                    <thead>
                        <tr>
                            <th colSpan="6">{pageData.title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.supervisor && (
                            <tr>
                                <td className="leftText"> Supervisor</td>
                                <td className="rightText">{pageData.supervisor}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.length > 1 && (
                            <tr>
                                <td className="leftText">Co-Supervisors</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.coSupervisor.lengt == 1 && (
                            <tr>
                                <td className="leftText">Co-Supervisor</td>
                                <td className="rightText">{pageData.coSupervisor.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.keywords && (
                            <tr>
                                <td className="leftText">Keywords</td>
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
                            <td className="leftText">Type</td>
                            <td className="rightText">{pageData.type}</td>
                        </tr>

                        {pageData.groups && (
                            <tr>
                                <td className="leftText">Groups</td>
                                <td className="rightText">{pageData.groups.join(', ')}</td>
                            </tr>
                        )}

                        <tr>
                            <td className="leftText">Description</td>
                            <td className="rightText">{pageData.description}</td>
                        </tr>

                        {pageData.requiredKnowledge && (
                            <tr>
                                <td className="leftText">Required Knowledge</td>
                                <td className="rightText">{pageData.requiredKnowledge.join(', ')}</td>
                            </tr>
                        )}

                        {pageData.notes && (
                            <tr>
                                <td className="leftText">Notes</td>
                                <td className="rightText">{pageData.notes}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="2">
                                <Row className="d-flex justify-content-between">
                                    <Col>
                                        <div style={{ textAlign: 'left', fontSize: 13 }}>
                                            <span>{pageData.level} thesis</span>
                                        </div>
                                        <div style={{ textAlign: 'left', fontSize: 13 }}>
                                            <span>Valid until {pageData.expired}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="text-center">
                                        <div className="button-apply">
                                            <Button className="button-style" onClick={() => setOpenPanel(true)}>
                                                APPLY
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                            </td>
                        </tr>
                    </tbody>
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