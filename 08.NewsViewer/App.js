import { Nav, NewsList, NewsListRender } from './components/index.js';

const $root = document.getElementById('root');

const categoryObj = { selectedCategory: 'all' };

// 프록시를 통해 상태가 변경되었을 때 NewsList를 자동적으로 리렌더링.
// 사실 이렇게 적은 양의 프로퍼티를 다루기 위해서는 proxy를 사용할 필요가 없다. 컨셉이 상태가 바뀌었을 때 상태를 구독하는 모든 컴포넌트들이 영향을 받아 싹 리렌더링 되는 것을 목적으로 사용.

// 우리는 NewsList만 리렌더링 했는데 Nav까지 리렌더링 하는게 이 컨셉에 맞겠다고 생각함.
const categoryHandler = {
  set(target, prop, receiver) {
    target[prop] = receiver;
    NewsListRender($root, target.selectedCategory);
    return true;
  },
  get(target) {
    return target.selectedCategory;
  },
};

const categoryProxy = new Proxy(categoryObj, categoryHandler);

Nav($root, categoryProxy);
NewsList($root, categoryProxy);

export default categoryProxy;
