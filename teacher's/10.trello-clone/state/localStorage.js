const KEY = 'state';

// mock
const initialState = {
  lists: [
    {
      id: 1,
      title: 'Tasks to Do',
      cards: [
        { id: 1, title: 'React', description: 'my task' },
        { id: 2, title: 'TypeScript', description: '' },
      ],
      isOpenCardComposer: false,
    },
    {
      id: 2,
      title: 'Doing Tasks',
      cards: [{ id: 3, title: 'Algorithm', description: '' }],
      isOpenCardComposer: false,
    },
    {
      id: 3,
      title: 'Completed Tasks',
      cards: [
        { id: 4, title: 'HTML', description: '' },
        { id: 5, title: 'CSS', description: '' },
        { id: 6, title: 'JavaScript', description: '' },
      ],
      isOpenCardComposer: false,
    },
  ],
  listComposer: {
    isOpen: false,
  },
  popup: {
    isOpen: false,
    isOpenCardDescComposer: false,
    listId: null,
    cardId: null,
  },
};

// const initialState = {
//   lists: [],
//   listComposer: {
//     isOpen: true,
//   },
//   popup: {
//     isOpen: false,
//     isOpenCardDescComposer: false,
//     listId: null,
//     cardId: null,
//   },
// };

// localStorage에 state를 저장한다.
export const saveState = newState => {
  const serialized = JSON.stringify(newState);
  localStorage.setItem(KEY, serialized);
};

// localStorage에서 state를 취득한다.
export const loadState = () => {
  const serialized = localStorage.getItem(KEY);
  return JSON.parse(serialized) || initialState;
};
