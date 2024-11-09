
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid, steps) => {
    let flashedCount = 0;
    for (let step = 0; step < steps; step += 1) {
        // console.log('step', step);
        // grid.print()
        // presumably we'll want to try some sort of memoization / loop identification
        //
        // first increase all energy levels by 1
        grid.iterate((row, column, i) => grid.set(row, column, i+1))

        // then we handle flashes and cascades
        // do
        const flashed = new Set();
        while(true) { 
            // find any octopuses with power 9 or greater if not already flashed
            const flashThese = []
            grid.iterate((row, column, value) =>{
                if(value > 9 && !flashed.has(JSON.stringify([row, column]))) {
                    // console.log('flashing!', row, column, value)
                    flashThese.push([row, column])
                }
            })

            // break if none
            if (flashThese.length == 0) { 
                break;
            }

            // mark them 'flashed' and add 1 to their neighbors
            flashThese.forEach(([row, column]) => {
                flashed.add(JSON.stringify([row, column]))                
                grid.neighboringIndexes(row, column).forEach(([nRow, nColumn]) => {
                    // console.log('incrementing neighbors', row, column, nRow, nColumn)
                    grid.set(nRow, nColumn, grid.at(nRow, nColumn) + 1)
                })
            })
            // repeat
        }

        // change energy levels of all flashed octopuses to 0
        flashed.forEach(s => {
            const [row, column] = JSON.parse(s)
            grid.set(row, column, 0)
        })
        
        // accumulate count of flashes 
        flashedCount += flashed.size
    }
    // console.log('step', steps)
    // grid.print()
    return flashedCount;
}

const part2 = (grid) => {
    let step = 0
    while(true) {
        // console.log('step', step);
        // grid.print()
        // presumably we'll want to try some sort of memoization / loop identification
        //
        // first increase all energy levels by 1
        grid.iterate((row, column, i) => grid.set(row, column, i+1))

        // then we handle flashes and cascades
        // do
        const flashed = new Set();
        while(true) { 
            // find any octopuses with power 9 or greater if not already flashed
            const flashThese = []
            grid.iterate((row, column, value) =>{
                if(value > 9 && !flashed.has(JSON.stringify([row, column]))) {
                    // console.log('flashing!', row, column, value)
                    flashThese.push([row, column])
                }
            })

            // break if none
            if (flashThese.length == 0) { 
                break;
            }

            // mark them 'flashed' and add 1 to their neighbors
            flashThese.forEach(([row, column]) => {
                flashed.add(JSON.stringify([row, column]))                
                grid.neighboringIndexes(row, column).forEach(([nRow, nColumn]) => {
                    // console.log('incrementing neighbors', row, column, nRow, nColumn)
                    grid.set(nRow, nColumn, grid.at(nRow, nColumn) + 1)
                })
            })
            // repeat
        }

        if (flashed.size === grid.size()) {
            break;
        }

        // change energy levels of all flashed octopuses to 0
        flashed.forEach(s => {
            const [row, column] = JSON.parse(s)
            grid.set(row, column, 0)
        })

        step += 1
    }

    // console.log('step', steps)
    // grid.print()
    return step + 1;
}


aoc.fetchDayCodes('2021', '11').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = new utils.Grid(codes[0], '', (s) => parseInt(s, 10), true)
    const p1Answer = utils.parseAnswerFromEms(codes[16]);
    const samplePart1Answer = part1(sample1, 100);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(new utils.Grid(codes[0], '', (s) => parseInt(s, 10), true));
    const part2Correct = utils.parseAnswerFromEms(codes[18]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '11'), aoc.fetchDayAnswers('2021', '11')]).then(([input, answers]) => {
        const list_of_ints = new utils.Grid(input, '', (s) => parseInt(s, 10), true)
        const answer2 = part1(list_of_ints, 100);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2( new utils.Grid(input, '', (s) => parseInt(s, 10), true));
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        // 135 is too low
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
