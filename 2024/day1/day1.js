
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (pairs) => {
    const list1 = pairs.map(([x]) => x).toSorted()
    const list2 = pairs.map(([_, y]) => y).toSorted()

    return utils.initArray(list1.length, (i) => i).reduce((sum, i) => { 
        return Math.abs(list1[i] - list2[i]) + sum
    }, 0)
}

const part2 = (pairs) => {
    const list1 = pairs.map(([x]) => x)
    const counts = pairs.reduce((accum, [_, y]) => ({...accum, [y]: (accum[y] ||0) + 1}), {})

    return list1.reduce((accum, n) => {
        return accum + (n * (counts[n] || 0))
    }, 0)
}

const parse = (lines) => lines.split("\n").filter(l => l != '').map(l => l.split(/\s+/).map(n => parseInt(n)).filter(n => n > 0))
aoc.fetchDayCodes('2024', '1').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[25]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', sample1, samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[39]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '1'), aoc.fetchDayAnswers('2024', '1')]).then(([input, answers]) => {

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
