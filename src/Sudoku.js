import { Calc } from "./Calc";
import { CalcBoard } from "./CalcBoard";
import { Game } from "./Game";
import { Settings } from "./Settings";

export class Sudoku {
  static currentGame;
  static isDefineGameState = false;
  static focusSymbols = 0;
  //Component methods:
  static refreshApp = null;
  static importantMessage = null;
  static updateMenu = null;
  static updateTimeDisplay = null;
  static highGameNumberStored = -1;
  static currentGameNumberStored = -1;

  constructor() {}

  static isSymbolBitOutOfFocus(symbolBit) {
    return Sudoku.focusSymbols && (Sudoku.focusSymbols & symbolBit) === 0;
  }
  static isSymbolValOutOfFocus(symbolVal) {
    return Sudoku.focusSymbols && (Sudoku.focusSymbols & symbolVal) === 0;
  }
  static isInFocus(symbolIx) {
    return (Sudoku.focusSymbols & Calc.getSymbolBit(symbolIx + 1)) !== 0;
  }
  static toggleFocus(symbolIx, altCmd) {
    const preFocus = Sudoku.focusSymbols;
    const symbolBit = Calc.getSymbolBit(symbolIx + 1);

    if (Sudoku.isInFocus(symbolIx)) {
      if (altCmd) {
        Sudoku.focusSymbols &= ~symbolBit;
      } else {
        Sudoku.focusSymbols = 0;
      }
    } else {
      if (altCmd) {
        Sudoku.focusSymbols |= symbolBit;
      } else {
        Sudoku.focusSymbols = symbolBit;
      }
    }
    const changed = Sudoku.focusSymbols !== preFocus;
    if (changed) Sudoku.refreshApp && Sudoku.refreshApp();
    return Sudoku.focusSymbols !== preFocus;
  }

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
        Sudoku.saveGame();
      }
    }

    return [value, cellChanged, otherChanged];
  }

  //static twodig(num) { return (num < 10 ? "0" : "") + num; }
  static formatDuration(seconds, showSecondsPostfix = false) {
    const secs = seconds % 60;
    const mins = Math.floor(seconds / 60);
    if (showSecondsPostfix && mins === 0) return secs + " seconds";

    const two = n => (n < 10 ? "0" : "") + n;
    if (mins < 60) return `${two(mins)}:${two(secs)}`;

    const hours = Math.floor(seconds / 3600);
    return `${two(hours)}:${two(mins % 60)}:${two(secs)}`;
  }

  static gameSolvedTest() {
    const solved = Calc.isSolved(Sudoku.currentGame.board);
    if (solved && !Sudoku.currentGame.isSolved) {
      Sudoku.currentGame.isSolved = true;
      Sudoku.currentGame.solvedTime = Sudoku.now();
      let duration = Math.floor((Sudoku.currentGame.solvedTime - Sudoku.currentGame.startTime) / 10);

      Sudoku.importantMessage &&
        Sudoku.importantMessage(["Solved!", "Time: " + Sudoku.formatDuration(duration, true)], "#0A0", 4);
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
      if (Sudoku.currentGame.isSolved) {
        Sudoku.currentGame.isSolved = false;
        Sudoku.updateTimeDisplay && Sudoku.updateTimeDisplay();
      }
    }
    if (v0 !== value) {
      Sudoku.saveGame();
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
    let cb = new CalcBoard(Calc.copyBoard(hardBoard));
    let levelCount = [];
    cb.trySolve(levelCount);

    Sudoku.currentGame = new Game(hardBoard, cb.board, cb.targetStatus, levelCount);
    //TimeDisplay.jsx:9 Warning: Cannot update a component (`TimeDisplay`) while rendering a different component (`Board`). To locate the bad setState() call inside `Board`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
    //Sudoku.updateTimeDisplay();
    Sudoku.refreshApp && Sudoku.refreshApp();
  }

  static createNewGame(level) {
    let needInitialReduce = Settings.autoReduceHelpSymbols;

    //Normal new game
    if (level >= 0) {
      Sudoku.currentGame = CalcBoard.generateNewGame(level);
      //console.log("createNewGame autoReduceHelpSymbols =", Settings.autoReduceHelpSymbols);
      Sudoku.isDefineGameState = false;
      Sudoku.currentGameNumberStored = -1;
      Sudoku.updateMenu && Sudoku.updateMenu();
    }
    //Restart game
    else if (level === -2) {
      Calc.restartGame(Sudoku.currentGame.board);
      Sudoku.currentGame.startTime = Sudoku.now();
      Sudoku.currentGame.isSolved = false;
    }
    //Start new user defined game
    else if (level === -1 && Sudoku.isDefineGameState) {
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
      } else {
        Sudoku.saveGame();
      }
      Sudoku.currentGame.startTime = Sudoku.now();
      Sudoku.currentGame.isSolved = false;
    }
    //Let user define game; Clear board; Enter definition mode
    else if (level === -1) {
      Sudoku.currentGame = new Game(Array(Calc.nrSquares).fill(Calc.symbolBits));
      Sudoku.currentGame.startTime = null;
      Sudoku.isDefineGameState = true;
      needInitialReduce = false;
      Sudoku.currentGameNumberStored = -1;
      Sudoku.updateMenu && Sudoku.updateMenu();
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
  static restoreHelpSymbols() {
    Calc.unreduceNonDetermined(Sudoku.currentGame.board);
    return true;
  }
  static restoreNonEdited() {
    Calc.unreduceNonEdited(Sudoku.currentGame.board);
    return true;
  }

  static showSudokuInfo() {
    //let l = Sudoku.currentGame.levelCount;
    Sudoku.importantMessage &&
      Sudoku.importantMessage(
        [
          //"SUDOKU by Lennart",
          "Click on choosen symbol to delete.",
          "Use Ctrl + click to keep support symbol.",
          "Use Ctrl + click to focus on more than one symbol.",
          //`${l[0]},${l[1]},${l[2]},${l[3]},${l[4]},${l[5]},${l[6]},${l[7]}`,
        ],
        "#333",
        30
      );
  }
  //   static confirmCommand(message, command) {
  //     Sudoku.importantMessage(message, "#000", 10, command);
  //   }

  static canLoadPre() {
    return Sudoku.currentGameNumberStored !== 0 && Sudoku.getHighGameNumber() > 0;
  }
  static canLoadNx() {
    return 0 <= Sudoku.currentGameNumberStored && Sudoku.currentGameNumberStored < Sudoku.getHighGameNumber();
  }

  static loadPreviousGame() {
    if (Sudoku.currentGameNumberStored === 0) return false;

    const preCurNr = Sudoku.currentGameNumberStored;
    if (Sudoku.currentGameNumberStored < 0) {
      const hgn = this.getHighGameNumber();
      if (hgn < 0) return false;
      Sudoku.currentGameNumberStored = hgn;
    } else {
      Sudoku.currentGameNumberStored--;
    }

    if (!Sudoku.loadGame()) {
      Sudoku.currentGameNumberStored = preCurNr;
      return false;
    }
    Sudoku.refreshApp && Sudoku.refreshApp();
    return true;
  }

  static loadNextGame() {
    if (Sudoku.currentGameNumberStored < 0) return false;
    const hgn = Sudoku.getHighGameNumber();
    if (Sudoku.currentGameNumberStored >= hgn) return false;
    Sudoku.currentGameNumberStored++;

    if (!Sudoku.loadGame()) {
      Sudoku.currentGameNumberStored--;
      return false;
    }

    Sudoku.refreshApp && Sudoku.refreshApp();
    return true;
  }

  static saveGame() {
    //return;
    if (Sudoku.currentGameNumberStored < 0) {
      Sudoku.getHighGameNumber();
      Sudoku.currentGameNumberStored = ++Sudoku.highGameNumberStored;
      localStorage.setItem("highGameNr", Sudoku.highGameNumberStored.toString());
    }
    const gameJson = JSON.stringify(Sudoku.currentGame);
    localStorage.setItem(Sudoku.currentGameNumberStored.toString(), gameJson);
  }
  static loadGame() {
    //return false;
    if (Sudoku.currentGameNumberStored < 0) {
      Sudoku.getHighGameNumber();
      Sudoku.currentGameNumberStored = Sudoku.highGameNumberStored;
      if (Sudoku.currentGameNumberStored < 0) return;
    }
    const gameJson = localStorage.getItem(Sudoku.currentGameNumberStored.toString());
    const loadedGame = JSON.parse(gameJson);
    if (loadedGame) {
      Sudoku.currentGame = loadedGame;
      return true;
    }
    return false;
  }
  static getHighGameNumber() {
    if (Sudoku.highGameNumberStored < 0) {
      Sudoku.highGameNumberStored = Sudoku.loadNumber("highGameNr");
    }
    return Sudoku.highGameNumberStored;
  }
  static loadNumber(id) {
    const jsonNum = localStorage.getItem(id);
    let num = parseInt(jsonNum);
    if (!Number.isInteger(num)) {
      num = -1;
    }
    return num;
  }
  static now() {
    return Math.floor(new Date().getTime() / 100);
  }
}
