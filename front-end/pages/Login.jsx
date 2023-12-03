import './Login.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

async function loginUser(username, password) {
    const base64Credentials = btoa(username + ':' + password);

    return fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + base64Credentials
        }
    })
    .then(response => {
        if (!response.ok) {
            // If the response is not ok (like 401 Unauthorized), throw an error.
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (!data.token) {
            throw new Error('Token not found in response');
        }
        return data
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// function login(username, password) {
//     // Encode username and password in Base64
//     const base64Credentials = btoa(username + ':' + password);

//     fetch('http://localhost:4000/login', {
//         method: 'GET', // or 'POST' if your backend is set up to handle POST
//         headers: {
//             'Authorization': 'Basic ' + base64Credentials,
//         },
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         // Handle your JWT token here, e.g., storing it for future requests
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }

import  { useEffect } from 'react';

export default function Login({ tokenInfo, setToken }) {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        // const token = await loginUser(
        //     username,
        //     password
        // );
        // setToken(token);
        // navigate(from, { replace: true });
        try {
            const response = await loginUser(username, password);
            // console.log(response);
            if (response && response.token && response.user_id) {
                // console.log(response.token);
                // console.log(response.user_id);
                setToken(response.token, response.user_id);
                navigate(from, { replace: true });
            } else {
                // Handle the case where token is not present or response is undefined
                console.error('Login failed: Token is missing in the response');
                // Optionally, display an error message to the user
                setError('Login failed: Incorrect username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Optionally, display an error message to the user
            setError('Login failed: An error occurred');
        }    

    }

    // useEffect(() => {
    //     if (tokenInfo.token && tokenInfo.userId) {
    //         navigate(from, { replace: true });
    //     }
    // }, [tokenInfo, navigate, from]);



    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}