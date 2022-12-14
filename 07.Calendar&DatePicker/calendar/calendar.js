import CalendarRender from './render.js';

// 재사용성을 위하여 index.html 파일에 calendar와 관련된 style을 동적으로 추가한다.
[...document.querySelectorAll('link')]
  .at(-1)
  .insertAdjacentHTML('afterend', '<link href="./calendar/calendar.css" rel="stylesheet" />');

// calendar에서 화살표 버튼을 눌렀을 때 보여줄 달에 대한 정보(dateState)를 변경한다.
const setDateState = (target, dateState) => {
  if (target.closest('.arrow.left')) {
    dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() - 1, dateState.date.getDate());
  }
  if (target.closest('.arrow.right')) {
    dateState.date = new Date(dateState.date.getFullYear(), dateState.date.getMonth() + 1, dateState.date.getDate());
  }
};

const Calendar = ($calendar, $datePicker) => {
  // date : 사용자가 .date-select를 클릭했을 때 보여줄 날짜에 대한 정보.
  // nowDate : 첫 렌더링시의 날짜 정보를 기억하기위해 선언한 변수.
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
