import { CalcBoard } from "./CalcBoard";
import { Calc } from "./Calc";

export function globalTest() {
  // let testBoard = new CalcBoard(
  //   [
  //     128, 32, 64, 2, 16, 4, 256, 8, 1, 4, 8, 256, 64, 128, 1, 32, 16, 2, 16, 2, 1, 256, 32, 8, 64, 128, 4, 64, 128, 4,
  //     8, 256, 32, 2, 1, 16, 2, 256, 32, 128, 1, 16, 8, 4, 64, 8, 1, 16, 4, 64, 2, 128, 256, 32, 256, 16, 128, 32, 4, 64,
  //     1, 2, 8, 32, 4, 8, 1, 2, 256, 16, 64, 128, 1, 64, 2, 16, 128, 128, 4, 32, 256,
  //   ],
  //   true,
  //   [
  //     128, 32, 64, 2, 16, 4, 256, 8, 1, 4, 8, 256, 64, 128, 1, 32, 16, 2, 16, 2, 1, 256, 32, 8, 64, 128, 4, 64, 128, 4,
  //     8, 256, 32, 2, 1, 16, 2, 256, 32, 128, 1, 16, 8, 4, 64, 8, 1, 16, 4, 64, 2, 128, 256, 32, 256, 16, 128, 32, 4, 64,
  //     1, 2, 8, 32, 4, 8, 1, 2, 256, 16, 64, 128, 1, 64, 2, 16, 8, 128, 4, 32, 256,
  //   ]
  // );
  // let res = testBoard.trySolve();
  // console.log("TEST testBoard.trySolve() =>", res);

  test_reduceSqAndGrpN();
  test_reduceOtherGroup();
  test_trySolve();
}

function compareValues(v1, v2, showSquareVals) {
  let diff = "";
  if (Array.isArray(v1)) {
    if (!Array.isArray(v2)) {
      diff += `(T:${typeof v1}/${typeof v2}) `;
    } else {
      let subdiff = compareArray(v1, v2, showSquareVals);
      if (subdiff) {
        diff += "A:" + subdiff;
      }
    }
  } else {
    if (v1 !== v2) {
      if (showSquareVals) diff += `(X ${Calc.symbolsToString(v1)} / ${Calc.symbolsToString(v2)}) `;
      else diff += `(X ${v1} / ${v2}) `;
    }
  }
  return diff;
}

// function compareValues(a1, a2) {
//   let diff = "";
//   if (a1 !== a2) {
//     diff = `X ${a1} / ${a2}`;
//   }
//   return diff;
// }
function compareArray(a1, a2, showSquareVals) {
  if (a1.length != a2.length) {
    return "Len:" + a1.length + "/" + a2.length;
  }
  let diff = "";
  for (let i = 0; i < a1.length; i++) {
    if (Array.isArray(a1[i])) {
      if (!Array.isArray(a2[i])) {
        diff += `(T index[${i}]: ${typeof a1[i]}/${typeof a2[i]}) `;
      } else {
        let subdiff = compareArray(a1[i], a2[i]);
        if (subdiff) {
          diff += "SUB:" + subdiff;
        }
      }
    } else {
      if (a1[i] !== a2[i]) {
        if (showSquareVals) diff += `(X index[${i}]: ${Calc.symbolsToString(a1[i])}/${Calc.symbolsToString(a2[i])}) `;
        else diff += `(X index[${i}]: ${a1[i]}/${a2[i]}) `;
      }
    }
  }
  return diff;
}
function testResult(desc, ...values) {
  let diff = [];
  for (let i = 0; i < values.length; i++) {
    let diffi = compareValues(values[i][0], values[i][1], values[i].length > 2 ? values[i][2] : false);
    if (diffi) diff.push(diffi);
  }
  if (diff.length === 0) {
    console.log("OK     -", desc);
  } else {
    console.log("FAILED -", desc, ...diff);
  }
}

function test_reduceOtherGroup() {
  // prettier-ignore
  let board = [
    0x1FF, 0x1FF, 0x1FF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1EF, 0x1EF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1EF, 0x1EF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1EF, 0x1EF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FC, 0x1FC, 0x1FC,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FC, 0x1FC, 0x1FC,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FD, 0x1FE, 0x1FF, 0x1FD, 0x1FF
  ];

  let cb = new CalcBoard(board, true);
  cb.initReductionPhase();

  let nrRed = cb.reduceOtherGroup(26);
  testResult(
    "TEST reduceOtherGroup(26)",
    [nrRed, 10],
    [cb.board.slice(72), [0x1fc, 0x1fc, 0x1fc, 0x1fc, 0x1fc, 0x1fc, 0x1ff, 0x1fd, 0x1ff], true]
  );

  nrRed = cb.reduceOtherGroup(22);
  testResult(
    "TEST reduceOtherGroup(22)",
    [nrRed, 6],
    [
      [
        cb.board[3],
        cb.board[12],
        cb.board[21],
        cb.board[30],
        cb.board[39],
        cb.board[48],
        cb.board[57],
        cb.board[66],
        cb.board[75],
      ],
      [0xef, 0x1ef, 0x1ef, 0x1ff, 0x1ff, 0x1ff, 0x1ef, 0x1ef, 0x1ec],
      true,
    ]
  );

  nrRed = cb.reduceOtherGroup(0);
  testResult(
    "TEST reduceOtherGroup(0)",
    [nrRed, 6],
    [
      [
        cb.board[0],
        cb.board[1],
        cb.board[2],
        cb.board[9],
        cb.board[10],
        cb.board[11],
        cb.board[18],
        cb.board[19],
        cb.board[20],
      ],
      [0x1ff, 0x1ff, 0x1ff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
      true,
    ]
  );
}

function test_reduceSqAndGrpN() {
  // prettier-ignore
  let board = [
    //0xD00,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0xC02,0xC80,
    0x1,0x2,0x4,0x8,0x1FF,0x20,0x40,0x80,0x100,
    //0x1ff, 0x1ff, 0x1ff, 0x1ff, 0x1ff, 0x02, 0x1ff, 0x08, 0x1ff,
    0x1,0x2,0x4,0x8,0x1FF,0x20,0x40,0x80,0xFF,
    //0x1ff,0x1ff,0x04,0x1ff,0x100,0x40,0x20,0x1ff,0x1ff,
    0x1,0x1FF,0x4,0x8,0x1FF,0x20,0x40,0x80,0x0FD,
    //0x10,0x1ff,0x1ff,0x1ff,0x08,0x1ff,0x07e,0x01,0x07e,
    0x10E, 0x1FE, 0x1FF, 0x10E, 0x1FF, 0x17F, 0x10E, 0x1EE, 0x10E,
    //0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x07e,0x07e,0x100,
    0x100, 0x18, 0x118, 0x18, 0x1FF, 0x17F, 0x1FE, 0x1FF, 0xBE,
    //0x01,0x100,0x1ff,0x40,0x1ff,0x1ff,0x07e,0x80,0x07e,
    0xA, 0x1FF, 0x1FF, 0x1FF, 0x1, 0x1FF, 0x12, 0x1FF, 0x18,
    0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x80,0x1ff,0x40,0x1ff,
    0x1ff,0x1ff,0x01,0x02,0x40,0x1ff,0x1ff,0x1ff,0x1ff,
    0x80,0x1ff,0x08,0x1ff,0x1ff,0x1ff,0x1ff,0x1ff,0x20

    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
  ];
  let cb = new CalcBoard(board, true);
  cb.initReductionPhase();
  let nrRed = cb.reduceSquareN(0, 1);
  testResult(
    "TEST reduceSquareN(0,1)",
    [nrRed, 1],
    [cb.board.slice(0, 9), [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x100], true]
  );

  nrRed = cb.reduceSquareN(1, 1);
  testResult(
    "TEST reduceSquareN(1,1)",
    [nrRed, 1],
    [cb.board.slice(9, 18), [0x1, 0x2, 0x4, 0x8, 0x100, 0x20, 0x40, 0x80, 0xff], true]
  );

  nrRed = cb.reduceSquareN(1, 1);
  testResult(
    "TEST reduceSquareN(1,1)",
    [nrRed, 1],
    [cb.board.slice(9, 18), [0x1, 0x2, 0x4, 0x8, 0x100, 0x20, 0x40, 0x80, 0x10], true]
  );

  nrRed = cb.reduceSquareN(2, 2);
  testResult(
    "TEST reduceSquareN(2,2)",
    [nrRed, 2],
    [cb.board.slice(18, 27), [0x1, 0x102, 0x4, 0x8, 0x102, 0x20, 0x40, 0x80, 0x0fd], true]
  );

  nrRed = cb.reduceSquareN(3, 5);
  testResult(
    "TEST reduceSquareN(3,5)",
    [nrRed, 5],
    [cb.board.slice(27, 36), [0x10e, 0xf0, 0xf1, 0x10e, 0xf1, 0x71, 0x10e, 0xe0, 0x10e], true]
  );

  nrRed = cb.reduceGroupN(4, 2);
  testResult(
    "TEST reduceGroupN(4,2)",
    [nrRed, 6],
    [cb.board.slice(36, 45), [0x100, 0x18, 0x100, 0x18, 0x1e7, 0x167, 0x1e6, 0x1e7, 0xa6], true]
    //0x100, 0x18, 0x118, 0x18, 0x1FF, 0x17F, 0x1FE, 0x1FF, 0xBE
  );

  nrRed = cb.reduceGroupN(5, 3);
  testResult(
    "TEST reduceGroupN(5,3)",
    [nrRed, 5],
    [cb.board.slice(45, 54), [0xa, 0x1e5, 0x1e5, 0x1e5, 0x1, 0x1e5, 0x12, 0x1e5, 0x18], true]
    //0xA, 0x1FF, 0x1FF, 0x1FF, 0x1, 0x1FF, 0x12, 0x1FF, 0x18,
  );
}

function test_trySolve() {
  // prettier-ignore
  let board = [
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x001,
    // 0x010, 0x1FF, 0x004, 0x1FF, 0x1FF, 0x1FF, 0x008, 0x1FF, 0x002,
    // 0x040, 0x1FF, 0x002, 0x008, 0x100, 0x1FF, 0x1FF, 0x010, 0x1FF,
    // 0x100, 0x1FF, 0x008, 0x1FF, 0x1FF, 0x020, 0x002, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x002, 0x1FF, 0x004, 0x020, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x040, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x010, 0x1FF, 0x002, 0x1FF, 0x080, 0x1FF,
    // 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x080, 0x004, 0x1FF, 0x020,
    // 0x020, 0x1FF, 0x100, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,

    0x008, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x004, 0x020, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x040, 0x1FF, 0x1FF, 0x100, 0x1FF, 0x002, 0x1FF, 0x1FF,
    0x1FF, 0x010, 0x1FF, 0x1FF, 0x1FF, 0x040, 0x1FF, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x008, 0x010, 0x040, 0x1FF, 0x1FF,
    0x1FF, 0x1FF, 0x1FF, 0x001, 0x1FF, 0x1FF, 0x1FF, 0x004, 0x1FF,
    0x1FF, 0x1FF, 0x001, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x020, 0x080,
    0x1FF, 0x1FF, 0x080, 0x010, 0x1FF, 0x1FF, 0x1FF, 0x001, 0x1FF,
    0x1FF, 0x100, 0x1FF, 0x1FF, 0x1FF, 0x1FF, 0x008, 0x1FF, 0x1FF,

  ];
  let cb = new CalcBoard(board, true);
  cb.initReductionPhase();
  let levelCount = [];
  let solved = cb.trySolve(levelCount);
  console.log("TEST trySolve()=>", solved, levelCount, cb.board);
}
