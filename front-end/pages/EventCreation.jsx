import React, { useState } from 'react';
import moment from 'moment';
import './EventCreation.css'; // Import the CSS file for styling

const PeopleList = ({ people }) => (
  <div className="container">
    <h3>People in the Group:</h3>
    <ul className="list-group">
      {people.map((person, index) => (
        <li key={index} className="list-group-item">{person}</li>
      ))}
    </ul>
  </div>
);

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [start_date, setStartDate] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_date, setEndDate] = useState('');
  const [end_time, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');

  const groups = ['Group A', 'Group B', 'Group C']; // Add your group names here

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = moment(`${start_date} ${start_time}`, 'MM/DD/YY HH:mm');
    const endDateTime = moment(`${end_date} ${end_time}`, 'MM/DD/YY HH:mm');

    console.log('Form submitted:', { title, startDateTime, endDateTime, description, selectedGroup });

    // You can perform further actions with the collected data here
    // For now, it's just logging the data to the console

    // Clear form fields after submission
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setSelectedGroup('');
    setPeople([]);
    setNewPerson('');
  };

  const handleAddPerson = () => {
    if (newPerson.trim() !== '') {
      setPeople([...people, newPerson]);
      setNewPerson('');
    }
  };

    return (
      <form onSubmit={handleSubmit} className="event-form">
        <div className="container mt-3">
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
                value={start_date}
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
                value={start_time}
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
                value={end_date}
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
                value={end_time}
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
  
          <div className="mb-3">
            <label htmlFor="group" className="form-label">Select Group:</label>
            <select
              id="group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="form-select"
            >
              <option value="" disabled>Select a group</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
          </div>
  
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    );
};

export default EventForm;
