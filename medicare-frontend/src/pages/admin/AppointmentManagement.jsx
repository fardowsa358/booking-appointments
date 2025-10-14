import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AppointmentManagement = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchAppointments();
    } else if (user === null) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAllAppointments(token);
      setAppointments(data);
    } catch (err) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Appointments</h2>
          <p>Review and manage all appointments</p>
        </div>

        <div className="appointments-section">
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.patient_name}</td>
                    <td>{a.doctor_name || a.doctor}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.time}</td>
                    <td>
                      <span className={`status-badge status-${a.status}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagement;


