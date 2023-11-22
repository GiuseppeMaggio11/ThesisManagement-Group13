import React, { useContext, useEffect, useState, useRef } from "react"
import API from "../API"
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import MessageContext from "../messageCtx"
import { ToastContainer } from 'react-toastify';
import { ChevronCompactDown, ChevronCompactUp, Search } from 'react-bootstrap-icons'
import Loading from "./Loading";


const SearchDropdown = ({ placeholder, position, items, selectedItems, setSelectedItems }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedItem, setHighlightedItem] = useState(null);
    const dropdownRef = useRef(null);

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
        setFilteredItems(
            items.filter(item => {
                const fullName = `${item.surname} ${item.name}`.toLowerCase();
                return fullName.includes(value);
            })
        );
        setShowDropdown(true);
    };

    const handleItemClick = (item) => {
        const selectedIndex = selectedItems.findIndex(selectedItem => selectedItem === item);
        let newSelectedItems = [...selectedItems];

        if (selectedIndex !== -1) {
            // Item already selected, remove it
            newSelectedItems.splice(selectedIndex, 1);
        } else {
            // Item not selected, add it
            newSelectedItems = [...selectedItems, item];
        }

        setSelectedItems(newSelectedItems);
        setHighlightedItem(item);
    };

    return (
        <div className="mt-6 p-4" style={{ marginBottom: '0.5em'}}>
            <Row>
                <Col xs={4} className={`d-flex  align-items-center${position === 'start' ? " justify-content-start" : " justify-content-end"}`}>
                    <p>{placeholder}: </p>
                </Col>
                <Col xs={8} className="position-relative">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={placeholder}
                            onChange={handleChange}
                        />
                        <span className="input-group-text">
                            {!showDropdown && <ChevronCompactDown onClick={() => { setShowDropdown(true) }} />}
                            {showDropdown && <ChevronCompactUp onClick={() => { setShowDropdown(false) }} />}
                        </span>
                    </div>
                </Col>
            </Row>
            {showDropdown && (
                <div className="dropdown-container">
                    <Row>
                        <Col xs={4} className="d-flex justify-content-start align-items-center"></Col>
                        <Col ref={dropdownRef} xs={8} className="ml-4 dropdown-content">
                            {/* Dropdown content */}
                            {filteredItems.length > 0 && (
                                <ul className="list-group mt-2">
                                    {filteredItems.map((item, index) => (
                                        <li
                                            className={`list-group-item${selectedItems.includes(item) ? " active" : ""}`}
                                            key={index}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {item.surname} {item.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {filteredItems.length <= 0 && (
                                <ul className="list-group mt-2">
                                    {items.map((item, index) => (
                                        <li
                                            className={`list-group-item${selectedItems.includes(item) ? " active" : ""}`}
                                            key={index}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {item}
                                        </li>
                                    ))}
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

export default SearchDropdown;


const FilterCard = (props) => {
    const { handleToast } = useContext(MessageContext)
    const [supervisors, setSupervisors] = useState(null)
    const [keywords, setKeywords] = useState([])
    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [selectedSupervisor, setSelectedSupervisor] = useState([])
    const [internalCosupervisor, setInternalCosupervisor] = useState(null)
    const [selectedinternalCosupervisor, setSelectedinternalCosupervisor] = useState(null)
    const [externalCosupervisor, setExternalCosupervisor] = useState(null)
    const [selectedExternalCosupervisor, setSelectedExternalCosupervisor] = useState(null)
    const [groups, setGroups] = useState([])
    const [selectedGroups, setSelectedGroups] = useState([])
    const [type, setType] = useState(['Sperimental', ''])

    const [selectedDate, setSelectedDate] = useState(props.virtualClock)

    useEffect(() => {
        const setFilters = async () => {
            let keywords_theses = [];
            let group_theses = [];
            let supervisors_theses = [];
            let internal_cosupervisors = []
            let external_cosupervisors = []
            try {
                if (props.thesisList) {
                    console.log(props.thesisList)
                    props.thesisList.forEach(item => {
                        console.log(item)
                        if (item.keywords.length > 0) {
                            console.log(keywords_theses)
                            item.keywords.forEach(i => {
                                keywords_theses.push(i)
                            })
                        }
                        if (item.supervisor) {
                            const name = item.supervisor
                            const supervisorExists = supervisors_theses.some(sup =>
                                sup === name
                            );

                            if (!supervisorExists) {
                                supervisors_theses.push(name);
                            }
                        }
                        if (item.cosupervisors?.length > 0) {
                            if (item.cosupervisors.contains('@'))
                                internal_cosupervisors.push(item.cosupervisor)
                            else
                                external_cosupervisors.push(item.cosupervisor)
                        }
                        if (item.groups?.length > 0) {
                            item.groups.forEach(i => {
                                console.log(i)
                                let exist = group_theses.some(g => g === i.group)
                                if (!exist)
                                    group_theses.push(i.group)
                            })
                        }
                    })
                    /*  console.log(external_cosupervisors)
                     console.log(internal_cosupervisors)
                     console.log(keywords_theses)
                     console.log(group_theses)
                     console.log(supervisors_theses) */
                    setExternalCosupervisor(external_cosupervisors);
                    setInternalCosupervisor(internal_cosupervisors);
                    setKeywords(keywords_theses)
                    setSupervisors(supervisors_theses)
                    setGroups(group_theses)
                }
            }
            catch (error) {
                console.log(error)
                handleToast(error.error, 'error')
            }
        }
        props.setLoading(true)
        setFilters()
        props.setLoading(false)
    }, [])

    return (
        <Card className="container mt-6 custom-rounded" style={{ marginBottom: '0.5em' }}>
            <Row style={{marginTop:'0.5em'}} >
                <Col xs={6}>
                    <SearchDropdown placeholder={'Supervisor'} position={'start'} items={supervisors} selectedItems={selectedSupervisor} setSelectedItems={setSelectedSupervisor} />
                </Col>
                <Col xs={6} className="p-4">
                    <Row className="align-items-center">
                        <Col xs={4} className="d-flex justify-content-end">
                            <p>valid untill: </p>
                        </Col>
                        <Col xs={8} className="position-relative">
                            <Form>
                                <Form.Group>
                                    <Form.Control
                                        type="date"
                                        id="expiration"
                                        name="expiration"
                                        value={new Date()}
                                        onChange={() => console.log('ok')}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* internal cosupervisor */}
            <Row>
                <Col xs={6}>
                    <SearchDropdown placeholder={'Internal cosupervisor'} position={'start'} items={internalCosupervisor} selectedItems={setInternalCosupervisor} setSelectedItems={setSelectedinternalCosupervisor} />
                </Col>
                <Col xs={6}  className="p-4">
                    <Row className="align-items-center">
                        <Col xs={4} className="d-flex justify-content-end">
                            <p>Type: </p>
                        </Col>
                        <Col xs={8} className="position-relative">
                            <Form>
                                <select className="form-select form-select-xl" aria-label=".form-select-sm example">
                                    <option selected>Choose a level</option>
                                    <option value="1">Sperimental</option>
                                    <option value="2">Type 2</option>
                                </select>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <SearchDropdown placeholder={'External cosupervisor'} position={'start'} items={externalCosupervisor} selectedItems={selectedExternalCosupervisor} setSelectedItems={setSelectedExternalCosupervisor} />
                </Col>
                <Col xs={6}>
                    <SearchDropdown placeholder={'Keywords'} position={'end'} items={keywords} selectedItems={selectedKeywords} setSelectedItems={setSelectedKeywords} />
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <SearchDropdown placeholder={'Groups'} position={'start'} items={groups} selectedItems={selectedGroups} setSelectedItems={setSelectedGroups} />
                </Col>
                <Col xs={6} className="d-flex justify-content-end" style={{paddingRight:'3em', paddingTop:'3em'}}>
                <Button className="button-style-cancel">Reset</Button>
                    <Button className="button-style">Search</Button>
                </Col>
            </Row>
            <ToastContainer />
        </Card>
    );
};







export { FilterCard }