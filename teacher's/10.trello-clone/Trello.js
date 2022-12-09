import Component from './core/Component.js';
import { Header, Main } from './components/index.js';

import { saveState, loadState } from './state/localStorage.js';
import {
  findCard,
  findList,
  updateListTitle,
  updateCardTitle,
  updateCardDescription,
  appendList,
  appendCard,
  moveList,
  moveCard,
  toggleIsOpenCardComposer,
} from './state/controller.js';

class Trello extends Component {
  constructor() {
    super();

    this.$dragTarget = null; // 드래그 타깃
    this.selectedListId = null; // 팝업을 오픈하기 위해 클릭되어 선택된 card의 list id
    this.selectedCardId = null; // 팝업을 오픈하기 위해 클릭되어 선택된 card id
    this.fromListId = null; // drag target의 list id
    this.fromListIndex = null; // drag target의 list index

    // 로컬 스토리지에서 state를 로드한다.
    this.state = loadState();
    console.log('[state loaded]', this.state);
  }

  /** 렌더링 메서드로 DOMString을 반환한다. dom/render 또는 부모 컴포넌트에 의해 호출되어 DOM에 반영된다. */
  render() {
    const header = new Header();
    const main = new Main(this.state);

    return `
      <header>${header.render()}</header>
      <main>${main.render()}</main>`;
  }

  /**
   * 이벤트 핸들러 등록을 위해 [{type: string, selector: string, handler: e => void}] 타입의 배열을 반환한다.
   * - 이 메서드는 Component class의 keepEvents 메서드에 의해 호출되어 일시적 이벤트 저장소에 저장되었다가
   * dom/render 함수에 의해 root container에 위임되어 일괄적으로 이벤트 등록된다.
   * - selector 프로퍼티 값은 다음과 같은 의미를 같는다.
   *   - 'window' => 이벤트 핸들러는 window에 등록된다.
   *   - null => 이벤트 핸들러는 필터링 없이 root container에 등록된다.
   *   - css selector => 필터링을 위해 handler에 if (e.target.matches(selector) || e.target.closest(selector)) handler(e);를 삽입해 새롭게 생성한다.
   * @type {() => Array<{type: string, selector: string|'window'|null, handler: Function}>}
   */
  addEventListener() {
    return [
      {
        type: 'beforeunload',
        selector: 'window', // 이벤트 핸들러는 window에 등록된다.
        handler: () => saveState(this.state),
      },
      {
        type: 'keydown',
        selector: 'window',
        handler: e => {
          if (e.key !== 'Escape') return;

          // Popup이 활성화되어 있는 상태에서 Esc 키를 누르면 Popup을 비활성화한다.
          if (this.state.popup.isOpen) this.closePopup();
          // Popup이 비활성화되어 있는 상태에서 Esc 키를 누르면 모든 composer를 닫는다.
          else this.closeComposerAll();
        },
      },
      {
        type: 'dragstart',
        selector: null, // 이벤트 핸들러는 필터링 없이 root container에 등록된다.
        handler: this.onDragstart.bind(this),
      },
      {
        type: 'dragend',
        selector: null,
        handler: this.onDragend.bind(this),
      },
      {
        type: 'dragover', // dragover 이벤트는 드래그 중인 마우스 포인트가 드롭 타깃 내부에서 들어와 있는 동안 주기적으로 연속해서 발생한다.
        selector: null,
        handler: _.throttle(this.onDragover.bind(this)),
      },
      {
        type: 'drop',
        selector: null,
        handler: this.onDrop.bind(this),
      },
      {
        type: 'click',
        selector: null,
        handler: this.onClick.bind(this),
      },
      {
        type: 'keydown',
        selector: null,
        handler: this.onKeydown.bind(this),
      },
      {
        type: 'focusout',
        selector: null,
        handler: this.onFocusout.bind(this),
      },
      {
        type: 'submit',
        selector: null,
        handler: this.onSubmit.bind(this),
      },
      {
        type: 'input',
        selector: null,
        handler: e => {
          // auto-resize textarea
          // TODO: 리렌더링되면 사라진다.
          if (!e.target.matches('textarea')) return;
          e.target.style.height = `${e.target.scrollHeight}px`;
        },
      },
    ];
  }

  /**
   * drag target(list|card)을 클론하여 transform: rotate가 적용된 커스텀 dragImage 요소를 생성해 body에 append한다.
   * @see https://htmldom.dev/show-a-ghost-element-when-dragging-an-element
   */
  appendDragImage() {
    const $ghost = document.createElement('div');
    const $ghostChild = this.$dragTarget.cloneNode(true);

    /**
     * 드래그 타깃이 아닌 드래그 타깃의 자식에 transform을 적용해야 transform이 동작한다.
     * @see https://stackoverflow.com/questions/43490351/how-to-tilt-rotate-the-item-being-dragged-in-javascript-drag-and-drop
     */
    $ghostChild.classList.add('ghost');

    $ghost.appendChild($ghostChild);
    document.body.appendChild($ghost);

    return $ghost;
  }

  /** 커스텀 dragImage 요소를 제거한다. */
  removeDragImage() {
    const $ghost = document.querySelector('.ghost').parentNode;
    document.body.removeChild($ghost);
  }

  /** $elem 요소의 중앙 Y 좌표를 취득한다. */
  getVerticalCenter($elem) {
    const { bottom, top } = $elem.getBoundingClientRect();
    return (bottom - top) / 2;
  }

  getListIndex($elem) {
    return +$elem.closest('.list').dataset.listIndex;
  }

  getListId($elem) {
    return +$elem.closest('.list').dataset.listId;
  }

  getCardId($elem) {
    return +$elem.closest('.card').dataset.cardId;
  }

  /**
   * React conditional rendering vs. display: none;
   * @see: https://ssangq.netlify.app/posts/conditional-rendering-vs-diplay-none
   */
  toggleCardComposer(listId) {
    const lists = toggleIsOpenCardComposer(this.state.lists, listId);
    this.setState({ lists });
  }

  toggleListComposer() {
    this.setState({ listComposer: { isOpen: !this.state.listComposer.isOpen } });
  }

  togglePopup(listId = null, cardId = null) {
    this.setState({
      popup: { ...this.state.popup, ...{ isOpen: !this.state.popup.isOpen, listId, cardId } },
    });
  }

  closePopup() {
    if (!this.state.popup.isOpen) return;

    this.setState({
      popup: { ...this.state.popup, isOpen: false },
    });
  }

  toggleCardDescComposer() {
    this.setState({
      popup: { ...this.state.popup, isOpenCardDescComposer: !this.state.popup.isOpenCardDescComposer },
    });
  }

  closeComposerAll() {
    if (this.state.lists.filter(list => list.isOpenCardComposer).length === 0 && !this.state.listComposer.isOpen)
      return;

    this.setState({
      lists: this.state.lists.map(list => ({ ...list, isOpenCardComposer: false })),
      listComposer: { isOpen: false },
    });
  }

  /**
   * Event Handlers
   */
  /*
    Drag & Drop event
    | 이벤트 타입  | 발생하는 상황                      | 이벤트 타깃
    |:-----------|:---------------------------------|:---------------
    | dragstart  | 드래그를 시작하면 발생               | 드래그 타깃
    | drag       | 드래그 중에 주기적으로 연속해서 발생    | 드래그 타깃
    | dragend    | 드래그를 종료하면 발생. drop은 droppable인 요소에서 마우스를 놓으면 발생하지만 dragend는 droppable이 아닌 요소에서도 발생(drop => dragend 순서) | 드래그 타깃
    | dragenter  | 드래그 중인 마우스 포인트가 드롭 타깃 내부로 들어오면 발생 | 드롭 타깃
    | dragover   | 드래그 중인 마우스 포인트가 드롭 타깃 내부에서 들어와 있는 동안 주기적으로 연속해서 발생 | 드롭 타깃
    | dragleave  | 드래그 중인 마우스 포인트가 드롭 타깃 외부로 나가면 발생 | 드롭 타깃
    | drop       | 드래그 타깃을 유효한 드롭 타깃에 드롭하면 발생. 반드시 dragenter, dragover 이벤트 핸들러에서 e.preventDefault를 호출해야 드롭이 허용된다. | 드롭 타깃
    */
  onDragstart(e) {
    // e.target은 drag target(draggable 어트리뷰트를 갖는 요소)이며 list 또는 card 요소다.
    this.$dragTarget = e.target;
    const $dragImage = this.appendDragImage();

    /**
     * drag 중에 마우스 포인터를 따라 다니는 커스텀 drag image를 설정한다.
     * 기본적으로 drag가 시작되면 drag target으로 반투명 이미지(drag image)를 자동 생성해 drag 중에 마우스 포인터를 따라 다닌다.
     * 커스텀 drag image를 생성해 사용하려면 DataTransfer.setDragImage를 사용한다.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
     */
    // ? 왜 2배인가?
    // offsetX/offsetX => e.target을 기준으로 상대적 마우스 x/y좌표를 반환
    e.dataTransfer.setDragImage($dragImage, e.offsetX * 2, e.offsetY * 2);

    /**
     * effectAllowed에 드래그 시 허가된 effect를 지정한다. effectAllowed는 마우스 커서 모양에 영향을 준다.
     * Drag & Drop API는 사용자 정의 커서를 지원하지 않는다.
     * @see: https://github.com/react-dnd/react-dnd/issues/325
     */
    e.dataTransfer.effectAllowed = 'move';

    /**
     * fromListIndex/fromListId은 drop 이벤트 핸들러에서 사용된다.
     * - this.fromListIndex: drag target의 list index
     * - this.fromListId: drag target의 list id
     */
    this.fromListIndex = this.getListIndex(this.$dragTarget);
    this.fromListId = this.getListId(this.$dragTarget);

    this.$dragTarget.classList.add('dragging');
  }

  onDragend() {
    this.$dragTarget.classList.remove('dragging');
    this.removeDragImage();
  }

  onDragover(e) {
    const $dropTarget = e.target;
    const $dropzone = $dropTarget.closest('.list');

    /**
     * 웹페이지 영역의 대부분은 드롭할 수 있는 유효한 영역이 아니다. 따라서 dragover 이벤트의 기본적인 동작은 드롭을 허용하지 않는다.
     * 드롭을 허용하도록 preventDefault를 호출한다.
     */
    e.preventDefault();

    // list 요소 밖에 dragover되면 $dropzone === null이다.
    if ($dropzone === null) return;

    if (this.$dragTarget.matches('.list')) {
      // $dropzone과 drag 중인 list 요소(= this.$dragTarget)가 동일하면, 즉 list 요소를 다른 list 요소가 아닌 자기자신에게 drop하려 하면 무시한다.
      if ($dropzone === this.$dragTarget) return;

      // this.fromListIndex을 참조하면 않된다. this.$dragTarget의 list index는 매번 변경되기 때문에 매번 새롭게 취득해야 한다.
      const [fromListIndex, toListIndex] = [this.getListIndex(this.$dragTarget), this.getListIndex($dropzone)];

      /**
       * insertedNode = parentNode.insertBefore(newNode, referenceNode);
       * insertBefore는 참조 노드(referenceNode) 앞에 특정 부모 노드(parentNode)의 자식 노드(newNode)를 삽입한다.
       * 만약 참조 노드(referenceNode)가 null이면 부모 노드(parentNode)의 맨 끝에 자식 노드(newNode)가 추가된다.
       * @see https://developer.mozilla.org/ko/docs/Web/API/Node/insertBefore
       */
      this.$dragTarget.parentNode.insertBefore(
        this.$dragTarget,
        /**
         * $dragTarget의 list index > $dropzone의 list index: drag 방향 ⇐
         * => $dragTarget을 $dropzone 앞으로 이동
         * $dragTarget의 list index < $dropzone의 list index: drag 방향 ⇒
         * => $dragTarget을 $dropzone의 뒤($dropzone의 다음 요소 앞)로 이동
         */
        fromListIndex > toListIndex ? $dropzone : $dropzone.nextElementSibling
      );

      // list index 재설정
      [...document.querySelectorAll('.list')].forEach(($list, i) => {
        $list.dataset.listIndex = i;
      });

      return;
    }

    if (this.$dragTarget.matches('.card')) {
      const $cardsContainer = $dropzone.querySelector('.cards-container');

      // list에 card가 없거나, $dropTarget과 $dropzone과 동일(card가 자신이 속한 list에 dragover)하면 마지막에 추가한다.
      if ($cardsContainer.children.length === 0 || $dropTarget === $dropzone) {
        $cardsContainer.appendChild(this.$dragTarget);
        return;
      }

      // card가 존재하는 list에 card를 드롭하려는 경우 sortable하게 동작하게 위해 자신이 아닌 다른 card 위를 dragover하는 경우만 유효하다.
      if ($dropTarget === this.$dragTarget || !$dropTarget.matches('.card')) return;

      $cardsContainer.insertBefore(
        this.$dragTarget,
        /**
         * 마우스 커서가 $dropTarget의 중앙보다 위에 위치
         * => $dragTarget을 $dropzone 앞으로 이동
         * 마우스 커서가 $dropTarget의 중앙보다 아래에 위치
         * => $dragTarget을 $dropzone의 뒤($dropzone의 다음 요소 앞)로 이동
         */
        e.offsetY < this.getVerticalCenter($dropTarget) ? $dropTarget : $dropTarget.nextSibling
      );
    }
  }

  onDrop() {
    // const $dropTarget = e.target;

    if (this.$dragTarget.matches('.list')) {
      /**
       * fromListIndex: drop된 list의 과거 list index(dragstart 이벤트 핸들러에서 저장)
       * toListIndex: drop된 list의 현재 list index
       *
       * toListIndex의 취득 방법
       * list 요소 외부에 drop 했지만 이미 DOM이 변경된 경우가 있다. 따라서 $dropzone을 기준으로 어디에 드롭되었는지 확인할 수 없다.
       * dragover 이벤트 핸들러에서 DOM은 이미 변경되었다. 따라서 현재 DOM 상에 dragTarget이 어디 있는지 확인해보면 어디로 drop되었는지 알 수 있다.
       */
      const [fromListIndex, toListIndex] = [this.fromListIndex, this.getListIndex(this.$dragTarget)];

      // list가 자신에게 drop되면 무시한다.
      if (fromListIndex === toListIndex) return;

      const lists = moveList(this.state.lists, fromListIndex, toListIndex);
      /**
       * setTimeout없이 this.setState를 호출하면 dragend 이벤트가 발생하지 않는다.
       * dragend 이벤트는 drop 이벤트가 발생한 이후에 발생한다.
       * task queue의 마지막으로 setState를 푸시해 dragend 이벤트 핸들러가 먼저 푸시되고 호출되도록 한다.
       */
      setTimeout(() => this.setState({ lists }), 10);
      return;
    }

    if (this.$dragTarget.matches('.card')) {
      const [cardId, fromListId, toListId] = [
        this.getCardId(this.$dragTarget),
        this.fromListId, // drop된 card의 과거 list id(dragstart 이벤트 핸들러에서 저장)
        // dragover 이벤트 핸들러에서 DOM은 이미 변경되었으므로 현재 DOM 상에 dragTarget이 어디 있는지 확인해보면 어디로 drop되었는지 알 수 있다.
        this.getListId(this.$dragTarget),
      ];

      // drop된 card의 index
      const index = [...this.$dragTarget.parentNode.querySelectorAll('.card')].findIndex(
        $card => cardId === +$card.dataset.cardId
      );

      // TODO: drag target이 자신의 위치로 drop되어도 리렌더링된다.
      const lists = moveCard(this.state.lists, cardId, fromListId, toListId, index);
      /**
       * setTimeout없이 this.setState를 호출하면 dragend 이벤트가 발생하지 않는다.
       * dragend 이벤트는 drop 이벤트가 발생한 이후에 발생한다.
       * task queue의 마지막으로 setState를 푸시해 dragend 이벤트 핸들러가 먼저 푸시되고 호출되도록 한다.
       */
      setTimeout(() => this.setState({ lists }), 10);
    }
  }

  onClick(e) {
    if (e.target.nodeName === 'A') e.preventDefault();

    if (e.target.matches('.card-composer-opener') || e.target.matches('.card-composer-closer')) {
      this.toggleCardComposer(this.getListId(e.target));
      return;
    }

    if (e.target.matches('.list-composer-opener') || e.target.matches('.list-composer-closer')) {
      this.toggleListComposer();
      return;
    }

    if (e.target.closest('.card')) {
      // 팝업을 오픈하기 위해 클릭되어 선택된 card의 list id
      this.selectedListId = this.getListId(e.target);
      // 팝업을 오픈하기 위해 클릭되어 선택된 card id
      this.selectedCardId = this.getCardId(e.target);

      this.togglePopup(this.selectedListId, this.selectedCardId);
      return;
    }

    if (e.target.matches('.popup-overlay') || e.target.matches('.close-popup')) {
      this.togglePopup();
      return;
    }

    if (e.target.matches('.card-desc-composer-opener') || e.target.matches('.card-desc-composer-closer')) {
      this.toggleCardDescComposer();
    }
  }

  onKeydown(e) {
    /**
     * 한글을 입력하면 keydown/keyup 이벤트가 두번 발생하는 이슈가 있다. 이를 방지하기 위해 keypress 이벤트를 사용할 수 있다.
     * 하지만 keypress 이벤트는 esc 키를 눌렀을 때 발생하지 않고, Deprecated되었으므로 사용을 권장하지 않는다.
     *
     * KeyboardEvent.isComposing을 사용하면 한글 입력 이슈를 해결할 수 있다.
     * 한국어(또는 중국어, 일본어)를 입력하면 isComposing은 true, keyCode는 229이다.
     * @see https://poiemaweb.notion.site/8cf9fde21037446f9be4adc81089e8fc
     */
    if (e.isComposing) return;

    if (e.key !== 'Escape' && e.key !== 'Enter') return;

    // 1. .mod-list-title: Escape/Enter => list title 갱신
    if (e.target.matches('.mod-list-title')) {
      // focusout 이벤트 핸들러가 호출된다. focusout 이벤트 핸들러가 list title을 갱신한다.
      e.target.blur();
      return;
    }

    /**
     * Escape 키
     * 2. .new-card-title => card를 추가하지 않는다. 입력된 textarea value는 유지한다.
     * 3. .new-list-title => list를 추가하지 않는다. 입력된 textarea value는 유지한다.
     * 4. .mod-card-title => card title을 갱신하지 않는다. 입력 이전의 상태로 되돌린다.
     * 5. .mod-card-desc => card description을 갱신하지 않는다. 입력 이전의 상태로 되돌린다.
     */
    if (e.key === 'Escape') {
      // window에 바인딩된 keydown 이벤트 핸들러에게 영향을 주지 않는다.
      e.stopPropagation();

      if (e.target.matches('.new-card-title')) {
        this.toggleCardComposer(this.getListId(e.target));
        return;
      }
      if (e.target.matches('.new-list-title')) {
        this.toggleListComposer();
        return;
      }
      if (e.target.matches('.mod-card-desc')) {
        this.toggleCardDescComposer();
        return;
      }
      if (e.target.matches('.mod-card-title')) {
        // 입력 이전의 상태로 되돌린다.
        e.target.value = findCard(this.state.lists, this.selectedCardId).title;
        e.target.blur();
      }

      return;
    }

    /**
     * Enter 키
     * 2. .new-card-title => card 추가
     * 3. .new-list-title => list 추가
     * 4. .mod-card-title => 개행 유효. Enter 키를 눌러도 submit event를 강제 발생시키지 않는다.
     * 4. .mod-card-title => title 갱신
     * 5. .mod-card-desc => 무시
     */
    if (e.key === 'Enter') {
      const val = e.target.value.trim();

      if (e.target.matches('.new-card-title') || e.target.matches('.new-list-title')) {
        // 개행을 방지한다. keyboardEvent의 기본 동작은 키를 입력받는 것이다. keyup이 아닌 keydown 이벤트를 사용하면 동작하지 않는다.
        e.preventDefault();

        /**
         * textarea에서 엔터키를 누르면 input과 달리 submit event가 발생하지 않는다.
         * textarea에 공백 이외의 문자를 입력하고 엔터키를 누르면 개행하지 않고 강제로 submit event를 발생시킨다.
         */
        if (val !== '') e.target.closest('form').querySelector('button').click();
        return;
      }

      if (e.target.matches('.mod-card-title')) {
        const { title } = findCard(this.state.lists, this.selectedCardId);

        // 이전 값으로 되돌린다.
        if (val === '') e.target.value = title;

        // 입력 값이 변경전 title과 다른 경우만 title 갱신
        if (title !== val) {
          const lists = updateCardTitle(this.state.lists, this.selectedCardId, e.target.value);
          this.setState({ lists });
        }

        e.target.blur();
      }
    }
  }

  /**
   * blur	이벤트는 버블링되지 않는다.
   * focusin, focusout 이벤트 핸들러를 이벤트 핸들러 프로퍼티 방식으로 등록하면 크롬, 사파리에서 정상 동작하지 않는다.
   * focusin, focusout 이벤트 핸들러는 addEventListener 메서드 방식을 사용해 등록해야 한다.
   */
  onFocusout(e) {
    if (!e.target.matches('.mod-list-title')) return;

    const listId = this.getListId(e.target);
    const currentListTitle = findList(this.state.lists, listId).title;
    const newListTitle = e.target.value.trim();

    // 입력값이 공백 뿐이면 입력 이전의 상태로 되돌린다.
    if (newListTitle === '') {
      e.target.value = currentListTitle;
      e.target.blur();
      return;
    }

    // list title 갱신
    if (currentListTitle !== newListTitle) {
      const lists = updateListTitle(this.state.lists, listId, newListTitle);
      this.setState({ lists });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const $textarea = e.target.querySelector('textarea');
    const value = $textarea.value.trim();

    if (e.target.matches('.card-composer')) {
      if (value === '') return;

      const listId = this.getListId(e.target);
      const lists = appendCard(this.state.lists, listId, value);
      $textarea.value = '';

      this.setState({ lists });
      return;
    }

    if (e.target.matches('.list-composer')) {
      if (value === '') return;

      const lists = appendList(this.state.lists, value);
      $textarea.value = '';

      this.setState({ lists });
      return;
    }

    if (e.target.matches('.card-desc-composer')) {
      const currentCardDescription = findCard(this.state.lists, this.selectedCardId).description;

      if (currentCardDescription === value) {
        this.toggleCardDescComposer();
        return;
      }

      const lists = updateCardDescription(this.state.lists, this.selectedCardId, value);
      this.setState({ lists, popup: { ...this.state.popup, isOpenCardDescComposer: false } });
    }
  }
}

export default Trello;
