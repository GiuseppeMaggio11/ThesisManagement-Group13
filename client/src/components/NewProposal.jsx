import React, { useContext, useEffect, useRef, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleComponent from "./Toggle";
import dayjs from "dayjs";
import MessageContext from "../messageCtx";
import { useNavigate, useParams } from "react-router-dom";

function NewProposal(props) {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [internal_cosupervisor_input, setInternalCosupervisorInput] =
    useState("");
  const [keywords_input, setKeywordsInput] = useState("");

  const [errors, setErrors] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [cosupervisors_external, setCoSupervisorExternal] = useState([]);
  const { handleToast } = useContext(MessageContext);
  const titleRef = useRef(null);
  const supervisorRef = useRef(null);
  const levelRef = useRef(null);
  const groupRef = useRef(null);
  const typeRef = useRef(null);
  const expirationRef = useRef(null);
  const degreeRef = useRef(null);

  if (!props.loggedIn || props.user.user_type !== "PROF")
    return API.redirectToLogin();

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

  const fetchThesisCopy = async (thesisId) => {
    try {
      const response = await API.getThesisToCopy(thesisId);
      setFormData(response);
    } catch (err) {
      handleToast("Error while fetching Thesis to copy", "error");
    }
  };

  useEffect(() => {
    props.setLoading(true);
    fetchData();
    if (id) fetchThesisCopy(id);
    props.setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { id, name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: id === "is_archived" ? checked : value,
    });
  };

  function handleChangeDate(event) {
    const { name, value } = event.target;
    const today = props.virtualClock;
    const selectedDate = dayjs(value);
    //console.log(today);
    if (selectedDate < today) {
      handleToast("Please select a date in the future", "error");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  const addChip = (field, value) => {
    if (!formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value],
      });
    }
    setInternalCosupervisorInput("");
    setKeywordsInput("");
  };

  const deleteChip = (field, value) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((item) => item !== value),
    });
  };

  function createMessage(path, msg) {
    let errorMessage;
    let id = 0;
    if (path.includes("supervisor")) {
      path = "Supervisor ID";
      msg = "Invalid value";
      errorMessage = path + ": " + msg;
      id = 2;
    } else if (path.includes("title")) {
      path = "Thesis level";
      msg = "Insert a value";
      errorMessage = path + ": " + msg;
      if (!id) id = 1;
    } else if (path.includes("level")) {
      path = "Thesis level";
      msg = "Insert a value";
      errorMessage = path + ": " + msg;
      if (!id) id = 3;
    } else if (path.includes("type")) {
      path = "Type";
      msg = "Insert a value";
      errorMessage = path + ": " + msg;
      if (!id) id = 4;
    } else if (path.includes("group")) {
      path = "Group";
      msg = "Insert a valid value";
      errorMessage = path + ": " + msg;
      if (!id) id = 4;
    } else if (path.includes("expiration")) {
      path = "Expiration date";
      msg = "The date is required";
      errorMessage = path + ": " + msg;
      if (!id) id = 5;
    } else if (path.includes("degree")) {
      path = "degree";
      msg = "Insert a value";
      errorMessage = path + ": " + msg;
      if (!id) id = 6;
    } else {
      //console.log(path + errorMessage);
      errorMessage = `${path ? path + ":" : ""} ${msg}`;
    }
    return { errorMessage, id };
  }

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRef = (id) => {
    switch (id) {
      case 1:
        scrollToRef(titleRef);
        break;
      case 2:
        scrollToRef(supervisorRef);
        break;
      case 3:
        scrollToRef(levelRef);
        break;
      case 4:
        scrollToRef(typeRef);
        break;
      case 5:
        scrollToRef(expirationRef);
        break;
      case 6:
        scrollToRef(degreeRef);
        break;
      default:
        break;
    }
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProp = {
      ...formData,
      keywords: formData.keywords.join(", "),
    };
    try {
      const response = await API.newProposal(newProp);
      handleToast("New proposal created successfully", "success");
      navigate("/teacher");
    } catch (error) {
      console.log(error);
      if (error.error) {
        const parts = error.error?.split(":");
        if (parts[0] && parts[1]) {
          let { message, id } = createMessage(parts[0], parts[1]);
          message = parts[0] + ": " + parts[1];
          setErrors([
            {
              type: "field",
              value: "",
              msg: parts[1],
              path: parts[0],
              location: "body",
            },
          ]);
          handleToast(message, "error");
          handleRef(id);
        }
      } else if (error.errors) {
        console.log(error.errors.errors);
        let id_min = 10;
        setErrors(error.errors.errors);
        Object.values(error.errors.errors).forEach((error, index) => {
          let { errorMessage, id } = createMessage(error.path, error.msg);
          if (id < id_min) {
            id_min = id;
          }
          toast.error(errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        handleRef(id_min);
      } else handleToast(error.msg ? error.msg : "Unexpected error", "error");
    }
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
                  <Form.Group className="mb-3" ref={titleRef}>
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      placeholder="Title"
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("title"))
                          ? { borderColor: "red" }
                          : {}
                      }
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
                      style={
                        errors &&
                        errors.some((error) =>
                          error?.path?.includes("description")
                        )
                          ? { borderColor: "red" }
                          : {}
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="supervisor_id" ref={supervisorRef}>
                      Supervisor ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="supervisor_id"
                      name="supervisor_id"
                      value={formData.supervisor_id}
                      placeholder="Supervisor ID"
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) =>
                          error?.path?.includes("supervisor")
                        )
                          ? { borderColor: "red" }
                          : {}
                      }
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
                      remove={deleteChip}
                    />
                    <Form.Control
                      id="cosupervisors_internal"
                      type="text"
                      placeholder="Enter an internal co-supervisor ID and press enter"
                      autoComplete="off"
                      value={internal_cosupervisor_input}
                      onChange={(e) =>
                        setInternalCosupervisorInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent the default form submission behavior
                          addChip("cosupervisors_internal", e.target.value);
                        }
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="cosupervisors_external">
                      External Co-supervisors
                    </Form.Label>
                    {cosupervisors_external.map((item, index) => (
                      <Form.Check
                        type="checkbox"
                        id={`${index}`}
                        key={item}
                        label={item}
                        value={item}
                        checked={
                          formData.cosupervisors_external
                            ? formData.cosupervisors_external.includes(item)
                            : false
                        }
                        onChange={(e) => {
                          const selectedItem = e.target.value;
                          if (
                            formData.cosupervisors_external.includes(
                              selectedItem
                            )
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
                      />
                    ))}
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
                      <Modal.Body style={{ paddingTop: 0 }}>
                        <NewExternalCoSupervisor
                          fetchData={fetchData}
                          onClose={() => setShowForm(false)}
                        />
                      </Modal.Body>
                    </Modal>
                  </Form.Group>
                  <Form.Group className="mb-3" ref={levelRef}>
                    <Form.Label htmlFor="thesis_level">Thesis level</Form.Label>
                    <Form.Select
                      id="thesis_level"
                      name="thesis_level"
                      value={formData.thesis_level}
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("level"))
                          ? { borderColor: "red" }
                          : {}
                      }
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
                      remove={deleteChip}
                      values={formData.keywords}
                    />
                    <Form.Control
                      id="keywords"
                      type="text"
                      placeholder="Enter a keyword and press enter"
                      autoComplete="off"
                      value={keywords_input}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent the default form submission behavior
                          addChip("keywords", e.target.value);
                        }
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" ref={typeRef}>
                    <Form.Label htmlFor="type_name">Type</Form.Label>
                    <Form.Control
                      type="text"
                      id="type_name"
                      name="type_name"
                      value={formData.type_name}
                      placeholder="Type"
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("type"))
                          ? { borderColor: "red" }
                          : {}
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" ref={groupRef}>
                    <Form.Label htmlFor="cod_group">Group</Form.Label>
                    <Form.Control
                      type="text"
                      id="cod_group"
                      name="cod_group"
                      value={formData.cod_group}
                      placeholder="Group"
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("group"))
                          ? { borderColor: "red" }
                          : {}
                      }
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
                      style={
                        errors &&
                        errors.some((error) =>
                          error?.path?.includes("required_knowledge")
                        )
                          ? { borderColor: "red" }
                          : {}
                      }
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
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("notes"))
                          ? { borderColor: "red" }
                          : {}
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" ref={expirationRef}>
                    <Form.Label htmlFor="expiration">Expiration</Form.Label>
                    <Form.Control
                      type="date"
                      id="expiration"
                      name="expiration"
                      value={
                        formData.expiration
                          ? dayjs(formData.expiration).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleChangeDate}
                      style={
                        errors &&
                        errors.some((error) =>
                          error?.path?.includes("expiration")
                        )
                          ? { borderColor: "red" }
                          : {}
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" ref={degreeRef}>
                    <Form.Label htmlFor="cod_degree">Degree</Form.Label>
                    <Form.Control
                      type="text"
                      id="cod_degree"
                      name="cod_degree"
                      value={formData.cod_degree}
                      placeholder="Degree"
                      onChange={handleChange}
                      style={
                        errors &&
                        errors.some((error) => error?.path?.includes("degree"))
                          ? { borderColor: "red" }
                          : {}
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <span style={{ fontSize: 18 }}>
                          Insert this thesis as archived
                        </span>
                      </Col>
                      <Col xs="auto" className="d-flex align-items-center">
                        {/* Add d-flex and align-items-center to vertically align the Toggle */}
                        <ToggleComponent
                          formData={formData}
                          handleChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <ToastContainer />

                  <Row className="justify-content-end">
                    <Col xs="auto">
                      <Button
                        className="button-style"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Create
                      </Button>
                    </Col>
                  </Row>
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
