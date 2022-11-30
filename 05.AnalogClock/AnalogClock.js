const MAX_DEG = 360;

const date = new Date();

const state = {
  clockElements: [],
  hourBySeconds: (date.getHours() % 12) * 60 ** 2,
  minuteBySeconds: date.getMinutes() * 60,
  seconds: date.getSeconds(),
};

let timerId = 0;
let { hourBySeconds, minuteBySeconds, seconds, clockElements } = state;

// prettier-ignore
const setHandPosition = $clock => {
  $clock.querySelector('.hour').style.setProperty('--deg', ((hourBySeconds + minuteBySeconds + seconds) / (60 ** 2 * 12)) * MAX_DEG);
  $clock.querySelector('.minute').style.setProperty('--deg', ((minuteBySeconds + seconds) / 60 ** 2) * MAX_DEG);
  $clock.querySelector('.second').style.setProperty('--deg', (seconds / 60) * MAX_DEG);
};

const renderAnalogClock = $clock => {
  $clock.innerHTML = `
    <div class="hand hour"></div>
    <div class="hand minute"></div>
    <div class="hand second"></div>
    <div class="time time1">|</div>
    <div class="time time2">|</div>
    <div class="time time3">|</div>
    <div class="time time4">|</div>
    <div class="time time5">|</div>
    <div class="time time6">|</div>
    <div class="time time7">|</div>
    <div class="time time8">|</div>
    <div class="time time9">|</div>
    <div class="time time10">|</div>
    <div class="time time11">|</div>
    <div class="time time12">|</div>
    `;

  setHandPosition($clock);
};

const moveAnalogClock = () => {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    seconds += 1;
    if (seconds === 60) {
      seconds = 0;
      minuteBySeconds += 60;
    }
    if (minuteBySeconds === 3600) {
      minuteBySeconds = 0;
      hourBySeconds += 3600;
    }

    clockElements.forEach($clock => {
      setHandPosition($clock);
    });
  }, 1000);
};

const AnalogClock = $newClock => {
  clockElements = [...clockElements, $newClock];
  renderAnalogClock($newClock);
  moveAnalogClock();
};

export default AnalogClock;
