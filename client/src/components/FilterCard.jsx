import React, { useContext, useEffect, useState } from "react"
import API from "../API"
import MessageContext from "../messageCtx"
import {toastContainer} from 'react-toastify';
import Loading from "./Loading";


const FilterCard = (props) =>{
    const {handleToast} = useContext(MessageContext)
    const [supervisor, setSupervisor] = useState(null)
    const [selectedSupervisor, setSelectedSupervisor] = useState(null)
    const [internalSupervisor, setInternalSupervisor] = useState(null)
    const [selectedinternalCosupervisor, setSelectedinternalCosupervisor] = useState(null)
    const [externalCosupervisor, setExternalCosupervisor] = useState(null)
    const [selectedExternalCosupervisor, setSelectedExternalCosupervisor] = useState(null)
    const [type, setType] = useState(['Sperimental',''])
    const [selectedDate, setSelectedDate] = useState(props.virtualClock)

    useEffect(()=>{
        const setFilters = async() => {
        let keywords=[];
        let supervisors=[];
        let internal_cosupervisor=[]
        try{
            let response = await API.getListExternalCosupervisors();
            if(response)
                setExternalCosupervisor(response)
    
            if(props.thesisList){
                props.thesisList.forEach(item => {
                    if(item.keywords.length>0)
                        keywords.push([...item.keywords])
                    if(item.supervisor)
                        supervisors.push(item.supervisor)
                    if(item.cosupervisors.length>0)
                        internal_cosupervisors.push([...item.cosupervisor]) // sono sia external che internal

                })
            }
        }
        catch(error){
            console.log(error)
            handleToast(error.error, 'error')
        }}
        props.setLoading(true)
        setFilters()
        props.setLoading(false)
    }, [])

    return(
        <toastContainer/>
    )
}




export {FilterCard}