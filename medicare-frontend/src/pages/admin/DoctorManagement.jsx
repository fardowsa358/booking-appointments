import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const DoctorManagement = () => {
  const { user,token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user && token) {
      fetchDoctors();
    } else if (user === null) {
      setLoading(false);
    } else {
      // If user exists but no token, still stop loading
      setLoading(false);
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        // Update doctor
        await api.updateDoctor(editingDoctor.id, formData,token);
      } else {
        // Add new doctor
        await api.createDoctor(formData, token);
      }
      
      setShowForm(false);
      setEditingDoctor(null);
      setFormData({ name: '', specialty: '', email: '', phone: '' });
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email || '',
      phone: doctor.phone || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.deleteDoctor(doctorId, token);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', specialty: '', email: '', phone: '' });
    setEditingDoctor(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctors...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="doctor-management">
        <div className="page-header">
          <h2>Doctor Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus"></i>
            Add Doctor
          </button>
        </div>

        {/* Add/Edit Doctor Form */}
        {showForm && (
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h3>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                <button className="close-btn" onClick={resetForm}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="doctor-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Doctor Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialty</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Dentistry">Dentistry</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Doctors Table */}
        <div className="doctors-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <div className="doctor-info">
                      <div className="doctor-avatar">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <span>{doctor.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="specialty-badge">{doctor.specialty}</span>
                  </td>
                  <td>{doctor.email || 'N/A'}</td>
                  <td>{doctor.phone || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(doctor)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doctor.id)}
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
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;
