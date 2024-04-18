import { Calc } from "./Calc";
import { Sudoku } from "./Sudoku";

export class Settings {
  static showHelpSymbols = false; //false => never show help symbols
  static showOnlyEditedHelp = false;
  static showAllHelp = false; //true => show all help symbols always
  static autoReduceHelpSymbols = false;
  static showErrors = false;
  static showFocusButtons = false;
  static showTime = true;

  static toggleShowTime() {
    Settings.showTime = !Settings.showTime;
    Sudoku.updateTimeDisplay && Sudoku.updateTimeDisplay();
  }

  static toggleShowFocusButtons() {
    if (Settings.showFocusButtons) {
      Settings.showFocusButtons = false;
      Sudoku.focusSymbols = 0;
    } else {
      Settings.showFocusButtons = true;
    }
    Sudoku.refreshApp && Sudoku.refreshApp();
  }
  static toggleShowHelpSymbols() {
    if (Settings.showHelpSymbols) {
      Settings.showHelpSymbols = false;
      //Settings.autoReduceHelpSymbols = false;
    } else {
      Settings.showHelpSymbols = true;
    }
    //Sudoku.updateMenu();
  }

  static toggleShowEditedOnly() {
    if (Settings.showOnlyEditedHelp) {
      Settings.showOnlyEditedHelp = false;
    } else {
      Settings.showOnlyEditedHelp = true;
      Settings.showHelpSymbols = true;
      Settings.showAllHelp = false;
    }
    //Sudoku.updateMenu();
  }

  static toggleShowAll() {
    if (Settings.showAllHelp) {
      Settings.showAllHelp = false;
    } else {
      Settings.showAllHelp = true;
      Settings.showHelpSymbols = true;
      Settings.showOnlyEditedHelp = false;
    }
    //Sudoku.updateMenu();
  }

  static toggleAutoReduceHelpSymbols() {
    if (Settings.autoReduceHelpSymbols) {
      Settings.autoReduceHelpSymbols = false;
    } else {
      Settings.autoReduceHelpSymbols = true;
      Settings.showHelpSymbols = true;
      Calc.simpleReduceFromDetermined(Sudoku.currentGame.board);
      //Calc.simpleReduceFromFixed(Sudoku.currentGame.board);
    }
    //Sudoku.updateMenu();
  }

  static toggleShowErrors() {
    Settings.showErrors = !Settings.showErrors;
    if (Settings.showErrors) {
      Sudoku.assureWrongTestsPossible();
    }
    //Sudoku.updateMenu();
  }

  static assureShowHelpSymbols_ifNotAssureUserEditOnly(isOn) {
    if (Settings.showHelpSymbols !== isOn) {
      Settings.showHelpSymbols = isOn;
      if (isOn && !Settings.showOnlyEditedHelp) {
        Settings.showOnlyEditedHelp = true;
      }
      Sudoku.updateMenu && Sudoku.updateMenu();
    }
  }
}
