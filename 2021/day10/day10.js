
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const CLOSERS = ']})>'.split('')
const OPENERS = '[{(<'.split('')
const POINTS = [57, 1197, 3, 25137]
const OPENER_POINTS = [2, 3, 1, 4]

const part1 = (lines) => {
    // console.log('part 1', lines)
    return lines.reduce((sum, line) => {
        // console.log('**************************', line)
        return sum + line.reduce(([found, stack], item) => {
            if(found > 0) {
                return [found]
            }

            if (OPENERS.indexOf(item) >= 0) {
                return [0, [...stack, item]]
            }

            const currentOpenerIndex = OPENERS.indexOf(stack[stack.length - 1])
            const closerIndex = CLOSERS.indexOf(item)
            if (currentOpenerIndex != closerIndex) { 
                // found the problem
                return [POINTS[closerIndex]]
            }

            // pop the stack
            return [0, stack.slice(0, stack.length - 1)]
        }, [0, []])[0]
    }, 0)
}

const part2 = (lines) => {
    // so part 2, we still need a stack
    // now throw out / skip corrupted lines instead
    // for lines that finish with a non-empty stack, we simply pop the stack,
    // lookup the opener points corresponding to those entries, then convert those digits to base 5
    // to get the score for that line 
    // then we sort the lines by score, 
    // and return the middle score Math.floor(score.length / 2), since it's guaranteed to be an odd number of incomplete lines

    const completionScores = lines.reduce((scores, line, index) => {
        const remainingOpeners = line.reduce(([done, stack], item) => {
            if(done) { 
                return [true, []]
            }

            if (OPENERS.indexOf(item) >= 0) {
                return [false, [...stack, item]]
            }

            const currentOpenerIndex = OPENERS.indexOf(stack[stack.length - 1])
            const closerIndex = CLOSERS.indexOf(item)
            if (currentOpenerIndex != closerIndex) { 
                // we want to skip this line, so bail out with an empty stack
                return [true, []]
            }

            // pop the stack
            return [false, stack.slice(0, stack.length - 1)]
        }, [false, []])[1]
        
        if (remainingOpeners.length > 0) { 
            let digits = ''
            while(remainingOpeners.length > 0) { 
                const opener = remainingOpeners.pop()
                const index = OPENERS.indexOf(opener)
                digits += OPENER_POINTS[index]
            }
            // console.log('completion score', index, digits, parseInt(digits, 5))
            return [...scores, parseInt(digits, 5)]
        }

        return [...scores]
    }, [])

    completionScores.sort((a,b) => a-b)
    return completionScores[Math.floor(completionScores.length / 2)]
}


aoc.fetchDayCodes('2021', '10').then(codes => { 
    // console.log('all the codes', codes.slice(50).map((c, i) => [c, i]));
    // return;

    const sample1 = codes[20].replaceAll('&lt;', '<').replaceAll('&gt;', '>').split('\n').map(l => l.split('')).filter(l => l.length > 0)
    const p1Answer = utils.parseAnswerFromEms(codes[52]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[101]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '10'), aoc.fetchDayAnswers('2021', '10')]).then(([input, answers]) => {
        const list_of_ints = input.replaceAll('&lt;', '<').replaceAll('&gt;', '>').split('\n').map(l => l.split('')).filter(l => l.length > 0)
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
