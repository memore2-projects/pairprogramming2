const $nav = document.querySelector('nav');
const KEY = 'isSideNavigationOpen';

/**
 * 사이드 네비게이션의 상태
 * 페이지 이동 또는 리로드 시에도 이전에 적용된 사이드 내비게이션 상태가 모든 웹페이지에 동일하게 적용되어야 한다.
 * 따라서 사이드 네비게이션의 상태는 애플리케이션 전역에서 사용할 수 있는 상태, 즉 전역 상태로서 관리해야 한다.
 * 전역 상태는 새로고침이나 페이지 이동 시에도 유지되어야 한다.
 * 따라서 전역 상태는 localStorage나 DataBase 등을 사용해 영속적으로 관리할 필요가 있다.
 */
let isSideNavigationOpen = false;

/**
 * 웹페이지가 로딩(좀 더 정확히 말하자면 DOMContentLoaded 이벤트는 DOM이 완성된 직후 발생한다)되면 로컬 스토리지에 저장되어 있는 상태를 로드한다.
 * @see https://developer.mozilla.org/ko/docs/Web/API/Window/DOMContentLoaded_event
 */
window.addEventListener('DOMContentLoaded', () => {
  // JSON.parse(localStorage.getItem(KEY))가 null이면 isSideNavigationOpen에 false를 할당한다.
  isSideNavigationOpen = JSON.parse(localStorage.getItem(KEY)) ?? false;

  /**
   * nav 요소에 active 클래스를 추가해 nav 요소와 main 요소의 위치를 open 상태로 이동시킨다.
   *
   * 첫 렌더링 시에 발생하는 불필요한 트랜지션을 방지하기 위해 body 요소에 preload 클래스가 추가되어 있다.
   * body 요소에 preload 클래스가 추가되어 있는 상태에서는 active 클래스를 추가해도 transition이 발생하지 않는다.
   */
  $nav.classList.toggle('active', isSideNavigationOpen);

  /**
   * 새로고침 시 active 클래스에 의해 nav 요소와 main 요소의 위치가 이동하는 움직임이 사용자에게 보이는 경우가 있다.
   * 이를 방지하기 위해 미리 css에 body {visibility: 'hidden'}을 추가해 두었다.
   * active 클래스가 추가된 이후에 body를 표시한다.
   *
   * body 요소에 preload 클래스가 추가되어 있는 상태에서는 active 클래스를 추가해도 transition이 발생하지 않는다.
   * 따라서 transitions delay 동안 대기할 필요가 없이 바로 'visibility' 상태로 변경한다.
   */
  document.body.style.visibility = 'visible';
});

/**
 * toggle 버튼이 클릭되어 사이드 네비게이션의 상태가 업데이트될 때마다 로컬 스토리지에 상태를 저장하는 것 보다
 * beforeunload 이벤트가 발생하면 로컬 스토리지에 상태를 저장히는 편이 효율적이다.
 * beforeunload 이벤트는 사용자가 웹페이지를 떠나기(새로고침, 앞으로/뒤로 가기, 브라우저 닫기, form submit 등) 직전에 발생한다.
 * @see https://developer.mozilla.org/ko/docs/Web/API/Window/beforeunload_event
 */
window.addEventListener('beforeunload', () => {
  localStorage.setItem(KEY, isSideNavigationOpen);
});

document.querySelector('.toggle').addEventListener('click', () => {
  /**
   * 초기 렌더링 시에 발생하는 불필요한 트랜지션을 방지하기 위해 body 요소에 추가되어 있는 preload 클래스를 제거해 트랜지션을 활성화시킨다.
   * DOMContentLoaded 이벤트 핸들러에서 처리하면 setTimeout으로 트랜지션이 종료할 때까지 지연시켜야 한다.
   */
  document.body.classList.remove('preload');

  isSideNavigationOpen = !isSideNavigationOpen;
  $nav.classList.toggle('active', isSideNavigationOpen);
});
