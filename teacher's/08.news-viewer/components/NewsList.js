import { state, subscribe } from '../state/index.js';

class NewsList {
  constructor($container) {
    this.$newsList = $container.querySelector('.news-list');
    this.$scrollObserver = $container.querySelector('.scroll-observer');

    /**
     * 내부 상태
     * 현재 페이지를 나타내며 intersectionObserver에 의해 증가된다.
     * page가 변경되면 render 메서드를 호출해 리렌더링한다.
     */
    this.page = 1;

    /**
     * 현재 카테고리
     * 전역 상태 category과 비교해 카테고리가 변경되었는지 확인하기 위해 사용한다.
     * Nav 컴포넌트가 전역 상태 category를 변경하면 render가 호출된다. 이때 현재 카테고리도 변경된다.
     */
    this.currentCategory = null;
    /**
     * 카테고리 내 뉴스의 총 갯수
     * 더 불러들일 뉴스가 존재하는지 확인하기 위해 사용한다.
     * 뉴스를 fetch한 이후 변경된다.
     */
    this.totalNewsCount = 0;
    /**
     * 지금까지 불러들인 뉴스의 총 갯수
     * 더 불러들일 뉴스가 존재하는지 확인하기 위해 사용한다. this.totalNewsCount와 같다면 더이상 불러들일 뉴스가 없다는 것을 의미한다.
     * 렌더링 이후 변경된다.
     */
    this.currentNewsCount = 0;

    // intersectionObserver 인스턴스. 렌더링 이후 observe된다.
    this.intersectionObserver = this.createIntersectionObserver();

    // 첫 렌더링 이후 $scrollObserver 요소가 뷰포트와 교차하는지 관측하기 시작한다.
    this.render().then(() => {
      // $scrollObserver 요소가 뷰포트와 교차하면 intersectionObserver의 observer가 호출된다.
      this.intersectionObserver.observe(this.$scrollObserver);
      // 전역 상태 구독. 전역 상태가 변경되면 전역 상태를 구독하고 있는 컴포넌트의 render 메서드가 호출되어 리렌더링된다.
      subscribe(this);
    });
  }

  // $scrollObserver 요소가 뷰포트와 교차하면 다음 뉴스를 읽어들여 추가 렌더링한다.
  createIntersectionObserver() {
    return new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || target !== this.$scrollObserver) return;

        // 더이상 불러들일 뉴스가 없다면
        if (this.currentNewsCount !== 0 && this.totalNewsCount === this.currentNewsCount) {
          console.log('NO MORE NEWS!');

          /* 박스 영역을 유지하도록 display: none; 대신 visibility: hidden;을 사용한다. */
          this.$scrollObserver.style.visibility = 'hidden';
          return;
        }

        this.$scrollObserver.style.visibility = 'visible';
        this.page += 1;
        this.render();
      });
    });
  }

  /**
   * render 메서드는 다음과 같은 경우 다시 호출되어 리렌더링한다.
   *  - 전역 상태 category 변경
   *  - 내부 상태 page 변경
   */
  async render() {
    // 전역 상태 category가 변경되어 render가 호출된 경우 isChangedCategory는 true다.
    const isChangedCategory = this.currentCategory !== state.category;

    // 전역 상태 category가 변경된 경우
    if (isChangedCategory) {
      this.page = 1;
      this.currentCategory = state.category;
    }

    /**
     * TODO: 이전 비동기 요청 취소
     * Nav을 클릭한 다음 비동기 요청이 완료되기 이전에 다른 Nav을 클릭하면 이전 비동기 요청을 취소한다.
     * @see https://developer.mozilla.org/ko/docs/Web/API/AbortController
     * @see https://velog.io/@maru5mango/비동기-통신-취소하기feat.-AbortController
     */

    const { totalResults, articles } = await this.fetchArticles(state.category, this.page);
    console.log('[fetch-articles]', { totalResults, articles });

    this.totalNewsCount = totalResults;
    const $articles = this.createArticleElements(articles);

    /**
     * 전역 상태 category가 변경된 경우: 페이지를 새롭게 시작
     * 내부 상태 page가 변경된 경우: 기존 페이지에 articles를 추가
     */
    if (isChangedCategory) {
      this.$newsList.replaceChildren($articles);
      this.currentNewsCount = articles.length;
    } else {
      this.$newsList.appendChild($articles);
      this.currentNewsCount += articles.length;
    }

    console.log('[render]', { totalNewsCount: this.totalNewsCount, currentNewsCount: this.currentNewsCount });
  }

  async fetchArticles(category, page) {
    const pageSize = 5;

    /**
     * News API는 일정 시간 내에 요청 횟수를 초과하면 429(Too Many Requests) 에러를 발생시킨다.
     * 개발시에는 많은 요청을 보낼 수 밖에 없으므로 여러 개의 apiKey를 생성하는 것을 추천한다.
     * 이메일만 다르면 여러 개의 apiKey를 생성할 수 있디.
     */
    // const apiKey = 'd62727a0a3d949f396ec220300e03302'; // 자신의 apiKey로 교체한다!
    const apiKey = '57dd0e05975842149c1357ed23313418'; // 자신의 apiKey로 교체한다!

    const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
      category === 'all' ? '' : category
    }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

    try {
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  createArticleElements(articles) {
    const $template = document.createElement('template');
    // prettier-ignore
    $template.innerHTML = articles.map(({ title, description, url, urlToImage }) => `
      <section class="news-item">
        <div class="thumbnail">
          <a href="${url}" target="_blank" rel="noopener noreferrer">
            <img
              src="${urlToImage || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}"
              alt="thumbnail"/>
          </a>
        </div>
        <div class="contents">
          <h2>
            <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
          </h2>
          <p>${description || ''}</p>
        </div>
      </section>`).join('');

    return $template.content;
  }
}

export default NewsList;
