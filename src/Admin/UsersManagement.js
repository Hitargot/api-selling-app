import React, { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../utils/api";

function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/admin/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Users Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersManagement;
