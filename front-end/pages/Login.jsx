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
    .then(response => response.json())
    .then(data => {
        // console.log('Success:', data);
        // Handle your JWT token here, e.g., storing it for future requests
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


export default function Login({ setToken }) {
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser(
            username,
            password
        );
        setToken(token);
        navigate(from, { replace: true });
    }

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
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