import { useState } from "react";
import { Settings } from "./Settings";
import { Sudoku } from "./Sudoku";
import "./TimeDisplay.css";
import { CalcBoard } from "./CalcBoard";

export function TimeDisplay() {
  const [updateCount, setUpdateCount] = useState(0);
  Sudoku.updateTimeDisplay = function () {
    setUpdateCount(c => c + 1);
  };

  const show = Settings.showTime && !!Sudoku.currentGame?.startTime;
  if (show) {
    let elapsed =
      (Sudoku.currentGame.isSolved ? Sudoku.currentGame.solvedTime : Sudoku.now()) - Sudoku.currentGame.startTime;
    if (!elapsed) elapsed = 0;
    const seconds = Math.floor(elapsed / 10);
    var timeStr = Sudoku.formatDuration(seconds);
    if (!Sudoku.currentGame.isSolved) {
      setTimeout(() => setUpdateCount(c => c + 1), 1001 - (elapsed % 10) * 100);
    }
    var levelInfo = CalcBoard.getLevel(Sudoku.currentGame.levelCount);
  }

  //console.log("TimeDisplay:", show, timeStr, Sudoku.currentGame?.isSolved, Sudoku.currentGame?.startTime);
  return show ? (
    <span id="time-display">
      Level {levelInfo} - {timeStr}
    </span>
  ) : (
    <></>
  );
}
