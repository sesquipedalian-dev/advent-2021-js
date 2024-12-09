
import aoc from '../../util/aoc.js';
import utils from './utils.js';
import fs from 'node:fs/promises';

const print = ({blocks, gaps}) => { 
    for (var i = 0; i < blocks.length; i++) {
        // first print block repr
        for (var b = 0; b < blocks[i].size; b++) {
            process.stdout.write(`${blocks[i].id}`)
        }

        // then gap
        if (i >= gaps.length) {
            continue 
        }

        for (var b = 0; b < gaps[i].size; b++) {
            if (b < gaps[i].filled.length) { 
                process.stdout.write(`${gaps[i].filled[b]}`)
            } else { 
                process.stdout.write('.')
            }
        }
    }
    process.stdout.write('\n')
}

const checksum = ({blocks, gaps}) => { 
    let checksum = 0
    let j = 0
    for (var i = 0; i < blocks.length; i++) {
        // first print block repr
        for (var b = 0; b < blocks[i].size; b++) {
            checksum += j * blocks[i].id
            j++
        }

        // then gap
        if (i >= gaps.length) {
            continue 
        }

        for (var b = 0; b < gaps[i].size; b++) {
            if (b < gaps[i].filled.length) { 
                checksum += j * gaps[i].filled[b]
                j++
            } else { 
                j++
            }
        }
    }

    return checksum
}

const part1 = ({blocks, gaps}) => {
    // print({blocks, gaps})

    // fill in first gap from end of blocks
    for (var gI = 0; gI < gaps.length; gI++) {
        for (var b = 0; b < gaps[gI].size;) {
            // console.log('blocks reverse?', typeof blocks, blocks)
            let blockToFill = -1
            for (var j = blocks.length - 1; j > gI; j--){
                if(blocks[j].size > 0) { 
                    blockToFill = j
                    break
                }
            }
            if(blockToFill <= 0) {
                break
            }

            // console.log('did we find it?', blocks[blockToFill])
            const amountToFill = Math.min(gaps[gI].size - b, blocks[blockToFill].size)
            for (var i = 0; i < amountToFill; i++) { 
                gaps[gI].filled.push(blocks[blockToFill].id)
            }
            blocks[blockToFill].size -= amountToFill
            b += amountToFill
        }
        // print({blocks, gaps})
    }

    // count up the 'checksum'
    // print({blocks, gaps})
    return checksum({blocks, gaps})
}

const part2 = () => {
    return null;
}

const parse = (input) => { 
    const ints = input.split('').filter(n => n != '').map(n => parseInt(n))
    const blocks = ints.map((v, i) => [v, i]).filter(([_, i]) => i % 2 === 0).map(([v, _], i) => ({id: i, size: v}))
    const gaps = ints.map((v, i) => [v, i]).filter(([_, i]) => i % 2 === 1).map(([v, _]) => ({size: v, filled: []}))
    return {blocks, gaps}
}

aoc.fetchDayCodes('2024', '9').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample0 = parse('12345')
    const sample0Ans = part1(sample0)
    const sample0Real = 60
    if(sample0Ans != sample0Real) { 
        console.log('failed on part 1 test case 0', sample0Ans, sample0Real)
        return
    }

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[22]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // 10 10 10 10 10 10 10 10 10 10 10
    // just 0 + 1 + 2 ... 10, or (n=10) n(n+1) / 2 = 110/2 = 55
    // 0^2 + 1^2 + 2^2 ... 10^2
    const sample2 = parse('1010101010101010101010')
    const sample2Ans = part1(sample2)
    const sample2Real = [...Array(10)].reduce((accum, _, n) => accum + (Math.pow(n + 1, 2)), 0)
    if (sample2Ans != sample2Real) { 
        console.log('failed part 1 test case 2', sample2Ans, sample2Real)
        return 
    }
    // return

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '9'), aoc.fetchDayAnswers('2024', '9')]).then(async ([_, answers]) => {
        const input = await fs.readFile('./2024/day9/input.txt', {encoding: 'utf8'})
        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', Number.MAX_SAFE_INTEGER, answer2, answer2Right);

        // const answer3 = part2(list_of_ints);
        // let answer3Right;
        // if (answers.length > 1) { 
        //     answer3Right = answers[1] == answer3.toString();
        // }
        // console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
