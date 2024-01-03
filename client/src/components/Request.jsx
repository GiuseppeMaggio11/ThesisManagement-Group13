import { Button, Card, Col, Container, OverlayTrigger, Row } from "react-bootstrap";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { Calendar, Pencil, X } from "react-bootstrap-icons";
import dayjs from "dayjs";
import Loading from "./Loading";
import randomcolor from "randomcolor";
import API from "../API";
import NoFileFound from "./NoFileFound";
import {
    Check2,
    XLg
} from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";

function RequestsPage(props) {
    const [requestList, setRequestList] = useState([])
    const isMobile = useMediaQuery({ maxWidth: 767 });

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

    return props.loading ? (
        <Loading />
    ) : (
        <Container className=" d-flex p-4">
            <Row className="fs-2 mb-2">
                Requests
            </Row>
            <Row style={{marginTop:'3em'}}>
                {requestList.length > 0 ?
                    (requestList?.map((req, index) => {
                        return (
                            <RequestCard key={index} request={req} isMobile={isMobile} isSecretary={props.user.user_type==='SECR'?true:false}/>
                        )

                    })) : <NoFileFound message={"No request found"} />
                }
            </Row>
        </Container>
    )
}

function RequestCard(props) {
    const { request, isMobile,isSecretary } = props
    console.log(request)
    return (
        <Col xs={12} md={12} lg={6} xl={4} xxl={4} className="mt-4">
            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ cursor: 'pointer' }}
            >
                <Card style={{ padding: 20, paddingTop: 15 }} className="custom-card-proposals">
                    <Card.Header style={{ padding: 0, backgroundColor: 'white', borderBottom: 'none' }} >
                        <Col className="text-end">
                            <span
                                className="badge"
                                style={{
                                    backgroundColor: randomcolor({
                                        seed: request.student_id + (Number((request.student_id).slice(1)) / 3) * 7,
                                        luminosity: "bright",
                                        format: "rgba",
                                        alpha: 1,
                                    }).replace(/1(?=\))/, "0.1"),
                                    color: randomcolor({
                                        seed: request.student_id + (Number((request.student_id).slice(1)) / 3) * 7,
                                        luminosity: "bright",
                                        format: "rgba",
                                        alpha: 1,
                                    }),
                                    padding: "0.5em 1.2em",
                                    borderRadius: "0.25rem",
                                    marginRight: 10,
                                }}
                            >
                                {request.student_id}
                            </span>
               
                            {isSecretary && <span
                                className="badge"
                                style={{
                                    backgroundColor: randomcolor({
                                        seed: request.supervisor_id + (Number((request.supervisor_id).slice(1)) / 3) * 7,
                                        luminosity: "bright",
                                        format: "rgba",
                                        alpha: 1,
                                    }).replace(/1(?=\))/, "0.1"),
                                    color: randomcolor({
                                        seed: request.supervisor_id + (Number((request.supervisor_id).slice(1)) / 3) * 7,
                                        luminosity: "bright",
                                        format: "rgba",
                                        alpha: 1,
                                    }),
                                    padding: "0.5em 1.2em",
                                    borderRadius: "0.25rem",
                                    marginRight: 10,
                                }}
                            >
                                {request.supervisor_id}
                            </span>}
                        </Col> 
                    </Card.Header>
                    <Row>
                        <Col xs={8}>
                            <Row>
                                <div
                                    className="title-custom-proposals"
                                    /* onClick={() => navigate("/viewproposal/" + request.id)} */
                                    style={{
                                        fontWeight: "medium",
                                        fontSize: 20,
                                        cursor: "pointer",
                                    }}
                                >
                                    {request.title}
                                </div>
                            </Row>
                            <Row>
                                <Col xs={12} md={12} lg={12}>
                                    <div
                                        className="title-custom-proposals"
                                        style={{
                                            fontWeight: "medium",
                                            fontSize: 15,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span>{'by '}</span>
                                        <span style={{ fontWeight: 500 }}>{request.student_fullname}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-end mx-2">
                            <Row style={{ marginTop: '1em' }}>
                                <Col xs={6} md={4} lg={4} xl={6}>
                                    {isMobile ? <Check2 style={{ fontSize: 20 }} /> :
                                        <>
                                            {/* <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                    /* overlay={renderTooltipEdit
                                    > */}
                                            <Button
                                                variant="light"
                                            /*  onClick={() => {
                                                 navigate("/copyproposal/" + request.id);
                                             }} */
                                            >
                                                <Check2 />
                                            </Button>
                                            {/* </OverlayTrigger> */}
                                        </>}



                                </Col>
                                <Col xs={6} md={4} lg={4} xl={6}>

                                    {isMobile ? <XLg style={{ fontSize: 15 }} /> :
                                        <>
                                            {/*  <OverlayTrigger
                                        placement="bottom"
                                    overlay={renderTooltipCopy}
                                    > */}
                                            <Button
                                                variant="light"
                                            /*  onClick={() => {
                                                 navigate("/copyproposal/" + request.id);
                                             }} */
                                            >
                                                <XLg />
                                            </Button>

                                            {/* </OverlayTrigger> */}
                                        </>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <div
                        className="hide-scrollbar"
                        style={{
                            fontWeight: "semi-bold",
                            fontSize: 14,
                            height: !isMobile ? 25 : 40,
                            marginTop: 5,
                        }}
                    >
                    </div>
                    <div
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                            minHeight: 50,
                        }}
                    >
                        {request.description.length > (isMobile ? 100 : 600) ? (
                            <>
                                <span>
                                    {request.description.substring(
                                        0,
                                        isMobile ? 100 : 600
                                    ) + "..... "}
                                </span>
                                <span className="description-read-more">
                                    Read more
                                </span>
                            </>
                        ) : (
                            request.description
                        )}
                    </div>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col xs={6} md={6} lg={6}>
                            <span>Thesis Level</span>
                        </Col>
                        <Col>
                            <span
                                style={{
                                    color: "black",
                                }}
                                className="badge"
                            >
                                {request.thesis_level.toUpperCase()}
                            </span>
                        </Col>
                    </Row>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col xs={6} md={6} lg={6}>
                            <span>Thesis Type</span>
                        </Col>
                        <Col>
                            <span
                                style={{
                                    color: "black",
                                }}
                                className="badge"
                            >
                                {request.thesis_type.toUpperCase()}
                            </span>
                        </Col>
                    </Row>
                    <Row
                        style={{
                            fontSize: 16,
                            marginTop: 16,
                        }}
                    >
                        <Col xs={6} md={6} lg={6}>
                            <span>Code Degree</span>
                        </Col>
                        <Col>
                            <span className="badge" style={{ color: "black" }}>
                                {request.cod_degree}
                            </span>
                        </Col>
                    </Row>
                </Card>
            </motion.div>
        </Col>
    )
}
export default RequestsPage

