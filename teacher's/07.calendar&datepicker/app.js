import Calendar from './components/Calendar/index.js';
import DatePicker from './components/DatePicker/index.js';

[...document.querySelectorAll('.calendar')].forEach($container => {
  new Calendar({ $container, calendarSize: 300 });
});

[...document.querySelectorAll('.date-picker')].forEach($container => {
  new DatePicker({ $container, calendarSize: 300 });
});
