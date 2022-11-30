// prettier-ignore
const printStarRating = $container => {
  $container.innerHTML = `
    <div class='star-rating-container'>
      ${Array(+$container.dataset.maxRating).fill(0)
        .map(() => `<i class='bx bxs-star'></i>`).join('')}
    </div>`
}

const StarRating = $container => {
  [...document.querySelectorAll('link')]
    .at(-1)
    .insertAdjacentHTML('afterend', '<link href="star-rating/theme.css" rel="stylesheet" />');

  printStarRating($container);

  // TODO: 클릭 이벤트 호버 이벤트 중첩된거 함수로 분리
  $container.addEventListener('mouseover', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    const stars = [...e.target.parentNode.children];
    const targetIndex = stars.findIndex(item => item === e.target);

    stars.forEach((star, index) => {
      star.classList.toggle('hovered', index <= +targetIndex && !star.matches('.selected'));
    });
  });

  $container.addEventListener('click', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    const stars = [...e.target.parentNode.children];
    const targetIndex = stars.findIndex(item => item === e.target);
    const custom = new CustomEvent('rating-change', {
      detail: targetIndex + 1,
    });
    $container.dispatchEvent(custom);
    stars.forEach((star, index) => {
      star.classList.toggle('selected', index <= +targetIndex);
    });
  });

  $container.addEventListener('mouseout', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    [...document.querySelectorAll('.bxs-star')].forEach(star => {
      star.classList.remove('hovered');
    });
  });
};

export default StarRating;
