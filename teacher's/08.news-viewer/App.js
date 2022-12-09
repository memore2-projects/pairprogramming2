import { Nav, NewsList } from './components/index.js';
import { createState } from './state/index.js';

const App = $container => {
  // 전역 상태 생성
  createState({ category: 'all' });

  $container.innerHTML = `
    <nav class="category-list"></nav>
    <div class="news-list-container">
      <article class="news-list"></article>
      <div class="scroll-observer">
        <img src="img/ball-triangle.svg" alt="Loading..." />
      </div>
    </div>`;

  new Nav($container.querySelector('.category-list'));
  new NewsList($container.querySelector('.news-list-container'));
};

App(document.getElementById('root'));
