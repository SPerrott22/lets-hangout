// import './Dashboard.css'
// import { useState } from 'react';

// function EventBlock({title, time, guests, description, handleClick}) {
 
//     let guest_string = guests.join(", ");


//     return <div className="eventBlock" onClick={handleClick}>
//         <div className="eventTitle">{title}</div>
//         <p>{time}</p>
//         <div className="eventGuests">{guest_string}</div>
//     </div>;
// }


// var popup = {title: "", time: "", guests: "", description: ""}
// export default function Dashboard({ tokenInfo }) {
//     const[show, setShow] = useState(false)
//     let data = [
//         {id: 1234, title: "Coding Meetup", time: "11/30/23 15:00-18:00", guests: ["Joshua Zhu", "Andrew", "Matt"], description: "code things"},
//         {id: 5678, title: "Grab Dinner", time: "11/30/23 18:00-19:00", guests: ["Joshua Zhu", "Joshua Li"], description: "eat food"},
//         {id: 1111, title: "CTF", time: "12/2/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"], description: "capture the flag"},
//         {id: 1112, title: "CTF Again!", time: "12/9/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"], description: "capture the flag again"}
//     ]
//     const eventItems = data.map(event => <EventBlock title={event.title} time={event.time} guests={event.guests} description={event.desc} handleClick={() => onEventClick(event.title, event.time, event.guests, event.description)}/>)

//     function onEventClick(title, time, guests, description) {
//         popup.title = title;
//         popup.time = time;
//         popup.guests = guests.join(", ");
//         popup.description = description;
//         console.log("here");
//         setShow(true);
//     }

//     function onXClick() {
//         setShow(false);
//     }

//     console.log(popup.title);
//     return <div className="dashboard">
//         {show && <div className="expandedEvent">
//             <div className="xButton" onClick={() => onXClick()}></div>
//             <h2>{popup.title}</h2>
//             <p>{popup.time}</p>
//             <p>{popup.guests}</p>
//             <div className="expandedEventDescription">{popup.description}</div>
//         </div>}
//         <div className="eventArea">
//             {eventItems}
//         </div>
//     </div>;
// }

// import React, { useState, useEffect } from 'react';
// import './Dashboard.css';

// function EventBlock({title, time, guests, description, handleClick}) {
//     let guest_string = guests.join(", ");

//     return (
//         <div className="eventBlock" onClick={handleClick}>
//             <div className="eventTitle">{title}</div>
//             <p>{time}</p>
//             <div className="eventGuests">{guest_string}</div>
//         </div>
//     );
// }

// export default function Dashboard({ tokenInfo }) {
//     const [events, setEvents] = useState([]);
//     const [show, setShow] = useState(false);
//     var popup = {title: "", time: "", guests: "", description: ""};

//     useEffect(() => {
//         if (tokenInfo.token && tokenInfo.userId) {
//             fetch(`http://localhost:4000/user/${tokenInfo.userId}/groups_events`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${tokenInfo.token}`
//                 }
//             })
//             .then(response => response.json())
//             .then(data => {
//                 setEvents(data);
//             })
//             .catch(error => console.error('Error fetching events:', error));
//         }
//     }, [tokenInfo]);

//     function onEventClick(title, time, guests, description) {
//         popup.title = title;
//         popup.time = time;
//         popup.guests = guests.join(", ");
//         popup.description = description;
//         setShow(true);
//     }

//     function onXClick() {
//         setShow(false);
//     }

//     const eventItems = events.map(event => (
//         <EventBlock
//             key={event.event_id}
//             title={event.title}
//             time={event.time}
//             guests={event.attendees.map(attendee => attendee.email)}
//             description={event.description}
//             handleClick={() => onEventClick(event.title, event.time, event.attendees.map(attendee => attendee.email), event.description)}
//         />
//     ));

//     return (
//         <div className="dashboard">
//             {show && (
//                 <div className="expandedEvent">
//                     <div className="xButton" onClick={() => onXClick()}></div>
//                     <h2>{popup.title}</h2>
//                     <p>{popup.time}</p>
//                     <p>{popup.guests}</p>
//                     <div className="expandedEventDescription">{popup.description}</div>
//                 </div>
//             )}
//             <div className="eventArea">
//                 {eventItems}
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function EventBlock({title, time, attendees, description, handleClick}) {
    let guest_string = attendees ? attendees.map(attendee => attendee.email).join(", ") : "";
    // let guest_string = attendees.map(attendee => attendee.email).join(", ");

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
    const navigate = useNavigate();
    // var popup = {title: "", time: "", guests: "", description: ""};

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


    // function onEventClick(title, time, guests, description) {
    //     let guest_string = guests ? guests.map(guest => guest.email).join(", ") : "";
    //     popup.title = title;
    //     popup.time = time;
    //     popup.guests = guest_string;
    //     popup.description = description;
    //     setShow(true);
    // }

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


    if (!Array.isArray(groupsEvents)) {
        return <div>Loading or error...</div>;
    }

    // Flatten the group events structure to create event items
    const eventItems = groupsEvents.flatMap(group =>
        group.events.map(event => (
            <EventBlock
                key={event.event_id}
                title={event.title}
                time={event.time}
                attendees={event.attendees}
                description={event.description}
                handleClick={() => onEventClick(event.title, event.time, event.attendees, event.description)}
            />
        ))
    );

    return (
        <div className="dashboard">
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
