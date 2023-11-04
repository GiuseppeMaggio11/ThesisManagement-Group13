import { Alert } from "react-bootstrap";

function ErrorAlert() {
  return (
    <Alert variant="danger" className="m-5">
      <Alert.Heading>Errore!</Alert.Heading>
      <p>Si è verificato un errore inaspettato, ti preghiamo di riprovare.</p>
    </Alert>
  );
}

export default ErrorAlert;
