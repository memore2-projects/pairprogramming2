const pageSize = 5;
const apiKey = '07030d65ffe043778447ce7ad2e3d90d';
let page = 0;
let $container = null;
let category = 'all';

const getNewsAPI = async category => {
  try {
    page += 1;
    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
      category === 'all' ? '' : category
    }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    const {
      data: { articles: news },
    } = await axios.get(url);
    return news;
  } catch (error) {
    console.log('getNewsAPI', error);
  }
};

// prettier-ignore
const addNewsItems = async category => {
  try {
    const news = await getNewsAPI(category);
    const $newsList = document.querySelector('.news-list');
    const $div = document.createElement('div');
    $div.innerHTML = `
      ${news.map(({ title, url, urlToImage, description }) => `
        <section class="news-item">
          <div class="thumbnail">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              <img src="${urlToImage}" alt="thumbnail" />
            </a>
          </div>
          <div class="contents">
            <h2>
              <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
            </h2>
            <p>${description}</p>
          </div>
        </section>`
      )}`;

    [...$div.children].forEach(news => {
      $newsList.appendChild(news);
    });
  } catch (error) {
    console.log(`addNewsItems ${error}`);
  }
};

const NewsListRender = async selectedCategory => {
  category = selectedCategory;
  page = 0;
  const news = await getNewsAPI(category);
  const $div = document.createElement('div');

  // 옵셔널 체이닝 연산자.
  // 기대하는 변수가 null 또는 undefined인지 확인하여 null일결우
  $container.querySelector('.news-list-container')?.remove();

  // prettier-ignore
  $div.innerHTML = `
    <div class="news-list-container">
      <article class="news-list">
        ${news.map(({ title, url, urlToImage, description }) => `
          <section class="news-item">
            <div class="thumbnail">
              <a href="${url}" target="_blank" rel="noopener noreferrer">
                <img src="${urlToImage}" alt="thumbnail" />
              </a>
            </div>
            <div class="contents">
              <h2>
                <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
              </h2>
              <p>${description}</p>
            </div>
          </section>
        `)}
      </article>
      <div class="scroll-observer">
        <img src="img/ball-triangle.svg" alt="Loading..." />
      </div>
    </div>`;

  $container.appendChild($div);

  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) addNewsItems(category);
    },
    { threshold: 0.5 }
  );
  observer.observe($container.querySelector('.scroll-observer > img'));
};
const NewsList = $root => {
  $container = $root;
  NewsListRender(category);
};

export { NewsList, NewsListRender };
