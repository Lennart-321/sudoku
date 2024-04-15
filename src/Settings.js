import { Calc } from "./Calc";
import { Sudoku } from "./Sudoku";

export class Settings {
  static showHelpSymbols = true;
  static autoReduceHelpSymbols = false;
  static showErrors = false;

  static toggleShowHelpSymbols() {
    if (Settings.showHelpSymbols) {
      Settings.showHelpSymbols = false;
      Settings.autoReduceHelpSymbols = false;
    } else {
      Settings.showHelpSymbols = true;
    }
  }

  static toggleAutoReduceHelpSymbols() {
    if (Settings.autoReduceHelpSymbols) {
      Settings.autoReduceHelpSymbols = false;
    } else {
      Settings.autoReduceHelpSymbols = true;
      Settings.showHelpSymbols = true;
      Calc.simpleReduceFromFixed(Sudoku.currentGame.board);
    }
  }
  static toggleShowErrors() {
    Settings.showErrors = !Settings.showErrors;
  }
}
