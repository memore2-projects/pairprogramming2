const CATEGORY_ARRAY = [
  ['all', '전체보기'],
  ['business', '비즈니스'],
  ['entertainment', '엔터테인먼트'],
  ['health', '건강'],
  ['science', '과학'],
  ['sports', '스포츠'],
  ['technology', '기술'],
];

// prettier-ignore
const NavRender = ($root, categoryProxy) => {
  $root.innerHTML = `
    <nav class="category-list">
      <ul>${CATEGORY_ARRAY
        .map(category => `
          <li id="${category[0]}" class="category-item ${categoryProxy.selectedCategory === category[0] ? 'active' : ''}">
            ${category[1]}
          </li>`).join('')}
      </ul>
    </nav>`;
};

const Nav = ($root, categoryProxy) => {
  NavRender($root, categoryProxy);

  $root.addEventListener('click', e => {
    if (!e.target.matches('.category-item')) return;

    // click한 카테고리의 id를 가져와 categoryObj의 상태를 변경한다.
    // proxy를 사용하여 변경함으로써 newsList 또한 렌더링 되게 한다.
    categoryProxy.selectedCategory = e.target.id;

    // 해당 카테고리만 active 클래스를 가지도록 변경.
    $root.querySelectorAll('.category-item').forEach(category => {
      category.classList.toggle('active', category.id === e.target.id);
    });
  });
};

export default Nav;
