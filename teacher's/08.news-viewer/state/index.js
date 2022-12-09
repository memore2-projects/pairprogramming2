let state = null;
let listeners = [];

/**
 * state = createState({ category: 'all' });
 * state.category = 'foo';
 */
const createState = initialState => {
  state = new Proxy(initialState, {
    set(target, key, newState) {
      if (target[key] === newState) return false;
      console.log(`[state change] ${key}: ${target[key]} => ${newState}`);

      target[key] = newState;
      listeners.forEach(component => component.render()); // re-rendering

      return true;
    },
  });

  return state;
};

const subscribe = newListener => {
  if (!listeners.includes(newListener)) listeners = [...listeners, newListener];

  // 구독 해지 함수
  return () => {
    listeners = listeners.filter(listener => listener !== newListener);
  };
};

const store = {
  state,
  createState,
  subscribe,
};

export default store;
export { state, createState, subscribe };
