
import aoc from '../../util/aoc.js';
import utils from './utils.js';

function mod(n, m) {
    return ((n % m) + m) % m;
}

const part1 = (parsed, cols, rows, seconds) => {
    // console.log('part1 start', JSON.stringify(parsed, cols, rows))
    const mCol = Math.floor(cols / 2)
    const mRow = Math.floor(rows / 2)

    return parsed.reduce((accum, {pCol, pRow, vCol, vRow}) => { 
        const next = [...accum]
        const fCol = mod((pCol + vCol * seconds), cols)
        const fRow = mod((pRow + vRow * seconds), rows)

        if(fCol < mCol ) { 
            if (fRow < mRow) { 
                next[0] += 1
            } else if (fRow > mRow) { 
                next[1] += 1
            }
        } else if (fCol > mCol) { 
            if (fRow < mRow) { 
                next[2] += 1
            } else if (fRow > mRow) { 
                next[3] += 1
            }
        }
        return next
    }, utils.initArray(4, () => 0)).reduce((accum, n) => {
        return accum * n
    }, 1)
}


const part2 = (parsed, cols, rows) => {
    console.log('part2 start', parsed, cols, rows)
    const seenGrids = new Set()
    let currentSecond = 0
    while(true) { 
        const currentGrid = new Set()
        parsed.forEach(({pCol, pRow, vCol, vRow}) => { 
            const fCol = mod((pCol + vCol * currentSecond), cols)
            const fRow = mod((pRow + vRow * currentSecond), rows)
            currentGrid.add(`${fCol},${fRow}`)
        })
        const gridKey = JSON.stringify([...currentGrid])

        // print
        process.stdout.write(`***************** SECOND ${currentSecond} ***************`)
        for (var row = 0; row < rows; row++) { 
            for (var col = 0; col < cols; col++) { 
                if(currentGrid.has(`${col},${row}`)) {
                    process.stdout.write("#")
                } else {
                    process.stdout.write('.')
                }
            }
            process.stdout.write("\n")
        }
        process.stdout.write('****************************************')

        // detect loop?
        if(seenGrids.has(gridKey)) {
            break;
        }
        seenGrids.add(gridKey)
        currentSecond ++
    }
    return null;
}

const parse = (input) => { 
    return input.split("\n").filter(n => n != '').map(l => {
        const [_1, _2, _, pPart, _3, _4, vPart] = l.split(/(p=)|( v=)/)
        const [pCol, pRow] = pPart.split(',').map(n => parseInt(n))
        const [vCol, vRow] = vPart.split(',').map(n => parseInt(n))
        return {pCol, pRow, vCol, vRow}
    })
}

aoc.fetchDayCodes('2024', '14').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[2])
    const p1Answer = utils.parseAnswerFromEms(codes[29]);
    const samplePart1Answer = part1(sample1, 11, 7, 100);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const part2Answer = part2(sample1, 11, 7);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '14'), aoc.fetchDayAnswers('2024', '14')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints, 101, 103, 100);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        // NOTE: I didn't actually find a loop on this input. But letting it run long enough 
        // does show a christmas tree plain as day in the output, just input the SECOND printed out above that section. 
        // It looks like something you could do would be to look for a long enough continuious string of ####
        const answer3 = part2(list_of_ints, 101, 103);
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
