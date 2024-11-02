
import {fetchDayCodes, fetchDayInput, fetchDayAnswers} from '../../util/aoc.js';
import {stringListToFirstInt} from './utils.js';

const part1 = () => {
    return null;
}

const part2 = () => {
    return null;
}


fetchDayCodes('2021', '2').then(codes => { 
    // console.log('all the codes', codes);
    // return;

    const sample1 = codes[0].split("\n").map(n => parseInt(n)).filter(n => n > 0);
    const p1Answer = codes[6];
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    if (part2Answer != codes[26]) {
        console.log('failed on part 2 test case', part2Answer, codes[26]);
        return;
    }

    Promise.all([fetchDayInput('2021', '2'), fetchDayAnswers('2021', '2')]).then(([input, answers]) => {

        const list_of_ints = stringListToFirstInt(input.split("\n"));
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
