import Calendar from '../calendar/calendar.js';
import CalendarRender from '../calendar/render.js';

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
    else if (!$calendar.contains(e.target) && !e.target.closest('button')) $calendar.innerHTML = '';
  });

  document.body.addEventListener('click', e => {
    if (e.target.closest('.calendar') || e.target.matches('.date-select') || e.target.closest('button')) return;
    $calendar.innerHTML = '';
  });

  // prettier-ignore
  $datePicker.addEventListener('date-click', e => {
    const { clickedYear, clickedMonth, clickedDate } = e.detail;
    $datePicker.querySelector('.date-select').value = `${clickedYear}-${clickedMonth.padStart(
      2,
      0
    )}-${clickedDate.padStart(2, 0)}`;

    newDate = {
      clickedYear,
      clickedMonth,
      clickedDate,
    };

    // 클릭 지점이 calendar 영역과 date picker 영역이 아닐 때 calendar를 닫기 위해서 위의 함수에서 body에 click 이벤트를 걸어 구현하고자 하였다.
    // 그러나 조건을 판별하는 과정에서 calendar 안의 요소를 클릭했을 경우를 if문에서 판별하지 못해 전체 calendar를 닫는 현상이 일어났다.
    // 원인은 그 요소를 클릭했을 때 우선적으로 해당 calendar를 닫기 때문에 조건문의 $calendar에 요소가 없는 것으로 판정되며, 따라서 $calendar안의 요소를 클릭했을 때 return 시킬 수 없었다.
    // 이것을 해결하기위해 임시적으로 setTimeout을 추가해주어 이벤트의 실행 순서를 보정했다.
    setTimeout(() => {
      $calendar.innerHTML = '';
    }, 0);
  });
};
export default Picker;
