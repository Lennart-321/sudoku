import { useState } from "react";
import "./Board.css";
import Cell from "./Cell.jsx";
import { Sudoku } from "./Sudoku.js";

export default function Board() {
  const [updateCount, setUpdateCount] = useState(0);

  console.log("Board update count:", updateCount);

  if (!Sudoku.currentGame) {
    Sudoku.createDefaultGame();
  }

  return (
    <>
      <div id="board">
        {Sudoku.currentGame?.board.map((_, ix) => (
          <Cell key={ix} index={ix} boardChanged={setUpdateCount} />
        ))}
      </div>
    </>
  );
}
