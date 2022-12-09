let $root = null;

// constants
// prettier-ignore
const WIN_CONDITIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const PLAYER = { X: 'X', O: 'O' };
const GRID_ITEM_COUNT = 9;

// states
let state = {};

const render = () => {
  const { board, nextPlayer, winner } = state;

  // prettier-ignore
  $root.innerHTML = `
    <h1 class="title">Tic Tac Toe</h1>
    <div class="game">
      <div class="game-status">${winner ? (winner !== 'Draw' ? `Winner is ${winner}` : 'Draw') : `Next Player : ${nextPlayer}`}</div>
      <div class="game-grid">
        ${board.map((gridItem, i) => `
          <div class="game-grid-item" data-id="${i}">${gridItem !== null ? gridItem : ''}</div>`
        ).join('')}
      </div>
      <button class="game-reset">Try again?</button>
    </div>`;
};

const setState = newState => {
  state = { ...state, ...newState };
  console.log('[state]', state);

  render();
};

/**
 * 승패를 판단하여 결과를 반환한다. 반환값은 다음과 같다.
 * 1) 'X' 또는 'O': 승자
 * 2) 'Draw': 무승부
 * 3) null: 승패 미결정
 * @type {() => 'X'|'O'|'Draw'|null}
 */
const judge = board => {
  for (const [x, y, z] of WIN_CONDITIONS) {
    // 승리 조건을 충족한 경우 해당 플레이어의 승리
    if (board[x] && board[x] === board[y] && board[y] === board[z]) return board[x];
  }

  // 아직 승패가 결정되지 않았지만 플레이를 마친 경우(grid의 요소 중에 null이 아닌 요소를 필터한 결과가 0)라면 무승부
  if (board.filter(v => v === null).length === 0) return 'Draw';

  // 승패 미결정
  return null;
};

const TicTacToe = $container => {
  // root 요소는 1개만 존재한다.
  $root = $container;

  const initialState = {
    /**
     * 게임 보드의 현재 상태
     * GRID_ITEM_COUNT개의 요소를 갖는 배열로 각 요소는 $gameGrid의 자식 요소인 div.game-grid-item 요소와 대응한다.
     * state.board 배열은 다음과 같이 사용자가 선택한 게임 보드의 현재 상태를 나타낸다
     * - 플레이어가 선택한 아이템이면 플레이어('O', 'X')가 저장되고, 플레이어가 아직 선택하지 않은 아이템이라면 null이 저장된다.
     * @example [null, 'O', 'X', null, null, null, null, null, null]
     *
     * state.board 배열은 WIN_CONDITIONS와 함께 승패 판단의 기준이 된다.
     */
    board: Array(GRID_ITEM_COUNT).fill(null),
    // 다음 플레이어
    nextPlayer: PLAYER.X,
    /**
     * 승자 정보
     * 'X' => 승자 X
     * 'O' => 승자 O
     * 'Draw' => 무승부
     * null => 승패 미결정(게임중)
     * @type {('X'|'O'|'Draw'|null)}
     */
    winner: null,
  };

  // initial rendering
  setState(initialState);

  $container.addEventListener('click', ({ target }) => {
    const { id } = target.dataset;

    /**
     * 무시 조건
     * 1. 클릭한 아이템(e.target)이 .game-item 요소가 아닌 경우
     * 2. 클릭한 아이템이 이미 선택된 아이템인 경우(state.board[id] !== null)
     * 3. 이미 승패가 결정된 경우(state.winner !== null)
     */
    if (!target.matches('.game-grid-item') || state.board[id] !== null || state.winner !== null) return;

    const board = state.board.map((gridItem, i) =>
      /**
       * 클릭한 아이템이 이미 선택된 아이템인 경우(state.board[id] !== null)는 무시했다.
       * 따라서 gridItem은 언제나 null이므로 gridItem이 state.nextPlayer과 같을 수 없다.
       */
      // i === +id && gridItem !== state.nextPlayer ? state.nextPlayer : gridItem
      i === +id ? state.nextPlayer : gridItem
    );

    setState({
      board,
      nextPlayer: state.nextPlayer === PLAYER.X ? PLAYER.O : PLAYER.X,
      // 변경된 board를 사용해 승패를 판정해야 한다.
      winner: judge(board),
    });
  });

  // reset
  $container.addEventListener('click', ({ target }) => {
    if (target.matches('.game-reset')) setState(initialState);
  });
};

export default TicTacToe;
