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

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CalendarRender = ($calendar, dateState, newDate) => {
  const { nowDate } = dateState;
  let { date } = dateState;
  if (newDate) {
    date = new Date(`${newDate.clickedYear}/${newDate.clickedMonth}/${newDate.clickedDate}`);
  }
  const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const crrLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const preLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();

  // prettier-ignore
  $calendar.innerHTML = `
    <nav class="calendar-nav">
      <button class='arrow left'><i class="fa-solid fas fa-caret-left"></i></button>
      <div class="calendar-title">
        <h2>${MONTH[dateMonth]}</h2>
        <span>${dateYear}</span>
      </div>
      <button class='arrow right'><i class="fa-solid fas fa-caret-right"></i></button>
    </nav>
    <ul class="calendar-grid">
      ${DAYS.map(day => `<li class="day ft-sv">${day}</li>`).join('')}
      ${Array(firstDayIndex + crrLastDate + 6 - lastDay)
        .fill(0)
        .map((_, index) => {
          if (index < firstDayIndex)
            return `<li class="ft-sv" data-date='${dateYear}-${dateMonth}-${index - firstDayIndex + preLastDate + 1}'>${
              index - firstDayIndex + preLastDate + 1
              }</li>`;
          
          if (index < firstDayIndex + crrLastDate)
            return `<li class="${index % 7 === 0 ? 'ft-red' : ''} ${
              dateState.date.getFullYear() === nowDate.getFullYear() &&
              dateState.date.getMonth() === nowDate.getMonth() &&
              dateState.date.getDate() === nowDate.getDate() &&
              index - firstDayIndex + 1 === nowDate.getDate()
                ? 'now'
                : ''
            } date" data-date='${dateYear}-${dateMonth + 1}-${index - firstDayIndex + 1}'>${
              index - firstDayIndex + 1
              }</li>`;
          
          return `<li class="ft-sv" data-date='${dateYear}-${dateMonth + 2}-${
            index - crrLastDate - firstDayIndex + 1
          }'>${index - crrLastDate - firstDayIndex + 1}</li>`;
        })
        .join('')}
    </ul>`;

  if (newDate) {
    [...$calendar.querySelectorAll('.calendar-grid > li')].forEach(date => {
      if (date.dataset.date === `${newDate.clickedYear}-${newDate.clickedMonth}-${newDate.clickedDate}`)
        date.classList.add('clicked');
    });
  }
};

export default CalendarRender;
