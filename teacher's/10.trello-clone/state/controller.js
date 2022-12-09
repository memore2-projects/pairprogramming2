/** lists에서 모든 card로 구성된 배열을 취득한다. */
const findAllCards = lists => lists.map(list => list.cards).flat();

/** card id로 lists에서 card를 취득한다. */
const findCard = (lists, cardId) => findAllCards(lists).find(({ id }) => id === +cardId);

/** list id로 lists에서 list를 취득한다. */
const findList = (lists, listId) => lists.find(({ id }) => id === +listId);

/** list title을 변경한다. */
const updateListTitle = (lists, listId, title) => lists.map(list => (list.id === +listId ? { ...list, title } : list));

/** card title을 변경한다. */
const updateCardTitle = (lists, cardId, title) =>
  lists.map(list => ({
    ...list,
    cards: list.cards.map(card => (card.id === +cardId ? { ...card, title } : card)),
  }));

/** card description을 변경한다. */
const updateCardDescription = (lists, cardId, description) =>
  lists.map(list => ({
    ...list,
    cards: list.cards.map(card => (card.id === +cardId ? { ...card, description } : card)),
  }));

/** 새롭게 생성할 list의 id를 생성한다. */
const generateListId = lists => Math.max(...lists.map(list => list.id), 0) + 1;

/** 새롭게 생성할 card의 id를 생성한다. */
const generateCardId = lists => Math.max(...findAllCards(lists).map(card => card.id), 0) + 1;

/** list를 생성해 추가한다. */
const appendList = (lists, title) => {
  const id = generateListId(lists);
  return [...lists, { id, title, cards: [] }];
};

/**  card를 생성해 지정된 list에 추가한다. */
const appendCard = (lists, listId, title) => {
  const id = generateCardId(lists);
  const newCard = { id, title, description: '' };
  return lists.map(list => (list.id === +listId ? { ...list, cards: [...list.cards, newCard] } : list));
};

/**
 * toIndex의 list를 fromIndex로 이동시킨다.
 * @example: moveList([1, 2, 3, 4], 3, 1) => [1, 4, 2, 3]
 */
const moveList = (lists, fromIndex, toIndex) => {
  const _lists = [...lists].filter((_, i) => i !== fromIndex);
  _lists.splice(toIndex, 0, lists[fromIndex]);

  return _lists;
};

/** 지정된 list의 특정 위치로 card를 이동시킨다. */
const moveCard = (lists, cardId, fromListId, toListId, index) => {
  const card = findCard(lists, cardId);

  return lists
    .map(list => (list.id === +fromListId ? { ...list, cards: list.cards.filter(({ id }) => id !== card.id) } : list))
    .map(list =>
      list.id === +toListId
        ? { ...list, cards: [...list.cards.slice(0, index), card, ...list.cards.slice(index)] }
        : list
    );
};

const toggleIsOpenCardComposer = (lists, listId) =>
  lists.map(list => (list.id === listId ? { ...list, isOpenCardComposer: !list.isOpenCardComposer } : list));

export {
  findCard,
  findList,
  updateListTitle,
  updateCardTitle,
  updateCardDescription,
  appendList,
  appendCard,
  moveCard,
  moveList,
  toggleIsOpenCardComposer,
};
