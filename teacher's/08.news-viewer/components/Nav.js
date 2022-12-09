import { state } from '../state/index.js';

class Nav {
  constructor($container) {
    this.$container = $container;

    this.categories = [
      { name: 'all', text: '전체보기' },
      { name: 'business', text: '비즈니스' },
      { name: 'entertainment', text: '엔터테인먼트' },
      { name: 'health', text: '건강' },
      { name: 'science', text: '과학' },
      { name: 'sports', text: '스포츠' },
      { name: 'technology', text: '기술' },
    ];

    this.render();
    this.bindEvents();
  }

  render() {
    // prettier-ignore
    this.$container.innerHTML = `
      <ul>
      ${this.categories.map(({ name, text }) =>
        `<li id="${name}" class="category-item ${state.category === name ? 'active' : ''}">
          ${text}
        </li>`).join('')}
      </ul>`;
  }

  bindEvents() {
    this.$container.addEventListener('click', ({ target }) => {
      // 현재 활성화된 category를 클릭하면 무시한다.
      if (!target.matches('.category-item:not(.active)')) return;

      this.$container.querySelector('.active').classList.remove('active');
      target.classList.add('active');

      // 전역 상태를 변경한다. 전역 상태가 변경되면 전역 상태를 구독하고 있는 컴포넌트의 render 메서드가 호출되어 리렌더링된다.
      state.category = target.id;
    });
  }
}

export default Nav;
