
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    // Djkstra's ? 
    let unvisited = {[JSON.stringify([0,0])]: true}
    const best = {} 
    grid.iterate((row, column) => {
        if(row == 0 && column == 0) { 
            return 
        }
        best[JSON.stringify([row, column])] = Number.MAX_SAFE_INTEGER
        unvisited[JSON.stringify([row, column])] = true
    })
    best[JSON.stringify([0,0])] = 0 // map from row, column coord to min risk to get there
 
    const target = [grid.rows - 1, grid.columns - 1]
    while(Object.entries(unvisited).length > 0) {
        let current = Object.entries(unvisited).reduce(([i, min], [coord]) => {
            // console.log('what is happening', i, min, coord)
            if (!i) {
                return [coord, best[coord]]
            }
            return best[coord] < min ? [coord, best[coord]] : [i, min]
        }, [null, Number.MAX_SAFE_INTEGER])[0]
        delete unvisited[current]
        // console.log('iteration', current, best[current])
        const [currentRow, currentColumn] = JSON.parse(current)
        // console.log('iteration', current, best[current])
        if (currentRow == target[0] && currentColumn == target[1]){
            break
        }

        grid.neighboringIndexes(currentRow, currentColumn).forEach(([row, column]) => {
            const key = JSON.stringify([row, column])
            if (!unvisited[key]) {
                // console.log('already visited?', row, '***', column)
                return
            }
            
            const cost = best[current] + grid.at(row, column)
            // console.log('feeling neighborly', row, column, cost)
            if (!best[key] || cost < best[key]) {
                best[key] = cost
            }
        })
    }

    return best[JSON.stringify(target)]
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
            value: parseInt(s, 10),
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
            (s) => parseInt(s, 10)
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
