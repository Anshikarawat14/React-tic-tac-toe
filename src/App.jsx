import { useState } from 'react';
import logo from '/game-logo.png';
import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './components/winning-combinations.js';


const PLAYERS={
  X:'Player 1',
  O:'Player 2'
};


const initialGameBoard =[
  [null,null,null],
  [null,null,null],
  [null,null,null],
];



function derivedActivePlayer(gameTurns) {
  let currentPlayer='X';
  if(gameTurns.length>0 && gameTurns[0].player==='X'){
    currentPlayer='O';
  }
  return currentPlayer
}

function derivedGameBoard(gameTurns){
  let gameBoard=[...initialGameBoard.map(array=> [...array])];
  for(const turn of gameTurns){
        const {square,player}=turn;
        const {row,col}=square;

        gameBoard[row][col]=player;
    }
    return gameBoard;
}

function deriveWinner(gameBoard,players)
{
  let winner;

  for(const combinations of WINNING_COMBINATIONS) {
    const firstSquareSymbol =gameBoard[combinations[0].row][combinations[0].column];
    const secondSquareSymbol=gameBoard[combinations[1].row][combinations[1].column];
    const thirdSquareSymbol =gameBoard[combinations[2].row][combinations[2].column];

    if(firstSquareSymbol && firstSquareSymbol===secondSquareSymbol && firstSquareSymbol===thirdSquareSymbol)
    {
      winner=players[firstSquareSymbol];
    }
  }
  return winner;
}


function App() {
  const[players,setPlayers] =useState(PLAYERS);

  const [gameTurns,setGameTurns]=useState([]);
  // const[activePlayer,setActivePlayer]=useState('X');
  // const[hasWinner,setHasWinner]=useState(false);

  const activePlayer=derivedActivePlayer(gameTurns);

  const gameBoard=derivedGameBoard(gameTurns);

  const winner=deriveWinner(gameBoard,players);

  const hasDraw=gameTurns.length===9 &&!winner;


  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X');
    setGameTurns((prevTurns) => {
      const currentPlayer=derivedActivePlayer(prevTurns);
  
      const updatedTurns = [
        { square: {row:rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }
  function handleRestart()
  {
    setGameTurns([]);
  }

function handlePlayerNameChange(symbol,newName) {
  setPlayers(prevPlayers=> {
    return {
      ...prevPlayers,
      [symbol]:newName
    };
  });
}


  return (
    <div>
    <header>
      <img src={logo}/>
      <h1>TIC-TAC-TOE</h1>
      </header>
      <main>
        <div id="game-container">
          <ol id="players" className="highlight-player">
            <Player initialName={players.X} symbol="X" isActive={activePlayer==='X'} onChangeName={handlePlayerNameChange} />
            <Player initialName={players.O} symbol="O" isActive={activePlayer==='O'} onChangeName={handlePlayerNameChange} />
          </ol>

          {(winner|| hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
          <GameBoard onSelectSquare={handleSelectSquare} 
          board={gameBoard} />
          </div>
          <Log turns={gameTurns} />
          </main>
    </div>
  )
}

export default App
