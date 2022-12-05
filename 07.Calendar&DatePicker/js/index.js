const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Calendar = $calendar => {
  const date = new Date();

  // prettier-ignore
  const render = () => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const crrLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const preLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

    $calendar.innerHTML = `
      <nav class="calendar-nav">
        <button><i class="fa-solid fas fa-caret-left"></i></button>
        <div class="calendar-title">
          <h2>${MONTH[date.getMonth()]}</h2>
          <span>${date.getFullYear()}</span>
        </div>
        <button><i class="fa-solid fas fa-caret-right"></i></button>
      </nav>
      <ul class="calendar-grid">
      ${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => `
        <li class="ft-sv">${day}</li>`).join('')}
      ${Array(firstDay + crrLastDate + 6 - lastDay).fill(0).map((_, index) => {
          if (index < firstDay) return `<li class="ft-sv">${index - firstDay + preLastDate + 1}</li>`;
          if (index < firstDay + crrLastDate)
            return `<li class="${index % 7 === 0 ? 'ft-red' : ''} ${
              date.getDate() === index - firstDay + 1 ? 'now' : ''
            }" >${index - firstDay + 1}</li>`;
          return `<li class="ft-sv">${index - crrLastDate - firstDay + 1}</li>`;
        }).join('')}
      </ul>`;
  };

  render();
};

export default Calendar;
