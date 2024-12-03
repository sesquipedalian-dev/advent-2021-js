
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (ops) => {
    // console.log('all pairs', muls)
    return ops.reduce((accum, {op, lhs, rhs}) => op === OPS.mul ? accum + (lhs * rhs) : accum, 0)
}

const part2 = (ops) => {
    return ops.reduce(({accum, enabled}, {op, lhs, rhs}) => {
        // console.log('part2 iteration', accum, enabled, op, lhs, rhs)
        if (op === OPS.mul && enabled) { 
            return {accum: accum + (lhs * rhs), enabled: true}
        }

        if (op === OPS.dont) {
            return {accum, enabled: false}
        }

        if (op === OPS.do) { 
            return {accum, enabled: true}
        }

        return {accum, enabled}
    }, {accum: 0, enabled: true})['accum']
}

const mulRegex = /(mul\((\d+),(\d+)\))|(do\(\))|(don\'t\(\))/g
const OPS = {
    mul: 'mul', 
    do: 'do', 
    dont: 'dont'
}

const parse = (s) => { 
    return [...s.matchAll(mulRegex)].map(([_all, _isMul, mulLhs, mulRhs, isDo, isDont]) => {
        // console.log('parse', _all, _isMul, mulLhs, mulRhs, isDo, isDont)
        if (isDont) {
            return {op: OPS.dont}
        } 

        if (isDo) { 
            return {op: OPS.do}
        }

        return {op: OPS.mul, lhs: parseInt(mulLhs), rhs: parseInt(mulRhs)}
    })
}

aoc.fetchDayCodes('2024', '3').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[15])
    const p1Answer = utils.parseAnswerFromEms(codes[17]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const sample2 = parse(codes[28])
    const part2Answer = part2(sample2);
    const part2Correct = utils.parseAnswerFromEms(codes[34]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '3'), aoc.fetchDayAnswers('2024', '3')]).then(([input, answers]) => {
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
