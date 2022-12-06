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

const render = ($calendar, dateState, newDate) => {
  const { date, nowDate, clickedIndex } = dateState;
  const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const crrLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const preLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

  console.log(Boolean(new Date(undefined)));

  console.log(firstDayIndex);
  console.log(crrLastDate);
  console.log(preLastDate);
  console.log(lastDay);

  // prettier-ignore
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
      ${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        .map(day => `<li class="day ft-sv">${day}</li>`).join('')}
      ${Array(firstDayIndex + crrLastDate + 6 - lastDay).fill(0).map((_, index) => {
          if (index < firstDayIndex) return `<li class="ft-sv" data-date='${index}'>${
            index - firstDayIndex + preLastDate + 1
          }</li>`;

          if (index < firstDayIndex + crrLastDate) return `<li class="${index % 7 === 0 ? 'ft-red' : ''} ${
            date.getFullYear() === nowDate.getFullYear() &&
            date.getDate() === nowDate.getDate() &&
            index - firstDayIndex + 1 === nowDate.getDate()
              ? 'now'
              : ''
          } date" data-date='${index}'>${index - firstDayIndex + 1}</li>`;

          return `<li class="ft-sv" data-date='${index}'>${
            index - crrLastDate - firstDayIndex + 1
          }</li>`;
        }).join('')}
    </ul>`;
};

const Calendar = ($calendar, $datePicker) => {
  const dateState = {
    date: new Date(),
    nowDate: new Date(),
  };

  render($calendar, dateState);

  $calendar.addEventListener('click', e => {
    if (!e.target.matches('.calendar-grid > li')) return;
    // $calendar.classList.add('hidden');
    const clickedYear = document.querySelector('.calendar-title').lastElementChild.textContent;
    const clickedMonth = MONTH.indexOf(document.querySelector('.calendar-title').firstElementChild.textContent) + 1;
    const clickedDate = e.target.dataset.index;

    const dateClick = new CustomEvent('date-click', {
      detail: {
        clickedYear,
        clickedMonth,
        clickedDate,
      },
    });
    $datePicker.dispatchEvent(dateClick);
  });
};

export default Calendar;
