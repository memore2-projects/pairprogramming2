import Accordion from './Accordion.js';

const menuList = [
  {
    id: 1,
    title: 'HTML',
    subMenu: [
      { title: 'Semantic Web', path: '#' },
      { title: 'Hyperlink', path: '#' },
    ],
    isOpen: true,
  },
  {
    id: 2,
    title: 'CSS',
    subMenu: [
      { title: 'Selector', path: '#' },
      { title: 'Box model', path: '#' },
      { title: 'Layout', path: '#' },
    ],
    isOpen: false,
  },
  {
    id: 3,
    title: 'JavaScript',
    subMenu: [
      { title: 'Variable', path: '#' },
      { title: 'Function', path: '#' },
      { title: 'Object', path: '#' },
      { title: 'DOM', path: '#' },
    ],
    isOpen: true,
  },
];

// 컴포넌트란 무엇인가?
// 프로그래밍에 있어 재사용이 가능한 가각의 독립된 모듈을 뜻한다.
new Accordion({ $container: document.getElementById('accordion1'), menuList });
new Accordion({ $container: document.getElementById('accordion2'), menuList, showMultiple: true });
