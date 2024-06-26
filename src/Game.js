import { Calc } from "./Calc";
import { CalcBoard } from "./CalcBoard";
import { Sudoku } from "./Sudoku";

export class Game {
  board;
  targetBoard;
  targetStatus;
  levelCount;
  startTime;
  solvedTime;
  isSolved;

  constructor(brd, trg = null, trgStat = undefined, levelCount = null) {
    // // prettier-ignore
    // this.board = brd ? brd : Calc.simpleCheatReduce([
    //   0xD00,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0xC02,0xC80,
    //   0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0xC02,0x1ff,0xC08,0x1ff,
    //   0x1ff,0x1ff,0xC04,0x1ff,0xD00,0xC40,0xC20,0x1ff,0x1ff,
    //   0xC10,0x1ff,0x1ff,0x1ff,0xC08,0x1ff,0x07e,0xC01,0x07e,
    //   0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x07e,0x07e,0xD00,
    //   0xC01,0xD00,0x1ff,0xC40,0x1ff,0x1ff,0x07e,0xC80,0x07e,
    //   0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0xC80,0x1ff,0xC40,0x1ff,
    //   0x1ff,0x1ff,0xC01,0xC02,0xC40,0x1ff,0x1ff,0x1ff,0x1ff,
    //   0xC80,0x1ff,0xC08,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0xC20
    // ]);
    this.board = brd; // ? brd : Calc.generateRandomBoard();
    //this.board = brd ? brd : CalcBoard.generateNewGame();
    this.targetBoard = trg;
    this.targetStatus = trgStat !== undefined ? trgStat : trg ? 1 : 0;
    this.levelCount = levelCount;
    this.isSolved = false;
    this.startTime = Sudoku.now();
    this.solvedTime = null;
  }
  copy() {
    return new Game(Calc.copyBoard(this.board), this.targetBoard, this.targetStatus);
  }
  solutionType() {
    return Calc.solutionType(this);
  }

  // isPlaying() {
  //   return !this.isSolved && !!this.startTime;
  // }
}
