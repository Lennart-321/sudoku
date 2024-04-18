import { useState } from "react";
import Cell from "./Cell.jsx";
import { Focus } from "./Focus.jsx";
import { Sudoku } from "./Sudoku.js";
import "./Board.css";

export default function Board() {
  const [updateCount, setUpdateCount] = useState(0);

  console.log("Board update count:", updateCount);

  if (!Sudoku.currentGame) {
    setTimeout(Sudoku.createDefaultGame, 0);
  }

  return (
    <>
      <div id="board">
        {Sudoku.currentGame?.board.map((_, ix) => (
          <Cell key={ix} index={ix} boardChanged={setUpdateCount} />
        ))}
      </div>
      <Focus />
    </>
  );
}
