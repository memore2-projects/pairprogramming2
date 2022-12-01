// BINGOS는 상수로 구분해주기 위해 TicTacToe 바깥으로 분리
const BINGOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToe = $root => {
  // state => 이벤트가 일어날 때마다 변경되는 데이터들을 관리하고, 관리된 데이터를 통해 브라우저에 출력할 수 있도록 하는 것.
  const state = {
    nextPlayer: 'X',
    // nextPlayer만 상태관리 > gameStatus 표현 가능.
    // render에서 새로 출력되는 문자열을 만들기 위한 로직을 만들어야함.
    // 그 출력되는 문자열도 이벤트마다 변경되기 때문에 상태로 관리하는 것이 좋다고 생각.
    // Q&A: gameStatus를 상태관리 안하고 로직 안복잡하게 코드 작성
    gameStatus: 'Next Player: X',
    playerXPicks: [],
    playerOPicks: [],
    // 이벤트가 발생할 때마다 Bingo 여부를 판단해야 하는데 그 불리언 값을 여러군데서 사용하려다 보니 함수를 계속 호출하게 됨.
    // 최초 이벤트 발생 시 Bingo여부 상태로 저장.
  };

  let { nextPlayer, playerXPicks, playerOPicks, gameStatus } = state;

  // 렌더는 현재 state 기준으로 출력만을 담당.
  // prettier-ignore
  const render = () => {
  $root.innerHTML = `
    <h1 class="title">Tic Tac Toe</h1>
    <div class="game">
      <div class="game-status">${gameStatus}</div>
      <div class="game-grid">
        ${Array(9).fill(null).map((_, index) => `
          <div class="game-grid-item" data-id="${index}">
            ${playerXPicks.includes(index) ? 'X' : playerOPicks.includes(index) ? 'O' : ''}
          </div>`).join('')}
      </div>
      <button class="game-reset">Try again?</button>
    </div>`;
  };
  // 초기 렌더링
  render();
  /* ----------------------------- Mutate Function ---------------------------- */

  const isBingo = () => {
    let result = false;
    const playerPicks = nextPlayer === 'X' ? playerXPicks : playerOPicks;

    BINGOS.forEach(bingo => {
      // player의 배열의 길이와, player와 bingo의 요소를 합해 Set한 것의 크기가 같다면 => player가 모든 bingo의 요소를 가지고 있는 것이 됨.
      if (new Set([...bingo, ...playerPicks]).size === playerPicks.length) result = true;
    });
    return result;
  };

  // state에서는 state 값만을 변경시키고 싶었음.

  // 판별 순서.
  // 1. NextPlayer가 어디를 체크 했는지 확인

  // 2. 체크를 한 것(각 플레이어 선택 배열)을 기준으로 bingo여부 판단.

  // 3. true: `Winner is nextPlayer`를 gameStatus에 할당.
  //    false: nextPlayer 정보를 상대 플레이어로 바꾼다. / 현재 모든 구역을 체크했는가 ? true: 'Draw' gameStatus에 할당 / false: `Next Player: ${nextPlayer}` gameStatus에 할당
  const setState = gridId => {
    nextPlayer === 'X' ? playerXPicks.push(gridId) : playerOPicks.push(gridId);

    if (isBingo()) gameStatus = `Winner is ${nextPlayer}`;
    else {
      nextPlayer = nextPlayer === 'X' ? 'O' : 'X';
      gameStatus = [...playerOPicks, ...playerXPicks].length === 9 ? 'Draw' : `Next Player: ${nextPlayer}`;
    }
  };

  /* ------------------------------ Event Handler ----------------------------- */

  $root.addEventListener('click', e => {
    if (!e.target.matches('.game-grid > div')) return;
    if ([...playerOPicks, ...playerXPicks].includes(+e.target.dataset.id) || isBingo()) return;

    setState(+e.target.dataset.id);
    render();
  });

  $root.addEventListener('click', e => {
    if (!e.target.matches('.game-reset')) return;

    // Q&A:
    gameStatus = 'Next Player: X';
    nextPlayer = 'X';
    playerXPicks = [];
    playerOPicks = [];

    render();
  });
};

export default TicTacToe;
