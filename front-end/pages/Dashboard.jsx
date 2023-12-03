import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function EventBlock({ title, time, attendees, description, handleClick }) {
    let guest_string = attendees ? attendees.map(attendee => attendee.email).join(", ") : "";

    return (
        <div className="eventBlock" onClick={handleClick}>
            <div className="eventTitle">{title}</div>
            <p>{time}</p>
            <div className="eventGuests">{guest_string}</div>
        </div>
    );
}

export default function Dashboard({ tokenInfo }) {
    const [groupsEvents, setGroupsEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState({ title: "", time: "", guests: "", description: "" });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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

    function handleTokenExpiration() {
        // Optionally clear token or any auth-related data here
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        // Redirect to login
        navigate('/login');
    }
    function onEventClick(title, time, attendees, description) {
        setPopup({
            title: title,
            time: time,
            guests: attendees.map(attendee => attendee.email).join(", "),
            description: description
        });
        setShow(true);
    }

    function onXClick() {
        setShow(false);
    }

    // Filter events based on the search query
    const filteredEvents = groupsEvents.flatMap(group =>
        group.events.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const eventItems = filteredEvents.map(event => (
        <EventBlock
            key={event.event_id}
            title={event.title}
            time={event.time}
            attendees={event.attendees}
            description={event.description}
            handleClick={() => onEventClick(event.title, event.time, event.attendees, event.description)}
        />
    ));

    return (
        <div className="dashboard">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {show && (
                <div className="expandedEvent">
                    <div className="xButton" onClick={() => onXClick()}></div>
                    <h2>{popup.title}</h2>
                    <p>{popup.time}</p>
                    <p>{popup.guests}</p>
                    <div className="expandedEventDescription">{popup.description}</div>
                </div>
            )}
            <div className="eventArea">
                {eventItems}
            </div>
        </div>
    );
}
