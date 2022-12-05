const MAX_DEG = 360;

const date = new Date();

// 시간에 따라 어떻게 각 시,분,초침이 표현될지를 간편하게 표현하기 위해 시, 분을 초단위로 표현.
// 초가 지남에 따라 times를 갱신하고 갱신한 times를 바탕으로 렌더된 .hour, .minute, .second 요소의 스타일을 변경.
const times = {
  hourBySeconds: (date.getHours() % 12) * 60 ** 2,
  minuteBySeconds: date.getMinutes() * 60,
  seconds: date.getSeconds(),
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
};

// 각 시, 분, 초침을 초단위로 계산하여 360도(MAX_DEG)를 기준으로 일정한 각도로 회전할 수 있도록 계산식 설정.
// prettier-ignore
const setHandPosition = $clock => {

  $clock.querySelector('.hour').style.setProperty('--deg', ((times.hourBySeconds + times.minuteBySeconds + times.seconds) / (60 ** 2 * 12)) * MAX_DEG);
  $clock.querySelector('.minute').style.setProperty('--deg', ((times.minuteBySeconds + times.seconds) / 60 ** 2) * MAX_DEG);
  $clock.querySelector('.second').style.setProperty('--deg', (times.seconds / 60) * MAX_DEG);
};

// 처음 렌더된 후 setInterval을 통해 1초마다 times를 갱신함.
// second +1 / 60초가 되면 second를 0으로 바꾼 뒤 minute 증가.
// minute을 초단위로 표현했기 때문에 60(초) 증가
// hour를 초단위로 표현했기 때문에 3600(초) 증가
setInterval(() => {
  times.seconds += 1;

  if (times.seconds === 60) {
    times.seconds = 0;
    times.minuteBySeconds += 60;
  }
  if (times.minuteBySeconds === 3600) {
    times.minuteBySeconds = 0;
    times.hourBySeconds += 3600;
  }
}, 1000);

const AnalogClock = $clock => {
  renderAnalogClock($clock);
  setHandPosition($clock);

  // 각 $clock 요소마다 .second, .minute, .hour의 스타일을 변경.
  setInterval(() => {
    setHandPosition($clock);
  }, 1000);
};

export default AnalogClock;
