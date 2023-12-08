import { Button, Modal } from 'react-bootstrap';

function ConfirmationModal(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {
          props.handleAction(props.thesis_id);
          handleClose();
        }}>
          {props.action}
        </Button>
      </Modal.Footer>
    </Modal>
);
}

export default ConfirmationModal;