import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ErrorAlert from "./components/ErrorAlert";
import HomePage from "./components/HomePage";

import LoginForm from "./components/LoginForm";
import TeacherPage from "./components/TeacherPage";
import NewProposal from "./components/NewProposal";

import ThesisPage from "./components/ThesisPage";

import "./style.css";
import { Button, Container } from "react-bootstrap";
import Header from "./components/Header";
import API from "./API";
import VirtualClock from "./components/VirtualClock";
import MessageContext from "./messageCtx";
import Applications from "./components/Applications";
import SearchProposalRoute from "./components/SearchProposal"
import Toasts from "./components/Toasts";
import StudentApplications from "./components/StudentApplications";


function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [virtualClock, setVirtualClock] = useState(new Date());
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  // If an error occurs, the error message will be shown in a toast.
  const handleToast = (err, type) => {
    console.log(err)
    let msg = "";
    if (err.error) msg = err.error;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";
    if(type==='success')
      setType(type)
    else
      setType('error')
    setMessage(msg);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const user = await API.getUserInfo();
        setLoading(false);
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
      <MessageContext.Provider value={{ handleToast }}>
      <Toasts
        message={message}
        type={type}
        onClose={() => {setMessage(""); setType("")}}
      />
        <div className="wrapper">
          <Header user={user} logout={logOut} />
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  loading={loading}
                  setLoading={setLoading}
                  user={user}
                />
              }
            />
            {/* <Route
              path="/login"
              element={
                loggedIn && user.user_type === "PROF" ? (
                  <Navigate replace to="/teacher" />
                ) : loggedIn && user.user_type === "STUD" ? (
                  <Navigate replace to='/proposal'/>
                ) : (
                  <LoginForm
                    loginSuccessful={loginSuccessful}
                    logOut={logOut}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )
              }
            /> */}
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
                  <Navigate replace to="/" />
                )
              }
            />
            <Route
              path="/proposal"
              element={
                loggedIn && user.user_type === "STUD" ? (
                  <SearchProposalRoute
                    loading={loading}
                    setLoading={setLoading}
                    virtualClock={virtualClock}
                  />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
            <Route
              path="/newproposal"
              element={
                loggedIn && user.user_type === "PROF" ? (
                  <NewProposal loading={loading} virtualClock={virtualClock} setLoading={setLoading} />
                ) : (
                  <ErrorAlert />
                )
              }
            />
            <Route
              path="/applications"
              element={
                loggedIn && user.user_type === "PROF" ? (
                  <Applications loading={loading} setLoading={setLoading} />
                ) : (
                  <ErrorAlert />
                )
              }
            />
            <Route
              path="/proposals/:id"
              element={
                loggedIn ? (
                  <ThesisPage
                    loading={loading}
                    virtualClock={virtualClock}
                    setLoading={setLoading}
                  />
                ) : (
                  <LoginForm
                    loginSuccessful={loginSuccessful}
                    logOut={logOut}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )
              }
            ></Route>
            <Route
              path="/studentapplications"
              element={
                loggedIn && user.user_type === "STUD" ? (
                  <StudentApplications
                    loading={loading}
                    setLoading={setLoading}
                    virtualClock={virtualClock}
                  />
                ) : (
                  <ErrorAlert />
                )
              }
            ></Route>

            {/*Leave DefaultRoute as last route */}
            <Route path="/*" element={<DefaultRoute />} />
          </Routes>
        </div>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

function DefaultRoute() {
  return (
    <Container className="App">
      <h1>Page not found...</h1>
      <Link to="/">
        <Button variant="light" className="button-style fs-5">
          Please go back to home page
        </Button>
      </Link>
    </Container>
  );
}

export default App;
