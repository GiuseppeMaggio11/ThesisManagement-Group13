import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import MessageContext from '../messageCtx'
import dayjs from "dayjs";

import API from "../API";
import { HoverIconButton } from "./HoverIconButton";
import { Search } from "react-bootstrap-icons";

function SearchProposalRoute(props) {
  const [thesisProposals, setThesisProposals] = useState([]);
  const {handleToast} = useContext(MessageContext)
  //const [dirtyThesisProposals, setDirtyThesisProposals] = useState(true);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(
    () => {
      props.setLoading(true);
      //if (dirtyThesisProposals) 
      API.getThesisProposals(props.virtualClock)
        .then((list) => {
          setThesisProposals(list);
          //setDirtyThesisProposals(false);
          props.setLoading(false);
        })
        .catch((err) => handleToast(err, 'error'));
      //}
    },
    []
  );

  return (
    <>
      {props.loading ? (
        <Spinner className="m-2" animation="border" role="status" />
      ) : (
        <SearchProposalComponent
          thesisProposals={thesisProposals}
          isMobile={isMobile}
        />
      )}
    </>
  );
}

function SearchProposalComponent(props) {
  const [filter, setFilter] = useState("");
  const [filteredThesisProposals, setFilteredThesisProposals] = useState([
    ...props.thesisProposals,
  ]);

  useEffect(() => {
    setFilteredThesisProposals([...props.thesisProposals]);
  }, [props.thesisProposals]);

  const handleSubmit = (event) => {
    if(event){
      event.preventDefault();
    }

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
                  if (
                    typeof nestedValue === "string" ||
                    typeof nestedValue === "number"
                  ) {
                    return nestedValue
                      .toString()
                      .toLowerCase()
                      .includes(filterLowerCase);
                  } else if (dayjs.isDayjs(nestedValue)) {
                    return dayjs(nestedValue)
                      .format("YYYY-MM-DD")
                      .includes(filterLowerCase);
                  }
                  return false;
                });
              } else if (typeof item === "string" || typeof item === "number") {
                // If the item is a string or number, handle the normal search
                return item.toString().toLowerCase().includes(filterLowerCase);
              } else if (dayjs.isDayjs(item)) {
                // If the item is a date handled by dayjs
                return dayjs(item)
                  .format("YYYY-MM-DD")
                  .includes(filterLowerCase);
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
  };

  const handleCancel = () => {
    setFilter("");
    setFilteredThesisProposals([...props.thesisProposals]);
  };

  const handleBrowseApplications = () => {
    API.getApplicationStudent().then(
      (result) => { console.log(result) }
    ).catch((err) => { handleErrors(err)});
  }

  
    {/*<Container>
       <Row>
        <h1>Thesis Proposals</h1>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Group className="mb-3 me-2 d-flex align-items-center">
              <Form.Label className="me-2 mb-0">Filter: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Insert a filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
            </Form.Group>
            <Button className="mb-3 mx-3" variant="success" type="submit">
              Search
            </Button>
            <Button className="mb-3" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Form>
        </Col>
      </Row> */}
return(
<>
<div className="d-flex justify-content-center">
        <Container className="width-80 margin-custom">
          <Row className="align-items-center">
            <Col xs={12} className="d-flex justify-content-between align-items-center">
              <h1 className={`margin-titles-custom ${props.isMobile ? 'smaller-heading' : ''}`}>
                Thesis Proposals
              </h1>
              <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3 me-2 d-flex align-items-center position-relative">
                <Form.Control
                  type="text"
                  placeholder="Insert a filter"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  onKeyDown={(event) => {
                    console.log(event.key)
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleSubmit();
                    }
                  }}
                  className="custom-input" 
                />
                {filter && (
                  <button className="clear-btn" onClick={handleCancel}>
                    <span>&times;</span>
                  </button>
                )}
                <Search className="search-button" onClick={handleSubmit} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
       {!props.isMobile ? (
        <Row>
          <Col>
            {filteredThesisProposals.length == 0 ? (
              <h2>No proposal found</h2>
            ) : (
              <Table hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Supervisor</th>
                    <th>Expiration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredThesisProposals].map((element) => (
                    <ProposalTableRow key={element.id} proposal={element} />
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>):(
          <Row>
        <Accordion>
          {[...filteredThesisProposals].map((element) => (
            <ProposalAccordion key={element.id} proposal={element} />
          ))}
        </Accordion>
      </Row>
        )}
      <Button onClick={handleBrowseApplications}>
          Browse Applications
      </Button>
      </Container>
    </div>
    </>)
}

function ProposalAccordion(props) {
  return (
    <Accordion.Item eventKey={props.proposal.id.toString()}>
      <Accordion.Header>
        <span className="my-3">
          <Link style={{color:'#4682B4', fontSize:18}} to={`/proposals/${props.proposal.id}`}>
            {props.proposal.title}
          </Link>
        </span>
      </Accordion.Header>
      <Accordion.Body style={{ position: "relative" }}>
        <p>
          Supervisor: <b>{props.proposal.supervisor}</b>
        </p>
        <p>
          Expiration date:{" "}
          <b>{dayjs(props.proposal.expiration).format("YYYY-MM-DD")}</b>
        </p>
      </Accordion.Body>
    </Accordion.Item>
  );
}

function ProposalTableRow(props) {
  const navigation = useNavigate()
  return (
    <tr onClick={()=>navigation(`/proposals/${props.proposal.id}`)}>
      <td>
        <Link style={{color:'#4682B4', fontSize:18}} to={`/proposals/${props.proposal.id}`}>
          {props.proposal.title}
        </Link>
      </td>
      <td style={{fontSize:18}}>{props.proposal.supervisor}</td>
      <td style={{fontSize:18}}>{dayjs(props.proposal.expiration).format("YYYY-MM-DD")}</td>
    </tr>
  );
}

export default SearchProposalRoute;
