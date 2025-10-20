import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const ReportsPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getAllAppointments(token);
        setAppointments(data);
      } catch (e) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const downloadPDF = () => {
    // Simple print-to-PDF: open printable view
    const w = window.open('', '_blank');
    if (!w) return;
    const rows = appointments.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.patient_name}</td>
        <td>${a.doctor_name || a.doctor}</td>
        <td>${new Date(a.date).toLocaleDateString()}</td>
        <td>${a.time}</td>
        <td>${a.status}</td>
      </tr>
    `).join('');
    w.document.write(`
      <html>
        <head>
          <title>Appointments Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h1 { margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Appointments Report</h1>
          <table>
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
              ${rows}
            </tbody>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Reports</h2>
          <p>Export appointments to PDF (use browser Save as PDF)</p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Appointments</h3>
            <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
          </div>
          <div className="card-content">
            {loading ? (
              <p>Loading...</p>
            ) : (
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
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;


