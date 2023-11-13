import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API';

function NewExternalCoSupervisorForm(props) {
  const [coSupervisor, setCoSupervisor] = useState({
    email: '',
    name: '',
    surname: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoSupervisor({
      ...coSupervisor,
      [name]: value,
    });
  };

  const handleAddCoSupervisor = async () => {
    await API.newExternalCosupervisor(coSupervisor)
      .then((response)=>{
        console.log(response)
      })
      .then((e) => setCoSupervisor({
        email: '',
        name: '',
        surname: '',
      }))
      .catch((err) => setError(err));
  };

  return (
    <Form>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={coSupervisor.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="surName">
        <Form.Label>Surname</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter surname"
          name="surname"
          value={coSupervisor.surname}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          name="name"
          value={coSupervisor.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleAddCoSupervisor}>
        Add external Co-Supervisor
      </Button>
    </Form>
  );
}

export default NewExternalCoSupervisorForm;
