
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const numeric = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['X', '0', 'A'],
]

const directional = [
    ['X', '^', 'A'],
    ['<', 'v', '>'],
]

const keyboards = [numeric, directional]

const pushSequenceOnKeyboard = ({sequence, start: [row, col], keyboardIndex}) => { 
    console.log('pushSequenceOnKeyboard args', sequence, row, col, keyboardIndex)
    const output = []
    if(sequence.length === 0) {
        return output
    }
    const nextItem = sequence[0]
    const rest = sequence.slice(1)
    const [tRow, tCol] = keyboards[keyboardIndex].reduce((accum, item, index) => { 
        if(accum != null) { 
            return accum
        }

        const posInThisArray = item.indexOf(nextItem)
        if(posInThisArray >= 0) { 
            return [index, posInThisArray]
        }
        return null
    }, null)

    // what moves do we need to get from (row, col) to (tRow, tCol)? add them to output
    // importantly, we must avoid gaps (marked with 'X')
    // basically since it's manhattan / taxicab geometry, the order of moves doesn't matter.
    // go to the correct row first, then correct column
    // if we run into a gap, instead move > first and then go to the row we were intending
    var cRow = row
    var cCol = col
    while(cRow != tRow) { 
        // 3 to 0 => -1
        const dirOfTravel = Math.sign(tRow - cRow)
        cRow = cRow + dirOfTravel
        // console.log('trying to reach keyboard key', keyboardIndex, cRow, cCol)
        if (keyboards[keyboardIndex][cRow][cCol] === 'X') {
            // first dodge around the gap
            cCol += 1
            output.push('>')
        }
        output.push(dirOfTravel > 0 ? 'v' : '^')
    }
    while(cCol != tCol) {
        const dirOfTravel = Math.sign(tCol - cCol)
        cCol = cCol + dirOfTravel
        output.push(dirOfTravel > 0 ? '>' : '<')
    }
    // then we need to push the button actually
    output.push('A')

    // recurse with rest, start: [tRow, tCol] and add all those moves to our output
    const moreOutputs = pushSequenceOnKeyboard({sequence: rest, start: [tRow, tCol], keyboardIndex})
    moreOutputs.forEach(s => output.push(s))

    return output
}

const chainedSequences = ({sequence, chainCount}) => { 
    var output = pushSequenceOnKeyboard({
        sequence,
        start: [3,2],
        keyboardIndex: 0
    })
    var currentChainCount = 1
    while(currentChainCount < chainCount) { 
        output = pushSequenceOnKeyboard({
            sequence: output,
            start: [0, 2],
            keyboardIndex: 1
        })
        chainCount++
    }
    return output
}

const part1 = () => {
    return null;
}

const part2 = () => {
    return null;
}

const parse = (input) => { 
    return input.split("\n").filter(n => n != '')
}

aoc.fetchDayCodes('2024', '21').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    // some simpler cases: sequence for pushing a code on the initial numeric keypad
    const numericSequence = codes[13]
    const numericSequenceOutput = codes[28].replaceAll('&gt;', '>').replaceAll('&lt;', '<')
    const numericSequenceAnswer = pushSequenceOnKeyboard({
        sequence: numericSequence,
        start: [3,2],
        keyboardIndex: 0
    }).join('')
    if(numericSequenceAnswer != numericSequenceOutput) { 
        console.log('failed on p0 test case 1', numericSequenceOutput, numericSequenceAnswer)
        return
    }

    const numericSequence2 = '701A'
    const numericSequenceOutput2 = '^^^<<Avv>vA^<A>v>A'
    const numericSequenceAnswer2 = pushSequenceOnKeyboard({
        sequence: numericSequence2,
        start: [3,2],
        keyboardIndex: 0
    }).join('')
    if(numericSequenceAnswer2 != numericSequenceOutput2) { 
        console.log('failed on p0 test case 2', numericSequenceOutput2, numericSequenceAnswer2)
        return
    }

    // let's test just two chains
    const chainedAnswer = chainedSequences({sequence: codes[13], chainCount: 2})
    const chainedOutput = codes[31].replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    if(chainedAnswer != chainedOutput) { 
        console.log('failed on p0 test case 3', chainedAnswer, chainedOutput)
    }

    // next let's test all 3 rounds chained together for one of the sequences
    const chainedAnswer2 = chainedSequences({sequence: codes[13], chainCount: 3})
    const chainedOutput2 = codes[34].replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    if(chainedAnswer2 != chainedOutput2) { 
        console.log('failed on p0 test case 3', chainedAnswer2, chainedOutput2)
    }

    // finally run the chains for all sequence and calculate the complexity value
    const sample1 = parse(codes[39])
    const p1Answer = utils.parseAnswerFromEms(codes[49]);
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

    Promise.all([aoc.fetchDayInput('2024', '21'), aoc.fetchDayAnswers('2024', '21')]).then(([input, answers]) => {

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
