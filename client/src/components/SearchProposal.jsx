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
import { HoverIconButton } from "./HoverIconButton";
import { Funnel, FunnelFill, Search } from "react-bootstrap-icons";
import dayjs from "dayjs";

import API from "../API";

import { FilterCard } from "./FilterCard";

function SearchProposalRoute(props) {
  const [thesisProposals, setThesisProposals] = useState([]);
  const { handleToast } = useContext(MessageContext)


  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(
    () => {
      props.setLoading(true);
      //if (dirtyThesisProposals) 
      API.getThesisProposals(props.virtualClock)
        .then((list) => {
          console.log(list)
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
          setLoading={props.setLoading}
          loadind={props.loading}
          virtualClock={props.virtualClock}
        />
      )}
    </>
  );
}

function SearchProposalComponent(props) {
  const [filter, setFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false)
  const [filteredThesisProposals, setFilteredThesisProposals] = useState([
    ...props.thesisProposals,
  ]);

  useEffect(() => {
    setFilteredThesisProposals([...props.thesisProposals]);
  }, [props.thesisProposals]);

  const handleCancel = () => {
    setFilter("");
    setFilteredThesisProposals([...props.thesisProposals]);
  };
  const handleChangeFilter = () => {
    const filter = !showFilters
    setShowFilters(filter)
  }

  const handleFilterTitle = (event) => {
    const value = event.target.value;
    setFilter(value);

    let filtered = []

    filtered = [...props.thesisProposals];

    if (value.trim() !== '') {
      const lowercaseFilter = value.toLowerCase();

      filtered = filtered.filter(thesis =>
        thesis.title.toLowerCase().includes(lowercaseFilter)
      );
    }

    setFilteredThesisProposals(filtered);
  };


  return (
    <>
      <div className="d-flex justify-content-center">
        <Container className="width-80 margin-custom">
          <Row className="d-flex align-items-center">
            <Col xs={6} className="d-flex justify-content-between align-items-center">
              <h1 className={`margin-titles-custom ${props.isMobile ? 'smaller-heading' : ''}`}>
                Thesis Proposals
              </h1>
            </Col>
            <Col xs={6} className="d-flex justify-content-end">
              <Col xs={6} className="d-flex px-4 justify-content-end align-items-end">
                <Form.Group className="d-flex align-items-center position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by name"
                    value={filter}
                    onChange={(e)=>{handleFilterTitle(e) }}
                    className="custom-input"
                  />
                  {filter && (
                    <button className="clear-btn" onClick={handleCancel} disabled={showFilters}>
                      <span>&times;</span>
                    </button>
                  )}
                </Form.Group>
              </Col>
              <Col xs={1} className="d-flex justify-content-start align-items-center">
                <Form.Group>
                  <Search className="button-style-filter" />
                </Form.Group>
              </Col>
              <Col xs={2} className="d-flex justify-content-start align-items-center">
                <Form.Group>
                  {!showFilters && <Funnel className={"button-style-filter"} onClick={handleChangeFilter}></Funnel>}
                  {showFilters && <FunnelFill className={"button-style-filter"} onClick={handleChangeFilter}></FunnelFill>}
                </Form.Group>
              </Col>
            </Col>
          </Row>
          {showFilters &&
            <Container >
              <Row >
                <Col xs={12} style={{ marginBottom: '0.5em' }}>
                  <FilterCard
                    virtualClock={props.virtualClock}
                    thesisList={props.thesisProposals}
                    loading={props.loading}
                    setLoading={props.setLoading}
                    showFilters={showFilters}
                    setProposals={setFilteredThesisProposals}
                    
                  />
                </Col >
              </Row>
            </Container>
          }




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
            </Row>) : (
            <Row>
              <Accordion>
                {[...filteredThesisProposals].map((element) => (
                  <ProposalAccordion key={element.id} proposal={element} />
                ))}
              </Accordion>
            </Row>
          )}
        </Container>
      </div >
    </>)
}

function ProposalAccordion(props) {
  return (
    <Accordion.Item eventKey={props.proposal.id.toString()}>
      <Accordion.Header>
        <span className="my-3">
          <Link style={{ color: '#4682B4', fontSize: 18 }} to={`/proposals/${props.proposal.id}`}>
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
    <tr onClick={() => navigation(`/proposals/${props.proposal.id}`)}>
      <td>
        <Link style={{ color: '#4682B4', fontSize: 18 }} to={`/proposals/${props.proposal.id}`}>
          {props.proposal.title}
        </Link>
      </td>
      <td style={{ fontSize: 18 }}>{props.proposal.supervisor}</td>
      <td style={{ fontSize: 18 }}>{dayjs(props.proposal.expiration).format("YYYY-MM-DD")}</td>
    </tr>
  );
}

export default SearchProposalRoute;
