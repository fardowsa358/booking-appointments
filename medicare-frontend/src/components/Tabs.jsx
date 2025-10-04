import React, { useState } from "react";
import Table from "./Table";
import Calendar from "./Calendar";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <>
      <div className="tabs">
        <div className={`tab ${activeTab==="appointments" ? "active":""}`} onClick={()=>setActiveTab("appointments")}>Appointments</div>
        <div className={`tab ${activeTab==="calendar" ? "active":""}`} onClick={()=>setActiveTab("calendar")}>Calendar</div>
        <div className={`tab ${activeTab==="patients" ? "active":""}`} onClick={()=>setActiveTab("patients")}>Recent Patients</div>
      </div>

      <div className={`tab-content ${activeTab==="appointments" ? "active":""}`}>
        {activeTab==="appointments" && <Table type="appointments" />}
      </div>
      <div className={`tab-content ${activeTab==="calendar" ? "active":""}`}>
        {activeTab==="calendar" && <Calendar />}
      </div>
      <div className={`tab-content ${activeTab==="patients" ? "active":""}`}>
        {activeTab==="patients" && <Table type="patients" />}
      </div>
    </>
  );
}

export default Tabs;
