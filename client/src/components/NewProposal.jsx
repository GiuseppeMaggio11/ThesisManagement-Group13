import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Modal,
} from "react-bootstrap";
import API from "../API";
import Loading from "./Loading";
import ChipsInput from "./ChipsInput";
import NewExternalCoSupervisor from "./NewExternalCosupervisor";

function NewProposal(props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    supervisor_id: "",
    cosupervisors_internal: [],
    cosupervisors_external: [],
    thesis_level: "",
    keywords: [],
    type_name: "",
    cod_group: "",
    required_knowledge: "",
    notes: "",
    expiration: "",
    cod_degree: "",
    is_archived: false,
  });

  const [errors, setErrors] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [cosupervisors_external, setCoSupervisorExternal] = useState([]);

  const fetchData = async () => {
    try {
      await API.getListExternalCosupervisors()
        .then((list) => {
          setCoSupervisorExternal(list.map((item) => item.email));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching external co-supervisors:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addChip = (field, value) => {
    if (!formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value],
      });
    }
  };

  const deleteChip = (field, value) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProp = {
      ...formData,
      keywords: formData.keywords.join(", "),
    };
    await API.newProposal(newProp)
      .then((response) => {
        if (response && "errors" in response) {
          setErrors(response.errors);
        } else {
          setFormData({
            title: "",
            description: "",
            supervisor_id: "",
            cosupervisors_internal: [],
            cosupervisors_external: [],
            thesis_level: "",
            keywords: [],
            type_name: "",
            cod_group: "",
            required_knowledge: "",
            notes: "",
            expiration: "",
            cod_degree: "",
            is_archived: false,
          });
          setErrors(null);
        }
      })
      .catch((error) => {
        setErrors([{ msg: error.message }]);
      });
  };

  return (
    <>
      {props.loading ? <Loading /> : ""}
      <Container>
        <Row>
          <Col
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              className="mt-3"
              style={{ maxWidth: "1000px", margin: "0 auto" }}
            >
              <Card.Header className="fs-4">
                Create a new thesis proposal
              </Card.Header>
              <Card.Body>
                <Form>
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
                    <Form.Label htmlFor="supervisor_id">
                      Supervisor ID
                    </Form.Label>
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
                    <Form.Label htmlFor="cosupervisors_internal">
                      Internal Co-supervisors
                    </Form.Label>
                    <ChipsInput
                      field="cosupervisors_internal"
                      values={formData.cosupervisors_internal}
                      add={addChip}
                      remove={deleteChip}
                      placeholder="Enter internal co-supervisors ID and press enter"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="cosupervisors_external">
                      External Co-supervisors
                    </Form.Label>
                    <Form.Select
                      multiple
                      value={formData.cosupervisors_external}
                      onChange={(e) => {
                        const selectedItem = e.target.value;
                        if (
                          formData.cosupervisors_external.includes(selectedItem)
                        ) {
                          const tempArray =
                            formData.cosupervisors_external.filter(
                              (item) => item !== selectedItem
                            );
                          setFormData({
                            ...formData,
                            cosupervisors_external: [...tempArray],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            cosupervisors_external: [
                              ...formData.cosupervisors_external,
                              selectedItem,
                            ],
                          });
                        }
                      }}
                    >
                      {cosupervisors_external.map((item) => (
                        <option key={item} value={item} disabled>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      className="button-style mt-3"
                      onClick={() => setShowForm(true)}
                    >
                      Add new external co-supervisor
                    </Button>
                    <Modal show={showForm} onHide={() => setShowForm(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Add a new external co-supervisor
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <NewExternalCoSupervisor fetchData={fetchData} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          className="button-style-cancel"
                          variant="light"
                          onClick={async () => {
                            setShowForm(false);
                          }}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="thesis_level">Thesis level</Form.Label>
                    <Form.Select
                      id="thesis_level"
                      name="thesis_level"
                      value={formData.thesis_level}
                      onChange={handleChange}
                      required
                    >
                      <option>Choose a thesis level</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="keywords">Keywords</Form.Label>
                    <ChipsInput
                      field="keywords"
                      values={formData.keywords}
                      add={addChip}
                      remove={deleteChip}
                      placeholder="Enter a keyword and press enter"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="type_name">Type</Form.Label>
                    <Form.Control
                      type="text"
                      id="type_name"
                      name="type_name"
                      value={formData.type_name}
                      placeholder="Type"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="cod_group">Group</Form.Label>
                    <Form.Control
                      type="text"
                      id="cod_group"
                      name="cod_group"
                      value={formData.cod_group}
                      placeholder="Group"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="required_knowledge">
                      Required knowledge
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="required_knowledge"
                      name="required_knowledge"
                      value={formData.required_knowledge}
                      placeholder="Required knowledge"
                      onChange={handleChange}
                      required
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
                      required
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
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="is_archived">Is archived</Form.Label>
                    <Form.Check
                      id="is_archived"
                      name="is_archived"
                      checked={formData.is_archived}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  {errors && (
                    <div className="alert alert-danger">
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
                  <Button
                    className="button-style"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Create
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default NewProposal;
