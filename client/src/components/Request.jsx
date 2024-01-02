import { Button, Card, Col, Container, OverlayTrigger, Row } from "react-bootstrap";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { Calendar,Pencil } from "react-bootstrap-icons";
import dayjs from "dayjs";
import Loading from "./Loading";
import randomcolor from "randomcolor";
import API from "../API";



function RequestsPage(props) {
    const [requestList, setRequestList] = useState([])
    

    useEffect(() => {
        async function getRquests() {
            props.setLoading(true);
            try {
                if (props.user && props.user.user_type === "PROF") {
                    let result = await API.getRequestsForProfessor()
                    setRequestList(result)
                }
                if (props.user && props.user.user_type === "SECR") {
                    let result = await API.getRequestsForSecretary()
                    setRequestList(result)
                }
            } catch (err) {
                //handleToast("Error while fetching requests", "error");
            }
        }
        getRquests()
        props.setLoading(false)
    }, [props.user]);



    /* return props.loading ? (
        <Loading />
      ) : (
        <Container className="p-4">
          <Row className="justify-content-between">
            <Col xs={8} className="fs-2">
              Requests
            </Col>
        </Row>
        {
            requestList?.map((req, index)=>{
                <RequestCard index={index} request={req}/>
            })
        }  
        </Container>
      ) */
      return(
        <h1>Requests</h1>
      )
}

function RequestCard(props){
    const {request} = props

    return(
    <Col xs={12} md={12} lg={12} xl={12} xxl={12} className="mt-4">
            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ cursor: 'pointer' }}
            >
                <Card style={{ padding: 20 }} className="custom-card-proposals">
                    <Row>
                        <Col style={{ minWidth: "300px" }}>
                            <div
                                className="title-custom-proposals"
                                /* onClick={() => navigate("/viewproposal/" + props.proposal.id)} */
                                style={{
                                    fontWeight: "medium",
                                    fontSize: 20,
                                    cursor: "pointer",
                                }}
                            >
                                {request.title}
                            </div>
                        </Col>
                        <Col className="text-end mx-2">
                            <Row>
                                <Col xs={6} md={6} lg={3}>
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        /* overlay={renderTooltipEdit} */
                                    >
                                        <Button
                                            variant="light"
                                          /*   onClick={() => {
                                                navigate("/updateproposal/" + props.proposal.id);
                                            }} */
                                        >
                                            {!props.isMobile && <span className="mx-2">Accept</span>}
                                            {/* <Pencil /> */}
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col xs={6} md={6} lg={3}>
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltipCopy}
                                    >
                                        <Button
                                            variant="light"
                                            onClick={() => {
                                                navigate("/copyproposal/" + props.proposal.id);
                                            }}
                                        >
                                            {!props.isMobile && <span className="mx-2">Copy</span>}
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
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div
                        className="hide-scrollbar"
                        style={{
                            fontWeight: "semi-bold",
                            fontSize: 14,
                            height: !props.isMobile ? 25 : 40,
                            marginTop: 5,
                        }}
                    >
                        {props.proposal.keywords &&
                            props.proposal.keywords.split(", ").map((key, index) => (
                                <span
                                    key={index}
                                    className="badge"
                                    style={{
                                        backgroundColor: randomcolor({
                                            seed: key,
                                            luminosity: "bright",
                                            format: "rgba",
                                            alpha: 1,
                                        }).replace(/1(?=\))/, "0.1"),
                                        color: randomcolor({
                                            seed: key,
                                            luminosity: "bright",
                                            format: "rgba",
                                            alpha: 1,
                                        }),
                                        padding: "0.5em 1.2em",
                                        borderRadius: "0.25rem",
                                        marginRight: 10,
                                    }}
                                >
                                    {key}
                                </span>
                            ))}
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                            minHeight: 50,
                        }}
                    >
                        {props.proposal.description.length > (props.isMobile ? 100 : 600) ? (
                            <>
                                <span>
                                    {props.proposal.description.substring(
                                        0,
                                        props.isMobile ? 100 : 600
                                    ) + "..... "}
                                </span>
                                <span
                                    className="description-read-more"
                                    onClick={() => navigate("/viewproposal/" + props.proposal.id)}
                                >
                                    Read more
                                </span>
                            </>
                        ) : (
                            props.proposal.description
                        )}
                    </div>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col style={{ maxWidth: "110px" }}>
                            <span>Thesis Level</span>
                        </Col>
                        <Col>
                            <span
                                style={{
                                    color: "black",
                                }}
                                className="badge"
                            >
                                {props.proposal.thesis_level.toUpperCase()}
                            </span>
                        </Col>
                    </Row>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col style={{ maxWidth: "110px" }}>
                            <span>Thesis Type</span>
                        </Col>
                        <Col>
                            <span
                                style={{
                                    color: "black",
                                }}
                                className="badge"
                            >
                                {props.proposal.thesis_type.toUpperCase()}
                            </span>
                        </Col>
                    </Row>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col style={{ maxWidth: "110px" }}>
                            <span>Expire at</span>
                        </Col>
                        <Col>
                            <span className="badge" style={{ color: "black" }}>
                                {dayjs(props.proposal.expiration).format("MM/DD/YYYY")}
                            </span>
                            <Calendar />
                        </Col>
                    </Row>
                </Card>
            </motion.div>
        </Col>
    )
}
export default RequestsPage

