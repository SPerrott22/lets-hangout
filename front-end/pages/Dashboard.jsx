import './Dashboard.css'

function EventBlock({title, time, guests}) {
    let guest_string = guests.join(", ");

    return <div className="eventBlock">
        <h2>{title}</h2>
        <p>{time}</p>
        <p>{guest_string}</p>
    </div>;
}

export default function Dashboard() {
    let data = [
        {id: 1234, title: "Coding Meetup", time: "11/30/23 15:00-18:00", guests: ["Joshua Zhu", "Andrew", "Matt"]},
        {id: 5678, title: "Grab Dinner", time: "11/30/23 18:00-19:00", guests: ["Joshua Zhu", "Joshua Li"]},
        {id: 1111, title: "CTF", time: "12/2/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"]},
        {id: 1112, title: "CTF Again!", time: "12/9/23 12:00-17:00", guests: ["Joshua Zhu", "Andrew Kuai", "Alex Zhang", "Jason An", "Benson Liu"]}
    ]
    const eventItems = data.map(event => <EventBlock title={event.title} time={event.time} guests={event.guests} />)

    return <div className="dashboard">
        <div className="eventArea">
            {eventItems}
        </div>
    </div>;
}