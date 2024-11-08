
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const digitProps = {
    0: {
        onSegments: 'abcefg'.split(''),
        isUniqueCount: false
    },
    1: {
        onSegments: 'cf'.split(''),
        isUniqueCount: true
    },
    2: { 
        onSegments: 'acdeg'.split(''),
        isUniqueCount: false
    },
    3: { 
        onSegments: 'acdfg'.split(''),
        isUniqueCount: false
    },
    4: { 
        onSegments: 'bcdf'.split(''),
        isUniqueCount: true
    },
    5: { 
        onSegments: 'abdfg'.split(''),
        isUniqueCount: false
    },
    6: { 
        onSegments: 'abdefg'.split(''),
        isUniqueCount: false
    },
    7: { 
        onSegments: 'acf'.split(''),
        isUniqueCount: true
    },
    8: { 
        onSegments: 'abcdefg'.split(''),
        isUniqueCount: true
    },
    9: { 
        onSegments: 'abcdfg'.split(''),
        isUniqueCount: false
    },
}

const part1 = (entries) => {
    return entries.reduce((count, {outputValues}) => { 
        return count + outputValues.reduce((outputCount, outputString) => { 
            return outputCount + Object.entries(digitProps).reduce((digitCount, [_, {onSegments, isUniqueCount}]) => {
                if (isUniqueCount) { 
                    if (onSegments.length === outputString.length) {
                        return digitCount + 1
                    }
                }
                return digitCount
            }, 0);
        }, 0)
    }, 0)
}

const part2 = () => {
    return null;
}

const parse = (lines) => { 
    return lines.filter(l => l != '').map(l => { 
        const stripEms = l.replaceAll('<em>', '').replaceAll('</em>', '')
        const [_, outputs] = stripEms.split(/\s+\|\s+/).map(p => p.trim())
        // console.log('line process', l, stripEms, 'but', outputs);
        return {
            outputValues: outputs.split(/\s+/)
        }
    })
}

aoc.fetchDayCodes('2021', '8').then(codes => { 
    console.log('all the codes', codes.map((c, i) => [c, i]));
    return;

    let sample1 = codes[39].split("\n")
    // console.log('l', sample1.length / 2)
    sample1 = [...Array(Math.floor(sample1.length / 2))].map((_, i) => (
        `${sample1[i * 2]} ${sample1[(i*2)+ 1]}`
    ))
    sample1 = parse(sample1)
    const p1Answer = utils.parseAnswerFromEms(codes[45]);
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

    Promise.all([aoc.fetchDayInput('2021', '8'), aoc.fetchDayAnswers('2021', '8')]).then(([input, answers]) => {
        const list_of_ints = parse(input.split("\n"));
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
