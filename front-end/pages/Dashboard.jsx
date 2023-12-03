import './Dashboard.css'
import { useState } from 'react';

function EventBlock({title, time, guests, description, handleClick}) {
 
    let guest_string = guests.join(", ");


    return <div className="eventBlock" onClick={handleClick}>
        <div className="eventTitle">{title}</div>
        <p>{time}</p>
        <div className="eventGuests">{guest_string}</div>
    </div>;
}


var popup = {title: "", time: "", guests: "", description: ""}
export default function Dashboard() {
    const[show, setShow] = useState(false)
    let data = [
        {id: 1234, title: "Coding Meetup", time: "11/30/23 15:00-18:00", guests: ["Joshua Zhu", "Andrew", "Matt"], description: "code things"},
        {id: 5678, title: "Grab Dinner", time: "11/30/23 18:00-19:00", guests: ["Joshua Zhu", "Joshua Li"], description: "eat food"},
        {id: 1111, title: "CTF", time: "12/2/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"], description: "capture the flag"},
        {id: 1112, title: "CTF Again!", time: "12/9/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"], description: "capture the flag again"}
    ]
    const eventItems = data.map(event => <EventBlock title={event.title} time={event.time} guests={event.guests} description={event.desc} handleClick={() => onEventClick(event.title, event.time, event.guests, event.description)}/>)

    function onEventClick(title, time, guests, description) {
        popup.title = title;
        popup.time = time;
        popup.guests = guests.join(", ");
        popup.description = description;
        console.log("here");
        setShow(true);
    }

    console.log(popup.title);
    return <div className="dashboard">
        {show && <div className="expandedEvent">
            <div className="xButton"></div>
            <h2>{popup.title}</h2>
            <p>{popup.time}</p>
            <p>{popup.guests}</p>
            <p>{popup.description}</p>
        </div>}
        <div className="eventArea">
            {eventItems}
        </div>
    </div>;
}