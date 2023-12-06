import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context
import './Dashboard.css';

function EventBlock({ title, startTime, endTime, attendees, handleClick, blurred}) {
    let guest_string = attendees ? attendees.map(attendee => attendee.email).join(", ") : "";

    return (
        <div>
            {!blurred && ( <div className="eventBlock" onClick={handleClick}>
                <div className="eventTitle">{title}</div>
                <p>{startTime} to<br/>{endTime}</p>
                <div className="eventGuests">{guest_string}</div>
            </div> )}
            {blurred && ( <div className="eventBlockBlurred" onClick={handleClick}>
                <div className="eventTitle">{title}</div>
                <p>{startTime} to<br/>{endTime}</p>
                <div className="eventGuests">{guest_string}</div>
            </div> )}
        </div>
    );
}
//{ tokenInfo }
export default function Dashboard() {
    const [groupsEvents, setGroupsEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState({ title: "", startTime: "", endTime: "", guests: "", description: "" });
    const [searchQuery, setSearchQuery] = useState('');
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

    function handleTokenExpiration() {
        // Optionally clear token or any auth-related data here
        // localStorage.removeItem('token');
        // localStorage.removeItem('user_id');
        // Redirect to login
        deleteToken(); 
        navigate('/login');
    }
    function onEventClick(title, startTime, endTime, attendees, description) {
        console.log(attendees);
        setPopup({
            title: title,
            startTime: startTime,
            endTime: endTime,
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
            startTime={event.start_time}
            endTime={event.end_time}
            attendees={event.attendees}
            description={event.description}
            handleClick={() => onEventClick(event.title, event.start_time, event.end_time, event.attendees, event.description)}
            blurred={show}
        />
    ));

    return (
        <div className="dashboard">
            <div className="d-flex">
                {show && (<div className="form-control me-sm-2">
                </div>)}
                {!show &&  (<input
                    className="form-control me-sm-2"
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}>
                </input>)}

            </div>
            {show && (
                <div className="expandedEvent">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => onXClick()}></button>
                    <h2>{popup.title}</h2>
                    <p>{popup.startTime} to<br/>{popup.endTime}</p>
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
