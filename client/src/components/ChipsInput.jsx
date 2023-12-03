import React, { useState } from 'react';
import { Form } from "react-bootstrap";

function ChipsInput(props){
  return (
    <Form.Group className="mb-1">
      <ul className="chip-list">
        {props.values.map(item => (
          <li key={item} className="chip">
            <span>{item}</span>
            <span className='chip-x' onClick={() => props.remove(props.field, item)}>X</span>
          </li>
        ))}
      </ul>
    </Form.Group>
  );
}

export default ChipsInput;
