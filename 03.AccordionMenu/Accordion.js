class Accordion {
  constructor({ $container, menuList, showMultiple = false }) {
    this.$container = $container;
    this.showMultiple = showMultiple;
    this.menuList = menuList;

    this.isOpens = [];
    this.setInitIsOpens();
    this.render();

    this.$container.addEventListener('click', e => {
      if (!e.target.matches('article > h1')) return;

      this.changeIsOpens(+e.target.parentNode.dataset.id);
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

  setInitIsOpens() {
    if (this.showMultiple) {
      this.menuList.forEach(menu => {
        this.isOpens.push(menu.isOpen);
      });
    } else {
      const firstTrueIndex = this.menuList.findIndex(menu => menu.isOpen);
      this.isOpens = Array(this.menuList.length).fill(false);
      this.isOpens[firstTrueIndex] = true;
    }
  }

  changeIsOpens(menuId) {
    if (this.showMultiple) {
      this.isOpens[menuId - 1] = !this.isOpens[menuId - 1];
    } else {
      const isMenuOpen = this.isOpens[menuId - 1];
      this.isOpens = Array(this.menuList.length).fill(false);
      this.isOpens[menuId - 1] = !isMenuOpen;
    }
  }
}

export default Accordion;
