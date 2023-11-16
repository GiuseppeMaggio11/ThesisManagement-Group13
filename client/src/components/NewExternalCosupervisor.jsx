import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import API from "../API";

function NewExternalCoSupervisorForm(props) {
  const [coSupervisor, setCoSupervisor] = useState({
    email: "",
    name: "",
    surname: "",
  });

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoSupervisor({
      ...coSupervisor,
      [name]: value,
    });
  };

  const handleAddCoSupervisor = async () => {
    await API.newExternalCosupervisor(coSupervisor)
      .then((response) => {
        if (response && "errors" in response) {
          setErrors(response.errors);
        } else {
          setCoSupervisor({
            email: "",
            name: "",
            surname: "",
          });
          setErrors(null);
          props.fetchData();
        }
      })
      .catch((error) => {
        setErrors([{ msg: error.message }]);
      });
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
      {errors && (
        <div className="alert alert-danger mt-3">
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={index}>
                {" "}
                {error?.path ? error.path + ":" : ""} {error.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button className="button-style mt-3" onClick={handleAddCoSupervisor}>
        Add
      </Button>
    </Form>
  );
}

export default NewExternalCoSupervisorForm;
