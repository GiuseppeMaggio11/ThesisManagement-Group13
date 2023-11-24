import React, { useContext, useEffect, useState, useRef } from "react"
import API from "../API"
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import MessageContext from "../messageCtx"
import { ToastContainer } from 'react-toastify';
import { ChevronCompactDown, ChevronCompactUp, Search } from 'react-bootstrap-icons'
import Loading from "./Loading";

const Chips2 = ({ items, selectedItems, setItems, setSelectedItems }) => {
    return (
        <div>
            {selectedItems.map((item, index) => (
                <span key={index} className="chip" style={{ fontSize: 10 }}>
                    {item}
                    <span
                        className="chip"
                        onClick={() => {
                            const updatedSupervisor = items.concat(item);
                            const updatedSelectedSupervisor = selectedItems.filter(
                                (selectedItem) => selectedItem !== item
                            );
                            setItems(updatedSupervisor);
                            setSelectedItems(updatedSelectedSupervisor);
                        }}
                    >
                        X
                    </span>
                </span>
            ))}
        </div>
    );
};

const SearchDropdown = ({ placeholder, position, items, setItems, selectedItems, setSelectedItems }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [highlightedItem, setHighlightedItem] = useState(null);
    const [loading, setLoading] = useState(true)
    const dropdownRef = useRef(null);
    const [input, setInput] = useState("")

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

        if (value === '') {
            setFilteredItems([]);
            setInput("")
        } else {
            setInput(value)
            setFilteredItems(
                items.filter((item) => {
                    const fullName = `${item}`.toLowerCase();

                    if (fullName.includes(' ')) {
                        const parts = fullName.split(' ');
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
        let newSelectedItems = [...selectedItems, item];
        let is = items.filter((i) => !newSelectedItems.includes(i));
        
        setItems(is);
        setSelectedItems(newSelectedItems);
        setInput("")
        setShowDropdown(false)
    };



    return (
        <div className="mt-0 p-2" style={{ marginBottom: '0.5em' }}>
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
                            value={input}
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
                            {filteredItems.length > 0 && (
                                <ul className="list-group mt-2">
                                    {filteredItems.map((item, index) => (
                                        <li
                                            className={`list-group-item`}
                                            key={index}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {item}
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
                                            {item}
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
    const [selectedType, setSelectedType] = useState([])

    const [reset, setReset] = useState(true)

    const [selectedDate, setSelectedDate] = useState(props.virtualClock)

    const thesisList = props.thesisList
    
    useEffect(() => {
        const setFilters = async () => {
            let keywords_theses = [];
            let group_theses = [];
            let supervisors_theses = [];
            let internal_cosupervisors = []
            let external_cosupervisors = []
            try {
                if (thesisList) {
                   
                    thesisList.forEach(item => {
                       
                        if (item.keywords.length > 0) {
                           
                            item.keywords.forEach(i => {
                                if (i != '' && i != ' ')
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
                                
                                let exist = group_theses.some(g => g === i.group)
                                if (!exist)
                                    group_theses.push(i.group)
                            })
                        }
                    })
                    console.log(thesisList[1].groups)
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
        if(reset){
            props.setLoading(true)
            setFilters()
            setReset(false)
        }
        props.setLoading(false)
       
    }, [reset, thesisList])

    const handleReset = () =>{
        setSelectedExternalCosupervisor([])
        setSelectedinternalCosupervisor([])
        setSelectedSupervisor([])
        setSelectedGroups([])
        setSelectedKeywords([])
        setSelectedType([])
        setSelectedDate(props.virtualClock)
        props.setProposals(thesisList)
        setReset(true)
    }
    
    const handleFilter = () => {
        let filtered = [...thesisList];

        if (selectedSupervisor?.length > 0) {
            filtered = filtered.filter(thesis =>
                selectedSupervisor.includes(thesis.supervisor)
            );
        }
        if (selectedDate!=props.virtualClock) {
            filtered = filtered.filter(thesis =>
                selectedDate > thesis.date
            );
        }
    
        if (selectedExternalCosupervisor?.length > 0) {
            filtered = filtered.filter(thesis =>
                selectedExternalCosupervisor.includes(thesis.cosupervisor)
            );
        }
    
        if (selectedinternalCosupervisor?.length > 0) {
            filtered = filtered.filter(thesis =>
                selectedinternalCosupervisor.includes(thesis.cosupervisor)
            );
        }
    
        if (selectedType?.length > 0) {
            filtered = filtered.filter(thesis =>
                selectedType.includes(thesis.type)
            );
        }

        if (selectedKeywords?.length > 0) {
            filtered = filtered.filter(thesis =>
                thesis.keywords.some(keyword =>
                    selectedKeywords.includes(keyword)
                )
            );
        }

        if (selectedGroups?.length > 0) {
                filtered = filtered.filter(thesis =>
                    thesis.groups.some(group =>
                        selectedGroups.includes(group.group)
                    )
                );
        }
        props.setProposals(filtered)
    };
        

    
    return (
        <Card className="container mt-6 custom-rounded" style={{ marginBottom: '0.5em' }}>
            <Form>
                {/* Supervisor and Valid until */}
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-start">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Label className="chip-list"
                                        style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth', }}
                                        ref={(labelRef) => {
                                            if (labelRef) {
                                                labelRef.scrollLeft = labelRef.scrollWidth - labelRef.clientWidth;
                                            }
                                        }}>
                                        {selectedSupervisor && selectedSupervisor.length > 0 && (
                                            <Chips2
                                                items={supervisors}
                                                selectedItems={selectedSupervisor}
                                                setItems={setSupervisors}
                                                setSelectedItems={setSelectedSupervisor}
                                            />
                                        )}
                                    </Form.Label>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-end">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={6}>
                        <SearchDropdown placeholder={'Supervisor'} position={'start'} items={supervisors} setItems={setSupervisors} selectedItems={selectedSupervisor} setSelectedItems={setSelectedSupervisor} />
                    </Col>
                    <Col xs={6} className="p-2">
                        <Row className="align-items-center">
                            <Col xs={4} className="d-flex justify-content-end">
                                <p>Valid untill: </p>
                            </Col>
                            <Col xs={8} className="position-relative">
                                <Form.Group>
                                    <Form.Control
                                        type="date"
                                        id="expiration"
                                        name="expiration"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            const selected = new Date(e.target.value);
                                            if (selected > props.virtualClock) {
                                                setSelectedDate(e.target.value);
                                            } else {
                                                handleToast('Date must be in the future', 'error')
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* internal cosupervisor and type */}
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-start">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={6}>
                        <Form.Group>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Label className="chip-list"
                                        style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth', }}
                                        ref={(labelRef) => {
                                            if (labelRef) {
                                                labelRef.scrollLeft = labelRef.scrollWidth - labelRef.clientWidth;
                                            }
                                        }}>
                                        {selectedinternalCosupervisor && selectedinternalCosupervisor.length > 0 && (
                                            <Chips2
                                                items={internalCosupervisor}
                                                selectedItems={selectedinternalCosupervisor}
                                                setItems={setInternalCosupervisor}
                                                setSelectedItems={setSelectedinternalCosupervisor}
                                            />
                                        )}
                                    </Form.Label>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-end">
                        {/* This column is empty */}
                    </Col>

                    <Col xs={6}>
                        <SearchDropdown placeholder={'Internal cosupervisor'} position={'start'} items={internalCosupervisor} setItems={setInternalCosupervisor} selectedItems={selectedinternalCosupervisor} setSelectedItems={setSelectedinternalCosupervisor} />
                    </Col>
                    <Col xs={6} className="p-2">
                        <Row className="align-items-center">
                            <Col xs={4} className="d-flex justify-content-end">
                                <p>Type: </p>
                            </Col>
                            <Col xs={8} className="position-relative">
                                <Form.Group>
                                    {/* Form control for Type */}
                                    <select className="form-select form-select-xl" aria-label=".form-select-sm example">
                                        <option selected>Choose a level</option>
                                        <option value="1">Sperimental</option>
                                        <option value="2">Type 2</option>
                                    </select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* external cosupervisor and keyword */}
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-start">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Label className="chip-list"
                                        style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth', }}
                                        ref={(labelRef) => {
                                            if (labelRef) {
                                                labelRef.scrollLeft = labelRef.scrollWidth - labelRef.clientWidth;
                                            }
                                        }}>
                                        {selectedExternalCosupervisor && selectedExternalCosupervisor.length > 0 && (
                                            <Chips2
                                                items={externalCosupervisor}
                                                selectedItems={selectedExternalCosupervisor}
                                                setItems={setExternalCosupervisor}
                                                setSelectedItems={setSelectedExternalCosupervisor}
                                            />
                                        )}
                                    </Form.Label>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-start">
                        {/* This column is empty*/}
                    </Col>
                    <Col xs={4}>
                        <Form.Group>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Label className="chip-list"
                                        style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth', }}
                                        ref={(labelRef) => {
                                            if (labelRef) {
                                                labelRef.scrollLeft = labelRef.scrollWidth - labelRef.clientWidth;
                                            }
                                        }}>
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
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <SearchDropdown placeholder={'External cosupervisor'} position={'start'} items={externalCosupervisor} setItems={setExternalCosupervisor} selectedItems={selectedExternalCosupervisor} setSelectedItems={setSelectedExternalCosupervisor} />
                    </Col>

                    <Col xs={6} className="align-items-center" >
                        <SearchDropdown placeholder={'Keywords'} position={'end'} items={keywords} setItems={setKeywords} selectedItems={selectedKeywords} setSelectedItems={setSelectedKeywords} />
                    </Col>
                </Row>

                {/* groups and buttons */}
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-start">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={6}>
                        <Form.Group>
                            <Row className="align-items-center">
                                <Col>
                                    <Form.Label className="chip-list"
                                        style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollBehavior: 'smooth', }}
                                        ref={(labelRef) => {
                                            if (labelRef) {
                                                labelRef.scrollLeft = labelRef.scrollWidth - labelRef.clientWidth;
                                            }
                                        }}>
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
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-end">
                        {/* This column is empty */}
                    </Col>
                    <Col xs={6}>
                        <SearchDropdown placeholder={'Groups'} position={'start'} items={groups} setItems={setGroups} selectedItems={selectedGroups} setSelectedItems={setSelectedGroups} />
                    </Col>
                    <Col xs={6} className="d-flex justify-content-end" style={{ paddingRight: '3em', paddingTop: '3em' }}>
                        <Button className="button-style-cancel" onClick={handleReset}>Reset</Button>
                        <Button className="button-style" onClick={()=>{handleFilter(); props.showFilters()}}>Search</Button>
                    </Col>
                </Row>

                <ToastContainer />

            </Form>
        </Card>
    );
};







export { FilterCard }