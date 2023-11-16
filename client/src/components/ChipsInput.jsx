import React, { useState } from 'react';
import { Form } from "react-bootstrap";

function ChipsInput(props){
  const [input, setInput] = useState("");

  const onSubmit = () => {
    props.add(props.field, input);
    setInput("");
  }

  return (
    <Form.Group className="mb-3">
      <ul className="chip-list">
        {props.values.map(item => (
          <li key={item} className="chip">
            <span>{item}</span>
            <a onClick={() => props.remove(props.field, item)}>X</a>
          </li>
        ))}
      </ul>
      <Form.Control
        id={props.field}
        type="text"
        placeholder={props.placeholder}
        autoComplete="off"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            onSubmit();
          }
        }}
      />
    </Form.Group>

      
  )
}

export default ChipsInput;
