class Accordion {
  constructor({ $container, menuList, showMultiple = false }) {
    this.$container = $container;
    this.showMultiple = showMultiple;
    this.menuList = menuList;

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
