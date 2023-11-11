import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { useState } from "react";

import dayjs from "dayjs";



function SearchProposalRoute(props) {
    const [thesisProposals, setThesisProposals] = useState([
        {
            id: 1,
            title: "Ciao",
            description: "This thesis is about tomatoes",
            supervisor: "Paolo",
            level: "2",
            type: "bho",
            required_knowledge: "Know what a tomato is",
            notes: "You will get dirty",
            expiration: dayjs("2023-09-22"),
            keywords: [
                "Green",
                "Tomatoes",
                "Biological Agriculture"
            ],
            group: "Biological Agriculture Sub-Department",
            department: "Agriculture Department",
            co_supervisors: [
                "Giuseppe",
                "Matteo",
                "Sajjad",
                "Manuel"
            ]
        },
        {
            id: 2,
            title: "WWE master level",
            description: "This thesis is about WWE",
            supervisor: "Sajjad",
            level: "2",
            type: "whatever",
            required_knowledge: "Know what WWE is",
            notes: "You will gain muscles",
            expiration: dayjs("2023-06-09"),
            keywords: [
                "Muscle",
                "Gym",
                "Motor sciences"
            ],
            group: "WWE Sub-Department",
            department: "Motor Sciences Department",
            co_supervisors: [
                "Carla",
                "Matteo",
                "Jacopo",
                "Giuseppe"
            ]
        }
    ]);
    const [dirtyThesisProposals, setDirtyThesisProposals] = useState(true);



    /*useEffect(() => {
        if (dirtyThesisProposals) {
          API.getThesisProposals(thesisProposalFilters)
            .then((list) => setThesisProposals(list))
            .catch((err) => props.handleError(err))
        }
      }, [dirtyThesisProposals]);*/



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
    const [filteredThesisProposals, setFilteredThesisProposals] = useState(props.thesisProposals);



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
                            if (typeof item === "string" || typeof item === "number") {
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
        setFilteredThesisProposals(props.thesisProposals);
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
                                    <th>Supervisor</th>
                                    <th>Expiration Date</th>
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
            <td>{props.proposal.supervisor}</td>
            <td>{dayjs(props.proposal.expiration).format("YYYY-MM-DD")}</td>
        </tr>
    )
}

export default SearchProposalRoute;