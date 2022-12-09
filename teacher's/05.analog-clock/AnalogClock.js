const tick = hands => {
  const date = new Date();
  const [seconds, minutes, hours] = [date.getSeconds(), date.getMinutes(), date.getHours()];
  const [$hourHand, $minuteHand, $secondHand] = hands;

  /**
   * Updating a CSS variable(CSS custom property)
   * @see https://css-tricks.com/updating-a-css-variable-with-javascript
   */
  // 초침: 1초당 6도(360deg/60s) 회전
  $secondHand.style.setProperty('--deg', seconds * 6);
  // 분침: 1시간당 360도, 1분당 6도(360deg/60m), 1초당 0.1도(6deg/60s) 회전
  // 10분 59초 => 60 + 5.9 = 65.9deg / 11분 => 66 + 0 = 66deg
  $minuteHand.style.setProperty('--deg', minutes * 6 + seconds * 0.1);
  // 시침: 1시간당 30도(360deg/12h), 1분당 0.5도(30deg/60m), 1초당 약 0.0083도(0.5deg/60s) 회전
  $hourHand.style.setProperty('--deg', hours * 30 + minutes * 0.5 + seconds * (0.5 / 60));
};

const AnalogClock = $container => {
  $container.innerHTML = `
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
    <div class="time time12">|</div>`;

  setInterval(tick, 1000, [...$container.querySelectorAll('.hand')]);
};

export default AnalogClock;
