
import {fetchDayCodes, fetchDayInput, fetchDayAnswers} from '../../util/aoc.js';
import {stringListToFirstInt} from './utils.js';

const part1 = (list) => {
    const sequenceLength = list[0].length;
    const charCountsByindex = list.reduce((accum, next) => {
        if (next.length != sequenceLength) {
            return accum;
        }

        const nextAccum = [...accum];
        next.split('').forEach((c, i) => {
            switch(c) {
                case '1':
                    nextAccum[i].ones++;
                    break;
                case '0':
                    nextAccum[i].zeroes++;
                    break;
                default:
                    break;
            }
        });
        return nextAccum;
    }, [...Array(sequenceLength)].map(() => { return {ones: 0, zeroes: 0}}));

    const [_, gamma, epsilon] = charCountsByindex.reduce(([power, gamma, epsilon], next) => {
        const valueOfThisBit =  + Math.pow(2, power);
        const nextPower = power - 1;

        if (next.ones == next.zeroes) {
            return [nextPower, gamma + valueOfThisBit, epsilon + valueOfThisBit]
        } else if (next.ones > next.zeroes) {
            return [nextPower, gamma + valueOfThisBit, epsilon];
        } else {
            return [nextPower, gamma, epsilon + valueOfThisBit];
        }
    }, [sequenceLength - 1, 0, 0]);

    return gamma * epsilon;
}

const commonBitFilter = (list, currentBit, invert) => {
    if (list.length == 1) {
        return list[0];
    }
    const sequenceLength = list[0].length;
    const charCountsByindex = list.reduce((accum, next) => {
        if (next.length != sequenceLength) {
            return accum;
        }

        const nextAccum = { ...accum };
        switch(next[currentBit]) {
            case '1':
                nextAccum.ones++;
                break;
            case '0':
                nextAccum.zeroes++;
                break;
            default:
                break;
        }
        return nextAccum;
    }, {ones: 0, zeroes: 0});

    var mostCommonChar = '1';
    if (charCountsByindex.zeroes > charCountsByindex.ones) {
        mostCommonChar = '0';
    }

    const newList = list.filter(l => {
        if (invert) { 
            return l[currentBit] != mostCommonChar;
        } else {
            return l[currentBit] == mostCommonChar;
        }
    });
    return commonBitFilter(newList, currentBit + 1, invert);
}

const part2 = (list, currentBit) => {
   const o2GenRating = commonBitFilter(list, 0, false);
   const co2ScrubRating = commonBitFilter(list, 0, true);
   return parseInt(o2GenRating, 2) * parseInt(co2ScrubRating, 2)
}


fetchDayCodes('2021', '3').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = codes[0].split("\n").filter(n => n != '');
    const p1Answer = parseInt(codes[17].split(/>|</)[2]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const p2Answer = parseInt(codes[80].split(/>|</)[2]);
    if (part2Answer != p2Answer) {
        console.log('failed on part 2 test case', part2Answer, p2Answer);
        return;
    }

    Promise.all([fetchDayInput('2021', '3'), fetchDayAnswers('2021', '3')]).then(([input, answers]) => {
        const list_of_ints = input.split("\n").filter(n => n != '');
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
