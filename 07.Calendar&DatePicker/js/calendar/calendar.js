import { setDateState, CalendarRender } from './state.js';

const Calendar = ($calendar, $datePicker) => {
  const dateState = {
    date: new Date(),
    nowDate: new Date(),
  };

  $calendar.addEventListener('click', e => {
    if (!e.target.matches('.calendar-grid > li') || e.target.matches('.day')) return;
    // $calendar.classList.add('hidden');
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
    // if (e.target.closest('.arrow.left')) {
    //   dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() - 1, 1);
    // }
    // if (e.target.closest('.arrow.right')) {
    //   dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() + 1, 1);
    // }
    // render($calendar, dateState);
  });
  return dateState;
};
export default Calendar;
