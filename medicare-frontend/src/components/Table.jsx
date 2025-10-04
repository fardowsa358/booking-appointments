import React from "react";

const Table = ({ type }) => {
  if(type==="appointments"){
    const appointments = [
      { patient:"John Smith", doctor:"Dr. Emily Wilson", time:"09:00 AM", dept:"Cardiology", status:"confirmed" },
      { patient:"Maria Garcia", doctor:"Dr. Michael Brown", time:"09:30 AM", dept:"Pediatrics", status:"pending" },
      { patient:"Robert Johnson", doctor:"Dr. Sarah Lee", time:"10:15 AM", dept:"Orthopedics", status:"confirmed" },
      { patient:"Lisa Chen", doctor:"Dr. James Miller", time:"11:00 AM", dept:"Dermatology", status:"cancelled" },
      { patient:"David Wilson", doctor:"Dr. Amanda Taylor", time:"11:45 AM", dept:"Neurology", status:"confirmed" },
    ];

    return (
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Today's Appointments</div>
          <button className="btn btn-primary">New Appointment</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Time</th><th>Department</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app,i)=>(
              <tr key={i}>
                <td>{app.patient}</td>
                <td>{app.doctor}</td>
                <td>{app.time}</td>
                <td>{app.dept}</td>
                <td><span className={`status ${app.status}`}>{app.status.charAt(0).toUpperCase()+app.status.slice(1)}</span></td>
                <td><button className="btn btn-outline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    const patients = [
      {id:"#P-10023", name:"John Smith", age:45, gender:"Male", lastVisit:"Sep 12, 2023", condition:"Hypertension"},
      {id:"#P-10024", name:"Maria Garcia", age:32, gender:"Female", lastVisit:"Sep 10, 2023", condition:"Diabetes"},
      {id:"#P-10025", name:"Robert Johnson", age:58, gender:"Male", lastVisit:"Sep 8, 2023", condition:"Arthritis"},
      {id:"#P-10026", name:"Lisa Chen", age:29, gender:"Female", lastVisit:"Sep 5, 2023", condition:"Migraine"},
      {id:"#P-10027", name:"David Wilson", age:65, gender:"Male", lastVisit:"Sep 3, 2023", condition:"Asthma"},
    ];

    return (
      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Recent Patients</div>
          <button className="btn btn-primary">Add Patient</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Last Visit</th><th>Condition</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p,i)=>(
              <tr key={i}>
                <td>{p.id}</td><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.lastVisit}</td><td>{p.condition}</td>
                <td><button className="btn btn-outline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table;
