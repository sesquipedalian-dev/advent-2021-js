
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (lineSegments, skipDiagonal = true) => {
    const pointCounts = lineSegments.reduce((accum, next) => 
        { 
            if (skipDiagonal && next.from.x != next.to.x && next.from.y != next.to.y) {
                // console.log('iteration b4', next)
                return accum
            }

            const newAccum = {...accum}
            let curPoint = {...next.from}
            while(!(curPoint.x === next.to.x && curPoint.y === next.to.y)) {
                // console.log('tagging', next.from, next.to, curPoint.x, curPoint.y);
                newAccum[[curPoint.x, curPoint.y]] = (newAccum[[curPoint.x, curPoint.y]] || 0) + 1 
                curPoint =  {
                    x: curPoint.x + Math.sign(next.to.x - curPoint.x),
                    y: curPoint.y + Math.sign(next.to.y - curPoint.y),
                }
            }
            newAccum[[curPoint.x, curPoint.y]] = (newAccum[[curPoint.x, curPoint.y]] || 0) + 1 
            return newAccum;
        },
        // map from [x,y] to count of seen 
        {}
    );
    return Object.entries(pointCounts).reduce((accum, [p, count]) => {
        if (count <= 1) { 
            return accum
        }
        // console.log('reducing', p, count)
        return accum + 1
    }, 0);
}

const part2 = (lineSegments) => {
    return part1(lineSegments, false)
}

// e.g. 0,9 -> 3,4 returns {from: [0,9], to: [3, 4]}
const parse = (string) => {
    const parts = string.split(/\s*(,|->|-&gt;)\s*/);
    // console.log('parse parts', parts)
    return {
        from: {x: parseInt(parts[0], 10), y: parseInt(parts[2], 10)},
        to: {x: parseInt(parts[4], 10), y: parseInt(parts[6], 10)},
    }
}

aoc.fetchDayCodes('2021', '5').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = codes[0].split("\n").filter(n => n != '').map(parse)
    const p1Answer = utils.parseAnswerFromEms(codes[25]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', sample1, samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[37])
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '5'), aoc.fetchDayAnswers('2021', '5')]).then(([input, answers]) => {
        const list_of_ints = input.split("\n").filter(n => n != '').map(parse)
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
