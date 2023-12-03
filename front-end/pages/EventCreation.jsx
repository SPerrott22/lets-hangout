import React, { useState } from 'react';
import moment from 'moment';
import './EventCreation.css'; // Import the CSS file for styling

const PeopleList = ({ people }) => (
  <div>
    <h3>People in the Group:</h3>
    <ul>
      {people.map((person, index) => (
        <li key={index}>{person}</li>
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
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="start_date">Start Date:</label>
        <input
          type="text"
          id="start_date"
          value={start_date}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="MM/DD/YY"
          required
        />
        <label htmlFor="start_time">Start Time:</label>
        <input
          type="text"
          id="start_time"
          value={start_time}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="HH:mm"
          required
        />
      </div>

      <div>
        <label htmlFor="end_date">End Date:</label>
        <input
          type="text"
          id="end_date"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="MM/DD/YY"
          required
        />
        <label htmlFor="end_time">End Time:</label>
        <input
          type="text"
          id="end_time"
          value={end_time}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="HH:mm"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="group">Select Group:</label>
        <select
          id="group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="" disabled>Select a group</option>
          {groups.map((group, index) => (
            <option key={index} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EventForm;
