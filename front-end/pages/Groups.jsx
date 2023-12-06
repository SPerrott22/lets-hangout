import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/TokenContext.jsx'; // Import the context
import './Groups.css';

function GroupBlock({title, members, handleClick, blurred }) {
    let members_string = members ? members.map(member => member.email).join(", ") : "";

    let classString = "groupBlock";
    if(blurred) {
        classString = classString + " blurred"
    }

    return (
        <div>
            <div className={classString} onClick={handleClick}>
                <div className="groupTitle">{title}</div>
                <div className="groupMembers">{members_string}</div>
            </div>

        </div>
    );
}

function ExpandedGroup({ title, members, handleXClick}) {
    //const { tokenInfo, deleteToken } = useContext(TokenContext);

    // function handleClick() {
    //     RSVPEvent();
    //     const currentAttendee = {
    //         id: tokenInfo.userId,
    //         email: tokenInfo.userEmail
    //     }
    //     const new_attendees = rsvp_status ? attendees.filter((a) => a.id !== tokenInfo.userId) : [...attendees, currentAttendee]

    //     setRSVPed(!hasRSVPed);
    //     setPopup({
    //         id: id,
    //         title: title,
    //         startTime: startTime,
    //         endTime: endTime,
    //         guests: new_attendees,
    //         description: description
    //     });

    // }


    return ( 
        <div className="expandedGroup">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleXClick}></button>
            <h2>{title}</h2>
            <p>{members.map(member => member.email).join(", ")}</p>
        </div>
    );
}

export default function Groups() {
    //const [groupsEvents, setGroupsEvents] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [popup, setPopup] = useState({ id: "", title: "", members: ""});
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { tokenInfo, deleteToken } = useContext(TokenContext); // Use context

    useEffect(() => {
        
        if (tokenInfo.token && tokenInfo.userId && tokenInfo.userEmail) {
            fetch(`http://localhost:4000/user/${tokenInfo.userId}/groups`, {
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
                    //setGroupsEvents(data); // Data is a list of groups with their events
                    //setGroups(data);
                    for(const g of data) {
                        getGroupUsers(g);

                        // var currData;
                        // if (tokenInfo.token && tokenInfo.userId && tokenInfo.userEmail) {
                        //     fetch(`http://localhost:4000/groups/${g.group_id}`, {
                        //         method: 'GET',
                        //         headers: {
                        //             'Authorization': `Bearer ${tokenInfo.token}`
                        //         }
                        //     })
                        //     .then(response => {
                        //         if (response.status === 401) { // Check for a 401 response
                        //             handleTokenExpiration(); // Handle token expiration
                        //             return; // Exit the function early
                        //         }
                        //         return response.json();
                        //     })
                        //     .then(data => {
                        //         if (data) {
                        //             // let newGroupUsers = groupUsers;
                        //             //newGroupUsers = [...newGroupUsers, data];
                        //             //setGroupUsers([...groupUsers, data]);
                        //             currData = data;
                        //             console.log(data);
                        //         }
                        //     })
                        //     .then(() => {
                        //         setGroupUsers([...groupUsers, currData]);
                        //     })
                        //     .catch(error => console.error('Error fetching groups:', error));
                        // }
                    }
                }
            })
            .catch(error => console.error('Error fetching groups:', error));
        }
    }, [tokenInfo, navigate]);
    
    async function getGroupUsers(g) {
        console.log("hi");
        const response = await fetch(`http://localhost:4000/groups/${g.group_id}`);
        const data = await response.json();
        console.log(data);
        // if(response.ok) {
        //     const data = await response.json();
        //     console.log("Successfully got group users. Group ID: ", data.id)
        // } else {
        //     const errorData = await response.json();
        //     console.error('Error getting group users:', errorData.message);
        // }
        
        setUsers(data);

    }

    function setUsers(data) {
        setGroupUsers([...groupUsers, data]);
    }

    function handleTokenExpiration() {
        // Optionally clear token or any auth-related data here
        // localStorage.removeItem('token');
        // localStorage.removeItem('user_id');
        // Redirect to login
        deleteToken(); 
        navigate('/login');
    }
    function onGroupClick(id, title, members) {
        setPopup({
            id: id,
            title: title,
            members: members
        });
        setShow(true);
    }

    function onXClick() {
        setShow(false);
    }

    // Filter events based on the search query
    // let filteredEvents = groupsEvents.flatMap(group =>
    //     group.events.filter(event =>
    //         event.title.toLowerCase().includes(searchQuery.toLowerCase())
    //     )
    // );

    // async function RSVP() {
    //     const rsvp_status = popup.guests.some((a) => a.id === tokenInfo.userId);
    //     const newAttendeesList = rsvp_status ? popup.guests.filter((a) => a.id !== tokenInfo.userId).map((a) => a.id) : [...popup.guests.map((a) => a.id), tokenInfo.userId];
    //     console.log(JSON.stringify({
    //         attendees: newAttendeesList
    //     }));
        
    //     const response = await fetch(`http://localhost:4000/event/${popup.id}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${tokenInfo.token}`
    //         },
    //         body: JSON.stringify({
    //             attendees: newAttendeesList
    //         })
    //     });
    //     if (response.ok) {
    //         const data = await response.json();
    //         console.log('Successfully RSVPed. Event ID:', data.id);
    //     } else {
    //         const errorData = await response.json();
    //         console.error('Error RSVPing:', errorData.message);
    //     }

    //     setRSVPs({
    //         ...rsvpStatuses,
    //         [popup.id]: !rsvpStatuses[popup.id]
    //     });

    //     for(const e of filteredEvents) {
    //         if(e.event_id === popup.id) {
    //             const currentAttendee = {
    //                 id: tokenInfo.userId,
    //                 email: tokenInfo.userEmail
    //             }
    //             const new_attendees = rsvp_status ? e.attendees.filter((a) => a.id !== tokenInfo.userId) : [...e.attendees, currentAttendee]
    //             console.log(new_attendees);
    //             e.attendees = new_attendees;
    //             break;
    //         }
    //     }
    // }

    
    //console.log("here");
    //console.log(groupUsers);
    const groupItems = groupUsers.flatMap(group => (
        <GroupBlock
            key={group.id}
            title={group.name}
            members={group.users}
            handleClick={() => onGroupClick(group.id, group.name, group.users)}
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
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}>
                </input>)}
            </div>
            {show && (
                <ExpandedGroup
                    id={popup.id}
                    title={popup.title}
                    members={popup.members}
                    handleXClick={onXClick}
                    setPopup={setPopup}
                    popup={popup}
                />
            )}
            <div className="eventGroup">
                {groupItems}
            </div>
        </div>
    );
}
