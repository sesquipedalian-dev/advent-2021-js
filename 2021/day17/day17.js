
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({xMin, xMax, yMin, yMax}) => {
    // console.log('part1 inputs', xMin, xMax, yMin, yMax)
    const n = -yMin - 1
    return n * (n + 1) / 2
}

const part2 = ({xMin, xMax, yMin, yMax}) => {
    let count = 0
    for(var vx = 0; vx <= xMax; vx += 1) {
        for(var vy = yMin; vy <= (-yMin - 1); vy += 1) {
            // console.log('checking initial', vx, vy)
            // simulate with initial velocity vx and vy
            let dx = vx
            let dy = vy
            let x = 0
            let y = 0

            while(x < xMax && y > yMin) {
                x = x + dx
                y = y + dy
                if ( xMin <= x && x <= xMax && yMin <= y && y <= yMax) { 
                    count += 1
                    // console.log('found')
                    break
                }
                dx = dx == 0 ? 0 : dx - 1
                dy = dy - 1
            }
        }
    }
    return count;
}

const parse = (s) => { 
    // console.log('s', s, s.split(/(x\=)|(, y=)/))
    const [_a, _b, _c, xRange, _d, _e, yRange] = s.split(/(x=)|(, y=)/)
    const [xMin, xMax] = xRange.split('..').map(p => parseInt(p))
    const [yMin, yMax] = yRange.split('..').map(p => parseInt(p))
    return {
        xMin, xMax,
        yMin, yMax
    }
}

aoc.fetchDayCodes('2021', '17').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[22])
    const p1Answer = utils.parseAnswerFromEms(codes[47]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[52]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '17'), aoc.fetchDayAnswers('2021', '17')]).then(([input, answers]) => {

        const list_of_ints = parse(input.split("\n")[0])
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
