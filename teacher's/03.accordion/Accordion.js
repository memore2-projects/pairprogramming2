class Accordion {
  /**
   * @type {(props: { $container: HTMLElement, menuList: Array<{ id: number, title: string, subMenu: Array<{ title: string, path: string }>, isOpen: boolean }>, showMultiple: boolean }) => void}
   * option.showMultiple: 여러 메뉴를 오픈 가능한지 여부(default: false)
   * @example
   * new Accordion({ $container: document.getElementById('accordion1'), menuList });
   * new Accordion({ $container: document.getElementById('accordion2'), menuList, showMultiple: true } });
   */
  constructor({ $container, menuList, showMultiple = false }) {
    this.$container = $container;
    this.showMultiple = showMultiple;

    // showMultiple가 false지만 true로 설정된 menuList의 isOpen 프로퍼티가 복수 존재하면 가장 앞선 isOpen만 true로 한다.
    if (!showMultiple) {
      let count = 0;
      // eslint-disable-next-line no-param-reassign
      menuList = menuList.map(menu => {
        if (menu.isOpen) count += 1;
        return count > 1 ? { ...menu, isOpen: false } : menu;
      });
    }

    this.setState({ menuList });
    this.bindEventHandlers();
  }

  setState(newState) {
    if (typeof newState !== 'object' || newState === null) throw new TypeError('newState must be object');

    this.state = { ...this.state, ...newState };
    console.log(`[STATE]`, this.state);

    this.render(); // re-rendering
  }

  render() {
    const { menuList } = this.state;

    // prettier-ignore
    this.$container.innerHTML = `
      <div class="accordion-container">
        ${menuList.map(({ id, title, subMenu, isOpen }) => `
        <article data-id="${id}" class="${isOpen ? 'active' : ''}">
          <h1><i class="bx bxs-chevron-down"></i>${title}</h1>
          <ul>
          ${subMenu.map(({title, path})=>`
            <li><a href="${path}">${title}</a></li>`).join('')}
          </ul>
        </article>`).join('')}
      </div>`;
  }

  bindEventHandlers() {
    /**
     * TODO: 서브메뉴를 열고 닫을 때 CSS transition을 이용하여 슬라이드 효과를 구현한다. CSS transition은 적절한 타이밍을 유지해야 한다. 다시 말해, 열고 닫히는 타이밍이 같아야 한다.
     *
     * ! 문제점 1
     * 현재 서브메뉴를 열고 닫을 때 아래와 같이 CSS에서 height를 변경한다.
     * .accordion-container > article > ul { height: 0; overflow: hidden; ...}
     * .accordion-container > article.active > ul { height: auto; }
     *
     * 이처럼 height가 0에서 auto로 변경되면 transition이 발동하지 않는다.
     * @see https://stackoverflow.com/questions/3508605/how-can-i-transition-height-0-to-height-auto-using-css
     * @see https://www.geeksforgeeks.org/how-to-make-transition-height-from-0-to-auto-using-css
     *
     * transition을 위해 명시적으로 height에 px 값을 지정해야 한다. max-height에 임의의 높이(예를 들어 1000px)를 지정하는 방법도 있지만 이 방법을 사용하면 애니메이션 타이밍이 망가진다.
     * $activeSubmenu.style.height = `${$activeSubmenu.scrollHeight}px`;
     *
     * ! 문제점 2
     * transition은 CSS 프로퍼티의 값이 변화할 때 프로퍼티 값의 변화가 일정 시간(duration)에 걸쳐 일어나도록 하는 것이다.
     * 따라서 DOM 요소를 새롭게 생성해 리렌더링하는 현재 방법에서는  transition이 발동하지 않는다.
     *
     * ! solution
     * transition 대신 animation을 사용한다?
     * transition vs. animation
     * @see https://blog.hubspot.com/website/css-transition-vs-animation
     */
    this.$container.addEventListener('click', e => {
      // h1 요소의 자식 요소가 클릭되는 경우도 있다. 이를 위해 e.target의 부모 중에서 h1 요소를 찾는다.
      if (!e.target.closest('article > h1')) return;

      const id = +e.target.parentNode.dataset.id;

      /**
       * showMultiple가 true면 여러 메뉴를 오픈할 수 있다.
       * showMultiple가 false면 선택된 메뉴만 오픈하고 그 외의 메뉴는 닫는다.
       */
      const menuList = this.state.menuList.map(menu =>
        menu.id === id ? { ...menu, isOpen: !menu.isOpen } : this.showMultiple ? menu : { ...menu, isOpen: false }
      );
      this.setState({ menuList });
    });
  }
}

export default Accordion;
