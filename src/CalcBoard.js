import { Calc } from "./Calc";
import { Game } from "./Game";

export class CalcBoard {
  board;
  solvedIxs;
  unsolvedIxs;
  solvedN;
  targetBoard;
  targetStatus; //0=Unknown, 1=Some solution, 3=Unique solution, 5=Not unique solution, 8=Not solvable, -1=ERROR

  constructor(
    board,
    isWorkBord = false,
    targetBoard = null,
    targetStatus = 0,
    solvedIxs = null,
    unsolvedIxs = null,
    discardSolved
  ) {
    this.board = Calc.copyBoard(board);
    this.targetBoard = targetBoard;
    this.targetStatus = targetStatus;
    this.solvedIxs = solvedIxs;
    this.unsolvedIxs = unsolvedIxs;
    this.solvedN = null;
    if (!isWorkBord) {
      Calc.transformToWorkBoard(this.board, discardSolved);
    }
  }

  copy() {
    return new CalcBoard(this.board, true, this.targetBoard, this.targetStatus);
  }

  transformToGame() {
    const gameBoard = Calc.copyBoard(this.board);
    gameBoard.forEach((sq, ix) => {
      if (Calc.symbolCount(sq) === 1) gameBoard[ix] |= Calc.isFixedBit | Calc.isDeterminedBit;
      else gameBoard[ix] = Calc.symbolBits;
    });
    return new Game(gameBoard, this.targetBoard, this.targetStatus);
  }
  updateGameBoard(game) {
    for (let ix = 0; ix < Calc.nrSquares; ix++) {
      game.board[ix] &= ~Calc.symbolBits | (this.board[ix] & Calc.symbolBits);
      if (Calc.symbolCount(this.board[ix]) === 1) {
        game.board[ix] |= Calc.isDeterminedBit;
      }
    }
  }
  removeManySolved(level) {
    const levelCount = [];
    if (level >= 10) {
      while (this.removeRandomSolved(levelCount));
    } else {
      while (this.removeRandomSolvedAtLevel(level, levelCount));
    }
    console.log("removeManySolved(" + level + ") level counter:", levelCount);
  }
  removeRandomSolved(levelCountTot) {
    for (
      let removeOptions = this.solvedIxs.slice(), removeIxIx;
      removeOptions.length > 0;
      removeOptions.splice(removeIxIx, 1)
    ) {
      removeIxIx = Math.floor(Math.random() * removeOptions.length);
      const removeIx = removeOptions[removeIxIx];

      const correctSym = this.board[removeIx];
      this.board[removeIx] = Calc.symbolBits; //Clear solved square, restore all options

      const tmpBoard = this.copy();
      tmpBoard.board[removeIx] &= ~correctSym; //Remove correct option

      let levelCount = [];
      if (!tmpBoard.isSolvable(levelCount)) {
        if (levelCountTot.length === 0) levelCountTot.push(...levelCount);
        else levelCount.forEach((l, lix) => (levelCountTot[lix] += l));

        this.solvedIxs.splice(this.solvedIxs.indexOf(removeIx), 1);
        this.unsolvedIxs.push(removeIx);
        return true;
      }

      //Failed, could not be removed!

      this.board[removeIx] = correctSym; //Restore correct symbol
    }

    return false;
  }

  removeRandomSolvedAtLevel(maxLevel, levelCountTot) {
    for (
      let removeOptions = this.solvedIxs.slice(), removeIxIx;
      removeOptions.length > 0;
      removeOptions.splice(removeIxIx, 1)
    ) {
      removeIxIx = Math.floor(Math.random() * removeOptions.length);
      const removeIx = removeOptions[removeIxIx];

      const correctSym = this.board[removeIx];
      this.board[removeIx] = Calc.symbolBits; //Clear solved square, restore all options

      const tmpBoard = this.copy();

      let levelCount = [];
      if (tmpBoard.isSolvable(levelCount, maxLevel >= 10 ? 9 : maxLevel)) {
        if (levelCountTot.length === 0) levelCountTot.push(...levelCount);
        else levelCount.forEach((l, lix) => (levelCountTot[lix] += l));

        this.solvedIxs.splice(this.solvedIxs.indexOf(removeIx), 1);
        this.unsolvedIxs.push(removeIx);
        return true;
      }

      //Failed, could not be removed!

      this.board[removeIx] = correctSym; //Restore correct symbol
    }

    return false;
  }

  /***************************** REDUCE METHODS *******************************/
  initReductionPhase() {
    if (!this.solvedN) {
      this.solvedN = Array(Calc.nrSymbols * 3 /*#groups*/);
      for (let i = 0; i < this.solvedN.length; i++) {
        this.solvedN[i] = [0, 0, 0, 0];
      }
    }
    // this.solvedSquaresBits = Calc.newClearedSquareBits();
    // this.board.forEach((sq, bix) => {
    //   if (Calc.symbolCount(sq) === 1) Calc.setSquareBit(this.solvedSquaresBits, bix);
    // });
  }

  continueSolving() {
    let moreThanOne = 0;
    for (var i = 0; i < Calc.nrSquares; i++) {
      let nrSyms = Calc.symbolCount(this.board[i]);
      if (nrSyms > 1) moreThanOne++;
      if (nrSyms === 0) return false;
    }
    return moreThanOne > 0;
  }
  isSolved() {
    for (let gx of Calc.grpIx) {
      let groupCombSymbols = 0;
      for (let bix of gx) {
        if (Calc.symbolCount(this.board[bix]) !== 1) return false;
        groupCombSymbols |= this.board[bix];
      }
      if (groupCombSymbols !== Calc.symbolBits) return false;
    }
    return true;
  }

  isSolvable = this.trySolve;
  // prettier-ignore
  trySolve(levelCount, maxLevel = 100) {
    this.initReductionPhase(); Array.prototype.push
    if (levelCount.length === 0) levelCount.push(0, 0, 0, 0, 0, 0, 0, 0);
    let nrRedTaE = -1;
    let loopCount = 0;
    let nrRedTotal = 0;

    while (this.continueSolving() && nrRedTaE !== 0) {
      console.log("trySolve while", ++loopCount);

      let nrRed = 0;
      nrRedTaE = -1;

      nrRed = this.reduceGroup1All();
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[0]++; continue; }

      if (maxLevel <= 1) break;

      nrRed += this.reduceSquareNAll(1);
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[1]++; continue; }

      if (maxLevel <= 2) break;

      nrRed += this.reduceGroupNAll(2);
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[2]++; continue; }

      if (maxLevel <= 3) break;

      nrRed += this.reduceOtherGroupAll();
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[3]++; continue; }

      if (maxLevel <= 4) break;

      nrRed += this.reduceSquareNAll(2);
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[4]++; continue; }

      if (maxLevel <= 5) break;

      nrRed += this.reduceGroupNAll(3);
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[5]++; continue; }

      if (maxLevel <= 6) break;

      nrRed += this.reduceSquareNAll(3);
      if (nrRed < 0) break; nrRedTotal += nrRed; if (nrRed > 0) { levelCount[6]++; continue; }

      if (maxLevel <= 9) break;

      nrRedTaE = this.reduceTrialAndError(levelCount);
      if (nrRedTaE < 0) break; nrRedTotal += nrRedTaE; if (nrRedTaE > 0) { levelCount[7]++; continue; }
    }

    const solved = this.isSolved()
    //levelCount[levelCount.length-1] = 
    console.log("trySolve()=>", solved, loopCount, nrRedTotal, levelCount, nrRedTaE);
    return solved;
  }

  //Only 1 symbol in 1 square. Reduce that symbol from rest of group
  reduceGroup1(gx, doForSymbolsBits = Calc.symbolBits) {
    let nrReduced = 0;
    let symbolBit = 1;
    let doAgainBits = 0;

    for (let s = 0; s < Calc.nrSymbols; s++, symbolBit <<= 1) {
      if ((doForSymbolsBits & symbolBit) === 0) continue;
      for (let g = 0; g < gx.length; g++) {
        if (this.board[gx[g]] === symbolBit) {
          const invSymbolBit = ~symbolBit;
          for (let g2 = 0; g2 < gx.length; g2++) {
            if (g2 === g) continue;
            if ((this.board[gx[g2]] & symbolBit) !== 0) {
              this.board[gx[g2]] &= invSymbolBit;
              nrReduced++;
              if (Calc.symbolCount(this.board[gx[g2]]) === 1 && this.board[gx[g2]] < symbolBit) {
                //Got another single-bit-square (less than current), do again for this symbol-bit later
                doAgainBits |= this.board[gx[g2]];
              }
            }
          }
        }
      }
    }
    if (doAgainBits !== 0) {
      nrReduced += this.reduceGroup1(gx, doAgainBits);
    }
    return nrReduced;
  }

  prepareGroupReduction(g, n) {
    const gx = Calc.grpIx[g];
    let solvedSymBits = 0;
    gx.forEach(bix => {
      if (Calc.symbolCount(this.board[bix]) === 1) solvedSymBits |= this.board[bix];
    });
    for (let i = 0; i < n - 1; i++) solvedSymBits |= this.solvedN[g][i];
    const doForSymbolsBits = Calc.symbolBits & ~solvedSymBits;
    const doForSymbols = Calc.getSymbols(doForSymbolsBits);
    const squaresForSymbols = Calc.squaresOfSymbolBits(this.board, gx, doForSymbolsBits);

    return [squaresForSymbols, doForSymbols, doForSymbolsBits];
  }
  reduceGroupNAll(n) {
    let nrReducedSquares = 0;
    for (let g = 0; g < Calc.grpIx.length; g++) {
      let nrRed = this.reduceGroupN(g, n);
      if (nrRed < 0) return nrRed;
      nrReducedSquares += nrRed;
    }
    return nrReducedSquares;
  }
  reduceSquareNAll(n) {
    let nrReducedSquares = 0;
    for (let g = 0; g < Calc.grpIx.length; g++) {
      let nrRed = this.reduceSquareN(g, n);
      if (nrRed < 0) return nrRed;
      nrReducedSquares += nrRed;
    }
    return nrReducedSquares;
  }

  //reduceSquare

  reduceGroup1All() {
    let nrReducedSquares = 0;
    for (let gx of Calc.grpIx) {
      let solvedSyms = 0;
      let unsolvedSquares = [];
      for (let bix of gx) {
        if (Calc.symbolCount(this.board[bix]) === 1) {
          if (this.board[bix] & solvedSyms) return -1; //Same solved symbol on more than 1 square in group
          solvedSyms |= this.board[bix];
        } else {
          unsolvedSquares.push(bix);
        }
      }
      // gx.forEach(bix => {
      //   if (Calc.bitCount(this.board[bix]) === 1) solvedSyms |= this.board[bix];
      //   else unsolvedSquares.push(bix);
      // });
      for (let us = 0; us < unsolvedSquares.length; us++) {
        if ((this.board[unsolvedSquares[us]] & solvedSyms) !== 0) {
          this.board[unsolvedSquares[us]] &= ~solvedSyms;
          nrReducedSquares++;
        }
        if (this.board[unsolvedSquares[us]] === 0) return -1;
      }
    }
    return nrReducedSquares;
  }

  reduceGroupN(g, n) {
    let [gx, doForSymbols, symBits] = this.prepareGroupReduction(g, n);

    let nrSquaresReduced = 0;
    if (gx.length != doForSymbols.length) {
      return -1; //ERROR not solvable
    }

    const sqCount = gx.length;
    // //First basic reduction
    // for (let g = 0; g < sqCount; g++) {
    //   if ((this.board[gx[g]] & ~symBits) !== 0) {
    //     this.board[gx[g]] &= symBits;
    //     let bitsLeft = Calc.bitCount(this.board[gx[g]]);
    //     if (bitsLeft === 0) return -1;
    //     if (bitsLeft === 1) Calc.setSquareBit(this.solvedSquaresBits, bix);
    //     nrSquaresReduced++;
    //   }
    // }
    if (sqCount <= n) return nrSquaresReduced;

    for (let comb = Calc.firstCombination(n); comb.length > 0; Calc.nextCombination(comb, sqCount)) {
      let symbolsOfSqureComb = 0;
      comb.forEach(c => (symbolsOfSqureComb |= this.board[gx[c]]));
      if (Calc.symbolCount(symbolsOfSqureComb) <= n) {
        gx.forEach((bix, gxIx) => {
          if (!comb.includes(gxIx) && (this.board[bix] & symbolsOfSqureComb) !== 0) {
            this.board[bix] &= ~symbolsOfSqureComb;
            let bitsLeft = Calc.symbolCount(this.board[bix]);
            if (bitsLeft === 0) return -1;
            //if (bitsLeft === 1) Calc.setSquareBit(this.solvedSquaresBits, bix);
            nrSquaresReduced++;
          }
        });
        if (n >= 2) {
          this.solvedN[g][n - 2] |= symbolsOfSqureComb;
        }
      }
    }
    return nrSquaresReduced;
  }

  reduceSquareN(g, n) {
    let [gx, doForSymbols] = this.prepareGroupReduction(g, n);

    let nrSquaresReduced = 0;
    if (gx.length != doForSymbols.length) {
      return -1; //ERROR not solvable
      console.log("ERROR reduceSquareN length error!");
    }
    const symCount = doForSymbols.length;
    if (symCount < n) return 0; //Below code won't work if symCount < n

    const sqixOfSym = Array(symCount);
    let six = 0;
    for (let sym of doForSymbols) {
      sqixOfSym[six++] = Calc.squareBitsOfSymbol(this.board, gx, sym);
    }

    for (let comb = Calc.firstCombination(n); comb.length > 0; Calc.nextCombination(comb, symCount)) {
      let squaresOfComb = 0;
      comb.forEach(c => (squaresOfComb |= sqixOfSym[c]));
      if (Calc.squareCount(squaresOfComb) <= n) {
        let symBits = 0;
        for (let i = 0; i < n; i++) symBits |= doForSymbols[comb[i]];

        Calc.bitIxs(squaresOfComb).forEach(gxIx => {
          if ((this.board[gx[gxIx]] & ~symBits) !== 0) {
            this.board[gx[gxIx]] &= symBits;
            //if (Calc.symbolCount(this.board[gx[gxIx]] === 1)) Calc.setSquareBit(this.solvedSquaresBits, gx[gxIx]);
            nrSquaresReduced++;
          }
        });

        if (n >= 2) {
          this.solvedN[g][n - 2] |= symBits;
        }
      }
    }
    return nrSquaresReduced;
  }

  reduceOtherGroupAll() {
    let nrSquaresReduced = 0;
    for (let g = 0; g < Calc.grpIx.length; g++) {
      nrSquaresReduced += this.reduceOtherGroup(g);
    }
    return nrSquaresReduced;
  }
  reduceOtherGroup(g) {
    let nrSquaresReduced = 0;
    const gx = Calc.grpIx[g];
    const isBox = g >= Calc.nrSymbols * 2;
    let doForSymbolsBits = 0;
    gx.forEach(bix => {
      if (Calc.symbolCount(this.board[bix]) > 1) doForSymbolsBits |= this.board[bix];
    });
    for (let symbol = 1; symbol < Calc.symbolBits; symbol <<= 1) {
      if ((symbol & doForSymbolsBits) === 0) continue;
      const sqIxs = Calc.squareIxsOfSymbol(this.board, gx, symbol);
      let nr = sqIxs.length;
      if (nr === 1) {
        console.log("ERROR!? reduceOtherGroups: Symbol in only one square");
      }
      if (1 < nr && nr <= Calc.nrSymbolRoot) {
        let otherGrp = -1;
        if (Math.floor(sqIxs[0] / Calc.nrSymbolRoot) == Math.floor(sqIxs[nr - 1] / Calc.nrSymbolRoot)) {
          //All in same other group
          let sec = Math.floor(sqIxs[0] / Calc.nrSymbolRoot);
          otherGrp =
            g < Calc.nrSymbols
              ? /*this is row, other is box*/ Math.floor(g / Calc.nrSymbolRoot) * Calc.nrSymbolRoot +
                sec +
                Calc.nrSymbols * 2
              : g < Calc.nrSymbols * 2
              ? /*this is column, other is box*/ sec * Calc.nrSymbolRoot +
                Math.floor((g - Calc.nrSymbols) / Calc.nrSymbolRoot) +
                Calc.nrSymbols * 2
              : /*this is box, other is row*/
                Math.floor((g - Calc.nrSymbols * 2) / Calc.nrSymbolRoot) * Calc.nrSymbolRoot + sec;
        }
        if (isBox) {
          const col = sqIxs[0] % Calc.nrSymbolRoot;
          let sameCol = true;
          for (let i = 1; i < nr; i++)
            if (col !== sqIxs[i] % Calc.nrSymbolRoot) {
              sameCol = false;
              break;
            }
          if (sameCol) {
            //other is column
            otherGrp = (g % Calc.nrSymbolRoot) * Calc.nrSymbolRoot + col + Calc.nrSymbols;
          }
        }

        if (otherGrp >= 0) {
          const ogx = Calc.grpIx[otherGrp];
          ogx.forEach(bix => {
            if ((this.board[bix] & symbol) !== 0 && !gx.includes(bix)) {
              this.board[bix] &= ~symbol;
              nrSquaresReduced++;
            }
          });
        }
      }
    }
    return nrSquaresReduced;
  }

  reduceTrialAndError(levelCount) {
    let [optionTaeSyms, taeSqIx] = this.prepareTrialAndError();
    if (taeSqIx < 0) return taeSqIx; //ERROR: unsolvable

    for (let taeSym of optionTaeSyms) {
      let tmpBoard = this.copy();
      tmpBoard.solvedN = Calc.deepCopy(this.solvedN);
      tmpBoard.board[taeSqIx] = taeSym;
      if (tmpBoard.trySolve(levelCount)) {
        this.board = tmpBoard.board;
        this.solvedN = tmpBoard.solvedN;
        return 1;
      }
    }

    //Failed!
    return 0;
  }

  solutionType() {
    if (this.targetStatus > 1) {
      return this.targetStatus;
    }

    let tmpBoard = this.copy();
    if (tmpBoard.trySolve([], 9)) {
      return (this.targetStatus = 3);
    }

    if (this.targetStatus === 0) {
      const levelCount = [];
      if (!tmpBoard.trySolve(levelCount)) {
        return (this.targetStatus = 8);
      }
      this.targetBoard = tmpBoard.board;
      if (levelCount[7] === 0) {
        console.log("solutionType ERROR: levelCount[7] === 0");
        return (this.targetStatus = 3);
      }
      this.targetStatus = 1;
    }

    const calcBoard = this.copy();
    calcBoard.solvedN = Calc.deepCopy(this.solvedN);

    for (let ix = 0; ix < Calc.nrSquares; ix++) {
      const nrSym = Calc.symbolCount(calcBoard.board[ix]);
      if (nrSym === 0) {
        console.log("solutionType ERROR: Insolvable, NO OPTIONS");
        return (this.targetStatus = -1);
      }
      if (nrSym > 1) {
        for (let otherSym of Calc.getSymbols(calcBoard.board[ix])) {
          if (otherSym === calcBoard.targetBoard[ix]) continue;
          let tmpBoard = calcBoard.copy();
          tmpBoard.solvedN = Calc.deepCopy(calcBoard.solvedN);
          tmpBoard.board[ix] = otherSym;
          if (tmpBoard.trySolve([])) {
            return (this.targetStatus = 5);
          }
        }
        calcBoard.board[ix] = calcBoard.targetBoard[ix];
        if (calcBoard.trySolve([], 9)) {
          return (this.targetStatus = 3);
        }
      }
    }

    console.log("solutionType ERROR: Bad finish");
    return (this.targetStatus = -1);
  }

  prepareTrialAndError() {
    if (Calc.getNSymbolSquares(this.board, 0).length > 0) {
      //ERROR: empty squares
      return [[], -1];
    }

    let nSymSquares;
    let n = 2;

    do {
      if (n > Calc.nrSymbols) return [[], 0];
      nSymSquares = Calc.getNSymbolSquares(this.board, n++);
      console.log("prepareTrialAndError", n, nSymSquares, this.board);
    } while (nSymSquares.length === 0);

    const taeSqIx = nSymSquares[Math.floor(Math.random() * nSymSquares.length)];
    const taeSq = this.board[taeSqIx];
    const optionSyms = Calc.getSymbols(taeSq);

    return [optionSyms, taeSqIx];
  }

  /************************** END - REDUCE METHODS ****************************/

  static generateNewGame(level = 100) {
    const targetBoard = Calc.generateRandomBoard();
    const board = Calc.copyBoard(targetBoard);
    const solvedIxs = Array(Calc.nrSquares);
    //solvedIxs.forEach((_, ix) => (solvedIxs[ix] = ix));
    for (var i = 0; i < solvedIxs.length; i++) solvedIxs[i] = i;

    const cb = new CalcBoard(board, true, targetBoard, 3 /*Unique solution*/, solvedIxs, []);
    cb.removeManySolved(level);

    return cb.transformToGame();
  }
}
