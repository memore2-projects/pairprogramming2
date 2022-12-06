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

const render = ($calendar, dateState) => {
  const { date, nowDate, clickedIndex } = dateState;
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const crrLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const preLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

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
      ${Array(firstDay + crrLastDate + 6 - lastDay).fill(0).map((_, index) => {
          if (index < firstDay) return `<li class="ft-sv ${index === clickedIndex ? 'clicked' : ''}" data-index ='${index}'>${
            index - firstDay + preLastDate + 1
          }</li>`;

          if (index < firstDay + crrLastDate) return `<li class="${index % 7 === 0 ? 'ft-red' : ''} ${
            date.getFullYear() === nowDate.getFullYear() &&
            date.getDate() === nowDate.getDate() &&
            index - firstDay + 1 === nowDate.getDate()
              ? 'now'
              : ''
          } date ${index === clickedIndex ? 'clicked' : ''}" data-index ='${index}'>${index - firstDay + 1}</li>`;

          return `<li class="ft-sv ${index === clickedIndex ? 'clicked' : ''}" data-index ='${index}'>${
            index - crrLastDate - firstDay + 1
          }</li>`;
        }).join('')}
    </ul>`;

  console.log(clickedIndex);
};

const Calendar = $calendar => {
  const dateState = {
    date: new Date(),
    nowDate: new Date(),
    clickedIndex: null,
  };

  render($calendar, dateState);

  $calendar.addEventListener('click', e => {
    if (!e.target.matches('.calendar-grid > li')) return;

    dateState.clickedIndex = +e.target.dataset.index;
    $calendar.classList.add('hidden');
    console.log(dateState.clickedIndex);
  });

  document.body.addEventListener('click', e => {
    if (!e.target.closest('.calendar')) {
      $calendar.classList.add('hidden');
    }
  });
};

export default Calendar;
