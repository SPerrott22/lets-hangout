import { useState } from 'react'
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
import useToken from './useToken';
import './App.css';
import EventForm from '../pages/EventCreation';

function App() {
  // const [count, setCount] = useState(0)

  // const [profileData, setProfileData] = useState(null);
  const { tokenInfo, setToken } = useToken();

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

    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <a href="/">Let's Hangout!</a>
          </header>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login setToken={setToken} tokenInfo={tokenInfo} />} />
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard tokenInfo={tokenInfo}/>
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
            </Routes>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link to='/calendar'>Calendar</Link>
            </li>
            <li>
              <Link to='/event_creation'>Event Creation</Link>
            </li>
          </ul>
        </div>
      </BrowserRouter>
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
