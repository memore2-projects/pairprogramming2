class Accordion {
  constructor({ $container, menuList, showMultiple = false }) {
    this.$container = $container;
    this.showMultiple = showMultiple;
    // 초기버전. app.js의 데이터를 변경하여 그 데이터를 기준으로 출력을 했는데, 여러개의 Accordion이 하나의 데이터를 기반으로 렌더링 되기 때문에 많은 오류가 있었음.
    // 읽어온 데이터(menuList)는 초기 렌더링에만 사용하고, 그 이후 동작에 대한 정보는 따로 isOpens라는 배열을 만들어 관리.
    this.menuList = menuList;

    // isOpens : 현재 각 메뉴가 열려있는 상태인지를 boolean으로 저장하는 배열
    this.isOpens = Array(this.menuList.length).fill(false);
    this.setInitIsOpens();
    this.render();

    this.$container.addEventListener('click', e => {
      if (!e.target.matches('article > h1')) return;

      this.toggleIsOpen(+e.target.parentNode.dataset.id);
      this.render();
    });
  }

  // prettier-ignore
  render() {
    this.$container.innerHTML = `
      <div class='accordion-container'>
        ${this.menuList.map(({ id, title, subMenu },index) => `
          <article data-id='${id}' class='${this.isOpens[index]? 'active' : ''}'>
            <h1><i class='bx bxs-chevron-down'></i>${title}</h1>
            <ul>
              ${subMenu.map(({ title, path }) => `
                <li><a href='${path}'>${title}</a></li>`).join('')}
            </ul>
          </article>`).join('')}
      </div>`;
  }

  /**
   *  #1 메뉴 여러개 열기 가능
   * - menuList에서 isOpen값이 true인 메뉴들을 찾아 isOpens 배열의 해당하는 index의 값을 true로 변경.
   *
   *  #2 메뉴 한개만 열기 가능
   * - menuList에서 가장 처음 isOpen이 true로 되어있는 메뉴를 찾아 해당하는 isOpens의 index만 true로 변경.
   */
  setInitIsOpens() {
    if (this.showMultiple) {
      this.menuList.forEach((menu, index) => {
        if (menu.isOpen) this.isOpens[index] = true;
      });
    } else {
      const firstTrueIndex = this.menuList.findIndex(menu => menu.isOpen);

      this.isOpens[firstTrueIndex] = true;
    }
  }

  /**
   * #1 메뉴 여러개 열기 가능
   * - 클릭한 요소의 id를 읽어와 isOpens[id-1](해당 요소 인덱스)의 값을 토글링(true <=> false)
   *
   * #2 메뉴 한개만 열기 가능
   * - isOpens를 순회하면서 isOpens[id-1](해당 요소 인덱스) 값은 토글링하고 (true <=> false), 나머지는 false
   */
  toggleIsOpen(menuId) {
    if (this.showMultiple) {
      this.isOpens[menuId - 1] = !this.isOpens[menuId - 1];
    } else {
      this.isOpens.forEach((isOpen, index) => {
        this.isOpens[index] = index === menuId - 1 ? !isOpen : false;
      });
    }
  }
}

export default Accordion;
