
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (line, steps) => {
    // console.log('part1 input', line, steps)
    let items = line.split(/\s+/).filter(n => n != '').map(n => parseInt(n))
        .reduce((counts, n) => ({...counts, [n]: (counts[n] || 0) + 1}), {})

    for (var step = 0; step < steps; step++) { 
        // console.log('step', step, items)
        items = Object.entries(items).reduce((accum, [n, count]) => { 
            if(n == 0) { 
                return {...accum, 1: (accum[1] || 0) + count}
            } else if (`${n}`.length % 2 === 0) { 
                const lhs = parseInt(`${n}`.slice(0, `${n}`.length / 2))
                const rhs = parseInt(`${n}`.slice(`${n}`.length / 2))
                if(lhs == rhs) { 
                    return {...accum, [lhs]: (accum[lhs] || 0) + count * 2}
                }
                return {...accum, [lhs]: (accum[lhs] || 0) + count, [rhs]: (accum[rhs] || 0) + count}
            } else {
                return {...accum, [n * 2024]: (accum[n * 2024] || 0) + count}
            }
        }, {})
    }

    // console.log('final', step, items)
    const foo = Object.entries(items).reduce((sum, [k, count]) => {
        // console.log('counting iteration?', sum, k, count)
        return sum + count
    }, 0)

    return foo
}

const parse = (input) => { 
    return input
}

aoc.fetchDayCodes('2024', '11').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[5])
    const p1Answer = 7
    const samplePart1Answer = part1(sample1, 1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case 1', samplePart1Answer, p1Answer);
        return;
    }

    const sample2 = parse(codes[18].split('\n')[1])
    const sample2Part1Answer = part1(sample2, 25)
    const sample2Part1Real = utils.parseAnswerFromEms(codes[20])
    if (sample2Part1Answer != sample2Part1Real) { 
        console.log('failed on part 1 test case 2', sample2Part1Answer, sample2Part1Real)
        return
    }

    Promise.all([aoc.fetchDayInput('2024', '11'), aoc.fetchDayAnswers('2024', '11')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints, 25);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part1(parse(input), 75);
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
