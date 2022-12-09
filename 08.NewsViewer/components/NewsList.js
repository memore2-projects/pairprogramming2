const PAGE_SIZE = 5;

const apiKey = '07030d65ffe043778447ce7ad2e3d90d';
let page = 0;

// NewsAPI에서 목적 카테고리의 페이지를 불러옴.
// page는 IntersectionObserver에서 addNewsItems을 통해 호출될 때마다 +1하여 다음 페이지 내용들이추가될 수 있도록 하고, 카테고리 변경으로 인한 렌더링은 page를 다시 0으로 바꿔주기 때문에 첫 페이지부터 다시 렌더링 할 수 있다.
const getNewsAPI = async selectedCategory => {
  try {
    page += 1;

    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
      selectedCategory === 'all' ? '' : selectedCategory
    }&page=${page}&pageSize=${PAGE_SIZE}&apiKey=${apiKey}`;

    // prettier-ignore
    const {data: { articles: news },} = await axios.get(url);
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

// 1. 초기 렌더링 호출 : 초기 상태(selectedCategory: 'all)을 기준으로 newAPI를 가져와서 렌더링
// 2. 카테고리(상태) 변경될 시의 호출 : 기존 존재하던 news-list를 삭제하고, 변경된 카테고리의 news-list 로 교체.
const NewsListRender = async ($root, selectedCategory) => {
  page = 0;

  const news = await getNewsAPI(selectedCategory);
  const $div = document.createElement('div');

  // 옵셔널 체이닝 연산자로 기존 news-list-container가 있을 경우 삭제.
  // 기대하는 변수가 null 또는 undefined인지 확인하여 null일결우
  $root.querySelector('.news-list-container')?.remove();

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

  $root.appendChild($div.firstElementChild);

  // 카테고리가 변경되어 새로 렌더링 되었을 때의 img와 이전 img가 다르기 때문에 해당 img에 접근하려면 다시 querySelector로 불러와야된다.
  const observer = new IntersectionObserver(
    entries => {
      // img요소가 보여질 때만을 기준으로 하기 위해 isIntersecting이 true일 때를 감지.
      // isIntersecting: 보여질 때의 상태를 판단.
      if (entries[0].isIntersecting) addNewsItems(selectedCategory);
    },
    // 해당 요소의 전체 크기를 기준으로 isIntersecting 판별
    { threshold: 1 }
  );
  observer.observe($root.querySelector('.scroll-observer > img'));
};

const NewsList = ($root, categoryProxy) => {
  NewsListRender($root, categoryProxy.selectedCategory);
};

export { NewsList, NewsListRender };
