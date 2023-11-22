import React, { useContext, useEffect, useState, useRef } from "react"
import API from "../API"
import MessageContext from "../messageCtx"
import { ToastContainer } from 'react-toastify';
import Loading from "./Loading";


const SearchDropdown = ({ items, selectedItems, setSelectedItems }) => {
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
        <div className="col-md-6">
            <input
                type="text"
                className="form-control"
                placeholder="Supervisors"
                onChange={handleChange}
            />
            {showDropdown && (
                <ul ref={dropdownRef} className="list-group mt-2">
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
        </div>
    );
};

export default SearchDropdown;


const FilterCard = (props) => {
    const { handleToast } = useContext(MessageContext)
    const [supervisors, setSupervisors] = useState(null)
    const [keywords, setKeywords] = useState([])
    const [selectedSupervisor, setSelectedSupervisor] = useState([])
    const [internalCosupervisor, setInternalCosupervisor] = useState(null)
    const [selectedinternalCosupervisor, setSelectedinternalCosupervisor] = useState(null)
    const [externalCosupervisor, setExternalCosupervisor] = useState(null)
    const [selectedExternalCosupervisor, setSelectedExternalCosupervisor] = useState(null)
    const [type, setType] = useState(['Sperimental', ''])
    const [selectedDate, setSelectedDate] = useState(props.virtualClock)
;

    useEffect(() => {
        const setFilters = async () => {
            let keywords_theses = [];
            let supervisors_theses = [];
            let internal_cosupervisors = []
            let external_cosupervisors = []
            try {
                if (props.thesisList) {
                    console.log(props.thesisList)
                    props.thesisList.forEach(item => {
                        console.log(item)
                        if (item.keywords.length > 0)
                            keywords.push(item.keywords)
                        if (item.supervisor) {
                            const [surname, name] = item.supervisor.split(' ');
                            const supervisorObj = {surname, name};

                            const supervisorExists = supervisors_theses.some(sup =>
                                sup.name === supervisorObj.name && sup.surname === supervisorObj.surname
                            );

                            if (!supervisorExists) {
                                supervisors_theses.push(supervisorObj);
                            }
                        }
                        if (item.cosupervisors?.length > 0) {
                            if (item.cosupervisors.contains('@'))
                                internal_cosupervisors.push(item.cosupervisor)
                            else
                                external_cosupervisors.push(item.cosupervisor)
                        }
                    })
                    console.log(external_cosupervisors)
                    console.log(internal_cosupervisors)
                    console.log(keywords_theses)
                    console.log(supervisors_theses)
                    setExternalCosupervisor(external_cosupervisors);
                    setInternalCosupervisor(internal_cosupervisors);
                    setKeywords(keywords_theses)
                    setSupervisors(supervisors_theses)
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
        <div className="container mt-4">
            <div className="row">
                <SearchDropdown items={supervisors} selectedItems={selectedSupervisor} setSelectedItems={setSelectedSupervisor} />
                {/* Render other input fields and dropdowns similarly */}
            </div>
            <ToastContainer />
        </div>
    );
};






export { FilterCard }