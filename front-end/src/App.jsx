import { useState, useContext } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import RequireAuth from "../components/RequireAuth";
import MyCalendar from "../pages/Calendar";
import axios from "axios";
import logo from "/logo.svg";
import api from "./api";
import Footer from "./Footer";
// import useToken from './useToken';
import "./App.css";
import EventForm from "../pages/EventCreation";
import { TokenContext } from "../context/TokenContext.jsx";
import AccountCreation from "../pages/AccountCreation";
import GroupForm from "../pages/GroupCreation";
import Groups from "../pages/Groups";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Brand from "/Olivia Wilson.png";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Header({ tokenProp, tokenDeletion }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
    tokenDeletion(); // This will remove the token from localStorage and update the state
  };

  const handleLoginClick = () => {
    navigate("/login");
  }

  return (
    <header className="App-header">
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <a
            className="navbar-brand py-0 align-content-start align-content-md-stretch"
            href="/"
          >
            <img
              src={logo}
              alt="Brand"
              style={{ height: "40px", marginRight: "10px" }}
            />
            Let's Hangout!
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/dashboard" ? "active" : ""
                  }`}
                  href="/dashboard"
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/groups" ? "active" : ""
                  }`}
                  href="/groups"
                >
                  Groups
                </a>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/calendar" ? "active" : ""
                  }`}
                  href="/calendar"
                >
                  Calendar
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/event_creation" ? "active" : ""
                  }`}
                  href="/event_creation"
                >
                  Create Event
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    location.pathname === "/group_creation" ? "active" : ""
                  }`}
                  href="/group_creation"
                >
                  Create Group
                </a>
              </li>
            </ul>
            {tokenProp.token && (
              <>
                <div className="ms-auto d-none d-lg-block">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            {!tokenProp.token &&  (
              <>
                <div className="ms-auto d-none d-lg-block">
                  <button
                      onClick={handleLoginClick}
                      className="btn btn-success"
                      type="button"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

function App() {
  const { tokenInfo, deleteToken } = useContext(TokenContext);

  return (
    <BrowserRouter>
      <div className="App">
        <Header tokenProp={tokenInfo} tokenDeletion={deleteToken} />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/groups"
            element={
              <RequireAuth>
                <Groups />
              </RequireAuth>
            }
          />

          <Route
            path="/calendar"
            element={
              <RequireAuth>
                <MyCalendar />
              </RequireAuth>
            }
          />
          <Route
            path="/event_creation"
            element={
              <RequireAuth>
                <EventForm />
              </RequireAuth>
            }
          />
          <Route
            path="/group_creation"
            element={
              <RequireAuth>
                <GroupForm />
              </RequireAuth>
            }
          />
          <Route path="/account" element={<AccountCreation />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
