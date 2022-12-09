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

new Accordion({ $container: document.getElementById('accordion1'), menuList });
new Accordion({ $container: document.getElementById('accordion2'), menuList, showMultiple: true });
