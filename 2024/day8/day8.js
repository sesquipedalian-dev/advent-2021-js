
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({rows, columns, antennae}) => {
    // console.log('part1 inputs', JSON.stringify(rows), JSON.stringify(columns), JSON.stringify(antennae))

    const locations = {}
    antennae.forEach((lhs, i) => antennae.slice(i + 1).forEach(rhs => { 
        if(rhs.value != lhs.value) { 
            return
        }

        const dRow = lhs.row - rhs.row
        const dColumn = lhs.column - rhs.column
        
        // first
        const anti1Row = lhs.row - 2 * dRow
        const anti1Col = lhs.column - 2 * dColumn
        if (0 <= anti1Row && anti1Row < rows && 0 <= anti1Col && anti1Col < columns) { 
            locations[`${anti1Row},${anti1Col}`] = 1
        }

        // second
        const anti2Row = rhs.row + 2 * dRow
        const anti2Col = rhs.column + 2 * dColumn
        if (0 <= anti2Row && anti2Row < rows && 0 <= anti2Col && anti2Col < columns) { 
            locations[`${anti2Row},${anti2Col}`] = 1
        }
    }))
    // console.log('results', locations)
    return Object.keys(locations).length
}

const part2 = ({rows, columns, antennae}) => {
 
    const locations = {}
    antennae.forEach((lhs, i) => antennae.slice(i + 1).forEach(rhs => { 
        if(rhs.value != lhs.value) { 
            return
        }

        const dRow = lhs.row - rhs.row
        const dColumn = lhs.column - rhs.column
        
        // first
        let anti1Row = lhs.row - dRow
        let anti1Col = lhs.column - dColumn
        while (0 <= anti1Row && anti1Row < rows && 0 <= anti1Col && anti1Col < columns) { 
            locations[`${anti1Row},${anti1Col}`] = 1
            anti1Row -= dRow
            anti1Col -= dColumn
        }

        // second
        let anti2Row = rhs.row + dRow
        let anti2Col = rhs.column + dColumn
        while (0 <= anti2Row && anti2Row < rows && 0 <= anti2Col && anti2Col < columns) { 
            locations[`${anti2Row},${anti2Col}`] = 1
            anti2Row += dRow
            anti2Col += dColumn
        }
    }))
    // console.log('results', locations)
    return Object.keys(locations).length
}

const antennaRegex = /[a-zA-Z0-9]/
const parse = (input) => {
    const lines = input.split("\n").filter(n => n != '')
    const rows = lines.length
    const antennae = lines.reduce((accum, line, row) => [
        ...accum,
        ...line.split('').map((c, i) => [c, i]).filter(([c]) => c.match(antennaRegex)).map(([value, column]) => ({row, column, value}))
    ], [])
    return {
        rows,
        columns: lines[0].length,
        antennae
    }
}

aoc.fetchDayCodes('2024', '8').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[14]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const p2Answer1 = part2(parse(codes[17]))
    const p2Real1 = utils.parseAnswerFromEms(codes[19])
    if (p2Answer1 != p2Real1) { 
        console.log('failed on part 2 test case 1', p2Answer1, p2Real1)
        return
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[20]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case 2', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '8'), aoc.fetchDayAnswers('2024', '8')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2(list_of_ints);
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
