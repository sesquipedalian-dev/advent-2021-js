import fs from 'node:fs/promises';
import fss from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = `
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = () => {
    return null;
}

const part2 = () => {
    return null;
}

const parse = (input) => { 
    return input.split("\\n").filter(n => n != '')
}

aoc.fetchDayCodes('{year}', '{day}').then(codes => { 
    console.log('all the codes', codes.map((c, i) => [c, i]));
    return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[codes.length - 1]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('{year}', '{day}'), aoc.fetchDayAnswers('{year}', '{day}')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
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
`;

const makeYearDay = async (year, day) => {
    const outputContents = template.replaceAll('{year}', year).replaceAll('{day}', day);
    const dirname = `${__dirname}/../${year}/day${day}`;
    const filename = `day${day}.js`
    await fs.mkdir(dirname, { recursive: true});
    await fs.writeFile(`${dirname}/${filename}`, outputContents);
    const utilContents = fss.readFileSync(`${__dirname}/utils.js`, );
    await fs.writeFile(`${dirname}/utils.js`, utilContents);
    console.log(`wrote ${dirname}`);
};

makeYearDay(process.argv[2], process.argv[3]);
