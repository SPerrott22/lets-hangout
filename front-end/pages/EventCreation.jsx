import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import moment from 'moment';
import './EventCreation.css'; // Import the CSS file for styling
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context

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

  useEffect(() => {
    // Fetch user's groups when the component mounts
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${tokenInfo.userId}/groups`,{
          method: 'GET',
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

  // const groups = ['Group A', 'Group B', 'Group C']; // Add your group names here

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const startDateTime = moment(`${startDate} ${startTime}`, 'MM/DD/YY HH:mm');
    const endDateTime = moment(`${endDate} ${endTime}`, 'MM/DD/YY HH:mm');
  
    const attendees = selectedGroup ? selectedGroup.value : null;
  
    try {
      const response = await fetch('http://localhost:4000/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: selectedGroup.value,
          title,
          description,
          time: startDateTime.format('YYYY-MM-DD HH:mm:ss'),

          //time: endDateTime.format('YYYY-MM-DD HH:mm:ss'),
          attendees: attendees ? [attendees] : [],  // Pass as an array if it exists
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
            />
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title:</label>
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
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
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
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-control"
            />
          </div>
  
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    );
};

export default EventForm;
