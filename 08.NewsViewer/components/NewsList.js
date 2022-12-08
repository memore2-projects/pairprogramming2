const category = 'entertainment';
const pageSize = 5;
const apiKey = '9318936041fb4ff38ca89bbeda183747';
let page = 1;

const render = $container => {
  const $div = document.createElement('div');

  $div.innerHTML = `
    <div class="news-list-container">
  <article class="news-list"></article>
      <div class="scroll-observer">
        <img src="img/ball-triangle.svg" alt="Loading..." />
      </div>
    </div>`;
  $container.appendChild($div.firstElementChild);
};

const getNewsAPI = async () => {
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

const addNewsItems = async () => {
  try {
    const news = await getNewsAPI();
    const $newsList = document.querySelector('.news-list');
    const $div = document.createElement('div');
    $div.innerHTML = `
${news.map(
  ({ title, url, urlToImage, description }) => `
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
)}
`;
    [...$div.children].forEach(news => {
      $newsList.appendChild(news);
    });
  } catch (error) {
    console.log(`addNewsItems ${error}`);
  }
};

const NewsList = $container => {
  render($container);

  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) addNewsItems($container);
    },
    { threshold: 1 }
  );
  observer.observe($container.querySelector('.scroll-observer'));
};

export default NewsList;
