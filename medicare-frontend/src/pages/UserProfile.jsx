import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const UserProfile = () => {
  const { user,token, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    if (user && token) {
      fetchUserAppointments();
    } else if (user === null) {
      setLoading(false);
    } else {
      // If user exists but no token, still stop loading
      setLoading(false);
    }

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [user]);

  const fetchUserAppointments = async () => {
    try {
      console.log('Fetching user appointments with token:', user?.token);
      const data = await api.getUserAppointments(token);
      console.log('User appointments received:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Set empty array so the page doesn't stay loading
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.updateAppointment(appointmentId, { status: 'cancelled' }, token);
        fetchUserAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
        <p>User: {user ? JSON.stringify(user) : 'No user'}</p>
        <p>Token: {token ? 'Present' : 'Missing'}</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Header */}
      <header className="profile-header">
        <div className="container">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <h1>Welcome, {user?.name}</h1>
                <p>{user?.email}</p>
                <span className="user-role">{user?.role}</span>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/" className="btn btn-outline">
                <i className="fas fa-home"></i>
                Visit Home
              </Link>
              <button onClick={logout} className="btn btn-login">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="profile-nav">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <i className="fas fa-calendar-alt"></i>
              My Appointments
            </button>
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="profile-content">
        <div className="container">
          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <div className="section-header">
                <h2>My Appointments</h2>
                <a href="#appointment" className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Book New Appointment
                </a>
              </div>

              {appointments.length === 0 ? (
                <div className="no-appointments">
                  <i className="fas fa-calendar-times"></i>
                  <h3>No Appointments Yet</h3>
                  <p>You haven't booked any appointments yet. Book your first appointment to get started!</p>
                  <a href="#appointment" className="btn btn-primary">
                    Book Appointment
                  </a>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h3>{appointment.doctor_name || appointment.doctor}</h3>
                          <span className={`status-badge status-${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="appointment-details">
                          <div className="detail-item">
                            <i className="fas fa-calendar"></i>
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-clock"></i>
                            <span>{appointment.time}</span>
                          </div>
                          {appointment.reason && (
                            <div className="detail-item">
                              <i className="fas fa-stethoscope"></i>
                              <span>{appointment.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        {appointment.status === 'pending' && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <i className="fas fa-times"></i>
                            Cancel
                          </button>
                        )}
                        <button className="btn btn-sm btn-primary">
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Settings</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={user?.name} disabled />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={user?.role} disabled />
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary">
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                  <button className="btn btn-secondary">
                    <i className="fas fa-key"></i>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
