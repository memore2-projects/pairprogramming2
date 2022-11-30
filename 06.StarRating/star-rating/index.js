// prettier-ignore
const setStarsInit = $container => {
  [...document.querySelectorAll('link')]
  .at(-1)
  .insertAdjacentHTML('afterend', '<link href="star-rating/theme.css" rel="stylesheet" />');

  $container.innerHTML = `
    <div class='star-rating-container'>
      ${Array(+$container.dataset.maxRating).fill('')
        .map(() => `<i class='bx bxs-star'></i>`).join('')}
    </div>`
}

const changeStarsStyle = ($star, className) => {
  const stars = [...$star.parentNode.children];
  const targetIndex = stars.findIndex(item => item === $star);

  stars.forEach((star, index) => {
    star.classList.toggle(className, index <= +targetIndex);
  });
};

const StarRating = $container => {
  setStarsInit($container);

  $container.addEventListener('mouseover', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star') || e.target.matches('.selected')) return;

    changeStarsStyle(e.target, 'hovered');
  });

  $container.addEventListener('click', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    changeStarsStyle(e.target, 'selected');

    const custom = new CustomEvent('rating-change', {
      detail: $container.querySelectorAll('.selected').length,
    });

    $container.dispatchEvent(custom);
  });

  $container.addEventListener('mouseout', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    [...document.querySelectorAll('.bxs-star')].forEach(star => {
      star.classList.remove('hovered');
    });
  });
};

export default StarRating;
