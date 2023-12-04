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

function Header({tokenProp, tokenDeletion}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    tokenDeletion(); // This will remove the token from localStorage and update the state
  };

  return <header className="App-header">
    <a href="/">Let's Hangout!</a>
    {tokenProp.token && (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
    )}
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
            {
              !tokenInfo.token && 
              <li>
                <Link to='/account'>Create Account</Link>
              </li>
            }
            <li>
              <Link to='/group_creation'>Group Creation</Link>
            </li>
          </ul>
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
