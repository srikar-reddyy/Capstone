import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react'

function Users() {
  const { getToken } = useAuth()
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    const token = await getToken()
    try {
      const response = await axios.get('http://localhost:3003/admin-api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.payload);

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(userId) {
    const token = await getToken()
    try {
      await axios.put(`http://localhost:3003/admin-api/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers()
      setUsers(users.map(user => user.id === userId ? { ...user, isActive: true } : user));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleRestore(userId) {
    const token = await getToken()
    try {
      await axios.put(`http://localhost:3003/admin-api/users/${userId}/restore`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers()
      setUsers(users.map(user => user.id === userId ? { ...user, isActive: false } : user));
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user,index) => (
              user.role!="admin" && (
              <tr key={index} className={user.isActive ? '' : 'table-danger'}>
                <td>{}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Active' : 'Delete'}</td>
                <td>
                  {user.isActive ? (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                  ) : (
                    <button className="btn btn-success btn-sm" onClick={() => handleRestore(user._id)}>Restore</button>
                  )}
                </td>
              </tr>
              )
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
