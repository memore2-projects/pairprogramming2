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
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// dateState.nowDate(현재 날짜)와 dateState.date(화면에 보여지는 날짜)를 비교하여 현재날짜가 화면에 보여질 때 체크.
const isEqualDateToNow = (dateState, index, firstDayIndex) =>
  dateState.date.getFullYear() === dateState.nowDate.getFullYear() &&
  dateState.date.getMonth() === dateState.nowDate.getMonth() &&
  index - firstDayIndex + 1 === dateState.nowDate.getDate();

// prettier-ignore
const calendarDateString = (calendarDatas, dateState, index) => {
  const { firstDayIndex, curLastDate, preLastDate } = calendarDatas;

  if (index < firstDayIndex)
    return `
    <li class="font-silver" data-date='${dateState.date.getFullYear()}-${dateState.date.getMonth()}-${index - firstDayIndex + preLastDate + 1}'>
      ${index - firstDayIndex + preLastDate + 1}
    </li>
    `;

  if (index < firstDayIndex + curLastDate)
    return `
      <li class="${index % 7 === 0 ? 'font-red' : ''} ${isEqualDateToNow(dateState, index, firstDayIndex) ? 'now' : ''} date"
      data-date='${dateState.date.getFullYear()}-${dateState.date.getMonth() + 1}-${index - firstDayIndex + 1}'>
        ${index - firstDayIndex + 1}
      </li>
      `;

  return `
    <li class="font-silver" data-date='${dateState.date.getFullYear()}-${dateState.date.getMonth() + 2}-${index - curLastDate - firstDayIndex + 1}'>
      ${index - curLastDate - firstDayIndex + 1}
    </li>
    `;
};

const CalendarRender = ($calendar, dateState, pickerDate) => {
  if (pickerDate)
    dateState.date = new Date(`${pickerDate.clickedYear}/${pickerDate.clickedMonth}/${pickerDate.clickedDate}`);

  // 날짜가 바뀔 경우 nowDate를 재할당하여, 재할당된 nowDate를 기준으로 현재 날짜 체크
  dateState.nowDate = new Date();

  const calendarDatas = {
    firstDayIndex: new Date(dateState.date.getFullYear(), dateState.date.getMonth(), 1).getDay(),
    curLastDate: new Date(dateState.date.getFullYear(), dateState.date.getMonth() + 1, 0).getDate(),
    preLastDate: new Date(dateState.date.getFullYear(), dateState.date.getMonth(), 0).getDate(),
    lastDay: new Date(dateState.date.getFullYear(), dateState.date.getMonth() + 1, 0).getDay(),
  };

  // prettier-ignore
  $calendar.innerHTML = `
    <nav class="calendar-nav">
      <button class='arrow left'><i class="fa-solid fas fa-caret-left"></i></button>
      <div class="calendar-title">
        <h2>${MONTH[ dateState.date.getMonth()]}</h2>
        <span>${dateState.date.getFullYear()}</span>
      </div>
      <button class='arrow right'><i class="fa-solid fas fa-caret-right"></i></button>
    </nav>
    <ul class="calendar-grid">
      ${DAYS.map(day => `<li class="day font-silver">${day}</li>`).join('')}
      ${Array(calendarDatas.firstDayIndex + calendarDatas.curLastDate + 6 - calendarDatas.lastDay)
        .fill(0)
        .map((_, index) => calendarDateString(calendarDatas,dateState,index))
        .join('')}
    </ul>
  `;

  if (pickerDate) {
    [...$calendar.querySelectorAll('.calendar-grid > li')].forEach(date => {
      if (date.dataset.date === `${pickerDate.clickedYear}-${pickerDate.clickedMonth}-${pickerDate.clickedDate}`)
        date.classList.add('clicked');
    });
  }
};

export default CalendarRender;
