import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ErrorAlert from "./components/ErrorAlert";
import HomePage from "./components/HomePage";
import TeacherPage from "./components/TeacherPage";
import NewProposal from "./components/NewProposal";
import "./style.css";
import { Button, Container } from "react-bootstrap";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      /*API calls here*/
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Routes>
          <Route
            path="/"
            element={
              !error ? (
                <HomePage
                  loading={loading}
                  setLoading={setLoading}
                  error={error}
                  setError={setError}
                />
              ) : (
                <ErrorAlert />
              )
            }
          />
          {/*Others route here */}
          <Route
            path="/teacher"
            element={
              !error ? (
                <TeacherPage
                  loading={loading}
                  setLoading={setLoading}
                  error={error}
                  setError={setError}
                />
              ) : (
                <ErrorAlert />
              )
            }
          />
          <Route
            path="/newproposal"
            element={
              !error ? (
                <NewProposal
                  loading={loading}
                  setLoading={setLoading}
                  error={error}
                  setError={setError}
                />
              ) : (
                <ErrorAlert />
              )
            }
          />
          {/*Leave DefaultRoute as last route */}
          <Route path="/*" element={<DefaultRoute />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function DefaultRoute() {
  return (
    <Container className="App">
      <h1>Page not found...</h1>
      <Link to="/">
        <Button variant="light" className="fs-5">
          Please go back to home page
        </Button>
      </Link>
    </Container>
  );
}

export default App;
