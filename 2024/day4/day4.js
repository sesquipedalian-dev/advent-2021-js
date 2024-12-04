
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (s) => {
    // copy the puzzle into all 8 directions we could read it in
    const myRotateRight = (s) => utils.rotateRight(s, '', '')
    const myRotateRight45 = (s) => utils.rotateRight45(s, '', '')
    const variations = [
        s,
        myRotateRight45(s),
        myRotateRight(s),
        myRotateRight45(myRotateRight(s)),
        myRotateRight(myRotateRight(s)),
        myRotateRight45(myRotateRight(myRotateRight(s))),
        myRotateRight(myRotateRight(myRotateRight(s))),
        myRotateRight45(myRotateRight(myRotateRight(myRotateRight(s)))),
    ].map(v => new utils.Grid(v.join('\n'), '', (e) => e, true))

    // variations.forEach(g => g.print())

    // iterate through the puzzle in order and count all the consecutive XMAS
    // resetting on row breaks
    let count = 0
    let last4 = ''
    variations.forEach((g, v) => g.iterate(
        (row, column, i) => {
            last4 = `${last4}${i}`.slice(-4)
            if (last4 == 'XMAS') { 
                count += 1
                // console.log('counting', v, row, column)
            }
        },
        () => last4 = ''
    ))
    return count;
}

const part2 = (s) => {
    const myRotateRight = (s) => utils.rotateRight(s, '', '')
    const myRotateRight45 = (s) => utils.rotateRight45(s, '', '')
    const variations = [
        // should diagonals count? I think so, but it doesn't pass the test case
        s,
        // myRotateRight45(s),
        myRotateRight(s),
        // myRotateRight45(myRotateRight(s)),
        myRotateRight(myRotateRight(s)),
        // myRotateRight45(myRotateRight(myRotateRight(s))),
        myRotateRight(myRotateRight(myRotateRight(s))),
        // myRotateRight45(myRotateRight(myRotateRight(myRotateRight(s)))),
    ].map(v => new utils.Grid(v.join('\n'), '', (e) => e, true))

    // variations.forEach(g => g.print())

    // iterate through the puzzle in order and count all the consecutive XMAS
    // resetting on row breaks
    let count = 0
    variations.forEach((g, v) => g.iterate(
        (row, column, i) => {
           if (i === 'M' && row <= (g.rows - 3) && column <= (g.columns - 3)) {
                // check if this is the top left of the M.S
                //                                      .A.
                //                                      M.S
                if (
                    g.at(row, column + 2) === 'S' &&
                    g.at(row + 1, column + 1) === 'A' &&
                    g.at(row + 2, column) === 'M' && 
                    g.at(row + 2, column + 2) === 'S'
                ) {
                    // g.print()
                    // console.log('counting', row, column, v)
                    count += 1
                }
           }
        }
    ))
    return count;
}

const parse = (s) => s.split('\n').filter(n => n != '');

aoc.fetchDayCodes('2024', '4').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 =  parse(codes[4])
    const p1Answer = 4
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case 1', samplePart1Answer, p1Answer);
        return;
    }

    // console.log('***************************')
    const sample2 = parse(codes[5])
    const sample2Answer = utils.parseAnswerFromEms(codes[7])
    const part1Sample2 = part1(sample2)
    if (sample2Answer != part1Sample2) { 
        console.log('failed on part 1 test case 2', sample2Answer, part1Sample2)
        return
    }

    const part2Answer = part2(sample2);
    const part2Correct = utils.parseAnswerFromEms(codes[24]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '4'), aoc.fetchDayAnswers('2024', '4')]).then(([input, answers]) => {
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
