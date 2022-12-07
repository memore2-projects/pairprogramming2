import setDateState from './setDate.js';
import CalendarRender from './render.js';

[...document.querySelectorAll('link')]
  .at(-1)
  .insertAdjacentHTML('afterend', '<link href="./calendar/calendar.css" rel="stylesheet" />');

const Calendar = ($calendar, $datePicker) => {
  const dateState = {
    date: new Date(),
    nowDate: new Date(),
  };

  $calendar.addEventListener('click', e => {
    if (!e.target.matches('.calendar-grid > li') || e.target.matches('.day')) return;

    const clickedYear = e.target.dataset.date.split('-')[0];
    const clickedMonth = e.target.dataset.date.split('-')[1];
    const clickedDate = e.target.dataset.date.split('-')[2];

    const dateClick = new CustomEvent('date-click', {
      detail: {
        clickedYear,
        clickedMonth,
        clickedDate,
      },
    });

    $datePicker.dispatchEvent(dateClick);
  });

  $calendar.addEventListener('click', e => {
    if (!e.target.closest('.arrow')) return;

    setDateState(e.target, dateState);
    CalendarRender($calendar, dateState);
  });

  return dateState;
};
export default Calendar;
