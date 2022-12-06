import Calendar from './calendar/calendar.js';

const render = $datePicker => {
  $datePicker.innerHTML = `
    <h2>Date Picker</h2>
    <input type="input" class="date-select" placeholder="Select date" />
    <section class="calendar hidden"></section>`;
};

const Picker = $datePicker => {
  render($datePicker);

  const $calendar = document.querySelector('.calendar');
  Calendar($calendar);

  document.body.addEventListener('click', e => {
    if (!e.target.matches('.date-select')) return;

    $calendar.classList.remove('hidden');
  });

  // document.bdoy.addEventListener('click', e => {
  //   if (document.querySelector('.calendar').firstElementChild) {
  //     document.querySelector('.calendar').innerHTML = '';
  //   }
  // });
};

export default Picker;
