const $nav = document.querySelector('nav');

window.addEventListener('DOMContentLoaded', () => {
  $nav.classList.toggle('active', localStorage.getItem('navOpened') === 'true');

  document.body.style.visibility = 'visible';
});

document.querySelector('i.toggle').addEventListener('click', () => {
  document.body.classList.remove('preload');
  $nav.classList.toggle('active');
  localStorage.setItem('navOpened', $nav.matches('.active'));
});
