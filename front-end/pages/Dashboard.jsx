import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context
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
//{ tokenInfo }
export default function Dashboard() {
    const [groupsEvents, setGroupsEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState({ title: "", time: "", guests: "", description: "" });
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
                                <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Home
                                <span className="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Separated link</a>
                            </div>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <input className="form-control me-sm-2" type="search" placeholder="Search" />
                        <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
  </div>
</nav>
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
