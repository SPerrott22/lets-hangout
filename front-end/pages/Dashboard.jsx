import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context
import './Dashboard.css';

function EventBlock({ title, startTime, endTime, attendees, handleClick, blurred, rsvp_status}) {
    // const currentAttendee = {
    //     id: tokenInfo.userId,
    //     email: tokenInfo.userEmail
    // }
    // let newGuests = attendees;
    // let found = false;
    // for(const a of newGuests) {
    //     if(a.id === currentAttendee.id) {
    //         found = true;
    //         break;
    //     }
    // }
    // if(rsvp_status && !found) {
    //     newGuests = [...newGuests, currentAttendee];
    // } else if(!rsvp_status && found) {
    //     attendees.filter((a) => a.id !== tokenInfo.userId);
    // }
    // attendees = newGuests;
    let guest_string = attendees ? attendees.map(attendees => attendees.email).join(", ") : "";

    

    let classString = "eventBlock";
    if(blurred) {
        classString = classString + " blurred"
    }
    if(rsvp_status) {
        classString = classString + " rsvped"
    } else {
        classString = classString + " notRsvped"
    }

    return (
        <div>
            <div className={classString} onClick={handleClick}>
                <div className="eventTitle">{title}</div>
                <p>{startTime} to<br/>{endTime}</p>
                <div className="eventGuests">{guest_string}</div>
            </div>
            {/* {!blurred && ( <div className="eventBlock" onClick={handleClick}>
                <div className="eventTitle">{title}</div>
                <p>{startTime} to<br/>{endTime}</p>
                <div className="eventGuests">{guest_string}</div>
            </div> )}
            {blurred && ( <div className="eventBlock blurred" onClick={handleClick}>
                <div className="eventTitle">{title}</div>
                <p>{startTime} to<br/>{endTime}</p>
                <div className="eventGuests">{guest_string}</div>
            </div> )} */}
        </div>
    );
}

function ExpandedEvent({ id, title, startTime, endTime, attendees, description, RSVPEvent, handleXClick, setPopup}) {
    const { tokenInfo, deleteToken } = useContext(TokenContext);
    const rsvp_status = attendees.some((a) => a.id === tokenInfo.userId);
    const [hasRSVPed, setRSVPed] = useState(rsvp_status);

    function handleClick() {
        RSVPEvent();
        const currentAttendee = {
            id: tokenInfo.userId,
            email: tokenInfo.userEmail
        }
        const new_attendees = rsvp_status ? attendees.filter((a) => a.id !== tokenInfo.userId) : [...attendees, currentAttendee]

        setRSVPed(!hasRSVPed);
        setPopup({
            id: id,
            title: title,
            startTime: startTime,
            endTime: endTime,
            guests: new_attendees,
            description: description
        });

    }

    let classString = "expandedEvent";
    if(rsvp_status) {
        classString = classString + " rsvped";
    } else {
        classString = classString + " notRsvped";
    }

    return ( 
        <div className={classString}>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleXClick}></button>
            <h2>{title}</h2>
            <p>{startTime} to<br/>{endTime}</p>
            <p>{attendees.map(attendee => attendee.email).join(", ")}</p>
            <div className="expandedEventDescription">{description}</div>
            {!hasRSVPed && (<div className="rsvp-button"><button type="button" className="btn btn-primary" onClick={handleClick}>RSVP</button></div>)}
            {hasRSVPed && (<div className="rsvp-button"><button type="button" className="btn btn-danger" onClick={handleClick}>Un-RSVP</button></div>)}
        </div>
    );
}

export default function Dashboard() {
    const [groupsEvents, setGroupsEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState({ id: "", title: "", startTime: "", endTime: "", guests: "", description: "" });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { tokenInfo, deleteToken } = useContext(TokenContext); // Use context
    const [rsvpStatuses, setRSVPs] = useState({});


    useEffect(() => {
        if (tokenInfo.token && tokenInfo.userId && tokenInfo.userEmail) {
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
                    let initialRSVPs = {};
                    for(const g of data) {
                        for(const e of g.events) {
                            initialRSVPs[e.event_id] = e.attendees.some((a) => a.id === tokenInfo.userId);
                        }
                    }
                    setRSVPs(initialRSVPs);
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
    function onEventClick(id, title, startTime, endTime, attendees, description) {
        setPopup({
            id: id,
            title: title,
            startTime: startTime,
            endTime: endTime,
            guests: attendees,
            description: description
        });
        setShow(true);
    }

    function onXClick() {
        setShow(false);
    }

    // Filter events based on the search query
    let filteredEvents = groupsEvents.flatMap(group =>
        group.events.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    async function RSVP() {
        const rsvp_status = popup.guests.some((a) => a.id === tokenInfo.userId);
        const newAttendeesList = rsvp_status ? popup.guests.filter((a) => a.id !== tokenInfo.userId).map((a) => a.id) : [...popup.guests.map((a) => a.id), tokenInfo.userId];
        console.log(JSON.stringify({
            attendees: newAttendeesList
        }));
        
        const response = await fetch(`http://localhost:4000/event/${popup.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenInfo.token}`
            },
            body: JSON.stringify({
                attendees: newAttendeesList
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Successfully RSVPed. Event ID:', data.id);
        } else {
            const errorData = await response.json();
            console.error('Error RSVPing:', errorData.message);
        }

        setRSVPs({
            ...rsvpStatuses,
            [popup.id]: !rsvpStatuses[popup.id]
        });

        for(const e of filteredEvents) {
            if(e.event_id === popup.id) {
                const currentAttendee = {
                    id: tokenInfo.userId,
                    email: tokenInfo.userEmail
                }
                const new_attendees = rsvp_status ? e.attendees.filter((a) => a.id !== tokenInfo.userId) : [...e.attendees, currentAttendee]
                console.log(new_attendees);
                e.attendees = new_attendees;
                break;
            }
        }
    }

    

    const eventItems = filteredEvents.map(event => (
        <EventBlock
            key={event.event_id}
            title={event.title}
            startTime={event.start_time}
            endTime={event.end_time}
            attendees={event.attendees}
            description={event.description}
            handleClick={() => onEventClick(event.event_id, event.title, event.start_time, event.end_time, event.attendees, event.description)}
            blurred={show}
            rsvp_status={rsvpStatuses[event.event_id]}
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
                <ExpandedEvent
                    id={popup.id}
                    title={popup.title}
                    startTime={popup.startTime}
                    endTime={popup.endTime}
                    attendees={popup.guests}
                    description={popup.description}
                    RSVPEvent={RSVP}
                    handleXClick={onXClick}
                    setPopup={setPopup}
                    popup={popup}
                />
            )}
            <div className="eventArea">
                {eventItems}
            </div>
        </div>
    );
}
