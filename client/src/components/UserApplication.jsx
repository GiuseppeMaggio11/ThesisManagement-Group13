import { Container, Row, Col, Table, Accordion} from "react-bootstrap";
import { useState } from "react";
import Loading from "./Loading";

function UserApplication(props) {
    const [pageData, setPageData] = useState({
        title:"TITOLO TESI",
        supervisor:"LUCA POLLONI",
        coSupervisor:"MURO LOII"
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
                    <Accordion defaultActiveKey={['0','1']} alwaysOpen>
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
                                {pageData.coSupervisor}
                            </Accordion.Body>
                        </Accordion.Item>
                        }
                    </Accordion>
                   </tr>
                </tbody>
            </Table>
        </Container>
      </>
    );
  }

  export default UserApplication;