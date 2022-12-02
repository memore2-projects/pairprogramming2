class Accordion {
  constructor({ $container, menuList, showMultiple = false }) {
    this.$container = $container;
    // 여러개의 아코디언이 서로에게 영향을 주지않고 독립적으로 사용가능하려면 깊은복사가 필요했다.
    this.menuList = [...menuList].map(obj => ({ ...obj }));
    this.showMultiple = showMultiple;

    // 왜 findIndex를 사용햇는가? : IsOpen이 true인 것이 여러개 존재한다면 첫번째인 것만 가져와야하기때문에
    if (!showMultiple) this.showSingleMenu(this.menuList.findIndex(menu => menu.isOpen));

    this.render();

    this.$container.addEventListener('click', e => {
      if (!e.target.matches('article > h1')) return;

      this.changeIsOpen(e.target.parentNode.dataset.id);
      this.render();
    });
  }

  // prettier-ignore
  render() {
    this.$container.innerHTML = `
      <div class='accordion-container'>
        ${this.menuList.map(({ id, title, subMenu, isOpen }) => `
          <article data-id='${id}' class='${isOpen ? 'active' : ''}'>
            <h1><i class='bx bxs-chevron-down'></i>${title}</h1>
            <ul>
              ${subMenu.map(({ title, path }) => `
                <li><a href='${path}'>${title}</a></li>`).join('')}
            </ul>
          </article>`).join('')}
      </div>`;
  }

  // TODO: setter와 getter의 개념을 공부하고 일반 메서드로 사용할때와 어떤 차이점이 있는지 공부하자.
  // TODO: 처음 클래스를 호출했을때 단 한번만 실행이 되는데 이것을 함수로 뺴서 사용하지 않는 방법이 있는지 찾자.
  showSingleMenu(firstId) {
    this.menuList.map((menu, index) => {
      if (firstId !== index) menu.isOpen = false;
      return menu;
    });
  }

  // changeMenuListIsOpen -> changeIsOpen으로 변경
  // 클래스 안에 코드문맥상으로 IsOpen이라는 것이 menu에 대한 상태를 의미하는 것을 누구나 알 수 있기때문에
  changeIsOpen(id) {
    // 이벤트가 일어날때 id를 받아오고 해당아이디와 같은 데이터의 isOpen를 변경한다.
    // 만약 showMultiple이 false인 인스턴스라면 클릭한 menu를 제외한 나머지 IsOpen은 false가 된다.
    this.menuList.map((menu, index) => {
      if (+id - 1 === index) menu.isOpen = !menu.isOpen;
      else if (!this.showMultiple) menu.isOpen = false;
      return menu;
    });
  }
}

export default Accordion;
