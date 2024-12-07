
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const canItOperate = (testValue, items, part2) => { 
    // console.log('canItOperate recur', testValue, items)
  
    const [first, second, ... rest] = items
    const sum = first + second
    const product = first * second
    const concat = (first * Math.pow(10, `${second}`.length)) + second
    // console.log('concat', first, second, concat)

    if (items.length == 2) { 
        // two cases
        // product = 400 = 10 * (), so check if remainder matches testValue / lhs
        // sum = 40 = 10 + (), so check if remainder matches testValue - lhs
        return (sum === testValue || product == testValue || (part2 && concat == testValue))
    }

    // for longer items, we have to try first+second and first * second with the rest
    return canItOperate(testValue, [sum, ...rest], part2) || canItOperate(testValue, [product, ...rest], part2) || (part2 && canItOperate(testValue, [concat, ...rest], part2))
}

const part1 = (equations) => {
    return equations.reduce((accum, {testValue, items}) => {
        if(canItOperate(testValue, items)) { 
            return accum + testValue
        }

        return accum
    }, 0)
}

const part2 = (equations) => {
    return equations.reduce((accum, {testValue, items}) => {
        if(canItOperate(testValue, items, true)) { 
            return accum + testValue
        }

        return accum
    }, 0)
}

const parse = (lines) => { 
    return lines.split("\n").filter(n => n != "").map(l => { 
        const [testValueS, items] = l.split(': ')
        const testValue = parseInt(testValueS)
        return {testValue, items: items.split(/\s+/).filter(n => n != "").map(n => parseInt(n))}
    })
}

aoc.fetchDayCodes('2024', '7').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[16]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[30]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '7'), aoc.fetchDayAnswers('2024', '7')]).then(([input, answers]) => {

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
