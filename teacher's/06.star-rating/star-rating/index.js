/**
 * 사용자가 star-rating 컴포넌트 외부에서 'star-rating-container'와 동일한 클래스 이름을 사용해 스타일을 정의하면 star-rating 컴포넌트도 이에 영향을 받는다.
 * 외부 스타일은 내부 스타일과 분리되지 않고 영향을 준다. 이를 방지하기 위해 "캡슐화"된 컴포넌트를 구현할 필요가 있다.
 * 캡슐화된 컴포넌트는 외부의 영향에서 자유로운 독립적인 컴포넌트다.
 * CSS의 경우, CSS Module이나 Shadow DOM을 사용하면 외부의 영향에서 독립된 캡슐화된 스타일을 구현할 수 있다.
 * - CSS Module: https://github.com/css-modules/css-modules
 * - Shadow DOM: https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM
 */
const CONTAINER_DEFAULT_CLASS_NAME = 'star-rating-container';
const CSS_DEFAULT_THEME = 'star-rating/theme.css';

const loadStyle = href => {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const $link = document.createElement('link');
  $link.href = href;
  $link.rel = 'stylesheet';

  // head 요소의 가장 마지막에 추가된다.
  // document.head.appendChild($link);

  // 기존의 마지막 link 요소 다음에 생성한 link 요소를 추가한다.
  const $lastLink = document.querySelector('link:last-of-type');
  // $lastLink.after($link); // => IE NG

  /**
   * Node.insertBefore => IE OK
   * @example
   * 참조된 노드(referenceNode) 앞에 특정 부모 노드(parentNode)의 자식 노드(newNode)를 삽입한다.
   * referenceNode가 null이면 parentNode의 자식 노드 리스트의 끝에 newNode가 삽입된다.
   * const insertedNode = parentNode.insertBefore(newNode, referenceNode);
   * - Append Before:
   * element.parentNode.insertBefore(newElement, element);
   * - Append After:
   * element.parentNode.insertBefore(newElement, element.nextSibling);
   * @see
   * https://developer.mozilla.org/ko/docs/Web/API/Node/insertBefore
   *
   * Element.after => IE NG
   * @example
   * siblingElement.after(... newNodes)
   * @see
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/after
   */
  document.head.insertBefore($link, $lastLink.nextElementSibling);
};

const render = $container => {
  // data-max-rating 어트리뷰트가 지정되어 있지 않으면 maxRating을 5로 지정한다.
  const { maxRating = 5 } = $container.dataset;

  // if (maxRating === undefined)
  //   throw new Error(
  //     `Star-rating 컴포넌트는 <div class="star-rating" data-max-rating="5"></div>처럼 max-rating 어트리뷰트를 지정해야 합니다.`
  //   );

  if (maxRating === '0') throw new Error(`Star-rating 컴포넌트의 max-rating 어트리뷰트 값은 1 이상이어야 합니다.`);

  $container.innerHTML = `
    <div class=${CONTAINER_DEFAULT_CLASS_NAME}>
      ${Array.from({ length: maxRating }, (_, i) => `<i class="bx bxs-star" data-value="${i + 1}"></i>`).join('')}
    </div>
  `;
};

// const StarRating = $container => {
const StarRating = props => {
  const { $container, onChange } = props;

  // rendering
  loadStyle(CSS_DEFAULT_THEME);
  render($container);

  // event binding
  const $stars = [...$container.querySelectorAll('i')];

  /**
   * i 요소에 마우스가 올라오면 hovered 클래스를 토글(추가/제거)한다.
   *
   * i 요소에 마우스가 올라오면 해당 i 요소의 data-value 어트리뷰트 값을 취득한다.
   * - data-value 어트리뷰트 값보다 작은 인덱스의 i 요소는 모두 hovered 클래스를 추가한다.
   * - data-value 어트리뷰트 값보다 크거나 같은 인덱스의 i 요소는 모두 hovered 클래스를 제거한다.
   *
   * mouseover 이벤트는 버블링되지만 mouseenter는 버블링되지 않는다.
   */
  $container.addEventListener('mouseover', ({ target }) => {
    if (!target.matches('i')) return;

    const { value } = target.dataset;

    $stars.forEach(($star, i) => {
      $star.classList.toggle('hovered', i < value);
    });
  });

  /**
   * $container 요소를 마우스가 벗어나면 모든 i 요소의 hovered 클래스를 제거한다.
   *
   * mouseleave 이벤트는 버블링되지 않고, mouseout 이벤트는 버블링된다.
   * mouseout 이벤트를 사용하면 $container 요소의 자식 요소인 i 요소에서 마우스가 벗어나는 경우에도
   * 이벤트 핸들러가 호출된다. 이때 모든 i 요소의 hovered 클래스가 제거된다.
   * 모든 i 요소의 hovered 클래스를 제거해야 할 때는 $container 요소를 벗어나는 경우이므로
   * 버블링되지 않는 mouseleave 이벤트를 사용하는 것이 바람직하다.
   */
  $container.addEventListener('mouseleave', () => {
    $stars.forEach($star => {
      $star.classList.remove('hovered');
    });
  });

  /**
   * i 요소를 클릭하면 selected 클래스를 토글(추가/제거)한다.
   *
   * i 요소를 클릭하면 해당 i 요소의 data-value 어트리뷰트 값을 취득한다.
   * - data-value 어트리뷰트 값보다 작은 인덱스의 i 요소는 모두 selected 클래스를 추가한다.
   * - data-value 어트리뷰트 값보다 크거나 같은 인덱스의 i 요소는 모두 selected 클래스를 제거한다.
   * - 취득된 data-value 어트리뷰트 값은 커스텀 이벤트 rating-change를 통해 외부로 방출한다.
   */
  $container.addEventListener('click', ({ target }) => {
    if (!target.matches('i')) return;

    const { value } = target.dataset;

    $stars.forEach(($star, i) => {
      $star.classList.toggle('selected', i < value);
    });

    onChange(value);
  });
};

export default StarRating;
