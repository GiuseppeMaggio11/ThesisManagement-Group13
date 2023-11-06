import { Form, Button, Container } from "react-bootstrap";
import Loading from "./Loading";
import React, { useState } from 'react';

function NewProposal(props) {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    supervisor_id: '',
    thesis_level: '',
    type: '',
    required_knowledge: '',
    notes: '',
    expiration: '',
    cod_degree: '',
    is_archived: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API
    console.log('Sent data : ', formData);
  };

  return (
    <>
    {props.loading ? <Loading /> : ""}
    <Container>
      <h2>Create a new thesis proposal</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="title">Title</Form.Label>
          <Form.Control
            type="text"
            id="title"
            name="title"
            value={formData.title}
            placeholder="Title"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="description"
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
            required
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="supervisor_id">Supervisor ID</Form.Label>
          <Form.Control
            type="text"
            id="supervisor_id"
            name="supervisor_id"
            value={formData.supervisor_id}
            placeholder="Supervisor ID"
            onChange={handleChange}
            required
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="thesis_level">Thesis level</Form.Label>
          <Form.Control
            type="text"
            id="thesis_level"
            name="thesis_level"
            value={formData.thesis_level}
            placeholder="Thesis level"
            onChange={handleChange}
            required
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="type">Type</Form.Label>
          <Form.Control
            type="text"
            id="type"
            name="type"
            value={formData.type}
            placeholder="Type"
            onChange={handleChange}
            required
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="required_knowledge">Required knowledge</Form.Label>
          <Form.Control
            type="text"
            id="required_knowledge"
            name="required_knowledge"
            value={formData.required_knowledge}
            placeholder="Required knowledge"
            onChange={handleChange}
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="notes">Notes</Form.Label>
          <Form.Control
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            placeholder="Notes"
            onChange={handleChange}
          />
         </Form.Group>
         <Form.Group className="mb-3">
          <Form.Label htmlFor="expiration">Expiration</Form.Label>
          <Form.Control
            type="date"
            id="expiration"
            name="expiration"
            value={formData.expiration}
            onChange={handleChange}
            required
          />
         </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="cod_degree">Degree</Form.Label>
          <Form.Control
            type="text"
            id="cod_degree"
            name="cod_degree"
            value={formData.cod_degree}
            placeholder="Degree"
            onChange={handleChange}
          />
         </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
    </>
  );
}

export default NewProposal;
