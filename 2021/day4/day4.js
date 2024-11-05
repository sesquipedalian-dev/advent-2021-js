import aoc from '../../util/aoc.js';
import utils from './utils.js';

const checkBoardRowsForNumber = (boardRows, checkForMe) => {
  // console.log('called with', boardRows, checkForMe);
  let finished = false;
  boardRows.forEach((r) => {
    // console.log('comparing', r[0], checkForMe, r[0] == checkForMe)
    if (r[0] == checkForMe) {
      // console.log('found it')
      r.shift();
      if (r.length < 1) {
        finished = true;
      }
    }
  });
  if (finished) {
    // score is the sum of remaining numbers in other rows
    const s = boardRows.reduce((sum, row) => sum + row.reduce((sum, n) => sum + parseInt(n), 0), 0);
    // console.log('sum', s);
    return s;
  }

  return 0;
};

const part1 = ([foundNumbers, boardRows, boardColumns]) => foundNumbers.reduce((sum, found) => {
  if (sum > 0) {
    return sum;
  }

  // console.log('iteration', JSON.stringify(boardRows[2])) ;;
  for (let b = 0; b < boardRows.length; b++) {
    const rowsScore = checkBoardRowsForNumber(boardRows[b], found);
    if (rowsScore > 0) {
      return rowsScore * found;
    }
    const colsScore = checkBoardRowsForNumber(boardColumns[b], found);
    if (colsScore > 0) {
      return colsScore * found;
    }
  }
}, 0);

const part2 = ([foundNumbers, boardRows, boardColumns]) =>
// console.log('called with', foundNumbers);
// console.log('lakdsjlfkja', boardRows);
  foundNumbers.reduce(([sum, finishedBoards], found) => {
    // console.log('iteration', found, sum, finishedBoards, JSON.stringify(boardColumns));
    // if (sum > 0) {
    //     console.log('next loop 1');
    //     return [sum, []]
    // }
    if (finishedBoards.reduce((soFar, n) => soFar && n, true)) {
      // console.log('finished');
      return [sum, finishedBoards];
    }

    // console.log('iteration', JSON.stringify(boardRows[2])) ;;
    let newScore = 0;
    const newFinishedBoards = [...finishedBoards];
    for (let b = 0; b < boardRows.length; b++) {
      if (finishedBoards[b]) {
        // console.log('next loop 4');
        continue;
      }

      const rowsScore = checkBoardRowsForNumber(boardRows[b], found);
      if (rowsScore > 0) {
        // console.log("did we finish a board?", rowsScore, b, finishedBoards.length, boardRows.length);
        // console.log('next loop 2');
        // OK, so this is not allowing columns on the other place to be marked
        newScore = rowsScore * found;
        newFinishedBoards[b] = true;
      }
      const colsScore = checkBoardRowsForNumber(boardColumns[b], found);
      if (colsScore > 0) {
        // console.log('next loop 3');
        newScore = colsScore * found;
        newFinishedBoards[b] = true;
      }
    }
    // console.log('next loop 6', newFinishedBoards)
    return [newScore, newFinishedBoards];
  }, [0, [...Array(boardRows.length)]])[0];

const parse = (lines) => {
  const foundNumbers = utils.stringListToFirstInt(lines.shift().split(',').filter((n) => n != ''));

  // get board
  let boards = [];
  while (lines.length > 0) {
    const next = lines.shift();
    if (next == '') {
      boards.push([]);
      continue;
    }
    boards[boards.length - 1].push(next);

    // const lineNumbers = utils.stringListToFirstInt(next.split(/\s+/));
    // lineNumbers.sort((a, b) => foundNumbers.indexOf(a) - foundNumbers.indexOf(b));
    // boards[boards.length - 1].push(lineNumbers);
  }
  boards = boards.filter((b) => b.length > 0);

  // order board in order it's found in found number list
  const rowBoards = boards.map((rows) => rows.map((r) => {
    // console.log('r?', r);
    const nums = utils.stringListToFirstInt(r.split(/\s+/));
    nums.sort((a, b) => foundNumbers.indexOf(a) - foundNumbers.indexOf(b));
    return nums;
  }));

  // find columns by rotating, then performing the same order in found number list
  const columnBoards = boards.map((rows) => utils.rotateRight(rows).map((c) => {
    const nums = utils.stringListToFirstInt(c.split(/\s+/));
    nums.sort((a, b) => foundNumbers.indexOf(a) - foundNumbers.indexOf(b));
    return nums;
  }));

  // columns
  return [foundNumbers, rowBoards, columnBoards];
};

aoc.fetchDayCodes('2021', '4').then((codes) => {
  // console.log('all the codes', codes.map((c, i) => [c, i]));
  // return;

  const sample1 = codes[0].split('\n');
  const parsedSample1 = parse(sample1);
  // console.log('parsed!', JSON.stringify(parsedSample1));
  // return;
  const p1Answer = parseInt(codes[19].split(/>|</)[2]);
  const samplePart1Answer = part1(parsedSample1);

  if (samplePart1Answer != p1Answer) {
    console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
    return;
  }

  const part2Answer = part2(parse(codes[0].split('\n')));
  const p2Answer = parseInt(codes[23].split(/>|</)[2]);
  if (part2Answer != p2Answer) {
    console.log('failed on part 2 test case', part2Answer, p2Answer);
    return;
  }

  Promise.all([aoc.fetchDayInput('2021', '4'), aoc.fetchDayAnswers('2021', '4')]).then(([input, answers]) => {
    const parsed = parse(input.split('\n'));
    const answer2 = part1(parsed);
    let answer2Right;
    if (answers.length > 0) {
      answer2Right = answers[0] == answer2.toString();
    }
    console.log('part 1 answer', answer2, answer2Right);

    const answer3 = part2(parse(input.split('\n')));
    let answer3Right;
    if (answers.length > 1) {
      answer3Right = answers[1] == answer3.toString();
    }
    console.log('part 2 answer', answer3, answer3Right);
  });
});

// note: can only submit once since the submit input disappears
