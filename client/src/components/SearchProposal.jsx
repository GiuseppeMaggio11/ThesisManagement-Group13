import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";

import dayjs from "dayjs";

import API from "../API";



function SearchProposalRoute(props) {
    const [thesisProposals, setThesisProposals] = useState([]);
    //const [dirtyThesisProposals, setDirtyThesisProposals] = useState(true);



    useEffect(() => {
        //if (dirtyThesisProposals) {
          API.getThesisProposals()
            .then((list) => { 
                setThesisProposals(list); 
                //setDirtyThesisProposals(false);
            })
            .catch((err) => props.handleError(err))
        //}
    }, [/*dirtyThesisProposals*/]);

    console.log(thesisProposals)

    return (
        <>
            {props.error ? <Alert variant="danger" dismissible className="margin-custom" onClose={props.resetError}>
                {props.error}</Alert> : null}
            {(props.error || props.loading) ? <Spinner className="m-2" animation="border" role="status" /> :
                <SearchProposalComponent thesisProposals={thesisProposals} />
            }
        </>
    )
}



function SearchProposalComponent(props) {
    const [filter, setFilter] = useState("");
    const [filteredThesisProposals, setFilteredThesisProposals] = useState([...props.thesisProposals]);



    useEffect(() => {
        setFilteredThesisProposals([...props.thesisProposals]);
    }, [props.thesisProposals]);



    const handleSubmit = (event) => {
        event.preventDefault();

        setFilteredThesisProposals(
            props.thesisProposals.filter((proposal) => {
                const filterLowerCase = filter.toLowerCase();

                return Object.entries(proposal).some(([key, value]) => {
                    if (key === "id") {
                        return false; // Exclude the "id" field
                    }
                    
                    if (Array.isArray(value)) {
                        // If the value is an array, check if the filter is present in at least one of the elements
                        return value.some((item) => {
                            if (typeof item === "object" && item !== null) {
                                // If the item is an object, search within its properties
                                return Object.values(item).some((nestedValue) => {
                                    if (typeof nestedValue === "string" || typeof nestedValue === "number") {
                                        return nestedValue.toString().toLowerCase().includes(filterLowerCase);
                                    }
                                    else if (dayjs.isDayjs(nestedValue)) {
                                        return dayjs(nestedValue).format("YYYY-MM-DD").includes(filterLowerCase);
                                    }
                                    return false;
                                });
                            } else if (typeof item === "string" || typeof item === "number") {
                                // If the item is a string or number, handle the normal search
                                return item.toString().toLowerCase().includes(filterLowerCase);
                            } else if (dayjs.isDayjs(item)) {
                                // If the item is a date handled by dayjs
                                return dayjs(item).format("YYYY-MM-DD").includes(filterLowerCase);
                            }
                        });
                    } else if (typeof value === "string" || typeof value === "number") {
                        // If the value is a string or number, handle the normal search
                        return value.toString().toLowerCase().includes(filterLowerCase);
                    } else if (dayjs.isDayjs(value)) {
                        // If the value is a date handled by dayjs
                        return dayjs(value).format("YYYY-MM-DD").includes(filterLowerCase);
                    }
                    
                    return false;
                });   
            })
        );
    }

    const handleCancel = () => {
        setFilter(""); 
        setFilteredThesisProposals([...props.thesisProposals]);
    }



    return (
        <Container className="margin-custom">
            <Row>
                <Col>
                    <h1 className="margin-titles-custom">Thesis Proposals</h1>
                </Col>
                <Col className="d-flex align-self-center justify-content-end">
                    <Form className="d-flex" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 me-2 d-flex align-items-center">
                            <Form.Label className="me-2 mb-0">Filter: </Form.Label>
                            <Form.Control type="text" placeholder="Insert a filter" value={filter} onChange={(event) => setFilter(event.target.value)} />
                        </Form.Group>
                        <Button className="mb-3 margin-buttons-custom" variant="success" type="submit">
                            Search
                        </Button>
                        <Button className="mb-3 margin-buttons-custom" variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {filteredThesisProposals.length == 0 ?
                        <h2>No proposal found</h2> :
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th className="d-none d-md-table-cell">Supervisor</th>
                                    <th className="d-none d-md-table-cell">Expiration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {

                                    [...filteredThesisProposals].map((element) =>
                                        <ProposalTableRow key={element.id} proposal={element} />
                                    )
                                }
                            </tbody>
                        </Table>
                    }
                </Col>
            </Row>
        </Container>
    )
}

function ProposalTableRow(props) {
    const navigate = useNavigate();

    return (
        <tr>
            <td><Button variant="link" onClick={() => navigate(`/proposals/${props.proposal.id}`)}>{props.proposal.title}</Button></td>
            <td className="d-none d-md-table-cell">{props.proposal.supervisor}</td>
            <td className="d-none d-md-table-cell">{dayjs(props.proposal.expiration).format("YYYY-MM-DD")}</td>
        </tr>
    )
}

export default SearchProposalRoute;