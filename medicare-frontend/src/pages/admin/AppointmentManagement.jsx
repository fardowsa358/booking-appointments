import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AppointmentManagement = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ doctor_id: '', date: '', time: '', status: '' });
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);

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

  const fetchDoctors = async () => {
    try {
      const list = await api.getDoctors();
      setDoctors(list);
    } catch (e) {
      setDoctors([]);
    }
  };

  const openEdit = (appt) => {
    setEditing(appt);
    setForm({
      doctor_id: appt.doctor_id || '',
      date: appt.date?.slice(0,10) || '',
      time: appt.time || '',
      status: appt.status || 'pending'
    });
    fetchDoctors();
  };

  const onFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        doctor_id: form.doctor_id ? Number(form.doctor_id) : undefined,
        date: form.date,
        time: form.time,
        status: form.status
      };
      await api.updateAppointment(editing.id, payload, token);
      setEditing(null);
      await fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to update appointment');
    } finally {
      setSaving(false);
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
                  <th>Actions</th>
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
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-primary" onClick={() => openEdit(a)}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editing && (
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h3>Edit Appointment #{editing.id}</h3>
                <button className="close-btn" onClick={() => setEditing(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form className="doctor-form" onSubmit={saveEdit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Doctor</label>
                    <select name="doctor_id" value={form.doctor_id} onChange={onFormChange}>
                      <option value="">Keep current</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="date" value={form.date} onChange={onFormChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input type="time" name="time" value={form.time} onChange={onFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={form.status} onChange={onFormChange}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagement;


