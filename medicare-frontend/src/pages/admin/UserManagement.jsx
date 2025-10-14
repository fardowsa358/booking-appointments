import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const UserManagement = () => {
  const { user,token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (user && token) {
      fetchUsers();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers(token);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId, token);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.updateUserStatus(userId, !currentStatus, token);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="user-management">
        <div className="page-header">
          <h2>User Management</h2>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userItem) => (
                <tr key={userItem.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <span className="user-name">{userItem.name}</span>
                        <span className="user-id">ID: {userItem.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{userItem.email}</td>
                  <td>
                    <span className={`role-badge role-${userItem.role}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${userItem.status ? 'active' : 'inactive'}`}>
                      {userItem.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {new Date(userItem.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className={`btn btn-sm ${userItem.status ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleUserStatus(userItem.id, userItem.status)}
                        title={userItem.status ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas fa-${userItem.status ? 'ban' : 'check'}`}></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(userItem.id)}
                        title="Delete User"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-data">
            <i className="fas fa-users"></i>
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
