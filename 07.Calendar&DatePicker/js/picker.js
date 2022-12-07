import Calendar from './calendar/calendar.js';
import { CalendarRender } from './calendar/state.js';

const render = $datePicker => {
  $datePicker.innerHTML = `
    <h2>Date Picker</h2>
    <input type="input" class="date-select" placeholder="Select date" disabled />
    <section class="calendar"></section>`;
};

const Picker = $datePicker => {
  render($datePicker);
  // document로 calendarNODE를 가져올 경우 재사용이 불가하다.
  // 재사용 가능하게 만들때는 document사용에 조심할것!!!!
  const $calendar = $datePicker.querySelector('.calendar');

  const dateState = Calendar($calendar, $datePicker);
  let newDate = null;

  $datePicker.addEventListener('click', e => {
    if (e.target.matches('.date-select') && !$calendar.firstElementChild) CalendarRender($calendar, dateState, newDate);
    // e.target이 icon일때 그리고 parentNode가 button일때 closest이 상위요소를 찾지 못한다.
    else if (!$calendar.contains(e.target) && !e.target.closest('button')) $calendar.innerHTML = '';
  });

  // prettier-ignore
  $datePicker.addEventListener('date-click', e => {
    const { clickedYear, clickedMonth, clickedDate } = e.detail;
    $datePicker.querySelector('.date-select').value =
     `${clickedYear}-${clickedMonth.padStart(2,0)}-${clickedDate.padStart(2, 0)}`;

    newDate = {
      clickedYear,
      clickedMonth,
      clickedDate,
    };

    $calendar.innerHTML = '';
  });
};
export default Picker;
