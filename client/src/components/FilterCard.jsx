import React, { useContext, useEffect, useState, useRef } from "react";
import API from "../API";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import MessageContext from "../messageCtx";
import { ToastContainer } from "react-toastify";
import {
  Border,
  ChevronCompactDown,
  ChevronCompactUp,
  Search,
} from "react-bootstrap-icons";
import Loading from "./Loading";
import dayjs from "dayjs";
import { useMediaQuery } from "react-responsive";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';


const Chips2 = ({ items, selectedItems, setItems, setSelectedItems }) => {
  return (
    <div>
      {selectedItems.map((item, index) => (
        <span key={index} className="chip" style={{ fontSize: 12, alignItems:'center', paddingTop:0, paddingBottom:0}}>
          {item}
          <span
            className="chip-x"
            onClick={() => {
              const updatedItem = items.concat(item);
              const updatedSelectedItem = selectedItems.filter(
                (selectedItem) => selectedItem !== item
              );
              setItems(updatedItem);
              setSelectedItems(updatedSelectedItem);
              
            }}
          >
            x
          </span>
        </span>
      ))}
    </div>
  );
};

const SearchDropdown = ({
  placeholder,
  position,
  items,
  setItems,
  selectedItems,
  setSelectedItems,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();

    if (value === "") {
      setFilteredItems([]);
      setInput("");
    } else {
      setInput(value);
      setFilteredItems(
        items.filter((item) => {
          const fullName = `${item}`.toLowerCase();

          if (fullName.includes(" ")) {
            const parts = fullName.split(" ");
            return parts.some((part) => part.startsWith(value));
          } else {
            return fullName.startsWith(value);
          }
        })
      );
    }
    setShowDropdown(true);
  };

  const handleItemClick = (item) => {
    //console.log(selectedItems)
    let newSelectedItems = [...selectedItems, item];
    //console.log(item)
    let is = items.filter((i) => !newSelectedItems?.includes(i));

    setItems(is);
    setSelectedItems(newSelectedItems);
    setInput("");
    setShowDropdown(false);
  };

  return (
    <div className="mt-0 p-2 py-0" style={{ marginBottom: "0.5em" }}>
      <Row>
        <Col
          xs={4}
          className={`d-flex align-items-center justify-content-start`}
        >
          <p style={{ margin: "0px" }}>{placeholder}: </p>
        </Col>
        <Col xs={8} className="position-relative">
          <div className="input-group ">
            <input
              type="text"
              className="form-control custom-input-text"
              placeholder={placeholder}
              onChange={handleChange}
              value={input}
              style={{borderRight:'none'}}
            />
            <span className="input-group-text custom-input-text" style={{background:'white'}}>
              {!showDropdown && (
                <ChevronCompactDown
                  onClick={() => {
                    setShowDropdown(true);
                  }}
                />
              )}
              {showDropdown && (
                <ChevronCompactUp
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                />
              )}
            </span>
          </div>
        </Col>
      </Row>
      {showDropdown && (
        <div className="dropdown-container">
          <Row>
            <Col
              xs={4}
              className="d-flex justify-content-start align-items-center"
            ></Col>
            <Col ref={dropdownRef} xs={8} className="ml-4 dropdown-content">
              {filteredItems.length > 0 && (
                <ul className="list-group mt-2">
                  {filteredItems.map((item, index) => (
                    <li
                      className={`list-group-item`}
                      key={index}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                    </li>
                  ))}
                </ul>
              )}
              {input === "" && items.length > 0 && (
                <ul className="list-group mt-2">
                  {items.map((item, index) => (
                    <li
                      className={`list-group-item`}
                      key={index}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                    </li>
                  ))}
                </ul>
              )}
              {filteredItems.length <= 0 && input.length !== 0 && (
                <ul className="list-group mt-2">
                  <li className={`list-group-item`}>No results</li>
                </ul>
              )}
            </Col>
          </Row>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

const FilterCard = ({
  virtualClock,
  thesisList,
  loading,
  setLoading,
  showFilters,
  setProposals,
  selectedGroups,
  setSelectedGroups,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  selectedCosupervisor,
  setSelectedCosupervisor,
  selectedKeywords,
  setSelectedKeywords,
  selectedSupervisor,
  setSelectedSupervisor,
  selectedTitlesWords,
  setSelectedTitlesWords,
  setAdvancedFilters,
  setShowFilters,
}) => {
  const { handleToast } = useContext(MessageContext);
  const [reset, setReset] = useState(true);

  const [titles, setTitles] = useState([]);
  const [titleFilter, setTitleFilters] = useState("");
  const [supervisors, setSupervisors] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [cosupervisors, setCosupervisors] = useState(null);
  const [groups, setGroups] = useState([]);
  const [type, setType] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  useEffect(() => {
    const setFilters = async () => {
      let keywords_theses = [];
      let group_theses = [];
      let type_theses = [];
      let supervisors_theses = [];
      let cosupervisors = [];
 
      try {
        if (thesisList) {
          thesisList.forEach((item) => {
            if (item.type) {
              const typeExist = type_theses.some((t) => t === item.type);
              if (!typeExist) type_theses.push(item.type);
            }

            if (item.keywords.length > 0) {
              item.keywords.forEach((i) => {
                if (i != "" && i != " ") keywords_theses.push(i);
              });
            }
            if (item.supervisor) {
              const name = item.supervisor;

              const supervisorExists = supervisors_theses.some(
                (sup) => sup === name
              );

              if (!supervisorExists) {
                supervisors_theses.push(name);
              }
            }

            if (item?.cosupervisors?.length > 0) {

              item?.cosupervisors.forEach((element) => {            
                if (!cosupervisors.includes(element)) {
                  cosupervisors.push(element)
                }
              });
            }
            if (item.groups?.length > 0) {
              item.groups.forEach((i) => {
                let exist = group_theses.some((g) => g === i.group);
                if (!exist) group_theses.push(i.group);
              });
            }
          });
          
          setCosupervisors(cosupervisors);
          setType(type_theses);
          setKeywords(keywords_theses);
          setSupervisors(supervisors_theses);
          setGroups(group_theses);
        }
      } catch (error) {
        console.log(error);
        handleToast(error.error, "error");
      }
    };
    if (reset) {
      setLoading(true);
      setFilters();
      setReset(false);
    }
    setLoading(false);
  }, [reset, thesisList]);

  const handleReset = () => {
    setSelectedCosupervisor([]);
    setSelectedSupervisor([]);
    setSelectedGroups([]);
    setSelectedKeywords([]);
    setSelectedType([]);
    setSelectedDate(dayjs(virtualClock));
    setSelectedTitlesWords([]);
    setReset(true);
    setProposals(thesisList);
    setAdvancedFilters(false);
  };

  const handleFilter = () => {
    let filtered = [...thesisList];

    if (selectedTitlesWords?.length > 0) {
      filtered = filtered.filter((thesis) => {
        const titleLowerCase = thesis.title.toLowerCase();
        return selectedTitlesWords.some((word) =>
          titleLowerCase.includes(word.toLowerCase())
        );
      });
    }

    if (selectedSupervisor?.length > 0) {
      filtered = filtered.filter((thesis) =>
        selectedSupervisor.includes(thesis.supervisor)
      );
    }
    if (selectedDate != null) {
      // console.log("date diff");
      // console.log(selectedDate);
      filtered = filtered.filter((thesis) =>
        dayjs(thesis.expiration).isAfter(selectedDate)
      );
    }

    if (selectedCosupervisor?.length > 0) {
      filtered = filtered.filter((thesis) =>
        thesis.cosupervisors.some((cosup) =>
          selectedCosupervisor.includes(cosup)
        )
      );
    }

    if (selectedType?.length > 0) {
      filtered = filtered.filter((thesis) =>
        selectedType.includes(thesis.type)
      );
    }

    if (selectedKeywords?.length > 0) {
      filtered = filtered.filter((thesis) =>
        thesis.keywords.some((keyword) => selectedKeywords.includes(keyword))
      );
    }

    if (selectedGroups?.length > 0) {
      filtered = filtered.filter((thesis) =>
        thesis.groups.some((group) => selectedGroups.includes(group.group))
      );
    }

    setProposals(filtered);
    setAdvancedFilters(true);
    setShowFilters(false);
  };

  const addWord = () => {
    let words = [];
    if (selectedTitlesWords?.length > 0) words = [...selectedTitlesWords];
    let wordExists = words.some((w) => w === titleFilter);
    if (!wordExists) words.push(titleFilter);
    setTitleFilters("");
    setSelectedTitlesWords(words);
  };
  
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (scrollbarRef.current) {
      const ps = scrollbarRef.current;
      ps.scrollTo(ps.scrollWidth, 0);
    }
  }, [selectedTitlesWords]);


  return (
    <Card
      className="container mt-6 custom-rounded"
      style={{ marginBottom: "0.5em", paddingTop:"0.5em" }}
    >
      <Form>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gridGap: "10px",
          }}
        >
          <div
            className="mt-0 p-0"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Form.Label
                  className="chip-list"
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollBehavior: "smooth",
                    height: "2.5em",
                    overflowY: "hidden"
                  }}
                >
                  {selectedTitlesWords && selectedTitlesWords.length > 0 && (
                    <PerfectScrollbar containerRef={(ref) => (scrollbarRef.current = ref)}>
                      <Chips2
                        items={titles}
                        selectedItems={selectedTitlesWords}
                        setItems={setTitles}
                        setSelectedItems={setSelectedTitlesWords}
                      />
                    </PerfectScrollbar>
                  )}
                </Form.Label>
              </Form.Group>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Col
                xs={4}
                className="d-flex align-items-center justify-content-start"
              >
                <p style={{ margin: "0px", paddingLeft:'0.5em' }}>Title: </p>
              </Col>
              
              <Col xs={8} className="d-flex justify-content-end">
                <Form.Group style={{ width: "95%", paddingRight:'0.5em'}}>
                  <Form.Control
                    type="text"
                    placeholder={isMobile?"insert a text...":"insert a text and press enter"}
                    value={titleFilter}
                    onChange={(e) => {
                      setTitleFilters(e.target.value);
                    }}
                    className="custom-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addWord();
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Form.Label
                  className="chip-list"
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollBehavior: "smooth",
                    height: "2.5em",
                    overflowY: "auto"
                  }}
                  ref={(labelRef) => {
                    if (labelRef) {
                      labelRef.scrollLeft =
                        labelRef.scrollWidth - labelRef.clientWidth;
                    }
                  }}
                >
                  {selectedSupervisor && selectedSupervisor.length > 0 && (
                    <Chips2
                      items={supervisors}
                      selectedItems={selectedSupervisor}
                      setItems={setSupervisors}
                      setSelectedItems={setSelectedSupervisor}
                    />
                  )}
                </Form.Label>
              </Form.Group>
            </div>
            <SearchDropdown
              placeholder={"Supervisor"}
              position={"end"}
              items={supervisors}
              setItems={setSupervisors}
              selectedItems={selectedSupervisor}
              setSelectedItems={setSelectedSupervisor}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Row className="align-items-center">
                  <Col>
                    <Form.Label
                      className="chip-list"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        scrollBehavior: "smooth",
                        height: "2.5em",
                        overflowY: "auto"
                      }}
                      ref={(labelRef) => {
                        if (labelRef) {
                          labelRef.scrollLeft =
                            labelRef.scrollWidth - labelRef.clientWidth;
                        }
                      }}
                    >
                      {selectedCosupervisor &&
                        selectedCosupervisor.length > 0 && (
                          <Chips2
                            items={cosupervisors}
                            selectedItems={selectedCosupervisor}
                            setItems={setCosupervisors}
                            setSelectedItems={setSelectedCosupervisor}
                          />
                        )}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <SearchDropdown
              placeholder={"CoSupervisors"}
              position={"start"}
              items={cosupervisors}
              setItems={setCosupervisors}
              selectedItems={selectedCosupervisor}
              setSelectedItems={setSelectedCosupervisor}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Row className="align-items-center">
                  <Col>
                    <Form.Label
                      className="chip-list"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        scrollBehavior: "smooth",
                        height: "2.5em",
                        overflowY: "auto"
                      }}
                      ref={(labelRef) => {
                        if (labelRef) {
                          labelRef.scrollLeft =
                            labelRef.scrollWidth - labelRef.clientWidth;
                        }
                      }}
                    >
                      {selectedType && selectedType.length > 0 && (
                        <Chips2
                          items={type}
                          selectedItems={selectedType}
                          setItems={setType}
                          setSelectedItems={setSelectedType}
                        />
                      )}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <SearchDropdown
              placeholder={"type"}
              position={"end"}
              items={type}
              setItems={setType}
              selectedItems={selectedType}
              setSelectedItems={setSelectedType}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column"}}>
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Row className="align-items-center">
                  <Col>
                    <Form.Label
                      className="chip-list"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        scrollBehavior: "smooth",
                        height: "2.5em",
                        overflowY: "auto"
                      }}
                      ref={(labelRef) => {
                        if (labelRef) {
                          labelRef.scrollLeft =
                            labelRef.scrollWidth - labelRef.clientWidth;
                        }
                      }}
                    >
                      {selectedKeywords && selectedKeywords.length > 0 && (
                        <Chips2
                          items={keywords}
                          selectedItems={selectedKeywords}
                          setItems={setKeywords}
                          setSelectedItems={setSelectedKeywords}
                        />
                      )}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <SearchDropdown
              placeholder={"Keywords"}
              position={"end"}
              items={keywords}
              setItems={setKeywords}
              selectedItems={selectedKeywords}
              setSelectedItems={setSelectedKeywords}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%" }}>
              <Form.Group>
                <Row className="align-items-center">
                  <Col>
                    <Form.Label
                      className="chip-list"
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        scrollBehavior: "smooth",
                        height: "2.5em",
                        overflowY: "auto"
                      }}
                      ref={(labelRef) => {
                        if (labelRef) {
                          labelRef.scrollLeft =
                            labelRef.scrollWidth - labelRef.clientWidth;
                        }
                      }}
                    >
                      {selectedGroups && selectedGroups.length > 0 && (
                        <Chips2
                          items={groups}
                          selectedItems={selectedGroups}
                          setItems={setGroups}
                          setSelectedItems={setSelectedGroups}
                        />
                      )}
                    </Form.Label>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <SearchDropdown
              placeholder={"Groups"}
              position={"start"}
              items={groups}
              setItems={setGroups}
              selectedItems={selectedGroups}
              setSelectedItems={setSelectedGroups}
            />
          </div>

          <div
            className="mt-0 p-2"
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "0.5em",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: "1.3em",
              }}
            >
              <Col
                xs={4}
                className="d-flex align-items-center justify-content-start"
              >
                <p style={{ margin: "0px", paddingTop: isMobile? "0.5": "1.5em" }}>Valid until:</p>
              </Col>
              <Col xs={8} className="d-flex">
                <Form.Group style={{ width: "100%", paddingInline: "0.5em", paddingTop:isMobile? "0.5em": "2em"}}>
                  <Form.Control
                    type="date"
                    id="expiration"
                    name="expiration"
                    value={selectedDate}
                    onChange={(e) => {
                      const selected = new Date(e.target.value);
                      if (selected > virtualClock) {
                        setSelectedDate(e.target.value);
                      } else {
                        handleToast("Date must be in the future", "error");
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </div>
          </div>
        </div>

        <Row className="d-flex justify-content-end">
          <Col xs={8} className="d-flex justify-content-end">
            <Button className="button-style-cancel" onClick={handleReset}>
              Reset
            </Button>
            <Button
              className="button-style"
              onClick={() => {
                handleFilter();
              }}
            >
              Search
            </Button>
          </Col>
        </Row>

        <ToastContainer />
      </Form>
    </Card>
  );
};

export { FilterCard };
