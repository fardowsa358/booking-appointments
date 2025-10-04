import React, { useEffect } from "react";

const Calendar = () => {
  useEffect(()=>{
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const calendar = document.querySelector('.calendar');
    if(!calendar) return;
    calendar.innerHTML = `
      <div class="calendar-header">Sun</div>
      <div class="calendar-header">Mon</div>
      <div class="calendar-header">Tue</div>
      <div class="calendar-header">Wed</div>
      <div class="calendar-header">Thu</div>
      <div class="calendar-header">Fri</div>
      <div class="calendar-header">Sat</div>
    `;
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1,0).getDate();
    const prevMonthLastDay = new Date(year, month,0).getDate();

    for(let i=firstDay-1;i>=0;i--){
      const day=document.createElement('div');
      day.className='calendar-day other-month';
      day.textContent=prevMonthLastDay-i;
      calendar.appendChild(day);
    }

    for(let i=1;i<=daysInMonth;i++){
      const day=document.createElement('div');
      day.className='calendar-day current-month';
      if(i===date.getDate()) day.classList.add('today');
      day.textContent=i;
      calendar.appendChild(day);
    }

    const totalCells=42;
    const daysSoFar=firstDay+daysInMonth;
    const nextDays=totalCells-daysSoFar;
    for(let i=1;i<=nextDays;i++){
      const day=document.createElement('div');
      day.className='calendar-day other-month';
      day.textContent=i;
      calendar.appendChild(day);
    }
  }

  return <div className="table-container"><div className="calendar"></div></div>;
}

export default Calendar;
