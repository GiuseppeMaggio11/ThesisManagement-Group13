import React, { useState } from 'react';
import { Form } from "react-bootstrap";

function ChipsInput(props){
  return (
    <Form.Group className="mb-0">
      <ul className="chip-list">
        {props.values.map(item => (
          <li key={item} className="chip">
            <span>{item}</span>
            <a onClick={() => props.remove(props.field, item)}>X</a>
          </li>
        ))}
      </ul>
    </Form.Group>
  );
}

export default ChipsInput;
