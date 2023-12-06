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

    return ( 
        <div className="expandedGroup">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleXClick}></button>
            <h2>{title}</h2>
            <p></p>
            <div className="bottom-margin"><div className="expandedGroupList">Members:<br/>{members.map(member => member.email).join(", ")}</div></div>
        </div>
    );
}

export default function Groups() {
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
                    setGroupUsers(data);
                }
            })
            .catch(error => console.error('Error fetching groups:', error));
        }
    }, [tokenInfo, navigate]);

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

    const groupItems = groupUsers.map(group => (
        <GroupBlock
            key={group.group_id}
            title={group.group_name}
            members={group.users}
            handleClick={() => onGroupClick(group.group_id, group.group_name, group.users)}
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
            <div className="groupArea">
                {groupItems}
            </div>
        </div>
    );
}
