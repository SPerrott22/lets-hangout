import React, { useState, useEffect } from "react";
import Select from "react-select";
import useToken from "../src/useToken";
import "./GroupCreation.css";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [groupCreated, setGroupCreated] = useState(false);

  const { setToken, deleteToken, tokenInfo } = useToken();

  const fetchUsers = async (inputValue) => {
    try {
      const response = await fetch(
        `http://localhost:4000/users?email=${inputValue}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const filteredUsers = data.users.filter(
        (user) => user.id !== tokenInfo.userId
      );

      const userOptions = filteredUsers.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.email})`,
      }));

      setOptions(userOptions);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers("");
  }, [tokenInfo.userId]);

  const handleInputChange = (newValue) => {
    setSearchTerm(newValue);
    fetchUsers(newValue);
  };

  const handleUserSelect = (selectedOption, action) => {
    if (action.action === "clear") {
      // If 'x' button is clicked, clear the selected users
      setSelectedUsers([]);
    } else if (action.action === "select-option") {
      // If a user is selected (not popped using 'x'), add it to the selectedUsers state
      console.log(selectedOption);
      setSelectedUsers(selectedOption);
      console.log(selectedUsers);
    } else if (action.action === "remove-value") {
      // If a user clicks the 'x' on the option, remove it from the selectedUsers state
      const toRemove = action.removedValue;
      setSelectedUsers(
        selectedUsers.filter((el) => el.value !== toRemove.value)
      );
    } else if (action.action === "pop-value") {
      // If a user types backspace when search is blank, remove the last option from the selectedUsers state
      // Almost same logic as remove-value, just toRemove could be null
      const toRemove = action.removedValue;
      if (toRemove) {
        setSelectedUsers(
          selectedUsers.filter((el) => el.value !== toRemove.value)
        );
      }
    } else {
      console.log("Not clear or select option");
      console.log(selectedOption);
      console.log(action);
    }

    handleInputChange("");
  };

  const handleCreateGroup = async () => {
    try {
      // Extract user IDs from selectedUsers
      const userIds = selectedUsers.map((user) => user.value);
      userIds.push(tokenInfo.userId);

      // Make a POST request to the backend route to create a group
      const response = await fetch("http://localhost:4000/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          user_ids: userIds,
          creator_id: tokenInfo.userId,
          // Additional data for group creation if needed
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log("Group created successfully. Group ID:", data.id);
        setGroupCreated(true);
      } else {
        const errorData = await response.json();
        console.error("Error creating group:", errorData.message);
        setGroupCreated(false);
      }
    } catch (error) {
      console.error("Error creating group:", error.message);
      setGroupCreated(false);
    }
    setGroupName("");
    setSelectedUsers([]);
    handleInputChange("");
  };

  return (
    <div className="main-container">
      <div className="card">
        <form onSubmit={handleCreateGroup} className="group-form">
          <p></p>
          <h2>Create Group</h2>
          <div className="container mt-3">
            <div className="mb-3">
              <label htmlFor="group-name" className="form-label">
                Group Name:
              </label>
              <input
                type="text"
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <Select
                isMulti
                value={selectedUsers}
                options={options}
                onInputChange={handleInputChange}
                onChange={handleUserSelect}
                onMenuClose={() => setSearchTerm("")}
                placeholder="Search for users..."
              />
            </div>
            {!groupCreated && <p></p>}
            {groupCreated && <p>Group created successfully!</p>}
            <button type="submit" className="btn btn-primary">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;
