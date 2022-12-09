// 드래그 타깃 요소(.draggable-list > li > .draggable)
let $dragTarget = null;

// https://githut.info
const languages = ['JavaScript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++', 'C', 'Shell', 'C#'];

// shuffle array
// const shuffle = unshuffled =>
//   unshuffled
//     .map(value => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);

// 피셔-예이츠 셔플(Fisher-Yates shuffle) 알고리즘
// https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
const shuffle = unshuffled => {
  const shuffled = [...unshuffled];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const swap = ($node1, $node2) => {
  /**
   * cloneNode는 이벤트 핸들러까지 복사하지 않는다. 따라서 $node1, $node2에 이벤트 핸들러가 등록되어 있다면 이벤트 핸들러가 제거된다.
   * 이벤트 핸들러를 유지해야 한다면 다음을 참고한다.
   * https://stackoverflow.com/questions/10716986/swap-two-html-elements-and-preserve-event-listeners-on-them/
   */
  $node1.parentNode.replaceChild($node2.cloneNode(true), $node1);
  $node2.parentNode.replaceChild($node1.cloneNode(true), $node2);

  // replaceWith => Internet Explorer 미대응
  // $node1.replaceWith($node2.cloneNode(true));
  // $node2.replaceWith($node1.cloneNode(true));
};

const checkLanguageOrder = $container => {
  [...$container.querySelectorAll('.draggable')].forEach(($draggable, i) => {
    const content = $draggable.textContent.trim();
    $draggable.parentNode.className = content === languages[i] ? 'right' : 'wrong';
  });
};

const render = $container => {
  // prettier-ignore
  $container.innerHTML = `
    <ul class="draggable-list">
    ${shuffle(languages).map((language, i) => `
      <li>
        <div class="seq">${i + 1}</div>
        <div class="draggable" draggable="true">
          <p class="language-name">${language}</p>
          <i class="bx bx-menu"></i>
        </div>
      </li>`).join('')}
    </ul>`;
};

const Swappable = $container => {
  // Event handlers
  /*
  드래그 앤 드롭 관련 이벤트는 다음과 같다.
  | 이벤트 타입  | 발생하는 상황                      | 이벤트 타깃
  |:-----------|:---------------------------------|:---------------
  | dragstart  | 드래그를 시작하면 발생               | 드래그 타깃
  | drag       | 드래그 중에 주기적으로 연속해서 발생    | 드래그 타깃
  | dragend    | 드래그를 종료하면 발생               | 드래그 타깃
  | dragenter  | 드래그 중인 마우스 포인트가 드롭 타깃 내부로 들어오면 발생 | 드롭 타깃
  | dragover   | 드래그 중인 마우스 포인트가 드롭 타깃 내부에서 들어와 있는 동안 주기적으로 연속해서 발생 | 드롭 타깃
  | dragleave  | 드래그 중인 마우스 포인트가 드롭 타깃 외부로 나가면 발생 | 드롭 타깃
  | drop       | 드래그 타깃을 유효한 드롭 타깃에 드롭하면 발생. 반드시 dragover 이벤트 핸들러에서 e.preventDefault를 호출해야 드롭이 허용된다. | 드롭 타깃
  */
  $container.addEventListener('dragstart', e => {
    $dragTarget = e.target; // e.target은 드래그 타깃이다. 드래그 타깃을 저장한다.
  });

  $container.addEventListener('dragenter', e => {
    // 드롭 타깃이 속한 .draggable-list > li 요소에 over 클래스를 추가한다.
    /**
     * add/remove 메서드 대신 toggle 메서드를 사용하는 이유
     * 아이콘 요소에 드래그가 들어가면 dragenter 이벤트와 dragleave 이벤트가 순차적으로 발생한다.
     * toggle 메서드를 사용하지 않고 add/remove 메서드를 사용하면
     * dragenter 이벤트 핸들러에서 add 메서드가 호출되어 over 클래스를 다시 추가하려 하지만 이미 추가되어 있으므로 무시된다.
     * dragleave 이벤트 핸들러에서 remove 메서드가 호출되어 over 클래스가 제거된다.
     * 따라서 결국 .draggable-list > li 요소에서 over 클래스가 제거되는 부작용이 발생한다.
     * add/remove 메서드 대신 toggle 메서드를 사용하면
     * dragenter 이벤트 핸들러에서 over 클래스가 일단 제거되지만 dragleave 이벤트 핸들러에서 over 클래스가 다시 추가된다.
     */
    e.target.closest('.draggable-list > li')?.classList.toggle('over');
    // e.target.closest('.draggable-list > li')?.classList.add('over');
  });

  $container.addEventListener('dragleave', e => {
    // 드롭 타깃이 속한 .draggable-list > li 요소에서 over 클래스를 제거한다.
    e.target.closest('.draggable-list > li')?.classList.toggle('over');
    // e.target.closest('.draggable-list > li')?.classList.remove('over');
  });

  $container.addEventListener('dragover', e => {
    /**
     * 웹페이지 영역의 대부분은 드롭할 수 있는 유효한 영역이 아니다.
     * 따라서 dragover 이벤트의 기본적인 동작은 드롭을 허용하지 않기 때문에 기본 동작을 취소해야 드롭이 허용된다.
     */
    e.preventDefault();
  });

  $container.addEventListener('drop', e => {
    /**
     * 드롭 타깃은 .draggable-list > li 요소 또는 .draggable-list > li 요소의 자식일 수 있다.
     * 드롭 타깃을 기준으로 .draggable 요소를 취득한다.
     */
    const $dropTarget = e.target.closest('.draggable-list > li').querySelector('.draggable');

    // $dropTarget 요소와 $dragTarget 요소가 같으면 교체할 필요가 없다. over 클래스만 제거한다.
    if ($dropTarget === $dragTarget) {
      $dropTarget.parentNode.classList.remove('over');
      return;
    }

    // 드롭 타깃과 드래그 타깃을 교체
    swap($dropTarget, $dragTarget);

    // 순서 확인
    checkLanguageOrder($container);
  });

  render($container);
  // 순서 확인
  checkLanguageOrder($container);
};

export default Swappable;
