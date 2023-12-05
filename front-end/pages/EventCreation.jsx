import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import './EventCreation.css'; // Import the CSS file for styling
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context
import { useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState();
  const [groupOptions, setGroupOptions] = useState([]);

  const { tokenInfo, deleteToken } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's groups when the component mounts
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${tokenInfo.userId}/groups`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenInfo.token}`
          }
        }).then(response => {
          if (response.status === 401) { // Check for a 401 response
            handleTokenExpiration(); // Handle token expiration
            return; // Exit the function early
          }
          return response;
        });
        const data = await response.json();
        console.log("Response fron server:", data);

        const groupOptions = data.map((g) => ({
          value: g.group_id,
          label: g.group_name
        }))

        setGroupOptions(groupOptions);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchGroups();
  }, [tokenInfo.userId]); // Run this effect when the user ID changes

  const handleTokenExpiration = () => {
    // Optionally clear token or any auth-related data here
    // localStorage.removeItem('token');
    // localStorage.removeItem('user_id');
    // Redirect to login
    deleteToken(); 
    navigate('/login');
  }

  const handleGroupSelect = (selectedOption, action) => {
    if (action.action === 'clear') {
    } else if (action.action === 'select-option') {
      setSelectedGroup(selectedOption);
    } else if (action.action === 'remove-value') {
    } else if (action.action === 'pop-value') {
    } else {
        console.log("Not clear or select option");
        console.log(selectedOption);
        console.log(action);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const attendees = [];

    const startDateTime = startDate.concat(' ', startTime);
    const endDateTime = endDate.concat(' ', endTime);

    try {
      const response = await fetch('http://localhost:4000/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenInfo.token}`
        },
        body: JSON.stringify({
          group_id: selectedGroup.value,
          title,
          description,
          start_time: startDateTime,
          end_time: endDateTime,
          attendees
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Event created successfully. Event ID:', data.id);
      } else {
        const errorData = await response.json();
        console.error('Error creating event:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  
    // Clear form fields after submission
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setSelectedGroup(null);  // Reset selected group to null
  };

    return (
      <form onSubmit={handleSubmit} className="event-form">
        <div className="container mt-3">
          <div className="mb-3">
            <label htmlFor="group" className="form-label">Select Group:</label>
            <Select
              value={selectedGroup}
              options={groupOptions}
              onChange={handleGroupSelect}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">Event Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-control"
            />
          </div>
  
          <div className="row g-3 mb-3">
            <div className="col">
              <label htmlFor="start_date" className="form-label">Start Date:</label>
              <input
                type="date"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="MM/DD/YY"
                required
                className="form-control"
              />
            </div>
            <div className="col">
              <label htmlFor="start_time" className="form-label">Start Time:</label>
              <input
                type="time"
                id="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="HH:mm"
                required
                className="form-control"
              />
            </div>
          </div>
  
          <div className="row g-3 mb-3">
            <div className="col">
              <label htmlFor="end_date" className="form-label">End Date:</label>
              <input
                type="date"
                id="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="MM/DD/YY"
                required
                className="form-control"
              />
            </div>
            <div className="col">
              <label htmlFor="end_time" className="form-label">End Time:</label>
              <input
                type="time"
                id="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="HH:mm"
                required
                className="form-control"
              />
            </div>
          </div>
  
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Event Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-control"
              maxLength="250"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Event</button>
        </div>
      </form>
    );
};

export default EventForm;
