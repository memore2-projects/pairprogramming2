import { addNewsItems } from './NewsList.js';

const categoryObj = { selectedCategory: 'all' };

const categoryHandler = {
  set(target, prop, receiver) {
    target[prop] = receiver;
    addNewsItems(target.selectedCategory);
    return true;
  },
  get(target) {
    return target.selectedCategory;
  },
};

const categoryProxy = new Proxy(categoryObj, categoryHandler);

export default categoryProxy;
