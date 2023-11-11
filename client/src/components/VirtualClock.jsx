import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const VirtualClock = (props) => {
  const updateTime = (amount, unit) => {
    const newDateTime = new Date(props.virtualClock);

    if (unit === "hour") {
      newDateTime.setHours(newDateTime.getHours() + amount);
    } else if (unit === "day") {
      newDateTime.setDate(newDateTime.getDate() + amount);
    } else if (unit === "month") {
      newDateTime.setMonth(newDateTime.getMonth() + amount);
    } else if (unit === "year") {
      newDateTime.setFullYear(newDateTime.getFullYear() + amount);
    }

    props.setVirtualClock(newDateTime);
  };
  const formattedDateTime = props.virtualClock.toLocaleString();
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
