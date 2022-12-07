// 이벤트로 다루는 대상이 한 곳이 아니었기 때문에 변수를 밖에서 선언했다
// 변수에 nav요소를 등록하지 않으면 클릭 이벤트가 동작할때마다 해당 쿼리를 찾는 동작을 해야하기 때문에
const $nav = document.querySelector('nav');

// localStorage의 값이 존재하지 않는다면 undefined인 줄 알았지만 알고보니 null이었다.
// 1. null 이라면 false
// 2. 'true' 이라면 true
// 3. 'false' 이라면 false
// 값이 존재한다면 그 값을 문자열로 반환하기 때문에 JSON.parse를 사용했다.
// or 연산자와 null 병합 연산자의 차이를 생각해보자
let isNavOpened = null
// DOMContentLoaded를 사용한 이유:
// DOM을 생성하자마자 active를 붙인 상태로 paint를 하고 싶었다.
// 새로고침 했을때 nav의 움직임이 보여지는 것이 싫었기 때문이다.
window.addEventListener('DOMContentLoaded', () => {
isNavOpened = JSON.parse(localStorage.getItem('navOpened')) ?? false;

  $nav.classList.toggle('active', isNavOpened);

  document.body.style.visibility = 'visible';
});

// transition의 발동이유: 초기값이 변경된다면 동작한다.
document.querySelector('i.toggle').addEventListener('click', () => {
  document.body.classList.remove('preload');
  $nav.classList.toggle('active');

  isNavOpened = !isNavOpened;
  localStorage.setItem('navOpened', isNavOpened);
});
