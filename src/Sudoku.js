import { Calc } from "./Calc";
import { CalcBoard } from "./CalcBoard";
import { Game } from "./Game";
import { Settings } from "./Settings";

export class Sudoku {
  static currentGame;
  static isDefineGameState = false;
  static focusSymbols = 0;
  static importantMessage = null;
  static updateMenu = null;

  constructor() {}

  static helpSymbolCommand(altCmd, symbolValue, index /*, currentSquareValue Curret Square Value*/) {
    const symbolBit = Calc.getSymbolBit(symbolValue);
    let value = Sudoku.currentGame.board[index]; //currentSquareValue;
    if (altCmd) {
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
      if (Calc.symbolCount(value) === Calc.nrSymbols) {
        value &= ~Calc.isUserEditedBit;
      } else {
        value |= Calc.isUserEditedBit;
        Settings.assureShowHelpSymbols_ifNotAssureUserEditOnly(true);
      }
    } else {
      value |= Calc.isDeterminedBit;
      value &= ~(Calc.symbolBits | Calc.isUserEditedBit);
      value |= symbolBit;
    }

    const cellChanged = value !== Sudoku.currentGame.board[index];
    let otherChanged = false;
    if (cellChanged) {
      Sudoku.currentGame.board[index] = value;

      if (Calc.isDetermined(value)) {
        if (!Sudoku.gameSolvedTest() && Settings.autoReduceHelpSymbols) {
          const nrRed = Calc.reduceFromSquare(Sudoku.currentGame.board, index);
          if (nrRed > 0) otherChanged = true;
        }
      }
    }

    return [value, cellChanged, otherChanged];
  }

  //static twodig(num) { return (num < 10 ? "0" : "") + num; }
  static formatDuration(seconds) {
    const secs = seconds % 60;
    let mins = Math.floor(seconds / 60);
    if (mins === 0) return secs + " seconds";

    const two = n => (n < 10 ? "0" : "") + n;
    if (mins < 60) return `${mins}:${two(secs)}`;

    const hours = Math.floor(seconds / 3600);
    return `${hours}:${two(mins % 60)}:${two(secs)}`;
  }

  static gameSolvedTest() {
    const solved = Calc.isSolved(Sudoku.currentGame.board);
    if (solved && !Sudoku.currentGame.isSolved) {
      Sudoku.currentGame.isSolved = true;
      Sudoku.currentGame.solvedTime = new Date();
      let duration = Math.floor((Sudoku.currentGame.solvedTime - Sudoku.currentGame.startTime) / 1000);

      Sudoku.importantMessage &&
        Sudoku.importantMessage(["Solved!", "Time: " + Sudoku.formatDuration(duration)], "#0A0", 30);
    }
    return solved;
  }

  static deleteDeterminedSquare(index) {
    let value = Sudoku.currentGame.board[index];
    let v0 = value;
    if (!Calc.isFixed(value)) {
      value &= ~Calc.isDeterminedBit;
      value |= Calc.symbolBits;
      Sudoku.currentGame.board[index] = value;
      Sudoku.currentGame.isSolved = false;
    }
    return v0 !== value;
  }

  static createDefaultGame(level) {
    //prettier-ignore
    const hardBoard = [
      0xC80, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
      0x1FF, 0x1FF, 0xC04, 0xC20, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
      0x1FF, 0xC40, 0x1FF, 0x1FF, 0xD00, 0x1FF, 0xC02, 0x1FF, 0x1FF,
      0x1FF, 0xC10, 0x1FF, 0x1FF, 0x1FF, 0xC40, 0x1FF, 0x1FF, 0x1FF,
      0x1FF, 0x1FF, 0x1FF, 0x1FF, 0xC08, 0xC10, 0xC40, 0x1FF, 0x1FF,
      0x1FF, 0x1FF, 0x1FF, 0xC01, 0x1FF, 0x1FF, 0x1FF, 0xC04, 0x1FF,
      0x1FF, 0x1FF, 0xC01, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0xC20, 0xC80,
      0x1FF, 0x1FF, 0xC80, 0xC10, 0x1FF, 0x1FF, 0x1FF, 0xC01, 0x1FF,
      0x1FF, 0xD00, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0xC08, 0x1FF, 0x1FF,
    ];
    Calc.twistAndTurn(hardBoard);
    Sudoku.currentGame = new Game(hardBoard);
  }

  static createNewGame(level) {
    let needInitialReduce = Settings.autoReduceHelpSymbols;

    if (level >= 0) {
      Sudoku.currentGame = CalcBoard.generateNewGame(level);
      console.log("createNewGame autoReduceHelpSymbols =", Settings.autoReduceHelpSymbols);
      Sudoku.isDefineGameState = false;
    } else if (level === -2) {
      Calc.restartGame(Sudoku.currentGame.board);
      Sudoku.currentGame.startTime = new Date();
      Sudoku.currentGame.isSolved = false;
    } else if (level === -1 && Sudoku.isDefineGameState) {
      Sudoku.isDefineGameState = false;

      Calc.definedGame(Sudoku.currentGame.board);

      const solutionType = Sudoku.currentGame.solutionType();
      let message = "";
      switch (solutionType) {
        case 8:
          message = "Game is not solvable";
          break;
        case 5:
          message = "Game has more than one solution";
          break;
        default:
          if (solutionType < 0) {
            message = "Internal calculation error!";
          }
      }
      if (message && Sudoku.importantMessage) {
        Sudoku.importantMessage(message, "#F00", 7);
      }

      Sudoku.currentGame.startTime = new Date();
      Sudoku.currentGame.isSolved = false;
    } else if (level === -1) {
      Sudoku.currentGame = new Game(Array(Calc.nrSquares).fill(Calc.symbolBits));
      Sudoku.isDefineGameState = true;
      needInitialReduce = false;
    }

    if (needInitialReduce) {
      Calc.simpleReduceFromFixed(Sudoku.currentGame.board);
    }
  }
  static assureWrongTestsPossible() {
    const preSolutionType = Sudoku.currentGame.targetStatus;
    const newSolutionType = Sudoku.currentGame.solutionType();

    return newSolutionType === 3 && preSolutionType !== newSolutionType; //Error tests is now possible, was not before.
  }
  static autoReduceOnce() {
    const nrRed = Calc.simpleReduceFromDetermined(Sudoku.currentGame.board);
    return nrRed > 0;
  }
}
