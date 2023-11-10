import { Container, Table, Accordion, Button, Modal} from "react-bootstrap";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

import Loading from "./Loading";

function UserApplication(props) {
    const [pageData, setPageData] = useState({
        title:"TITOLO TESI",
        supervisor:"LUCA POLLONI",
        coSupervisor: ["Muro Loii", "Adato Gooli", "Laura Poll"],
        keywords : ["AUTOMATATION", "RESOLT"],
        type : "Sperimentale",
        groups : ["Gruppo 1", "Gruppo2"],
        requiredKnowledge : ["Python", "Java"],
        description : "Questa è la descrizione",
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

    useEffect(()=>{
        const init = async() => {
            try{
                //API TO RECEIVE DATA
            } catch (error){
                
            }
        }
        init()
        // setLoading(false)
    },[])
    
    const handleApplication = (event) => {
        event.preventDefault();
        //API calls to send data
    }

    return (
      <>
        {props.loading ? <Loading /> : ""}
        <Container>
            <Table striped className="navbarMargin">
                <thead class="head_tableApplication">
                    <tr class="colorStyle">
                        {pageData.title}
                    </tr>
                </thead>
                <tbody>
                   <tr>
                    <Accordion defaultActiveKey={['0','3','5','6']} alwaysOpen>
                       
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>SUPERVISOR</Accordion.Header>
                            <Accordion.Body className="margin_left_accordition">
                                {pageData.supervisor}
                            </Accordion.Body>
                        </Accordion.Item>
                        
                        { pageData.coSupervisor && 
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>CO-SUPERVISOR</Accordion.Header>
                            <Accordion.Body className="margin_left_accordition">
                                {pageData.coSupervisor.map((name, index)=>{
                                    if(index === pageData.coSupervisor.length -1){
                                        return name.toUpperCase()
                                    }
                                    return name.toUpperCase().concat(", ")})}
                            </Accordion.Body>
                        </Accordion.Item>
                        }
                        { pageData.keywords && 
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>KEY WORDS</Accordion.Header>
                            <Accordion.Body className="margin_left_accordition">
                                {pageData.keywords.map((element, index) => {
                                    if(index === pageData.keywords.length -1) {
                                        return <u key={index}> {element.toUpperCase()} </u>
                                    }
                                    return <u key={index}> {element.toUpperCase().concat(", ")} </u>})}
                            </Accordion.Body>
                        </Accordion.Item>
                        }
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>TYPE</Accordion.Header>
                            <Accordion.Body className="margin_left_accordition">
                                {pageData.type}
                            </Accordion.Body>
                        </Accordion.Item>
                        {pageData.groups && 
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>GROUPS</Accordion.Header>
                                <Accordion.Body className="margin_left_accordition">
                                    {pageData.groups.map((name, index)=>{
                                        if(index === pageData.groups.length -1){
                                            return name.toUpperCase()
                                        }
                                        return name.toUpperCase().concat(", ")})}
                                </Accordion.Body>
                            </Accordion.Item> 
                        }
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>DESCRIPTION</Accordion.Header>
                            <Accordion.Body className="margin_left_accordition">
                                {pageData.description}
                            </Accordion.Body>
                        </Accordion.Item>
                        {pageData.requiredKnowledge && 
                            <Accordion.Item eventKey="6">
                                <Accordion.Header>REQUIRED KNOWLEDGE</Accordion.Header>
                                <Accordion.Body className="margin_left_accordition">
                                    {pageData.requiredKnowledge.map((name, index)=>{
                                        if(index === pageData.groups.length -1){
                                            return name.toUpperCase()
                                        }
                                        return name.toUpperCase().concat(", ")})}
                                </Accordion.Body>
                            </Accordion.Item> 
                        }
                        {pageData.notes && 
                            <Accordion.Item eventKey="7">
                                <Accordion.Header>NOTES</Accordion.Header>
                                <Accordion.Body className="margin_left_accordition">
                                    {pageData.notes}
                                </Accordion.Body>
                            </Accordion.Item> 
                        }
                    </Accordion>
                   </tr>
                    <tr class="footer_application">
                        Experation: {pageData.expired} Level: {pageData.level}
                    </tr>
                    <td>
                        <div className="button-apply">
                            <Button variant="success" onClick={()=>setOpenPanel(true)}>APPLY</Button>
                        </div>
                    </td>
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
                    <Button variant="outline-danger"onClick={() => handleRemoveFile(index)}>
                        <i class="bi bi-x-circle"></i>
                    </Button>
                </div>
                ))}
            </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="confirmation_application_div">Confirm application for {pageData.title} thesis?</div>
            
            <Button variant="danger" onClick={()=>setOpenPanel(false)}>
                Cancel
            </Button>
            <Button variant="primary" onClick={()=>handleApplication()}>
                Apply
            </Button>
            </Modal.Footer>
        </Modal>
        
      </>
    );
  }

  export default UserApplication;