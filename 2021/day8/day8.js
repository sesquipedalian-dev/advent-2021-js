
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

const part2 = (entries) => {
    // ok, so
    // the numbers with unique counts of segments (1,4,7,8) cover the range of segments
    // 1 -> (2) -> cf 
    // 4 -> (4) -> bcdf
    // 7 -> (3) -> acf
    // 8 -> (7) -> abcdefg
    //
    // I think we should basically assume each of the entries has an '8' in it, to give us the mappings
    // it wouldn't make sense to have lines with other unique count numbers in it that add up to the full 
    // picture, because none of the other examples light up 'e'.
    //
    // we only need to identify the 8, use it to generate a mapping, translate the digits in the 'output values'
    // then sum them all up
    //
    // wait no, 8 is the only number that ISN'T useful since it contains all of 'em
    //
    return entries.reduce((sum, {allValues, outputValues}) => {
        // find the items that are the right length for all of the unique ones
        const uniqueOnes = allValues.reduce((accum, next) => {
            switch(next.length){
                case 2:
                    accum[0] = next.split('').toSorted()
                    break;
                case 3:
                    accum[1] = next.split('').toSorted()
                    break;
                case 4:
                    accum[2] = next.split('').toSorted()
                    break;
                case 7:
                    accum[3] = next.split('').toSorted()
                    break;
            }
            return accum
        }, ['', '', '', ''])
        if (!uniqueOnes.reduce((accum, next) => accum && next != '', true)) {
            console.log("here's aline without all the uniques", allValues)
        }

        const digits = outputValues.reduce((digits, next) => {
            let nextDigit = '';
            const nextChars = next.split('')
            switch(next.length) {
                case 2:
                    nextDigit = '1'
                    break;
                case 3:
                    nextDigit = '7'
                    break;
                case 4:
                    nextDigit = '4'
                    break;
                case 5:
                    // 2 -> 5 -> acdeg - has one letter it shares a letter with all 3 of 1, 4, 7, and one in all of those that it doesn't have
                    // 3 -> 5 -> acdfg - has both letters in 1
                    // 5 -> 5 -> abdfg - etc
                    if (utils.intersection(nextChars, uniqueOnes[0]).length == 2) {
                        nextDigit = '3'
                    } else if (utils.intersection(nextChars, uniqueOnes[2]).length == 3) {
                        nextDigit = '5'
                    } else {
                        nextDigit = '2'
                    }
                    // console.log('found 5 length next digit?', nextDigit, next)
                    break;
                case 6:
                    // 0 -> 6 -> abcefg - has both letter in 1 and not 9
                    // 6 -> 6 -> abdefg - other length 6
                    // 9 -> 6 -> abcdfg - length 6 and has all the letters in 4
                    if(utils.intersection(nextChars, uniqueOnes[2]).length == 4) {
                        nextDigit = '9'
                    } else if (utils.intersection(nextChars, uniqueOnes[0]).length == 2) {
                        nextDigit = '0'
                    } else {
                        nextDigit = '6'
                    }
                    // console.log('found 6 length', nextDigit, next)
                    break;
                case 7:
                    nextDigit = '8'
                    break;

            }
            return digits + nextDigit
        }, '')

        return sum + parseInt(digits, 10)
    }, 0);
}

const parse = (lines) => { 
    return lines.filter(l => l != '').map(l => { 
        const stripEms = l.replaceAll('<em>', '').replaceAll('</em>', '')
        const [_, outputs] = stripEms.split(/\s+\|\s+/).map(p => p.trim())
        // console.log('line process', l, stripEms, 'but', outputs);
        return {
            allValues: stripEms.split(/\s+/).filter(n => n != '|'),
            outputValues: outputs.split(/\s+/)
        }
    })
}

aoc.fetchDayCodes('2021', '8').then(codes => { 
    // console.log('all the codes', codes.slice(50).map((c, i) => [c, i]));
    // return;

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

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[102]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '8'), aoc.fetchDayAnswers('2021', '8')]).then(([input, answers]) => {
        const list_of_ints = parse(input.split("\n"));
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
