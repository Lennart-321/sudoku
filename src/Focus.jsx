import { useState } from "react";
import "./Focus.css";
import { Sudoku } from "./Sudoku";
import { Settings } from "./Settings";

//prettier-ignore
const symbolIxs = Array(9).fill(0).map((_, ix) => ix); //(ix + 1).toString());

export function Focus() {
  const focusSelection = function (event, symIx) {
    const alt = event.ctrlKey | event.altKey | event.shiftKey;
    Sudoku.toggleFocus(symIx, alt);
  };

  return Settings.showFocusButtons ? (
    <div id="focus-bar">
      {symbolIxs.map(six => (
        <button
          key={six}
          onClick={e => focusSelection(e, six)}
          className={`focus-button ${Sudoku.isInFocus(six) ? "infocus" : ""}`}
        >
          {six + 1}
        </button>
      ))}
    </div>
  ) : (
    <></>
  );
}
