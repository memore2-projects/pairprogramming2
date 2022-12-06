import Calendar from './calendar/calendar.js';

const render = $datePicker => {
  $datePicker.innerHTML = `
    <h2>Date Picker</h2>
    <input type="input" class="date-select" placeholder="Select date" />
    <section class="calendar"></section>`;
};

const Picker = $datePicker => {
  render($datePicker);

  const $calendar = document.querySelector('.calendar');

  document.body.addEventListener('click', e => {
    if (e.target.matches('.date-select') && !$calendar.firstElementChild) Calendar($calendar, $datePicker);
    else if (!e.target.closest('.calendar')) $calendar.innerHTML = '';
  });
  // console.log($datePicker);
  $datePicker.addEventListener('date-click', e => {
    const { clickedYear, clickedMonth, clickedDate } = e.detail;
    document.querySelector('.date-select').value = `${clickedYear}-${clickedMonth}-${clickedDate}`;
  });
};

export default Picker;
