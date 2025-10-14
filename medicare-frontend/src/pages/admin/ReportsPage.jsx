import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const ReportsPage = () => {
  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Reports</h2>
          <p>Analytics and exportable reports will appear here.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Coming Soon</h3>
          </div>
          <div className="card-content">
            <p>
              This section will include charts and downloadable CSV/PDF reports for
              appointments, users, and doctors activity. For now, navigation works
              and the page renders correctly.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;


