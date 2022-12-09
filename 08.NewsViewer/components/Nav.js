// do something!
import categoryProxy from './category.js';

const categoryArr = [
  ['all', '전체보기'],
  ['business', '비즈니스'],
  ['entertainment', '엔터테인먼트'],
  ['health', '건강'],
  ['science', '과학'],
  ['sports', '스포츠'],
  ['technology', '기술'],
];

// prettier-ignore
const NavRender = $root => {
  $root.innerHTML = `
    <nav class="category-list">
      <ul>${categoryArr.map(category => `
        <li id="${category[0]}" class="category-item ${categoryProxy.selectedCategory === category[0] ? 'active' : ''}">
          ${category[1]}
        </li>`).join('')}
      </ul>
    </nav>`;
  
};

const Nav = $root => {
  NavRender($root);

  $root.addEventListener('click', e => {
    if (!e.target.matches('.category-item')) return;

    categoryProxy.selectedCategory = e.target.id;

    $root.querySelectorAll('.category-item').forEach(category => {
      category.classList.toggle('active', category.id === e.target.id);
    });
  });
};

export default Nav;
