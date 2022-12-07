// html의 가장 마지막에 있는 link태그 아래에 동적으로 theme.css 파일을 추가로 링크.
[...document.querySelectorAll('link')]
  .at(-1)
  .insertAdjacentHTML('afterend', '<link href="star-rating/theme.css" rel="stylesheet" />');

// prettier-ignore
/**
 * 초기 star 렌더링
 * 적용할 container의 몇개의 별을 추가 = maxRating
 * star 아이콘을 추가하기 위해 개수(maxRating) 크기의 배열을 생성하고 map 고차함수를 통해 생성.
 */
const printStarsInit = $container => {
  $container.innerHTML = `
    <div class='star-rating-container'>
      ${Array(+$container.dataset.maxRating)
        .fill('')
        .map(() => `<i class='bx bxs-star'></i>`)
        .join('')}
    </div>`;
};

const addClassToStar = ($star, className) => {
  const stars = [...$star.parentNode.children];
  const targetIndex = stars.findIndex(item => item === $star);

  stars.forEach((star, index) => {
    star.classList.toggle(className, index <= +targetIndex);
  });
};

const StarRating = $container => {
  printStarsInit($container);

  $container.addEventListener('mouseover', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star') || e.target.matches('.selected')) return;

    addClassToStar(e.target, 'hovered');
  });

  $container.addEventListener('click', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    addClassToStar(e.target, 'selected');

    // NOTE:왜 클릭 이벤트에서 current rating을 조작하는 것이 아니라 커스텀 이벤트를 만들어 데이터를 저장하고, app.js에서 변경시키는가에 대한 생각.
    // -> StarRating 컴포넌트에서는 단지 각 별들의 출력과 형태 변경에 대해서만 다루고 싶었던게 아닐까? 하는 생각. ex) 배달의 민족 - 별점을 매기는 곳은 여러 곳에 있지만 각각의 형태가 조금씩 다름. 별 자체는 동일하지만 표현하는 것 ex) current rating, percentage rating 등.
    // 컴포넌트에서는 완전히 동일한 부분과, 데이터만을 전달하고 부가적인 요소는 따로 다룰 수 있게 하고싶었던 것 같다.

    // rating-change라는 커스텀 이벤트를 생성하고, 이벤트 객체의 detail 값으로 현재 선택되어있는 star의 개수를 저장.
    // dispatchEvent를 통해 클릭 이벤트가 발생할 때마다 rating-change 이벤트가 호출되도록 함.
    const selectedLength = new CustomEvent('rating-change', {
      detail: $container.querySelectorAll('.selected').length,
    });

    $container.dispatchEvent(selectedLength);
  });

  $container.addEventListener('mouseout', e => {
    if (!e.target.matches('.star-rating-container > .bxs-star')) return;

    [...document.querySelectorAll('.bxs-star')].forEach(star => {
      star.classList.remove('hovered');
    });
  });
};

export default StarRating;
