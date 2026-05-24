import { useMemo, useState } from 'react';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }

  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);
  const currentPlayer = xIsNext ? 'X' : 'O';

  const status = winner
    ? `Player ${winner.player} wins`
    : isDraw
      ? 'Match draw'
      : `Player ${currentPlayer}'s turn`;

  const handleSquareClick = (index) => {
    if (board[index] || winner || isDraw) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextWinner = getWinner(nextBoard);
    const nextDraw = !nextWinner && nextBoard.every(Boolean);

    setBoard(nextBoard);

    if (nextWinner) {
      setScore((prev) => ({
        ...prev,
        [nextWinner.player]: prev[nextWinner.player] + 1,
      }));
      return;
    }

    if (nextDraw) {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setXIsNext((value) => !value);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <main className="game-page">
      <section className="game-shell">
        <header className="hero">
          <p className="eyebrow">React + Vite</p>
          <h1>Tic Tac Toe Arena</h1>
          <p>Two players. Nine moves. One clean little battle of logic.</p>
        </header>

        <section className="game-panel" aria-label="Tic Tac Toe game">
          <div className="score-strip">
            <div className={`player-card ${currentPlayer === 'X' && !winner ? 'active' : ''}`}>
              <span>Player X</span>
              <strong>X</strong>
            </div>
            <div className={`player-card ${currentPlayer === 'O' && !winner ? 'active' : ''}`}>
              <span>Player O</span>
              <strong>O</strong>
            </div>
          </div>

          <div className="score-board" aria-label="Score board">
            <div>
              <span>X Wins</span>
              <strong>{score.X}</strong>
            </div>
            <div>
              <span>Draws</span>
              <strong>{score.draws}</strong>
            </div>
            <div>
              <span>O Wins</span>
              <strong>{score.O}</strong>
            </div>
          </div>

          <div className={`status ${winner ? 'win' : isDraw ? 'draw' : ''}`}>{status}</div>

          <div className="board" role="grid" aria-label="Game board">
            {board.map((value, index) => {
              const isWinningCell = winner?.line.includes(index);

              return (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  aria-label={`Square ${index + 1}${value ? ` filled by ${value}` : ''}`}
                  onClick={() => handleSquareClick(index)}
                  className={`square ${value ? `filled ${value.toLowerCase()}` : ''} ${
                    isWinningCell ? 'winner-cell' : ''
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <div className="button-row">
            <button type="button" className="reset-button" onClick={resetGame}>
              Reset Game
            </button>
            <button type="button" className="reset-button secondary" onClick={resetScore}>
              Reset Score
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
