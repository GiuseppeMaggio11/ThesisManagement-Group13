import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import API from "../API";
import FlipClock from "./clock";

const VirtualClock = (props) => {
  const [tempTime, setTempTime] = useState(props.virtualClock);
  const [isVirtual, setIsVirtual] = useState(false)
  const [settingVirtual, setSettingVirtual] = useState(false)
  const [isAmPm, setIsAmPm] = useState('')

  /*   const updateTime = (amount, unit) => {
      const newDateTime = new Date(tempTime);
  
      if (unit === "hour") {
        newDateTime.setHours(newDateTime.getHours() + amount);
      } else if (unit === "day") {
        newDateTime.setDate(newDateTime.getDate() + amount);
      } else if (unit === "month") {
        newDateTime.setMonth(newDateTime.getMonth() + amount);
      } else if (unit === "year") {
        newDateTime.setFullYear(newDateTime.getFullYear() + amount);
      }
  
      setTempTime(newDateTime);
    }; */

  const handleVirtualTime = async (newTime) => {
    props.setVirtualClock(newTime);
    localStorage.setItem("virtualclock", JSON.stringify(newTime));
    await API.updateExpiration(newTime)
      .then((response) => {
        if (response && "errors" in response) {
          //setErrors(response.errors);
        } else {
          //props.setVirtualClock(newTime);
          //setErrors(null);
        }
      })
      .catch((error) => {
        //setErrors([{ msg: error.message }]);
      });
  };

  const handleRealTime = async () => {
    setTempTime(new Date());
    props.setVirtualClock(new Date());
    localStorage.removeItem("virtualclock");
    await API.updateExpiration(tempTime)
      .then((response) => {
        if (response && "errors" in response) {
          //setErrors(response.errors);
        } else {
          props.setVirtualClock(tempTime);
          //setErrors(null);
        }
      })
      .catch((error) => {
        //setErrors([{ msg: error.message }]);
      });
  };
  const formattedDateTime = tempTime.toLocaleString();

  function handleChageAmPm(){
    if(isAmPm==='pm'){
      console.log('è pm')
      console.log('am')
      setIsAmPm('am')
    }
    else
      setIsAmPm('pm')

      console.log(isAmPm)
  }

  return (
    <Container className="mt-3">
      <div>
        <FlipClock isVirtual={isVirtual} setIsVirtual={setIsVirtual} isAmPm={isAmPm} setIsAmPm={setIsAmPm} handleChageAmPm={handleChageAmPm} settingVirtual={settingVirtual} setSettingVirtual={setSettingVirtual}/>
      </div>
      <div style={{display:"flex", alignItems:"center", justifyContent:'center'}}>
        {!settingVirtual && !isVirtual && <Button style={{marginRight:'0.5em'}} onClick={()=>{setSettingVirtual(true)}}> set Virtual time</Button>}
        {!settingVirtual && isVirtual && <Button style={{marginRight:'0.5em'}} onClick={()=>{setIsVirtual(false)}}> RealTime Mode </Button>}
        {settingVirtual && <Button  onClick={()=>{setIsVirtual(true); setSettingVirtual(false)}}> apply virtual time</Button>}
      </div>
    </Container>
  );
};

export default VirtualClock;
