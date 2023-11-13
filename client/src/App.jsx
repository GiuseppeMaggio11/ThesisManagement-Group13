import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ErrorAlert from "./components/ErrorAlert";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import TeacherPage from "./components/TeacherPage";
import NewProposal from "./components/NewProposal";
import "./style.css";
import { Button, Container } from "react-bootstrap";
import Header from "./components/Header";
import API from "./API";
import VirtualClock from "./components/VirtualClock";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [virtualClock, setVirtualClock] = useState(new Date());

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        if (error.response && error.response.status !== 401) {
          console.log(err);
          setError(true);
        }
      }
    };
    checkAuth();
    setLoading(false);
  }, []);

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setLoading(false);
  };
  const logOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
  };

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header user={user} logout={logOut} />
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
          <Route
            path="/login"
            element={
              loggedIn && user.user_type === "PROF" ? (
                <Navigate replace to="/teacher" />
              ) : (
                loggedIn ? (
                  <Navigate replace to="/" />
              ) : (
                <LoginForm
                 loginSuccessful={loginSuccessful}
                 logOut={logOut}
                 loading={loading}
                 setLoading={setLoading}
               />
             )

              ) 
            }
          />
          <Route
            path="/virtualclock"
            element={
              <VirtualClock
                virtualClock={virtualClock}
                setVirtualClock={setVirtualClock}
              />
            }
          />
          <Route
            path="/teacher"
            element={
              loggedIn && user.user_type === "PROF" ? (
                <TeacherPage
                  loading={loading}
                  setLoading={setLoading}
                  error={error}
                  setError={setError}
                />
              ) : (
                <Navigate replace to="/login" />
              ) 
            }
          />
          <Route
            path="/newproposal"
            element={
              loggedIn && user.user_type === "PROF" ? (
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
