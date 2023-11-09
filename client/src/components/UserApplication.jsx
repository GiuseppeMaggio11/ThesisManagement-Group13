import { Container, Row, Col, Table, Accordion} from "react-bootstrap";
import { useState } from "react";
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
                    <Accordion defaultActiveKey={['0','1','2','3','4','5','6','7']} alwaysOpen>
                       { pageData.supervisor && 
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>SUPERVISOR</Accordion.Header>
                            <Accordion.Body>
                                {pageData.supervisor}
                            </Accordion.Body>
                        </Accordion.Item>
                        }
                        { pageData.coSupervisor && 
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>CO-SUPERVISOR</Accordion.Header>
                            <Accordion.Body>
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
                            <Accordion.Body>
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
                            <Accordion.Body>
                                {pageData.type}
                            </Accordion.Body>
                        </Accordion.Item>
                        {pageData.groups && 
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>GROUPS</Accordion.Header>
                                <Accordion.Body>
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
                            <Accordion.Body>
                                {pageData.description}
                            </Accordion.Body>
                        </Accordion.Item>
                        {pageData.requiredKnowledge && 
                            <Accordion.Item eventKey="6">
                                <Accordion.Header>REQUIRED KNOWLEDGE</Accordion.Header>
                                <Accordion.Body>
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
                                <Accordion.Body>
                                    {pageData.notes}
                                </Accordion.Body>
                            </Accordion.Item> 
                        }
                    </Accordion>
                   </tr>
                    <tr class="footer_application">
                        Experation: {pageData.expired} Level: {pageData.level}
                    </tr>
                </tbody>
            </Table>
        </Container>
      </>
    );
  }

  export default UserApplication;