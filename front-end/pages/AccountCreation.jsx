import React, { useState } from 'react';
import { redirect, Navigate } from 'react-router-dom';
import "./EventCreation.css";


const AccountCreation = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the user data
    const userData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
    };

    try {
        // Make a POST request to the backend route
        const response = await fetch('http://localhost:4000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      
        // Check if the request was successful (status code 2xx)
        if (response.ok) {
          const responseData = await response.json();
          console.log('User created successfully. User ID:', responseData.id);
          setUser(true);
          // return redirect("/login");

        } else {
          // Handle error responses
          const errorText = await response.text(); // Read response body as text
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText); // Try parsing as JSON
              console.error('Error creating user:', errorData.message);
            } catch (parseError) {
              console.error('Error creating user. Unable to parse JSON:', parseError);
            }
          } else {
            console.error('Error creating user. Empty response body.');
          }
        }
      } catch (error) {
        console.error('Error creating user:', error.message);
      }

    // Clear form fields after submission
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
  };

  return (
      <form onSubmit={handleSubmit} className="account-form">
        {
          user && <Navigate to="/login" replace={true}/>
        }
        <p></p>
        <h2>Create an Account</h2>
        <div className="container mt-3">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
          />
          </div>
          <button type="submit" className="btn btn-primary">Create Account</button>
        </div>
      </form>
  );
};


export default AccountCreation;