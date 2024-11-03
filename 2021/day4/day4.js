
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = () => {
    return null;
}

const part2 = () => {
    return null;
}

const parse = (lines) => {
    const foundNumbers = utils.stringListToFirstInt(lines.shift().split(',').filter(n => n != ''));

    const boards = [];
    while(lines.length > 0) {
        const next = lines.shift();
        if (next == '') {
            boards.push([]);
            continue;
        }

        const lineNumbers = utils.stringListToFirstInt(next.split(/\s+/));
        lineNumbers.sort((a, b) => foundNumbers.indexOf(a) - foundNumbers.indexOf(b));
        boards[boards.length - 1].push(lineNumbers);
    }
    return [foundNumbers, boards];
}

aoc.fetchDayCodes('2021', '4').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = codes[0].split("\n");
    const parsedSample1 = parse(sample1);
    console.log('parsed!', parsedSample1);
    return;
    const p1Answer = parseInt(codes[19].split(/>|</)[2]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const part2Answer = part2(sample1);
    // if (part2Answer != codes[26]) {
    //     console.log('failed on part 2 test case', part2Answer, codes[26]);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2021', '4'), aoc.fetchDayAnswers('2021', '4')]).then(([input, answers]) => {

        const list_of_ints = utils.stringListToFirstInt(input.split("\n"));
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        // const answer3 = part2(list_of_ints);
        // let answer3Right;
        // if (answers.length > 1) { 
        //     answer3Right = answers[1] == answer3.toString();
        // }
        // console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
