import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import About from '../pages/About';
import Home from '../pages/Home';
// import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import axios from "axios";
import logo from '/vite.svg';
import api from './api';
import useToken from './useToken';
import './App.css';

function App() {
  // const [count, setCount] = useState(0)

  const [profileData, setProfileData] = useState(null);
  const { token, setToken } = useToken();

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

    if (!token) {
      return <Login setToken={setToken} />;
    }

    return (
      <BrowserRouter>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
  
          {/* new line start*/}
          <p>To get your profile details: </p><button onClick={getData}>Click me</button>
          {profileData && <div>
                <p>Profile name: {profileData.profile_name}</p>
                <p>About me: {profileData.about_me}</p>
              </div>
          }
           {/* end of new line */}
        </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        <ul>
          <li>
            <Link to='/about'>about</Link>
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
