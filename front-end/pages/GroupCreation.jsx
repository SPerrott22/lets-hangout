import React, { useState } from 'react';
import Select from 'react-select';
import useToken from "../src/useToken";

const GroupForm = () => {
  // const [selectedUsers, setSelectedUsers] = useState([{value: "1234", label: "ash ketchum"}]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [groupCreated, setGroupCreated] = useState(false);

  const { setToken, deleteToken, tokenInfo } = useToken();

  const fetchUsers = async (inputValue) => {
    try {
      const response = await fetch(`http://localhost:4000/users?email=${inputValue}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const userOptions = data.users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.email})`,
      }));
  
      setOptions(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (newValue) => {
    setSearchTerm(newValue);
    /*
    if (!newValue) {
    }
    */
  
    fetchUsers(newValue);
  };

  const handleUserSelect = (selectedOption, action) => {
    if (action.action === 'clear') {
      // If 'x' button is clicked, clear the selected users
      setSelectedUsers([]);
    } else if (action.action === 'select-option') {
        // If a user is selected (not popped using 'x'), add it to the selectedUsers state
        console.log(selectedOption);
        setSelectedUsers(selectedOption);
        console.log(selectedUsers);
    } else {
        console.log("Not clear or select option");
        console.log(action);
    }
  
    setSearchTerm('');
    setOptions([]);
  };
  
  

  const handleCreateGroup = async () => {
    try {
      // Extract user IDs from selectedUsers
      const userIds = selectedUsers.map((user) => user.value);
      console.log(selectedUsers);

      // Make a POST request to the backend route to create a group
      const response = await fetch('http://localhost:4000/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "GroupNameEpic",
          user_ids: userIds,
          creator_id: tokenInfo.userId
          // Additional data for group creation if needed
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Group created successfully. Group ID:', data.id);
        setGroupCreated(true);
      } else {
        const errorData = await response.json();
        console.error('Error creating group:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating group:', error.message);
    }
  };

  return (
    <div>
      {groupCreated && <p>Group created successfully!</p>}
      <h2>Create Group</h2>
      <Select
        isMulti
        value={selectedUsers}
        options={options}
        onInputChange={handleInputChange}
        onChange={handleUserSelect}
        onMenuClose={() => setSearchTerm('')}
        placeholder="Search for users..."
      />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div> 
  );
};

export default GroupForm;