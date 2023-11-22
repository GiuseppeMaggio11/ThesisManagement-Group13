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
import { Funnel, FunnelFill } from "react-bootstrap-icons";
import dayjs from "dayjs";

import API from "../API";
import { Search } from "react-bootstrap-icons";
import { FilterCard } from "./FilterCard";

function SearchProposalRoute(props) {
  const [thesisProposals, setThesisProposals] = useState([]);
  const { handleToast } = useContext(MessageContext)

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

  const handleSubmit = (event) => {
    if (event) {
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

  const handleChangeFilter = () => {
    const filter = !showFilters
    setShowFilters(filter)
  }


  return (
    <>
      <div className="d-flex justify-content-center">
        <Container className="width-80 margin-custom">
          <Row className="align-items-center">
            <Col xs={12} className="d-flex justify-content-between align-items-center">
              <h1 className={`margin-titles-custom ${props.isMobile ? 'smaller-heading' : ''}`}>
                Thesis Proposals
              </h1>

              {!showFilters && <Funnel className={"button-style-filter"} onClick={handleChangeFilter}></Funnel>}
              {showFilters && <FunnelFill className={"button-style-filter"} onClick={handleChangeFilter}></FunnelFill>}
            </Col>
          </Row>
          {showFilters &&
          <Container >
            <Row >
              <Col xs={12} style={{marginBottom:'0.5em'}}>
                <FilterCard
                  virtualClock={props.virtualClock}
                  thesisList={props.thesisProposals}
                  loading={props.loading}
                  setLoading={props.setLoading}
                  showFilters={showFilters}
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
