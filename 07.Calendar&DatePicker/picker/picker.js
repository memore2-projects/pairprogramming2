import Calendar from '../calendar/calendar.js';
import CalendarRender from '../calendar/render.js';

const render = $datePicker => {
  $datePicker.innerHTML = `
    <h2>Date Picker</h2>
    <input type="input" class="date-select" placeholder="Select date" readonly/>
    <section class="calendar"></section>`;
};

const Picker = $datePicker => {
  render($datePicker);
  // document로 calendarNODE를 가져올 경우 재사용이 불가하다.
  // 재사용 가능하게 만들때는 document사용에 조심할것!!!!
  const $calendar = $datePicker.querySelector('.calendar');

  const dateState = Calendar($calendar, $datePicker);
  let newDate = null;

  // .date-select를 클릭했을 때  1- calendar를 렌더링한다. / 2- calendar가 렌더링되어 있다면 .calendar를 비운다.
  // 1. 캘린더를 처음 렌더링 했을 때 :
  // 2. 이미 한번 렌더링이 된 후 날짜를 클릭하여 newDate에 데이터를 저장했을 때 :
  // CalendarRander 에서 (초기 dateState or 수정된 dateState)으로 렌더링.
  $datePicker.querySelector('.date-select').addEventListener('focus', e => {
    if (e.target.matches('.date-select') && !$calendar.firstElementChild) {
      CalendarRender($calendar, dateState, newDate);
    }
    // TODO: e.target.closest('button')하는 이유: icon클릭했을 경우에 closest이 calendar를 찾지 못했다. 그래서 사용할수밖에 없었다. 이유를 찾자!!
    else if (!e.target.closest('.calendar') && !e.target.closest('.arrow')) $calendar.innerHTML = '';
  });

  // calendar가 열려있을 때 캘린더를 제외한 영역을 클릭하면 .calendar를 비운다.
  window.addEventListener('click', e => {
    if (e.target.closest('.calendar') || e.target.matches('.date-select') || e.target.closest('.arrow')) return;
    $calendar.innerHTML = '';
    dateState.date = new Date();
  });

  // prettier-ignore
  // 커스텀이벤트 date-click이 호출되면, 클릭한 날짜에 대한 정보를 받아와 newDate에 객체로 저장한다.
  // 이 때, clickedMonth와 clickedDate는 2자리수로 저장
  $datePicker.addEventListener('date-click', e => {
    const { clickedYear, clickedMonth, clickedDate } = e.detail;
    $datePicker.querySelector('.date-select').value = `
      ${clickedYear}-${clickedMonth.padStart(2,0)}-${clickedDate.padStart(2, 0)}
      `;

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
