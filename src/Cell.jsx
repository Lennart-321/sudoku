// import "./Board.css";
import { useState } from "react";
import { Calc } from "./Calc.js";
import { Settings } from "./Settings.js";
//import { CalcBoard } from "./CalcBoard.js";
import { Sudoku } from "./Sudoku.js";
//mode = "selected" | "fixed" | "empty" | "help" | "wrong" /*"note"*/
//let counter = 0;
//prettier-ignore
const symbols = Array(Calc.nrSymbols).fill(0).map((_, ix) => ix + 1);
export default function Cell({ index, boardChanged }) {
  const [updateCount, refreshCell] = useState(0);

  const game = Sudoku.currentGame;
  const value = game.board[index];

  const isFixed = Calc.isFixed(value);
  const isDetermined = Calc.isDetermined(value);
  const isSelected = Calc.isSelected(value);
  const isReduced = Calc.isReduced(value);
  const showWrong =
    Settings.showErrors &&
    isDetermined &&
    game.targetBoard &&
    Calc.symbols(value) !== Calc.symbols(game.targetBoard[index]) &&
    game.solutionType() === 3;

  const showHelpSymbols =
    Settings.showHelpSymbols &&
    !isDetermined &&
    Calc.symbolCount(value) > 0 &&
    ((Settings.showOnlyEditedHelp && Calc.isUserEdited(value)) ||
      (!Settings.showOnlyEditedHelp && isReduced) ||
      Settings.showAllHelp);

  // prettier-ignore
  const mode =
    showWrong ? "wrong" :
      isFixed ? "fixed" :
        isSelected ? "selected" :
          showHelpSymbols ? "help" :
            "empty"; //"symbol-menu";

  const determinedSymbol = Calc.determinedSymbol(value);

  // prettier-ignore
  console.log(index, mode, "help=", showHelpSymbols, "red=", isReduced, "sel=", isSelected, "det=", isDetermined, "fix=", isFixed, "err=", showWrong);

  const determined = (
    <span
      className="determined-symbol"
      onClick={() => {
        if (Sudoku.deleteDeterminedSquare(index)) refreshCell(c => c + 1);
      }}
    >
      {determinedSymbol}
    </span>
  );
  const helpAndMenu = (
    <div className="help-grid">
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
            let [newValue, thisCellChanged, otherCellChanged] = Sudoku.helpSymbolCommand(
              e.altKey | e.ctrlKey | e.shiftKey,
              s,
              index
            );
            if (otherCellChanged) boardChanged(c => c + 1);
            else if (thisCellChanged) refreshCell(c => c + 1);
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

// function handleHelpSymbolClick(alt, symbol, value) {
//   const symbolBit = Calc.getSymbolBit(symbol);
//   if (alt) {
//     if (Calc.isReduced(value)) {
//       if (value & symbolBit) {
//         value &= ~symbolBit;
//         if (Calc.symbolCount(value) === 0) {
//           value |= Calc.symbolBits;
//         }
//       } else {
//         value |= symbolBit;
//       }
//     } else {
//       value &= ~Calc.symbolBits;
//       value |= symbolBit;
//     }
//     if (Calc.symbolCount(value) === Calc.nrSymbols) value &= ~Calc.isUserEditedBit;
//     else value |= Calc.isUserEditedBit;
//   } else {
//     //if (value & symbolBit) {
//     value |= Calc.isDeterminedBit;
//     value &= ~(Calc.symbolBits | Calc.isUserEditedBit);
//     value |= symbolBit;
//     //}
//   }
//   return value;
// }
