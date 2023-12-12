import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import MessageContext from "../messageCtx";
import {
  Calendar,
  Dice1,
  Funnel,
  FunnelFill,
  Person,
  PersonFill,
  Search,
} from "react-bootstrap-icons";
import dayjs from "dayjs";

import API from "../API";

import { FilterCard } from "./FilterCard";
import Loading from "./Loading";
import randomColor from "randomcolor";

function SearchProposalRoute(props) {
  const [thesisProposals, setThesisProposals] = useState([]);
  const { handleToast } = useContext(MessageContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!props.loggedIn || props.user.user_type !== "STUD")
    return API.redirectToLogin();

  useEffect(() => {
    props.setLoading(true);
    //if (dirtyThesisProposals)
    API.getThesisProposals(props.virtualClock)
      .then((list) => {
        // console.log(list);
        setThesisProposals(list);
        //setDirtyThesisProposals(false);
        props.setLoading(false);
      })
      .catch((err) => handleToast(err, "error"));
    //}
  }, []);

  return (
    <>
      {props.loading ? (
        <Loading />
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
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [titleFilters, setTitleFilters] = useState(false);
  const [filteredThesisProposals, setFilteredThesisProposals] = useState([
    ...props.thesisProposals,
  ]);
  const [filteredByTitle, setFilteredByTitle] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCosupervisor, setSelectedCosupervisor] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState([]);
  const [selectedTitlesWords, setSelectedTitlesWords] = useState([]);

  useEffect(() => {
    setFilteredThesisProposals([...props.thesisProposals]);
  }, [props.thesisProposals]);

  const handleCancel = () => {
    setFilter("");
    setFilteredThesisProposals([...props.thesisProposals]);
  };
  const handleChangeFilter = () => {
    const f = !showFilters;
    setShowFilters(f);
  };

  const handleFilterTitle = (event) => {
    const value = event.target.value;
    setFilter(value);

    let filtered = [];

    filtered = [...props.thesisProposals];

    if (value.trim() !== "") {
      const lowercaseFilter = value.toLowerCase();

      filtered = filtered.filter((thesis) =>
        thesis.title.toLowerCase().includes(lowercaseFilter)
      );
      setFilteredByTitle(filtered);
    } else {
      setFilteredByTitle([]);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <Container className="width-80 margin-custom">
          <Row className="d-flex align-items-center">
            <Col
              xs={4}
              className="d-flex justify-content-between align-items-center"
            >
              <h1
                className={`margin-titles-custom ${
                  props.isMobile ? "smaller-heading" : ""
                }`}
              >
                Thesis Proposals
              </h1>
            </Col>
            <Col xs={8} className="d-flex justify-content-end">
              <Col
                xs={6}
                className="d-flex justify-content-end align-items-end"
              >
                {!advancedFilters && (
                  <Form.Group className="d-flex align-items-center position-relative">
                    <Form.Control
                      type="text"
                      placeholder={
                        props.isMobile ? "Search.." : "Search by name"
                      }
                      value={filter}
                      onChange={(e) => {
                        handleFilterTitle(e);
                      }}
                      className="custom-input"
                    />
                    {filter && (
                      <button
                        className="clear-btn"
                        onClick={handleCancel}
                        disabled={showFilters}
                      >
                        <span>&times;</span>
                      </button>
                    )}
                  </Form.Group>
                )}
              </Col>

              <Col
                xs={2}
                className="d-flex px-2 justify-content-start align-items-center"
              >
                <Form.Group>
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    {!showFilters && !advancedFilters && (
                      <Funnel
                        className={"button-style-filter"}
                        onClick={handleChangeFilter}
                      />
                    )}
                    {showFilters && !advancedFilters && (
                      <FunnelFill
                        className={"button-style-filter"}
                        onClick={handleChangeFilter}
                      />
                    )}
                    {advancedFilters && (
                      <>
                        <FunnelFill
                          className={"button-style-filter"}
                          onClick={handleChangeFilter}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "-2px",
                            right: "-4px",
                            borderRadius: "50%",
                            width: "10px",
                            height: "10px",
                            backgroundColor: "orange",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <span></span>
                        </div>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Col>
          </Row>
          {showFilters && (
            <Container>
              <Row>
                <Col xs={12} style={{ marginBottom: "0.5em" }}>
                  <FilterCard
                    virtualClock={props.virtualClock}
                    thesisList={props.thesisProposals}
                    loading={props.loading}
                    setLoading={props.setLoading}
                    showFilters={showFilters}
                    setProposals={setFilteredThesisProposals}
                    selectedGroups={selectedGroups}
                    setSelectedGroups={setSelectedGroups}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedCosupervisor={selectedCosupervisor}
                    setSelectedCosupervisor={setSelectedCosupervisor}
                    selectedKeywords={selectedKeywords}
                    setSelectedKeywords={setSelectedKeywords}
                    selectedSupervisor={selectedSupervisor}
                    setSelectedSupervisor={setSelectedSupervisor}
                    selectedTitlesWords={selectedTitlesWords}
                    setSelectedTitlesWords={setSelectedTitlesWords}
                    setAdvancedFilters={setAdvancedFilters}
                    setShowFilters={setShowFilters}
                  />
                </Col>
              </Row>
            </Container>
          )}

          {/*!props.isMobile ? (
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
                      {filteredByTitle.length <= 0 &&
                        filter === "" &&
                        [...filteredThesisProposals].map((element) => (
                          <ProposalTableRow
                            key={element.id}
                            proposal={element}
                          />
                        ))}
                      {filteredByTitle.length <= 0 && filter !== "" && (
                        <h2 className="mt-3"> no proposals found</h2>
                      )}
                      {filteredByTitle.length > 0 &&
                        [...filteredByTitle].map((element) => (
                          <ProposalTableRow
                            key={element.id}
                            proposal={element}
                          />
                        ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          ) : (
            <Row style={{ marginBottom: "5rem" }}>
              <Accordion>
                {filteredByTitle.length <= 0 &&
                  filter === "" &&
                  [...filteredThesisProposals].map((element) => (
                    <ProposalAccordion key={element.id} proposal={element} />
                  ))}
                {filteredByTitle.length <= 0 && filter !== "" && (
                  <h2 className="mt-3"> no proposals found</h2>
                )}
                {filteredByTitle.length > 0 &&
                  [...filteredByTitle].map((element) => (
                    <ProposalAccordion key={element.id} proposal={element} />
                  ))}
              </Accordion>
            </Row>
                  )*/}
          <Row>
            <Col>
              {filteredThesisProposals.length == 0 ? (
                <h2>No proposal found</h2>
              ) : (
                <Row>
                  <Col>
                    <Row>
                      {filteredByTitle.length <= 0 &&
                        filter === "" &&
                        [...filteredThesisProposals].map((element) => (
                          <Proposal key={element.id} proposal={element} />
                        ))}
                      {filteredByTitle.length <= 0 && filter !== "" && (
                        <Col>
                          <h2 className="mt-3"> no proposals found</h2>
                        </Col>
                      )}
                      {filteredByTitle.length > 0 &&
                        [...filteredByTitle].map((element) => (
                          <Proposal
                            key={element.id}
                            proposal={element}
                            isMobile={props.isMobile}
                          />
                        ))}
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

function Proposal(props) {
  const navigate = useNavigate();

  return (
    <Col xs={12} md={12} lg={6} xl={6} xxl={6} className="mt-4">
      <Card
        style={{ padding: 20, minHeight: "350px" }}
        className="custom-card-proposals"
      >
        <Row>
          <Col style={{ minWidth: "300px" }}>
            <div
              className="title-custom-proposals"
              onClick={() => navigate(`/proposals/${props.proposal.id}`)}
              style={{
                fontWeight: "medium",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {props.proposal.title}
            </div>
          </Col>
          <Col className="text-end mx-2">
            <PersonFill size={25} />
            <span>
              {props.proposal.supervisor.split(" ")[1] +
                " " +
                props.proposal.supervisor.split(" ")[0]}
            </span>
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
            props.proposal.keywords.map((key, index) => (
              <span
                key={index}
                className="badge"
                style={{
                  backgroundColor: randomColor({
                    seed: key,
                    luminosity: "bright",
                    format: "rgba",
                    alpha: 1,
                  }).replace(/1(?=\))/, "0.1"),
                  color: randomColor({
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
          {props.proposal.description}
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
              {props.proposal.level && props.proposal.level.toUpperCase()}
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
              {props.proposal.type && props.proposal.type.toUpperCase()}
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
    </Col>
  );
}

function ProposalTableRow(props) {
  const navigation = useNavigate();
  return (
    <tr onClick={() => navigation(`/proposals/${props.proposal.id}`)}>
      <td>
        <Link
          style={{ color: "#4682B4", fontSize: 18, textDecoration: "none" }}
          to={`/proposals/${props.proposal.id}`}
        >
          {props.proposal.title}
        </Link>
      </td>
      <td style={{ fontSize: 18 }}>{props.proposal.supervisor}</td>
      <td style={{ fontSize: 18 }}>
        {dayjs(props.proposal.expiration).format("MM/DD/YYYY")}
      </td>
    </tr>
  );
}

export default SearchProposalRoute;
