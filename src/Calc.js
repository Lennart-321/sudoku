import { CalcBoard } from "./CalcBoard";
import { Sudoku } from "./Sudoku";

export class Calc {
  static initClass() {
    //symbolCount optimization
    const nrValues = Math.pow(2, Calc.nrSymbols);
    Calc.bitCountArray_UsedBy_symbolCount = new Array(nrValues);
    for (var value = 0; value < nrValues; value++) {
      let count = 0;
      let bit = 1;
      for (let i = 0; i < Calc.nrSymbols; i++, bit <<= 1) {
        if (value & bit) count++;
      }
      Calc.bitCountArray_UsedBy_symbolCount[value] = count;
    }

    //groupsOfSquare optimization
    Calc.groupBelongingOfSquares_UsedBy_groupsOfSquare = Array(Calc.nrSquares);
    for (var sq = 0; sq < Calc.nrSquares; sq++) {
      Calc.groupBelongingOfSquares_UsedBy_groupsOfSquare[sq] = [];
      Calc.grpIx.forEach((gx, gxIx) => {
        if (gx.includes(sq)) Calc.groupBelongingOfSquares_UsedBy_groupsOfSquare[sq].push(gx);
      });
    }

    //? //TODO: Calc.initClass() more...

    // console.log(
    //   "Calc.initClass() #symbolvalues=",
    //   nrValues,
    //   Calc.bitCountArray_UsedBy_symbolCount.length,
    //   Calc.bitCountArray_UsedBy_symbolCount[nrValues - 1]
    // );
  }
  //static showHelpsymolsBit = 0x200;
  static isFixedBit = 0x400;
  static isDeterminedBit = 0x800;
  static isUserEditedBit = 0x1000;
  static nrSquares = 81;
  static nrSymbols = 9;
  static nrSymbolRoot = 3;
  static bitCountArray_UsedBy_symbolCount;
  static groupBelongingOfSquares_UsedBy_groupsOfSquare;
  static get symbolBits() {
    return 0x1ff;
  }
  static grpTyIx = [
    [
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 32, 33, 34, 35],
      [36, 37, 38, 39, 40, 41, 42, 43, 44],
      [45, 46, 47, 48, 49, 50, 51, 52, 53],
      [54, 55, 56, 57, 58, 59, 60, 61, 62],
      [63, 64, 65, 66, 67, 68, 69, 70, 71],
      [72, 73, 74, 75, 76, 77, 78, 79, 80],
    ],
    [
      [0, 9, 18, 27, 36, 45, 54, 63, 72],
      [1, 10, 19, 28, 37, 46, 55, 64, 73],
      [2, 11, 20, 29, 38, 47, 56, 65, 74],
      [3, 12, 21, 30, 39, 48, 57, 66, 75],
      [4, 13, 22, 31, 40, 49, 58, 67, 76],
      [5, 14, 23, 32, 41, 50, 59, 68, 77],
      [6, 15, 24, 33, 42, 51, 60, 69, 78],
      [7, 16, 25, 34, 43, 52, 61, 70, 79],
      [8, 17, 26, 35, 44, 53, 62, 71, 80],
    ],
    [
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80],
    ],
  ];
  static grpIx = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80],
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
  ];
  // // prettier-ignore
  // static bits27 = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x100,
  //   0x200, 0x400, 0x800, 0x1000, 0x2000, 0x4000, 0x8000, 0x10000, 0x20000,
  //   0x40000, 0x80000, 0x100000, 0x200000, 0x400000, 0x800000, 0x1000000, 0x2000000, 0x4000000];
  // static newClearedSquareBits() {
  //   return [0, 0, 0].slice();
  // }
  // static newSetSquareBits() {
  //   return [0x7ffffff, 0x7ffffff, 0x7ffffff].slice();
  // }
  // static isAllBitsSet(squareBits) {
  //   return (squareBits[0] & squareBits[1] & squareBits[2]) === 0x7ffffff;
  // }
  // static setSquareBit(bits, bitIx) {
  //   bits[Math.floor(bitIx / 27)] |= Calc.bits27[bitIx % 27]; //1 << (bitIx % 27);
  // }
  // static isSquareBit(bits, bitIx) {
  //   return (bits[Math.floor(bitIx / 27)] & Calc.bits27[bitIx % 27]) !== 0; //1 << (bitIx % 27);
  // }

  static firstBoxGroup = 18; //2 * Calc.grpIx.length / 3;
  static isFixed(value) {
    return (value & Calc.isFixedBit) !== 0;
  }
  static isDetermined(value) {
    return (value & Calc.isDeterminedBit) !== 0;
  }
  static isSelected(value) {
    return (value & (Calc.isFixedBit | Calc.isDeterminedBit)) === Calc.isDeterminedBit;
  }
  static isUserEdited(value) {
    return (value & Calc.isUserEditedBit) !== 0;
  }
  static symbols(value) {
    return value & Calc.symbolBits;
  }
  static symbolCount(value) {
    return Calc.bitCountArray_UsedBy_symbolCount[value & Calc.symbolBits];
  }
  static squareCount = Calc.symbolCount;
  static isReduced(value) {
    return Calc.symbolCount(value) < Calc.nrSymbols;
  }
  static getSymbolBit(symbol) {
    return 1 << (symbol - 1);
  }
  static symbolFromBit = Calc.firstBitNr;
  static firstBitNr(bit) {
    for (var bitNr = 1; bitNr <= Calc.nrSymbols; bitNr++, bit >>= 1) {
      if ((bit & 1) === 1) return bitNr;
    }
    return 0;
  }
  static getSymbols(symBits) {
    const syms = [];
    for (var symBit = 1; symBit < Calc.symbolBits; symBit <<= 1) {
      if ((symBits & symBit) !== 0) syms.push(symBit);
    }
    return syms;
  }

  static bitIxs(bits) {
    const res = [];
    for (var bitIx = 0, bit = 1; bitIx < Calc.nrSymbols; bitIx++, bit <<= 1) {
      if ((bits & bit) !== 0) res.push(bitIx);
    }
    return res;
  }

  static cleanBoard() {
    return Array(Calc.nrSquares).fill(Calc.symbolBits);
  }

  static copyBoard(board) {
    const cpBoard = Array(board.length);
    for (var i = 0; i < board.length; i++) {
      cpBoard[i] = board[i];
    }
    return cpBoard;
  }

  static copyFrom(from, to) {
    for (var i = 0; i < from.length; i++) {
      to[i] = from[i];
    }
  }

  static firstCombination(n) {
    const fc = Array(n);
    for (let i = 0; i < fc.length; i++) {
      fc[i] = i;
    }
    return fc;
  }
  static nextCombination(comb, limit) {
    const n = comb.length;
    for (let i = n - 1; i >= 0; i--) {
      if (comb[i] < --limit) {
        comb[i]++;
        while (++i < n) {
          comb[i] = comb[i - 1] + 1;
        }
        return;
      }
    }
    comb.splice(0); //Termination signal
  }

  static determinedSymbol(value) {
    switch (value & (Calc.isDeterminedBit | Calc.symbolBits)) {
      case Calc.isDeterminedBit | 0x1:
        return 1;
      case Calc.isDeterminedBit | 0x2:
        return 2;
      case Calc.isDeterminedBit | 0x4:
        return 3;
      case Calc.isDeterminedBit | 0x8:
        return 4;
      case Calc.isDeterminedBit | 0x10:
        return 5;
      case Calc.isDeterminedBit | 0x20:
        return 6;
      case Calc.isDeterminedBit | 0x40:
        return 7;
      case Calc.isDeterminedBit | 0x80:
        return 8;
      case Calc.isDeterminedBit | 0x100:
        return 9;
      default:
        return "";
    }
  }

  static getNSymbolSquares(wb, n) {
    const result = [];
    for (var i = 0; i < wb.length; i++) {
      if (Calc.symbolCount(wb[i]) === n) result.push(i);
    }
    return result;
  }
  static unreduceNonDetermined(board) {
    for (var i = 0; i < board.length; i++) {
      if ((board[i] & Calc.isDeterminedBit) === 0) {
        board[i] |= Calc.symbolBits;
      }
    }
  }
  static unreduceNonEdited(board) {
    for (var i = 0; i < board.length; i++) {
      if ((board[i] & (Calc.isUserEditedBit | Calc.isDeterminedBit)) === 0) {
        board[i] |= Calc.symbolBits;
      }
    }
  }

  static transformToWorkBoard(board, discardSolved = false) {
    //Keep only symbolbits
    const keepCriteriaBits = discardSolved ? Calc.isFixedBit : Calc.isDeterminedBit | Calc.isFixedBit;
    for (var i = 0; i < board.length; i++) {
      if ((board[i] & keepCriteriaBits) !== 0) {
        board[i] &= Calc.symbolBits;
      } else {
        board[i] = Calc.symbolBits;
      }
    }
  }
  static definedGame(board) {
    for (var i = 0; i < board.length; i++) {
      if (Calc.symbolCount(board[i]) === 1) {
        board[i] |= Calc.isFixedBit | Calc.isDeterminedBit;
      } else {
        board[i] = Calc.symbolBits;
      }
    }
  }

  static restartGame(board) {
    for (var i = 0; i < board.length; i++) {
      if (!Calc.isFixed(board[i])) {
        board[i] |= Calc.symbolBits;
        board[i] &= ~Calc.isDeterminedBit;
      }
    }
  }
  static isSolved(gameBoard) {
    for (let gx of Calc.grpIx) {
      let groupCombSymbols = 0;
      for (let bix of gx) {
        const val = gameBoard[bix];
        if (!Calc.isDetermined(val) || Calc.symbolCount(val) !== 1) return false;
        groupCombSymbols |= val;
      }
      if ((groupCombSymbols & Calc.symbolBits) !== Calc.symbolBits) return false;
    }
    return true;
  }

  static solutionType(game) {
    if (game.targetStatus > 1) return game.targetStatus;
    const calcBoard = new CalcBoard(
      game.board,
      false,
      game.targetBoard,
      game.targetStatus,
      null,
      null,
      true /*discard solved*/
    );
    game.targetStatus = calcBoard.solutionType();
    game.levelCount = calcBoard.levelCount;
    if (!game.targetBoard) {
      game.targetBoard = calcBoard.targetBoard;
    }
    return game.targetStatus;
  }

  static solveGame(game) {
    Calc.unreduceNonDetermined(game.board);
    const calcBoard = new CalcBoard(game.board);
    calcBoard.trySolve([]);
    calcBoard.updateGameBoard(game);
    Sudoku.gameSolvedTest();
  }

  static simpleReduceFromFixed(board) {
    for (var g = 0; g < Calc.grpIx.length; g++) {
      var gx = Calc.grpIx[g];
      var fixed = Calc.getFixedInGrp(board, gx);
      if (fixed !== 0) {
        Calc.reduceNonSolved(board, gx, fixed, true);
      }
    }
    return board;
  }
  static simpleReduceFromDetermined(board) {
    let nrReduced = 0;
    for (var g = 0; g < Calc.grpIx.length; g++) {
      var gx = Calc.grpIx[g];
      var determined = Calc.getDeterminedInGrp(board, gx);
      if (determined !== 0) {
        nrReduced += Calc.reduceNonSolved(board, gx, determined, false);
      }
    }
    return nrReduced;
  }

  static getFixedInGrp(board, gx) {
    let fixedBits = 0;
    gx.forEach(ix => {
      if (Calc.isFixed(board[ix])) fixedBits |= board[ix] & Calc.symbolBits;
    });
    return fixedBits;
  }
  static getDeterminedInGrp(board, gx) {
    let determinedBits = 0;
    gx.forEach(ix => {
      if (Calc.isDetermined(board[ix])) determinedBits |= board[ix] & Calc.symbolBits;
    });
    return determinedBits;
  }
  static reduceNonSolved(board, gx, reduceBits, fixedOnly = false) {
    let nrSquaresReduced = 0;
    const solvedFunc = fixedOnly ? Calc.isFixed : Calc.isDetermined;
    gx.forEach(ix => {
      //if (!solvedFunc.call(this, board[ix]) && (board[ix] & invReduceBits) !== 0)
      if (!solvedFunc(board[ix]) && (board[ix] & reduceBits) !== 0) {
        board[ix] &= ~reduceBits;
        ++nrSquaresReduced;
      }
    });
    return nrSquaresReduced;
  }
  static reduceFromSquare(board, ix) {
    let nrSquaresReduced = 0;
    //const invBits = ~(board[ix] & Calc.symbolBits);
    const grps = Calc.groupsOfSquare(ix);
    grps.forEach(gx => (nrSquaresReduced += Calc.reduceNonSolved(board, gx, board[ix] & Calc.symbolBits)));
    return nrSquaresReduced;
  }

  static groupsOfSquare(sq) {
    return Calc.groupBelongingOfSquares_UsedBy_groupsOfSquare[sq];
  }

  static squareBitsOfSymbol(board, gx, symbolBit) {
    let squareBits = 0;
    gx.forEach((sqIx, gIx) => {
      if ((board[sqIx] & symbolBit) !== 0) squareBits |= 1 << gIx;
    });
    return squareBits;
  }
  static squaresOfSymbolBits(board, gx, symbolBits) {
    let squares = [];
    gx.forEach(bix => {
      if ((board[bix] & symbolBits) !== 0) squares.push(bix);
    });
    return squares;
  }
  static squareIxsOfSymbol(board, gx, symbolBit) {
    let squares = [];
    gx.forEach((sqIx, gIx) => {
      if ((board[sqIx] & symbolBit) !== 0) squares.push(gIx);
    });
    return squares;
  }
  static singleSquaresOfSymbol(board, gx, symbolBit) {
    let foundSqIx = -1;
    gx.forEach(sqIx => {
      if ((board[sqIx] & symbolBit) !== 0) {
        if (foundSqIx >= 0) return -1;
        foundSqIx = sqIx;
      }
    });
    return foundSqIx;
  }
  static symbolsToString(symBits) {
    let str = "";
    for (var symBit = 1, sym = 1; symBit <= symBits; symBit <<= 1, sym++) {
      if ((symBits & symBit) !== 0) str += sym;
    }
    return str;
  }

  //Few(n) symbols only in few(n) squares. Reduce other symbols from those squares.
  //static reduceSquares(board, gx, n) {}

  //Only few(n) symbols in few(n) squares. Reduce those symbols from rest of group
  static reduceGroup(board, gx, n) {}

  //Only 1 symbol in 1 square. Reduce that symbol from rest of group
  static reduceGroup1(wb, gx, doForSymbolsBits = Calc.symbolBits) {
    let nrReduced = 0;
    let symbolBit = 1;
    let doAgainBits = 0;

    for (let s = 0; s < Calc.nrSymbols; s++, symbolBit <<= 1) {
      if ((doForSymbolsBits & symbolBit) === 0) continue;
      for (let g = 0; g < gx.length; g++) {
        if (wb[gx[g]] === symbolBit) {
          const invSymbolBit = ~symbolBit;
          for (let g2 = 0; g2 < gx.length; g2++) {
            if (g2 === g) continue;
            if ((wb[gx[g2]] & symbolBit) !== 0) {
              wb[gx[g2]] &= invSymbolBit;
              nrReduced++;
              if (Calc.symbolCount(wb[gx[g2]]) === 1 && wb[gx[g2]] < symbolBit) {
                //Got another single-bit-square (less than current), do again for this symbol-bit later
                doAgainBits |= wb[gx[g2]];
              }
            }
          }
        }
      }
    }
    if (doAgainBits !== 0) {
      nrReduced += Calc.reduceGroup1(wb, gx, doAgainBits);
    }
    return nrReduced;
  }

  //1 symbol in only 1 square. Reduce other symbols from that square
  static reduceSquares1(wb, gx, doForSymbolsBits = Calc.symbolBits) {
    let nrReducedSquares = 0;
    let symbolBit = 1;
    for (let s = 0; s < Calc.nrSymbols; s++, symbolBit <<= 1) {
      if ((symbolBit & doForSymbolsBits) === 0) continue;
      const sqIx = Calc.singleSquaresOfSymbol(wb, gx, symbolBit);
      if (sqIx >= 0) {
        wb[sqIx] = symbolBit;
        nrReducedSquares++;
      }
    }
    return nrReducedSquares;
  }

  static removeSolvedSquares(wb, gx) {
    let solvedBits = 0;
    gx = gx.reduce((res, ix) => {
      if (Calc.symbolCount(wb[ix]) > 1) {
        res.push(ix);
      } else {
        solvedBits |= wb[ix];
      }
      return res;
    }, []);
    return [gx, solvedBits];
  }

  // //Only 2 symbols in 2 square. Reduce those symbols from rest of group...
  // //...and 2 symbols only in 2 squares. Reduce other symbols from those squares.
  // //Assumes 1 reduced before
  // static reduceGroupsAndSquares2(wb, gx, doForSymbolsBits = Calc.symbolBits) {
  //   let solvedBits;
  //   [gx, solvedBits] = Calc.removeSolvedSquares(wb, gx);
  //   doForSymbolsBits &= ~solvedBits;

  //   const sqixOfSym = Array(Calc.nrSymbols);
  //   let symbolBit = 1;
  //   for (let s = 0; s < Calc.nrSymbols; s++, symbolBit <<= 1) {
  //     if ((symbolBit & doForSymbolsBits) === 0) continue;
  //     sqixOfSym[s] = Calc.squareBitsOfSymbol(wb, gx, symbolBit);
  //   }

  //   symbolBit = 1;
  //   for (let s1 = 0; s1 < Calc.nrSymbols; s1++, symbolBit <<= 1) {
  //     if ((symbolBit & doForSymbolsBits) !== 0) continue;
  //     let symbolBit2 = 1;
  //     for (let s2 = 0; s2 < Calc.nrSymbols; s2++, symbolBit2 <<= 1) {
  //       if ((symbolBit & doForSymbolsBits) !== 0 || s1 === s2) continue;

  //       const combSymBits = symbolBit | symbolBit2;

  //       let eqCount = 0;
  //       let firstEqIx = -1;
  //       for (let g = 0; g < gx.length; g++) {
  //         if (wb[gx[g]] === combSymBits) {
  //           if (++eqCount === 2) {
  //             for (let g2 = 0; g2 < gx.length; g2++) {
  //               if (g2 === firstEqIx || g2 === g) continue;
  //               wb[gx[g2]] &= ~combSymBits;
  //             }

  //             return true;
  //           }
  //           firstEqIx = g;
  //         }
  //       }

  //       if (
  //         sqixOfSym[s1] === sqixOfSym[s2] &&
  //         Calc.symbolCount(sqixOfSym[s1]) === 2 /*Calc.bitCount(sqixOfSym[s1] | sqixOfSym[s2]) === 2*/
  //       ) {
  //         const gIxs = Calc.bitIxs(sqixOfSym[s1]);
  //         gIxs.forEach(gIx => (wb[gx[gIx]] &= combSymBits));
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  //Only 2 symbols in 2 square. Reduce those symbols from rest of group.
  //Assumes 1 reduced before
  static reduceGroups2(wb, gx, doForSymbolsBits = Calc.symbolBits) {
    let solvedBits;
    [gx, solvedBits] = Calc.removeSolvedSquares(wb, gx);
    doForSymbolsBits &= ~solvedBits;

    let symbolBit = 1;
    for (let s1 = 0; s1 < Calc.nrSymbols - 1; s1++, symbolBit <<= 1) {
      if ((symbolBit & doForSymbolsBits) !== 0) continue;
      let symbolBit2 = symbolBit << 1;
      for (let s2 = s1 + 1; s2 < Calc.nrSymbols; s2++, symbolBit2 <<= 1) {
        if ((symbolBit & doForSymbolsBits) !== 0) continue;

        const combSymBits = symbolBit | symbolBit2;

        let eqCount = 0;
        let firstEqIx = -1;
        for (let g = 0; g < gx.length; g++) {
          if (wb[gx[g]] === combSymBits) {
            if (++eqCount === 2) {
              for (let g2 = 0; g2 < gx.length; g2++) {
                if (g2 === firstEqIx || g2 === g) continue;
                wb[gx[g2]] &= ~combSymBits;
              }

              return true;
            }
            firstEqIx = g;
          }
        }
      }
    }
    return false;
  }

  static shuffle(array) {
    for (var ix = array.length - 1; ix > 0; ix--) {
      var rndIx = Math.floor(Math.random() * ix);
      var tmp = array[ix];
      array[ix] = array[rndIx];
      array[rndIx] = tmp;
    }
  }

  //2 symbols only in 2 squares. Reduce other symbols from those squares.
  //Assumes 1 reduced before
  static reduceSquares2(wb, gx, doForSymbolsBits = Calc.symbolBits) {
    let solvedBits;
    [gx, solvedBits] = Calc.removeSolvedSquares(wb, gx);
    doForSymbolsBits &= ~solvedBits;

    const sqixOfSym = Array(Calc.nrSymbols);
    let symbolBit = 1;
    for (let s = 0; s < Calc.nrSymbols; s++, symbolBit <<= 1) {
      if ((symbolBit & doForSymbolsBits) === 0) continue;
      sqixOfSym[s] = Calc.squareBitsOfSymbol(wb, gx, symbolBit);
    }

    symbolBit = 1;
    for (let s1 = 0; s1 < Calc.nrSymbols - 1; s1++, symbolBit <<= 1) {
      if ((symbolBit & doForSymbolsBits) !== 0) continue;
      let symbolBit2 = symbolBit << 1;
      for (let s2 = s1 + 1; s2 < Calc.nrSymbols; s2++, symbolBit2 <<= 1) {
        if ((symbolBit2 & doForSymbolsBits) !== 0) continue;

        const combSymBits = symbolBit | symbolBit2;

        if (
          sqixOfSym[s1] === sqixOfSym[s2] &&
          Calc.symbolCount(sqixOfSym[s1]) === 2 /*Calc.bitCount(sqixOfSym[s1] | sqixOfSym[s2]) === 2*/
        ) {
          const gIxs = Calc.bitIxs(sqixOfSym[s1]);
          gIxs.forEach(gIx => (wb[gx[gIx]] &= combSymBits));
          return true;
        }
      }
    }
    return false;
  }
  // static generateRandomBoard() {
  //   const board = Array(Calc.nrSymbols * Calc.nrSymbols).fill(Calc.symbolBits);
  //   const undecided = Array(board.length);
  //   for (var i = 0; i < board.length; i++) {
  //     undecided[i] = i;
  //   }
  //   Calc.glbCounter = 0;
  //   const ok = Calc.solveRandom(board, undecided);
  //   console.log(ok, board.length, board);
  //   return board;
  // }

  static generateRandomBoard() {
    const board = Array(Calc.nrSquares).fill(Calc.symbolBits);
    Calc.glbCounter = 0;
    const ok = Calc.solveRandom2(board, 0);
    //console.log("generateRandomBoard()=>", ok, board.length, board);
    return board;
  }

  static solveRandom2(board, sqIx) {
    Calc.glbCounter++;
    if (sqIx === 0) Calc.highLevel = 0;

    const origSq = board[sqIx];
    const candidateSyms = Calc.getSymbols(origSq);
    Calc.shuffle(candidateSyms);

    if (sqIx > Calc.highLevel) {
      Calc.highLevel = sqIx;
      //console.log("Square", sqIx, Calc.glbCounter, origSq, candidateSyms, board);
    }

    const reduced = [];
    for (var candSym of candidateSyms) {
      board[sqIx] = candSym;
      if (Calc.reduceFromDecidedSquare_OnlyHigherSquares(board, sqIx, reduced)) {
        if (sqIx + 1 === board.length || Calc.solveRandom2(board, sqIx + 1)) {
          return true;
        }
      }
      //candSym failed, restore board
      reduced.forEach(ix => (board[ix] |= candSym)); //Restore
      reduced.splice(0);
    }

    //Failed, restore square
    board[sqIx] = origSq;
    return false;
  }
  static reduceFromDecidedSquare_OnlyHigherSquares(wb, ix, reduced) {
    const solvedSym = wb[ix];
    const invSolvedSym = ~solvedSym;
    const grps = Calc.groupsOfSquare(ix);

    for (var g = 0; g < grps.length; g++) {
      for (var m = 0; m < grps[g].length; m++) {
        var bix = grps[g][m];
        if (bix <= ix) continue; //OnlyHigherSquares
        if ((wb[bix] & solvedSym) !== 0) {
          if (wb[bix] === solvedSym) {
            //ERROR: no candidates left
            return false;
          }
          wb[bix] &= invSolvedSym;
          reduced.push(bix);
        }
      }
    }
    return true;
  }

  static glbCounter = 0;
  static highLevel;
  // static solveRandom(board, undecided, level = 0) {
  //   Calc.glbCounter++;
  //   if (level === 0) Calc.highLevel = 0;
  //   if (level + undecided.length != 81) {
  //     console.log("LEVELERROR", level, undecided.length);
  //     return false;
  //   }

  //   if (undecided.length === 0) {
  //     console.log("TRUE-1", level);
  //     return true;
  //   }
  //   if (level > 100) {
  //     console.log("FALSE LEVEL", level);
  //     return false;
  //   }
  //   const undecidedIndex = Math.floor(Math.random() * undecided.length);
  //   const undecidedBoardIx = undecided[undecidedIndex];
  //   const restUndecided = undecided.slice();
  //   restUndecided.splice(undecidedIndex, 1);
  //   const origSq = board[undecidedBoardIx];
  //   const reduced = [];
  //   const candidateSyms = Calc.getSymbols(origSq);
  //   Calc.shuffle(candidateSyms);

  //   if (level > Calc.highLevel) {
  //     Calc.highLevel = level;
  //     console.log("Level", level, Calc.glbCounter, undecidedBoardIx, origSq, candidateSyms, board);
  //   }

  //   //console.log(level, undecidedIndex, undecidedBoardIx, candidateSyms, undecided, restUndecided);

  //   for (var candSym of candidateSyms) {
  //     board[undecidedBoardIx] = candSym;
  //     if (Calc.reduceFromDecidedSquare(board, undecidedBoardIx, reduced)) {
  //       if (restUndecided.length === 0) {
  //         console.log("TRUE-2", level);
  //         return true;
  //       }
  //       if (Calc.solveRandom(board, restUndecided, level + 1)) {
  //         console.log("TRUE-3", level);
  //         /*Found good board*/
  //         return true;
  //       }
  //     }
  //     //console.log("Pre-restore:", reduced, candSym, board);
  //     reduced.forEach(ix => (board[ix] |= candSym)); //Restore
  //     reduced.splice(0);
  //     //console.log("Post-restore:", reduced, board);
  //   }

  //   board[undecidedBoardIx] = origSq;
  //   //console.log("FALSE", level, undecidedIndex, undecidedBoardIx, origSq);
  //   return false;
  // }
  static turn(board, turned) {
    for (let r = 0; r < Calc.nrSymbols; r++) {
      let gxr = Calc.grpIx[r];
      let gxc = Calc.grpIx[2 * Calc.nrSymbols - 1 - r];
      for (let i = 0; i < Calc.nrSymbols; i++) {
        turned[gxc[i]] = board[gxr[i]];
      }
    }
  }
  static twist(board, twisted) {
    for (let r = 0; r < Calc.nrSymbols; r++) {
      let gx = Calc.grpIx[r];
      let gxr = Calc.grpIx[Calc.nrSymbols - 1 - r];
      for (let i = 0; i < Calc.nrSymbols; i++) {
        twisted[gxr[i]] = board[gx[i]];
      }
    }
  }
  static permutate(board) {
    const perm = Array(Calc.nrSymbols);
    for (let i = 0; i < Calc.nrSymbols; i++) perm[i] = i;
    Calc.shuffle(perm);
    for (let i = 0; i < board.length; i++) {
      let v = board[i];
      if (Calc.isDetermined(v)) {
        let s0 = Calc.symbolFromBit(v);
        let s1 = (s0 > 0 ? perm[s0 - 1] : (console.log("permutate ERROR!"), 0)) + 1;
        v &= ~Calc.symbolBits;
        v |= Calc.getSymbolBit(s1);
        board[i] = v;
      }
    }
  }
  static twistAndTurn(board) {
    let b1 = board;
    let b2 = Calc.cleanBoard();
    for (let tu = Math.random() * 4; tu > 0; tu = tu - 1) {
      Calc.turn(b1, b2);
      [b1, b2] = [b2, b1];
    }
    if (true || Math.random() > 0.5) {
      Calc.twist(b1, b2);
      [b1, b2] = [b2, b1];
    }
    Calc.permutate(board);
    if (b1 !== board) Calc.copyFrom(b1, board);
  }

  static deepCopy(ary) {
    if (!Array.isArray(ary)) return ary;
    const cp = Array(ary.length);
    for (let i = 0; i < ary.length; i++) {
      cp[i] = Calc.deepCopy(ary[i]);
    }
  }
}
