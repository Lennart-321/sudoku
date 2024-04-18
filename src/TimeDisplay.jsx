import { useState } from "react";
import { Settings } from "./Settings";
import { Sudoku } from "./Sudoku";
import "./TimeDisplay.css";

export function TimeDisplay() {
  const [updateCount, setUpdateCount] = useState(0);
  Sudoku.updateTimeDisplay = function () {
    setUpdateCount(c => c + 1);
  };

  const show = Settings.showTime && !!Sudoku.currentGame?.startTime;
  if (show) {
    const elapsed =
      (Sudoku.currentGame.isSolved ? Sudoku.currentGame.solvedTime : new Date()) - Sudoku.currentGame.startTime;
    const seconds = Math.floor(elapsed / 1000);
    var timeStr = Sudoku.formatDuration(seconds);
    if (!Sudoku.currentGame.isSolved) {
      setTimeout(() => setUpdateCount(c => c + 1), 1001 - (elapsed % 1000));
    }
  }

  //console.log("TimeDisplay:", show, timeStr, Sudoku.currentGame?.isSolved, Sudoku.currentGame?.startTime);
  return show ? <span id="time-display">{timeStr}</span> : <></>;
}
