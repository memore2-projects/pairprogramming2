import Component from '../../core/Component.js';
import Calendar from '../Calendar/index.js';

class DatePicker extends Component {
  init() {
    this.styles = ['components/DatePicker/theme.css'];
  }

  render() {
    this.$container.innerHTML = `
      <input class="date-picker-selector" type="text" placeholder="Select date" readonly />
      <div class="date-picker-calendar"></div>`;
  }

  bindEvents() {
    const $datepicker = this.$container.querySelector('.date-picker-selector');
    const $calendar = this.$container.querySelector('.date-picker-calendar');

    $datepicker.addEventListener('focus', () => {
      // 부모/자식 간 데이터 교환을 위해 부모가 자식에게 함수를 전달하는 경우
      // const onCalendarDateSelect = dateString => {
      //   $datepicker.value = dateString;
      //   $calendar.style.display = 'none';
      // };

      if ($calendar.children.length === 0)
        new Calendar({
          $container: $calendar,
          // onCalendarDateSelect,
          ...(this.calendarSize && { calendarSize: this.calendarSize }),
        });
      else $calendar.style.display = 'block';
    });

    /**
     * calendar와 datepicker는 부모/자식 관계다.
     * 자식인 calendar가 부모인 datepicker의 value를 참조해 값을 직접 변경할 수도 있다.
     * 이 경우 자식인 calendar는 부모인 datepicker에게 강하게 의존(deep coupling)하게 된다.
     * 예를 들어 datepicker의 value를 참조하는 방법이 변경된다면 calendar도 변경되어야 한다.
     * 부모/자식 간의 영향을 최소화하기 위해 서로를 참조해 직접 변경시키지 않도록 한다.
     * 부모/자식 간의 데이터 교환을 위해 다음과 같은 방법을 사용한다.
     * - 부모가 자식에게 데이터를 전달하려면 부모는 인수를 전달한다.(new Calendar({$calendar, someValue}))
     * - 자식이 부모에게 데이터를 전달하려면 자식은 이벤트를 발생시키고 부모는 이벤트를 캐치한다.
     *   참고로 커스텀 이벤트를 사용하지 않고 다음처럼 부모가 자식에게 함수를 전달할 수도 있다.
     *   const onCalendarDateSelect = dateString => {
     *     $datepicker.value = dateString;
     *     $calendar.style.display = 'none';
     *   }
     *   Calendar({$container, ..., onCalendarDateSelect});
     */
    // calendar의 날짜를 클릭하면 calendar는 'calendar-date-select' 이벤트를 발생시킨다.
    $calendar.addEventListener('calendar-date-select', e => {
      $datepicker.value = e.detail;
      $calendar.style.display = 'none';
    });

    /**
     * $calendar(자손 요소 포함)와 $datepicker 이외의 HTML 요소에서 클릭 이벤트가 발생하면 $calendar를 감춘다.
     * $calendar의 클릭 이벤트 핸들러에서 클릭 이벤트 전파를 중지시켰으므로 $calendar에서 클릭 이벤트를 방출하지 않는다.
     * 따라서 아래 클릭 이벤트 핸들러는 $calendar(자손 요소 포함)와 $datepicker 이외의 HTML 요소에서 발생한 클릭 이벤트만 처리한다.
     */
    window.addEventListener('click', e => {
      if (!e.target.matches('.date-picker-selector')) $calendar.style.display = 'none';
    });
  }
}

export default DatePicker;
