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
  const dateTimeArray = formattedDateTime.split(',');
  const date = dateTimeArray[0]; // Extract date
  const time = dateTimeArray.slice(1).join(','); // Extract time
  const hour = time.split(':')[0]
  const minute = time.split(':')[1]
  const second = time.split(':')[2]
  console.log(hour)
  console.log(minute)
  console.log(second)
    return (
      <Container>
      <Row>
        <Col>
          <h2>{date}</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FlipClock/>
        </Col>
      </Row>
      {/* Other components or content */}
    </Container>
    );
  };
      
  

export default VirtualClock;
