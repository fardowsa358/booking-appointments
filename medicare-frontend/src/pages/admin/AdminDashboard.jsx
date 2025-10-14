import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      fetchDashboardData();
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard admin data with token:', user?.token);
      const [statsData, appointmentsData] = await Promise.all([
        api.getDashboardStats(user?.token),
        api.getAllAppointments(user?.token)
      ]);
      console.log(statsData)
      setStats(statsData.stats);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-login">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.totalUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p className="stat-number">{stats?.totalAppointments || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Appointments</h3>
              <p className="stat-number">{stats?.pendingAppointments || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Today's Appointments</h3>
              <p className="stat-number">{stats?.todayAppointments || 0}</p>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="appointments-section">
            <h2>Recent Appointments</h2>
            <div className="table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 10).map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.doctor_name || appointment.doctor}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`status-badge status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
