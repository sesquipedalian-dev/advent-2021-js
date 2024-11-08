
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (list_of_ints) => {
    // sort
    const sorted = list_of_ints.toSorted()

    // brute force - what is the target fuel number, and how many fuel steps does it take to get there? 
    // the potential range of the target number is the min and max number in the list - is that true? 
    // just try each target number, migrating each number in the list to the target position 
    // and keep track of the min fuel expenditure among these optionss
    let best = Number.MAX_SAFE_INTEGER;
    for (let targetNumber = sorted[0]; targetNumber <= sorted[sorted.length - 1]; targetNumber += 1) {
        const thisSum = sorted.reduce((sum, next) => sum + Math.abs(targetNumber - next), 0)
        if (thisSum < best) { 
            // console.log("targetNumber beats best", best, targetNumber, thisSum)
            // sorted.forEach((next) => console.log(next, targetNumber, Math.abs(targetNumber - next)))
            best = thisSum;
        }
    }
    return best;
}

const part2 = (list_of_ints) => {
    // same as part 1, but we're going to use a memoized function to calculate / cache
    // the fuel expenditure for a given distance
    const distanceToFuel = utils.memoize((distance) => [...Array(distance)].map((_, i) => i + 1).reduce((sum, next) => sum + next, 0))
    // console.log('some distances', distanceToFuel(1), distanceToFuel(2), distanceToFuel(3))

    const sorted = list_of_ints.toSorted()

    let best = Number.MAX_SAFE_INTEGER;
    for (let targetNumber = sorted[0]; targetNumber <= sorted[sorted.length - 1]; targetNumber += 1) {
        const thisSum = sorted.reduce((sum, next) => sum + distanceToFuel(Math.abs(targetNumber - next)), 0)
        if (thisSum < best) { 
            // console.log("targetNumber beats best", best, targetNumber, thisSum)
            // sorted.forEach((next) => console.log(next, targetNumber, distanceToFuel(Math.abs(targetNumber - next))))
            best = thisSum;
        }
    }
    return best;
}


aoc.fetchDayCodes('2021', '7').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = codes[0].split("\,").map(n => parseInt(n)).filter(n => n >= 0);
    const p1Answer = utils.parseAnswerFromEms(codes[34]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[76]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '7'), aoc.fetchDayAnswers('2021', '7')]).then(([input, answers]) => {
        const list_of_ints = input.split(",").map(n => parseInt(n)).filter(n => n >= 0);
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
