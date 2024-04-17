import { useState } from "react";
import Board from "./Board.jsx";
import { Menu } from "./Menu.jsx";
import { Message } from "./Message.jsx";
import "./App.css";

//const glbDefaultGame = new Game();
function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const refresh = function () {
    setUpdateCount(c => c + 1);
  };
  //const [game, setGame] = useState(null); // useState(glbDefaultGame);
  // if (!game) {
  //   setGame(new Game());
  // }
  //console.log(game, game.board);
  // const setNewGame = function (newGame) {
  //   Game.currentGame = newGame;
  //   setGame(newGame);
  // };

  return (
    <>
      <Menu refresh={refresh} />
      <Board />
      <Message />
    </>
  );

  // return (
  //   <>
  //     <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App;
