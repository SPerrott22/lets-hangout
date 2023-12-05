import { useState, useContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import RequireAuth from '../components/RequireAuth';
import MyCalendar from '../pages/Calendar';
import axios from "axios";
import logo from '/vite.svg';
import api from './api';
// import useToken from './useToken';
import './App.css';
import EventForm from '../pages/EventCreation';
import { TokenContext } from '../context/TokenContext.jsx';
import AccountCreation from '../pages/AccountCreation';
import GroupForm from '../pages/GroupCreation';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom"

function Header({tokenProp, tokenDeletion}) {
  const navigate = useNavigate();
  const location = useLocation();
  

  const handleLogout = () => {
    navigate("/");
    tokenDeletion(); // This will remove the token from localStorage and update the state
  };

  return <header className="App-header">
    {/* <a href="/">Let's Hangout!</a>
    {tokenProp.token && (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
    )} */}
    
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
          <a className="navbar-brand" href="/">Let's Hangout!</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    {location.pathname==="/" && (<a className="nav-link active" href="/">Home</a>)}
                    {location.pathname!=="/" && (<a className="nav-link" href="/">Home</a>)}
                  </li>
                  <li className="nav-item">
                    {location.pathname==="/dashboard" && (<a className="nav-link active" href="/dashboard">Dashboard</a>)}
                    {location.pathname!=="/dashboard" && (<a className="nav-link" href="/dashboard">Dashboard</a>)}
                  </li>
                  <li className="nav-item">
                    {location.pathname==="/calendar" && (<a className="nav-link active" href="/calendar">Calendar</a>)}
                    {location.pathname!=="/calendar" && (<a className="nav-link" href="/calendar">Calendar</a>)}
                  </li>
                  <li className="nav-item">
                    {location.pathname==="/event_creation" && (<a className="nav-link active" href="/event_creation">Create Event</a>)}
                    {location.pathname!=="/event_creation" && (<a className="nav-link" href="/event_creation">Create Event</a>)}
                  </li>
                  {tokenProp.token && (
                    <button onClick={handleLogout} className="btn btn-danger" type="button">
                      Logout
                    </button>)}
                  {!tokenProp.token && (
                    <li className="nav-item">
                      {location.pathname==="/account" && (<a className="nav-link active" href="/account">Create Account</a>)}
                      {location.pathname!=="/account" && (<a className="nav-link" href="/account">Create Account</a>)}
                    </li>
                  )}
              </ul>
          </div>
      </div>
    </nav>
  </header>
}

function App() {
  const { tokenInfo, deleteToken } = useContext(TokenContext);
  

  // const [count, setCount] = useState(0)

  // const [profileData, setProfileData] = useState(null);
  // const { tokenInfo, setToken, deleteToken } = useToken();

  // useEffect(() => {
  //   console.log('New tokenInfo:', tokenInfo);
  // }, [tokenInfo]);


  /*
  function getData() {
    api({
      method: "GET",
      url:"/profile",
    })
    .then((response) => {
      const res =response.data
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}
    */

    /*
    if (!token) {
      return <Login setToken={setToken} />;
    }
    */

    
  
    // tokenInfo={tokenInfo}
    //setToken={setToken} tokenInfo={tokenInfo} 

    return (
      // <TokenProvider>
      <BrowserRouter>
        <div className="App">
            <Header tokenProp={tokenInfo} tokenDeletion={deleteToken}/>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard /> 
                </RequireAuth>
              }/>
              <Route path="/calendar" element={ 
                <RequireAuth>
                  <MyCalendar />
                </RequireAuth>
              } /> 
              <Route path="/event_creation" element= {
                <RequireAuth>
                  <EventForm />
                </RequireAuth>
              } /> 
              <Route path="/group_creation" element= {
                <RequireAuth>
                  <GroupForm />
                </RequireAuth>
              } /> 
              <Route path = "/account" element = {<AccountCreation/>}/>
            </Routes>
        </div>
      </BrowserRouter>
      // </TokenProvider>
    );
  


  // return (
  //   <>
  //     <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App
