const state = {
  currentPlayer: 'X',

  playerX: [],
  playerO: [],
};

const initItems = Array(9).fill(null);

let { currentPlayer, playerX, playerO } = state;

const bingoArray = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const isBingo = currentPlayer => {
  let result = false;
  const currentArr = currentPlayer === 'X' ? playerX : playerO;
  bingoArray.forEach(arr => {
    let count = 0;
    arr.forEach(arrItem => {
      if (currentArr.includes(arrItem)) count += 1;
    });
    if (count === 3) result = true;
  });
  return result;
};

// prettier-ignore
const render = $root => {
  const gameStatus = isBingo(currentPlayer) 
    ? `Winner is ${currentPlayer}` 
    : [...playerO, ...playerX].length === 9 
      ? 'Draw' : `Next Player: ${currentPlayer}`;

  $root.innerHTML = `
    <h1 class="title">Tic Tac Toe</h1>
    <div class="game">
        <div class="game-status">${gameStatus}</div>
        <div class="game-grid">
            ${initItems.map((_, index) => `
            <div class="game-grid-item" data-id="${index}">${
                playerX.includes(index) ? "X" : playerO.includes(index) ? "O" : ''
            }</div>
            `).join('')}
        </div>
        <button class="game-reset">Try again?</button>
    </div> `;
};

const setState = id => {
  if (isBingo(currentPlayer)) return;

  currentPlayer === 'X' ? playerX.push(id) : playerO.push(id);
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const TicTacToe = $root => {
  window.addEventListener('DOMContentLoaded', () => {
    render($root);
  });

  $root.addEventListener('click', e => {
    if (!e.target.matches('.game-grid > div')) return;
    if ([...playerO, ...playerX].includes(+e.target.dataset.id)) return;

    setState(+e.target.dataset.id);
    render($root);
  });

  $root.addEventListener('click', e => {
    if (!e.target.matches('.game-reset')) return;
    currentPlayer = 'X';
    playerX = [];
    playerO = [];
    render($root);
  });
};

export default TicTacToe;
