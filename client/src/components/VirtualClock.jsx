import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import API from "../API";

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
    <Container className="mt-4">
      <Card className="text-center">
        <Card.Header className="fs-3">Virtual Clock</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Row>
                <Col>
                  <Button
                    variant="info"
                    onClick={() => updateTime(1, "hour")}
                    className="w-50 mb-1"
                  >
                    +1 Hour
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    onClick={() => updateTime(1, "day")}
                    className="w-50 mb-1"
                  >
                    +1 Day
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="warning"
                    onClick={() => updateTime(1, "month")}
                    className="w-50 mb-1"
                  >
                    +1 Month
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="danger"
                    onClick={() => updateTime(1, "year")}
                    className="w-50 mb-1"
                  >
                    +1 Year
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <Card.Title>Current Time</Card.Title>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text className="custom-virtual-clock">
                    <span>{formattedDateTime}</span>
                  </Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="danger"
                    className="w-50 mb-1"
                    onClick={() => handleVirtualTime(tempTime)}
                  >
                    Use VirtualTime
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    className="w-50 mb-1"
                    onClick={() => handleRealTime()}
                  >
                    Use real time
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <Button
                    variant="info"
                    onClick={() => updateTime(-1, "hour")}
                    className="w-50 mb-1"
                  >
                    -1 Hour
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    onClick={() => updateTime(-1, "day")}
                    className="w-50 mb-1"
                  >
                    -1 Day
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="warning"
                    onClick={() => updateTime(-1, "month")}
                    className="w-50 mb-1"
                  >
                    -1 Month
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="danger"
                    onClick={() => updateTime(-1, "year")}
                    className="w-50 mb-1"
                  >
                    -1 Year
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VirtualClock;
