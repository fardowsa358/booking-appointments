import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      fetchUserAppointments();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const fetchUserAppointments = async () => {
    try {
      const data = await api.getUserAppointments(user?.token);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-login">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-content">
            <h2>My Appointments</h2>
            
            {appointments.length === 0 ? (
              <div className="no-appointments">
                <p>You don't have any appointments yet.</p>
                <a href="#appointment" className="btn btn-appointment">
                  Book an Appointment
                </a>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-info">
                      <h3>{appointment.doctor_name || appointment.doctor}</h3>
                      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {appointment.time}</p>
                      <p><strong>Status:</strong> 
                        <span className={`status-badge status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </p>
                      {appointment.reason && (
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                      )}
                    </div>
                    <div className="appointment-actions">
                      <button className="btn btn-sm">Edit</button>
                      <button className="btn btn-sm btn-danger">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
