import { Calc } from "./Calc";
import { CalcBoard } from "./CalcBoard";

export class Game {
  board;

  constructor(brd) {
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
    this.board = brd ? brd : Calc.generateRandomBoard();
    //this.board = brd ? brd : CalcBoard.generateNewGame();
  }
  copy() {
    // const cpBoard = Array(this.board.length);
    // for (var i = 0; i < this.board.length; i++) {
    //   cpBoard[i] = this.board[i];
    // }
    // return new Game(cpBoard);
    return new Game(Calc.copyBoard(this.board));
  }
}
