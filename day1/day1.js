
import {fetchDayCodes, fetchDayInput} from '../util/aoc.js';
import {stringListToFirstInt} from './util.js';

const part1 = (list_of_ints) => {
    var count = 0;
    for(var i = 0; i < list_of_ints.length - 1; i++) { 
        if (list_of_ints[i] < list_of_ints[i + 1]) {
            count++;
        }
    }
    return count;
}

const part2 = (list_of_ints) => {
    var count = 0;
    var previousSum = Number.MAX_SAFE_INTEGER;
    for(var i = 0; i < list_of_ints.length - 2; i++) { 
        const sum = list_of_ints[i] + list_of_ints[i + 1] + list_of_ints[i + 2];
        if (previousSum < sum) {
            count++;
        }
        previousSum = sum;
    }
    return count;
}


fetchDayCodes('2021', '1').then(codes => { 
    // console.log('all the codes', [...codes].map((m, i) => [m[0], i]));

    const sample1 = codes.next().value[1].split("\n").map(n => parseInt(n)).filter(n => n > 0);
    const answer = [...codes].map(m => m[1]);
    const p1Answer = answer[5];
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    if (part2Answer != answer[25]) {
        console.log('failed on part 2 test case', part2Answer, answer[25]);
        return;
    }

    fetchDayInput('2021', '1').then(input => {
        const list_of_ints = stringListToFirstInt(input.split("\n"));
        const answer2 = part1(list_of_ints);
        console.log('part 1 answer', answer2);

        const answer3 = part2(list_of_ints);
        console.log('part 2 answer', answer3);
    });
})

// note: can only submit once since the submit input disappears 