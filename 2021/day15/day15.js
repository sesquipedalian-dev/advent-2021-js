
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    // Djkstra's ? 
    const target = [grid.rows - 1, grid.columns - 1]
    let steps = 0
    while(steps < 10_000 && !grid.at(target[0], target[1]).visited) {
        steps += 1
        let current = {
            best: Number.MAX_SAFE_INTEGER
        }
        grid.iterate((row, column, {best, visited}) => {
            // console.log('iteration', row, column, best)
            if (!visited && best < current.best) { 
                current.best = best
                current.row = row
                current.column = column
            }
        })
        // console.log('iteration', current)
        if (current.row == target[0] && current.column == target[1]){
            // reached end
            break
        }
        grid.at(current.row, current.column).visited = true

        grid.neighboringIndexes(current.row, current.column).forEach(([row, column]) => {
            if (grid.at(row, column).visited) {
                // console.log('already visited?', row, '***', column)
                return
            }
            
            const cost = current.best + grid.at(row, column).risk
            // console.log('feeling neighborly', row, column, cost)
            if (cost < grid.at(row, column).best) {
                grid.at(row, column).best = cost
            }
        })
    }

    return grid.at(grid.rows - 1, grid.columns - 1).best
}

const part2 = () => {
    return null;
}


aoc.fetchDayCodes('2021', '15').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = new utils.Grid(
        codes[0],
        '',
        (s, row, column) => ({
            visited: false,
            risk: parseInt(s, 10),
            best: (row == 0 && column == 0) ? 0 : Number.MAX_SAFE_INTEGER
        })
    )
    const p1Answer = utils.parseAnswerFromEms(codes[2]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[11]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2021', '15'), aoc.fetchDayAnswers('2021', '15')]).then(([input, answers]) => {
        const list_of_ints = new utils.Grid(
            input,
            '', 
            (s, row, column) => ({
                visited: false,
                risk: parseInt(s, 10),
                best: (row == 0 && column == 0) ? 0 : Number.MAX_SAFE_INTEGER
            })
        )
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
