// import "./Board.css";
import { useRef, useState } from "react";
import { Calc } from "./Calc.js";
import { Settings } from "./Settings.js";
import { CalcBoard } from "./CalcBoard.js";
import { Sudoku } from "./Sudoku.js";
//mode = "selected" | "fixed" | "symbol-menu" | "help" | "note"
let counter = 0;
//prettier-ignore
const symbols = Array(Calc.nrSymbols).fill(0).map((_, ix) => ix + 1);
export default function Cell({ index, boardChanged }) {
  const [updateCount, refreshCell] = useState(0);

  const game = Sudoku.currentGame;
  let value = game.board[index];

  // let [value, setValue] = useState(cellValue);
  // const lastCellValueProp = useRef(cellValue);
  // console.log("Cell render:", ++counter, index, cellValue, lastCellValueProp, value);
  // if (cellValue != lastCellValueProp.current) {
  //   lastCellValueProp.current = cellValue;
  //   value = cellValue;
  // }
  // console.log(index, cellValue, lastCellValueProp, value);

  const isFixed = Calc.isFixed(value);
  const isDetermined = Calc.isDetermined(value);
  const isSelected = Calc.isSelected(value);
  const isReduced = Calc.isReduced(value);

  // prettier-ignore
  const mode =
    isFixed ? "fixed" :
      isSelected ? "selected" :
        isReduced && Settings.showHelpSymbols ? "help" :
          "symbol-menu";

  const determinedSymbol = Calc.determinedSymbol(value);

  const determined = (
    <span
      className="determined-symbol"
      onClick={() => {
        if (!Calc.isFixed(value)) {
          game.board[index] &= ~Calc.isDeterminedBit;
          game.board[index] |= Calc.symbolBits;
          refreshCell(c => c + 1);
        }
      }}
    >
      {determinedSymbol}
    </span>
  );
  const helpAndMenu = (
    <div className="cell-grid">
      {symbols.map(s => (
        <div
          key={s}
          className={`help-symbol ${
            isReduced && Settings.showHelpSymbols
              ? (value & Calc.getSymbolBit(s)) === 0
                ? "reduced"
                : "candidate"
              : ""
          }`}
          onClick={e => {
            game.board[index] = handleHelpSymbolClick(e.altKey | e.ctrlKey | e.shiftKey, s, value);
            //setValue(game.board[index]);
            refreshCell(c => c + 1);
            if (Calc.isDetermined(game.board[index])) {
              console.log("Symbol selected");
              let count = 0;
              if (Settings.autoReduceHelpSymbols && (count = Calc.reduceFromSquare(game.board, index)) > 0) {
                console.log(count, game.board);
                boardChanged(c => c + 1);
              }
            }
          }}
        >
          {s}
        </div>
      ))}
    </div>
  );
  return (
    <div className={`cell h${index % 3} v${Math.floor(index / 9) % 3} ${mode} val${value}`}>
      {isDetermined ? determined : helpAndMenu}
    </div>
  );
}

function handleHelpSymbolClick(alt, symbol, value) {
  const symbolBit = Calc.getSymbolBit(symbol);
  if (alt) {
    if (Calc.isReduced(value)) {
      if (value & symbolBit) {
        value &= ~symbolBit;
        if (Calc.symbolCount(value) === 0) {
          value |= Calc.symbolBits;
        }
      } else {
        value |= symbolBit;
      }
    } else {
      value &= ~Calc.symbolBits;
      value |= symbolBit;
    }
  } else {
    //if (value & symbolBit) {
    value |= Calc.isDeterminedBit;
    value &= ~Calc.symbolBits;
    value |= symbolBit;
    //}
  }
  return value;
}
