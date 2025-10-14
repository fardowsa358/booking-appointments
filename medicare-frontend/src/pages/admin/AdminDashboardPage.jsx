import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboardPage = () => {
  // console.log(" sax sax")
  const { user,token } = useAuth();
  // console.log(token)
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
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

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data with token:', user?.token);
      
      const [statsData, appointmentsData, activitiesData] = await Promise.all([
        api.getDashboardStats(token),
        api.getAllAppointments(token),
        api.getRecentActivities(token)
      ]);
      
      console.log('Dashboard data received:', { statsData, appointmentsData, activitiesData });
      
      setStats(statsData.stats);
      setAppointments(appointmentsData);
      setRecentActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set some default data so the page doesn't stay loading
      setStats({
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        todayAppointments: 0
      });
      setAppointments([]);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
          <p>User: {user ? JSON.stringify(user) : 'No user'}</p>
          <p>Token: {user?.token ? 'Present' : 'Missing'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Dashboard Overview</h2>
          <p>Welcome back, {user?.name}! Here's what's happening at MediCare.</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.totalUsers || 0}</p>
              <span className="stat-label">Registered Patients</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-content">
              <h3>Doctors</h3>
              <p className="stat-number">{stats?.totalDoctors || 0}</p>
              <span className="stat-label">Active Doctors</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3>Appointments</h3>
              <p className="stat-number">{stats?.totalAppointments || 0}</p>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-number">{stats?.pendingAppointments || 0}</p>
              <span className="stat-label">Awaiting Confirmation</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>Confirmed</h3>
              <p className="stat-number">{stats?.confirmedAppointments || 0}</p>
              <span className="stat-label">Confirmed Today</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-content">
              <h3>Today</h3>
              <p className="stat-number">{stats?.todayAppointments || 0}</p>
              <span className="stat-label">Today's Appointments</span>
            </div>
          </div>
        </div>

        {/* Charts and Tables Row */}
        <div className="dashboard-content">
          <div className="dashboard-row">
            {/* Recent Appointments */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Appointments</h3>
                <a href="/admin/appointments" className="view-all">View All</a>
              </div>
              <div className="card-content">
                <div className="appointments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{appointment.patient_name}</td>
                          <td>{appointment.doctor_name || appointment.doctor}</td>
                          <td>{new Date(appointment.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge status-${appointment.status}`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Activities</h3>
              </div>
              <div className="card-content">
                <div className="activities-list">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <i className={`fas fa-${activity.type === 'appointment' ? 'calendar' : 'user'}`}></i>
                      </div>
                      <div className="activity-content">
                        <p>{activity.title}</p>
                        <span className="activity-time">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="quick-actions">
                <a href="/admin/doctors" className="action-btn">
                  <i className="fas fa-user-plus"></i>
                  <span>Add Doctor</span>
                </a>
                <a href="/admin/appointments" className="action-btn">
                  <i className="fas fa-calendar-plus"></i>
                  <span>Manage Appointments</span>
                </a>
                <a href="/admin/users" className="action-btn">
                  <i className="fas fa-users-cog"></i>
                  <span>Manage Users</span>
                </a>
                <a href="/admin/reports" className="action-btn">
                  <i className="fas fa-chart-line"></i>
                  <span>View Reports</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
