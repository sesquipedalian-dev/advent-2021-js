
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({corruptions, target}) => {
    const [maxCol, maxRow] = target.split(',').map(n => parseInt(n))
    const visited = {}
    const cost = {['0,0']: 0}

    while (true) { 
        // next lowest cost place to go
        var best = []
        var bestCost = Number.MAX_SAFE_INTEGER
        for ( var row = 0; row <= maxRow; row++) { 
            for (var col = 0; col <= maxCol;  col++) {
                if(visited[`${col},${row}`]) {
                    continue
                }
                const thisCost = cost[`${col},${row}`]
                if ( thisCost < bestCost) { 
                    best = [col, row]
                    bestCost = thisCost
                }
            }
        }
        // console.log('visiting', best, target)
        // check if we reached the end
        if (best[0] == maxCol && best[1] == maxRow) { 
            break
        }

        // if we've already visited this somehow prune that branch
        if (visited[`${best[0]},${best[1]}`]) {
            // console.log('skipping visited')
            continue
        }

        // mark this as visited
        visited[`${best[0]},${best[1]}`] = true

        // check if we can improve any neighbors
        const ds = [
            utils.DIRECTIONS.N,
            utils.DIRECTIONS.E,
            utils.DIRECTIONS.S,
            utils.DIRECTIONS.W
        ]
        // console.log('directions', ds)
        ds.forEach(({dRow, dColumn}) => {
            const tCol = best[0] + dColumn
            const tRow = best[1] + dRow

            // console.log('checking neighbor', tCol, tRow)
            if (
                !(0 <= tCol && tCol <= maxCol) ||
                !(0 <= tRow && tRow <= maxRow) ||
                corruptions.indexOf(`${tCol},${tRow}`) >= 0 ||
                visited[`${tCol},${tRow}`]
            ) {
                // console.log('skipping')
                return
            }

            const thisCost = cost[`${best[0]},${best[1]}`] + 1
            const existingCost = cost[`${tCol},${tRow}`] || Number.MAX_SAFE_INTEGER
            if(thisCost < existingCost) {
                cost[`${tCol},${tRow}`] = thisCost
            }
        })
    }

    return cost[target];
}

const part2 = ({corruptions, target}) => {
    const [maxCol, maxRow] = target.split(',').map(n => parseInt(n))
    
    // this should be a more straightforward DFS or BFS since 
    // we just want to check if there IS a path, 
    // not the best one

    for (var maxC = 1024; maxC < corruptions.length; maxC++) { 
        // console.log('checking maxC', maxC)
        const toVisit = [[0,0]]
        const visited = {}
        var foundTarget = false
        const currentCorruptions = corruptions.slice(0, maxC + 1)
        while(toVisit.length > 0) { 
            const [col, row] = toVisit.shift()

            // console.log('visiting', col, row, toVisit, maxC)
            if(col == maxCol && row == maxRow) { 
                // console.log('found target')
                foundTarget = true
                break
            }

            if(visited[`${col},${row}`]) {
                continue;
            }
            visited[`${col},${row}`] = true

             // check if target is reachable from neighbors
            const ds = [
                utils.DIRECTIONS.N,
                utils.DIRECTIONS.E,
                utils.DIRECTIONS.S,
                utils.DIRECTIONS.W
            ]
            // console.log('directions', ds)
            ds.forEach(({dRow, dColumn}) => {
                const tCol = col + dColumn
                const tRow = row + dRow

                // console.log('checking neighbor', tCol, tRow)
                if (
                    !(0 <= tCol && tCol <= maxCol) ||
                    !(0 <= tRow && tRow <= maxRow) ||
                    currentCorruptions.indexOf(`${tCol},${tRow}`) >= 0 ||
                    visited[`${tCol},${tRow}`]
                ) {
                    // console.log('skipping')
                    return
                }

                toVisit.push([tCol, tRow])
            })
        }

        if(!foundTarget) { 
            return corruptions[maxC]
        }
    }

    return null;
}

// list in order of corrupted locations as they appear, e.g. 
// [
//   '0,1',  // 0 from left, 1 from top
//   '1,2',
//   ...
// ]
const parse = (input, count) => { 
    return {
        corruptions: input.split("\n").filter(n => n != '').slice(0, count)
    }
    //.map(n => n.split(',').map(d => parseInt(d, 10)))
}

const parse2 = (input) => { 
    return {
        corruptions: input.split("\n").filter(n => n != '')
    }
    //.map(n => n.split(',').map(d => parseInt(d, 10)))
}

aoc.fetchDayCodes('2024', '18').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[4], 12)
    const p1Answer = utils.parseAnswerFromEms(codes[15]);
    const samplePart1Answer = part1({...sample1, target: '6,6'});

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    // const sample2 = parse2(codes[4])
    // const part2Answer = part2({...sample2, target: '6,6'});
    // const part2Correct = codes[24].split(/>|</)[2]
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '18'), aoc.fetchDayAnswers('2024', '18')]).then(([input, answers]) => {

        const list_of_ints = parse(input, 1024)
        const answer2 = part1({...list_of_ints, target: '70,70'});
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2({...parse2(input), target: '70,70'});
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
