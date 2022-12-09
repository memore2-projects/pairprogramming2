class Component {
  constructor(args) {
    this._init(args);

    (async () => {
      // css가 적용되기 전에 렌더링되지 않도록 한다.
      await this.loadStyles();
      this.render();
      this.bindEvents();
    })();
  }

  /**
   * 인스턴스 프로퍼티를 초기화한다.
   * @private
   */
  _init(args) {
    for (const [key, value] of Object.entries(args)) {
      this[key] = value;
    }

    this.init();

    if (!Object.keys(this).includes('$container')) {
      throw new Error(
        `${this.constructor.name} 클래스의 인스턴스를 생성할 때 '$container' 프로퍼티를 가지는 객체를 인수로 전달해야 합니다. '$container' 프로퍼티 값은 HTMLElement 타입의 객체입니다.`
      );
    }
  }

  /** @abstract */
  init() {
    throw new Error(`Component의 서브 클래스는 'init' 메서드를 구현해야 합니다.`);
  }

  /** @abstract */
  render() {
    throw new Error(`Component의 서브 클래스는 'render' 메서드를 구현해야 합니다.`);
  }

  /** @abstract */
  bindEvents() {
    throw new Error(`Component의 서브 클래스는 'bindEvents' 메서드를 구현해야 합니다.`);
  }

  /**
   * @type {(newState: object|null) => void}
   * @protected
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * @type {() => Promise}
   * @private
   */
  loadStyles() {
    if (!this.styles) return;
    return Promise.all(this.styles.map(style => this.fetchStyle(style)));
  }

  /**
   * @type {(href: string) => Promise}
   * @private
   */
  fetchStyle(href) {
    return new Promise(resolve => {
      if (document.querySelector(`link[href="${href}"]`)) return resolve();

      const $link = document.createElement('link');
      $link.href = href;
      $link.rel = 'stylesheet';

      const $lastLink = document.querySelector('link:last-of-type');
      document.head.insertBefore($link, $lastLink.nextElementSibling);

      $link.onload = resolve;
    });
  }
}

export default Component;
