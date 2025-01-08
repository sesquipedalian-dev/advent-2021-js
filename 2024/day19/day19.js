
import aoc from '../../util/aoc.js';
import utils from './utils.js';

import {isMatch} from 'super-regex';


const part1 = ({regex, designs}) => {
    // console.log('part 1 start', regex, designs)
    return designs.filter(d => {
        const possible = isMatch(regex, d, {timeout: 500})
        return possible
    }).length
}

var waysMemo = {}
const countWays = (design, options) => { 
    if(waysMemo[JSON.stringify({design, options})]){
        // console.log('cache hit', design)
        return waysMemo[JSON.stringify({design, options})]
    }
    // for each option, if design starts with option it is possible
    // after starting with the option
    // if there's no remaining string, that's one way to generate the design
    // if there IS a remaining string, recurse if the remaining string can be generated with the options. If so, then this is one way.

    // console.log('cache miss', design)
    const result =  options.reduce((accum, option) => { 
        if(design.indexOf(option) == 0){
            const remainder = design.slice(option.length)
            if (remainder.length == 0) { 
                return accum + 1
            } else {
                return accum + countWays(remainder, options)
            }
        }
        return accum
    }, 0)
    waysMemo[JSON.stringify({design, options})] = result
    return result
}

const part2 = ({regex, designs, options}) => {
    // console.log('part 2 start', regex, designs, options)
    waysMemo = {}
    return designs.reduce((accum, d) => {
        const possible = isMatch(regex, d, {timeout: 500})
        if(possible) { 
            return accum + countWays(d, options)
        }
        return accum + (possible ? 1 : 0)
    }, 0)
}

const parse = (input) => { 
    var regex;
    const designs = []
    const options = []
    utils.parseSeparatedSections({
        input,
        parsers: [
            (l) => { 
                const split = l.split(', ')
                const rPart = split.join(')|(')
                regex = new RegExp(`^((${rPart}))*$`)
                split.forEach(option => options.push(option))
            },
            (l) => designs.push(l)
        ]
    })
    return {regex, designs, options}
}

aoc.fetchDayCodes('2024', '19').then(codes => { 
    // console.log('all the codes', codes.slice(50).map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[12])
    const p1Answer = utils.parseAnswerFromEms(codes[43]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[116]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '19'), aoc.fetchDayAnswers('2024', '19')]).then(([input, answers]) => {

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
