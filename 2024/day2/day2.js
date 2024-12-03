
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    let safeCount = grid.rows
    // console.log('initial safe count', safeCount)
    let previous = undefined
    let skip = false
    let direction = undefined
    grid.iterate((r, c, i) => {
        let e = i - previous
        let m = Math.abs(e)
        let d = Math.sign(e)
        // console.log('iteration', previous, direction, skip, i, e, m, d, previous && !skip, m > 3)
        if (previous && !skip) { 
            // console.log('we should be skipping here', m < 1, m > 3, (direction && (d != direction)),
                // m < 1 || m > 3 || (direction && (d != direction))
            // )
            if(m < 1 || m > 3 || (direction && (d != direction))) { 
                safeCount -= 1
                skip = true
            }
        }
        previous = i
        direction = d
    }, () => { previous = undefined; skip = false })
    // console.log('iteration final', skip, safeCount)
    return safeCount;
}

const checkReport = (row) => { 
    // console.log(`checkReport called`, row)
    let previous = undefined
    let skip = false
    let direction = undefined
    row.forEach(i => {
        let e = i - previous
        let m = Math.abs(e)
        let d = Math.sign(e)
        // console.log('iteration', previous, direction, skip, i, e, m, d, removedOne)
        if (previous && !skip) { 
            if(m < 1 || m > 3 || (direction && (d != direction))) { 
                skip = true
            }
        }
        previous = i
        direction = d
    })
    // console.log('row is skip?', row, skip)
    return !skip
}

function *sliceGenerator(row) { 
    let index = 0
    while(index < row.length) { 
        yield [...row.slice(0, index), ...row.slice(index + 1)]
        index += 1
    }
}

const part2 = (grid) => {
    return [...grid.items].reduce((accum, row) => { 
        if(checkReport(row)) { 
            return accum + 1
        }
        const slices = sliceGenerator(row)
        while(true) { 
            const {value, done} = slices.next()
            if(done) { 
                break
            }
            if(checkReport(value)) {
                return accum + 1
            }
        }
        return accum
    }, 0)
}


aoc.fetchDayCodes('2024', '2').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = new utils.Grid(codes[0], /\s+/, (i) => parseInt(i))
    const p1Answer = utils.parseAnswerFromEms(codes[12]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case 1', samplePart1Answer, p1Answer);
        return;
    }

    const sample2 = new utils.Grid(`1 3 5 7 5\n1 3 4 5 9`, /\s+/, (i) => parseInt(i))
    const sample2Answer = part1(sample2)
    if(sample2Answer != 0) {
        console.log('failed on part 1 test case 2', sample2Answer, 0)
        return
    }
    
    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[22]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case 1', part2Answer, part2Correct);
        return;
    }

    const sample3 = new utils.Grid(`9 1 2 3 4`, /\s+/, (i) => parseInt(i))
    const part1Three = part1(sample3)
    const part2Three = part2(sample3)

    if (part1Three != 0) { 
        console.log('failed on part 1 test case 3', part1Three, 0)
        return 
    }

    if (part2Three != 1) { 
        console.log('failed on part 2 test case 2', part2Three, 1)
        return
    }

    const sample4 = new utils.Grid(`1 2 3 4 9`, /\s+/, (i) => parseInt(i))
    const part2Four = part2(sample4)
    if (part2Four != 1) { 
        console.log('failed on part 2 test case 3', part2Four, 1)
    }

    Promise.all([aoc.fetchDayInput('2024', '2'), aoc.fetchDayAnswers('2024', '2')]).then(([input, answers]) => {
        const list_of_ints = new utils.Grid(input, /\s+/, (i) => parseInt(i))
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        // 290 + 291 are too low; 477 is too high 
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2(list_of_ints);
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        // 497, 510 is too low
        // 615 is too high 
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
