import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import API from "../API";
import FlipClock from "./clock";

const VirtualClock = (props) => {
  const [tempTime, setTempTime] = useState(props.virtualClock);

  const updateTime = (amount, unit) => {
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
  };
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
  return (
    <Container className="mt-5">
      <FlipClock/>
    </Container>
  );
};

export default VirtualClock;
