import Component from '../../core/Component.js';

class Calendar extends Component {
  init() {
    this.styles = ['components/Calendar/theme.css'];
    /**
     * 캘린더의 next/prev 버튼을 클릭하면 setState 메서드를 사용해 익월/전월로 상태를 변경한다.
     * 상태가 변경되면 render 메서드가 호출되어 리렌더링된다.
     */
    this.state = { currentDate: new Date() };
  }

  render() {
    const DEFAULT_SIZE = 360; // 기본 캘린더 크기

    const monthNames = [
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

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // prettier-ignore
    this.$container.innerHTML = `
      <div class="calendar-container" style="--calendar-width: ${this.calendarSize || DEFAULT_SIZE}px;">
        <div class="calendar-nav">
          <i class="prev bx bx-caret-left"></i>
          <div class="calendar-title">
            <div class="month">${monthNames[this.currentMonth]}</div>
            <div class="year">${this.currentYear}</div>
          </div>
          <i class="next bx bx-caret-right"></i>
        </div>
        <div class="calendar-grid">
          ${dayNames.map(dayName => `<div class="day">${dayName}</div>`).join('')}
          ${this.eachCalendarDates().map(date =>
            `<div data-date="${this.formattedDate(date)}" class="${this.classNames(date)}">
              ${date.getDate()}
            </div>`).join('')}
        </div>
      </div>`;
  }

  bindEvents() {
    this.$container.addEventListener('click', e => {
      // 클릭 이벤트를 전파하지 않는다.
      e.stopPropagation();

      // .prev/.next 버튼을 클릭하면 currentDate 상태를 전월/익월로 변경하고 캘린더를 리렌더링한다.
      if (e.target.classList.contains('prev') || e.target.classList.contains('next')) {
        const delta = e.target.matches('.prev') ? -1 : 1;

        // 상태가 변경되면 render 메서드가 호출되어 캘린더가 리렌더링된다.
        this.setState({ currentDate: new Date(this.currentYear, this.currentMonth + 1 * delta) });
        return;
      }

      // 캘린더의 날짜를 클릭하면 부모인 datepicker에게 커스텀 이벤트를 방출해 해당 날짜의 date-date 어트리뷰트 값을 전달한다.
      if (e.target.matches('.calendar-grid > div:not(.day)') && !e.target.classList.contains('selected')) {
        this.$container.querySelector('.selected')?.classList.remove('selected');
        e.target.classList.add('selected');

        const selectedDate = e.target.dataset.date;
        console.log('[SELECTED DATE]', selectedDate);

        // 커스텀 이벤트를 디스패치한다.
        this.$container.dispatchEvent(
          new CustomEvent('calendar-date-select', {
            detail: selectedDate, // 이벤트와 함께 전달할 정보
            bubbles: true, // 버블링 여부
          })
        );

        // 부모/자식 간 데이터 교환을 위해 부모가 자식에게 함수를 전달한 경우
        // this.onCalendarDateSelect(selectedDate);
      }
    });
  }

  get currentYear() {
    return this.state.currentDate.getFullYear();
  }

  get currentMonth() {
    return this.state.currentDate.getMonth();
  }

  /**
   * date 객체를 'yyyy-mm-dd' 형식의 문자열로 변환하여 반환한다.
   * @type {(date: Date) => string}
   * @private
   */
  formattedDate(date) {
    const format = n => (n < 10 ? '0' + n : n + '');
    return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
  }

  /**
   * Date 객체 from과 to를 전달받아 from과 to 사이에 존재하는 일의 총수를 반환한다.
   * @type {(from: Date, to: Date) => number}
   * @private
   */
  diffDays(from, to) {
    const MILLISECONDS_PER_DAY = 86_400_000;
    return Math.abs(to - from) / MILLISECONDS_PER_DAY;
  }

  /**
   * 년도와 월을 나타내는 정수를 전달받아 해당 월의 캘린더를 구성하는 Date 객체들의 배열을 생성한다.
   * @type {() => Date[]}
   * @private
   */
  eachCalendarDates() {
    const { currentYear, currentMonth } = this;

    // 1일의 요일을 나타내는 정수(0 ~ 6)를 구한다.
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // 말일의 요일을 나타내는 정수(0 ~ 6)를 구한다.
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDay();

    /**
     * 캘린더의 시작 날짜를 나타내는 Date 객체를 구한다.
     * Date 생성자 함수의 3번째 매개변수(날짜)에 0을 전달하면 전월 말일, -1을 전달하면 전월 말일의 전날을 가리키는 Date 객체를 반환한다.
     *   new Date(2021, 0, 0) => 2020/12/31
     *   new Date(2021, 0, -1) => 2020/12/30
     *   new Date(2021, 0, -2) => 2020/12/29
     *
     * firstDay가 0(일요일): 1 - 0 => 금월 첫째
     * firstDay가 1(월요일): 1 - 1 => 금월 첫째날에서 1일전(전월 마지막날
     * firstDay가 2(화요일): 1 - 2 => 금월 첫째날에서 2일전(전월 마지막날의 전날
     * ..
     * firstDay가 6(토요일): 1 - 6 => 금월 첫째날에서 6일전(전월 마지막날의 5일전날)
     */
    const from = new Date(currentYear, currentMonth, 1 - firstDay);

    // 캘린더의 마지막 날짜를 나타내는 Date 객체를 구한다.
    const to = new Date(currentYear, currentMonth + 1, 7 - (lastDay + 1));

    /**
     * from과 to 사이에 존재하는 일의 총수 + 1 크기의 배열을 생성하고
     * 캘린더의 시작 날짜를 나타내는 Date 객체부터 시작해 Date 객체를 하루씩 증가시키면서
     * 캘린더를 구성하는 Date 객체로 배열을 채운다.
     */
    return Array.from({ length: this.diffDays(from, to) + 1 }, (_, i) => {
      if (i !== 0) from.setDate(from.getDate() + 1); // from을 다음날로 변경
      return new Date(from); // 복사본을 반환
    });
  }

  /**
   * 전달받은 2개의 Date 객체가 같은 년도/월/날짜를 가리키는지 확인한다.
   * @type {(d1: Date, d2: Date) => boolean}
   * @private
   */
  isEqualDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  /**
   * 전달받은 Date 객체를 기준으로 클래스 문자열을 생성한다.
   * @type {(date: Date) => string}
   * @private
   */
  classNames(date) {
    const today = new Date();
    const res = [];

    if (this.isEqualDate(date, today)) res.push('today');
    if (date.getMonth() !== this.currentMonth) res.push('muted');
    if (date.getDay() === 0) res.push('sunday');
    // if (this.isEqualDate(date, this.currentDate)) res.push('selected');

    return res.join(' ');
  }
}

export default Calendar;
