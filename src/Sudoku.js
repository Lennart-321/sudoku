import { Calc } from "./Calc";
import { CalcBoard } from "./CalcBoard";
import { Game } from "./Game";
import { Settings } from "./Settings";

export class Sudoku {
  static currentGame;
  static isDefineGameState = false;

  constructor() {}

  static createNewGame(level) {
    let needInitialReduce = Settings.autoReduceHelpSymbols;

    if (level >= 0) {
      Sudoku.currentGame = CalcBoard.generateNewGame(level);
      console.log("createNewGame autoReduceHelpSymbols =", Settings.autoReduceHelpSymbols);
      Sudoku.isDefineGameState = false;
    } else if (level === -2) {
      Calc.restartGame(this.currentGame.board);
    } else if (level === -1 && Sudoku.isDefineGameState) {
      Sudoku.isDefineGameState = false;
      Calc.definedGame(this.currentGame.board);
    } else if (level === -1) {
      Sudoku.currentGame = new Game(Array(Calc.nrSquares).fill(Calc.symbolBits));
      Sudoku.isDefineGameState = true;
      needInitialReduce = false;
    }

    if (needInitialReduce) {
      Calc.simpleReduceFromFixed(Sudoku.currentGame.board);
    }
  }
}
