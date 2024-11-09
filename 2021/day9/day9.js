
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    let sum = 0;
    grid.iterate((row, column, item) => {
        // console.log('iteration', row, column, item)
        if (!grid.neighboringIndexes(row, column).find(([nRow, nColumn]) => {
            // console.log('comparing neighbors', nRow, nColumn)
            // console.log('comparing n2', grid.at(nRow, nColumn), item)
            return grid.at(nRow, nColumn) <= item
        })) {
            // console.log('low point?', row, column, item, grid.neighboringIndexes(row, column).map(([nRow, nColumn]) => grid.at(nRow, nColumn)))
            sum += item + 1
        }
    })
    return sum;
}

const part2 = () => {
    return null;
}


aoc.fetchDayCodes('2021', '9').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = new utils.Grid(codes[0], '', s => parseInt(s, 10))
    const p1Answer = utils.parseAnswerFromEms(codes[11]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2021', '9'), aoc.fetchDayAnswers('2021', '9')]).then(([input, answers]) => {
        const list_of_ints = new utils.Grid(input, '', s => parseInt(s, 10))
        // list_of_ints.print()
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        // 1504 is too high
        console.log('part 1 answer', answer2, answer2Right);

        // const answer3 = part2(list_of_ints);
        // let answer3Right;
        // if (answers.length > 1) { 
        //     answer3Right = answers[1] == answer3.toString();
        // }
        // console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
