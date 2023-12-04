import React, { useEffect, useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context

import { useNavigate } from 'react-router-dom';

import "./Calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [groupsEvents, setGroupsEvents] = useState([]);
  const navigate = useNavigate();
  const { tokenInfo, deleteToken } = useContext(TokenContext); // Use context

  useEffect(() => {
    if (tokenInfo.token && tokenInfo.userId) {
        fetch(`http://localhost:4000/user/${tokenInfo.userId}/groups_events?full=True`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenInfo.token}`
            }
        })
        .then(response => {
            if (response.status === 401) { // Check for a 401 response
                handleTokenExpiration(); // Handle token expiration
                return; // Exit the function early
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log(data); // Debugging line
                setGroupsEvents(data); // Data is a list of groups with their events
            }
        })
        .catch(error => console.error('Error fetching events:', error));
    }
  }, [tokenInfo, navigate]); //
  
  const handleTokenExpiration = () => {
    // Optionally clear token or any auth-related data here
    // localStorage.removeItem('token');
    // localStorage.removeItem('user_id');
    // Redirect to login
    deleteToken(); 
    navigate('/login');
  }

  const formatEvents = () => {
    let events = [];
    groupsEvents.forEach(group => {
      group.events.forEach(event => {
        events.push({
          start: moment(event.time).toDate(),
          end: moment(event.time)
                 .add(1, "days")
                 .toDate(),
          title: event.title
        });
      });
    });
    return events;
  }

  // const events = [
  //   {
  //     start: moment().toDate(),
  //     end: moment()
  //       .add(1, "days")
  //       .toDate(),
  //     title: "Some title"
  //   }
  // ];

  return (
    <div className="calendar">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={formatEvents()}
        style={{ height: "100vh" }}
      />
    </div>
  );
}

export default MyCalendar;