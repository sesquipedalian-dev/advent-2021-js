
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({grid, start, end, cheatDistance}) => {
    // console.log('part1 inputs', start, end)
    // grid.print((r, c, {passable, wall}) => {
    //     if (r === start[0] && c === start[1]) { 
    //         return 'S'
    //     }
    //     if (r === end[0] && c === start[0]) { 
    //         return 'E'
    //     }
    //     if(passable) { 
    //         return '.'
    //     }
    //     if(wall) { 
    //         return '#'
    //     }
    //     return '?'
    // })
    // so djkstra's gives us the shortest path from the start 
    // to any one node
    // is it reasonable to say that the improvement from a cheat is 
    // after DJkstra's, cost[end of cheat] - cost[start of cheat] - 2 (for the 2 steps you cheat)? 
    //
    // * with this formula, is it possible to compound errors by having multiple cheats? I don't think so
    // OHHH, you can only cheat once during the race.
    // 
    // I guess first of all, what even are possible cheats? 
    // any place you can skip one piece of wall and get to a higher cost[]? 
    //   01234
    // 0 ##..#
    // 1 #.#.#
    // 2 #...#
    // 3 #####
    //
    // start at 1, 1 end at 0,2 - best path = 6
    // possible cheats and their savings
    // 1,1 => 1,2 => 0,2 => 6 - 0 - 2 = 4
    // 1,1 => 0,1 => 0,2 => 6 - 0 - 2 = 4
    // 2,2 => 1,2 => 0,2 => 6 - 2 - 2 = 2
    // 1,3 => 1,2 => 0,2 => 6 - 4 - 2 = 0  * no savings
    //
    // of course my first idea was just that it's easy to calculate the new best path 
    // with including these cheating rules, by keeping track of the extra picoseconds cheated
    // in each node with Djkstra's.  But the problem wants to check all possible cheats :thinking:
    //
    // so for a given point, the range of cheats is....
    //   Q
    //  Y#R
    // Y#X#Y
    //  Y#Y
    //   Y
    // as long as those points aren't outside of the puzzle, I think if the endpoints (Y)
    // - have a higher cost than (X) 
    // - is an empty space
    // - the relevant space next to them is a wall ('relevant' - e.g. Q has a relevant wall immediately below it and R has one left and one down)
    // then they could be valid cheats worth checking 
    //
    // we also have to make sure we don't stop the Djkstra's upon getting to the end in case any deadends can be cheated.
    //  
   

    // so first djkstra's
    const key = (r, c) => `${r},${c}`
    const visited = {}
    const cost = {[key(start[0], start[1])]: 0}

    var countOfVisitableNodes = 0
    grid.iterate((r,c,{passable}) => countOfVisitableNodes += (passable ? 1 : 0))

    while (Object.keys(visited).length < countOfVisitableNodes) { 
        // find best
        var best = null
        var bestCost = Number.MAX_SAFE_INTEGER
        grid.iterate((r, c, i) => { 
            // console.log('best visit', r, c, i, cost[key(r,c)])
            if(visited[key(r,c)]) {
                // console.log('already visited')
                return
            }
            if(cost[key(r,c)] < bestCost) {
                // console.log('improved!', best)
                best = [r,c]
                bestCost = cost[key(r,c)]
                // console.log('improved2!', best)
            }
        })
        // console.log('best', best)
        if(best === null) { 
            // console.log('no more nodes to visit')
            break
        }
        const [row, col] = best

        // check if we reached the end
        // actually don't though because we need to include dead ends as potential shortcuts
        if (row === end[0] && col == end[1]) { 
            // break
        }

        // if we've already visited this somehow prune that branch
        if (visited[key(row, col)]) {
            // console.log('skipping visited')
            continue
        }

        // mark this as visited
        visited[key(row, col)] = true

        // check if we can improve any neighbors
        grid.neighboringIndexes(row, col).forEach(([nRow, nCol]) => { 
            // console.log('considering neighbors', row, col, nRow, nCol)
            if ( 
                visited[key(nRow, nCol)] ||
                grid.at(nRow, nCol).wall
            ) { 
                // console.log('already visited or wall', grid.at(nRow, nCol))
                return
            }

            const thisCost = cost[key(row, col)] + 1
            const existingCost = cost[key(nRow, nCol)] || Number.MAX_SAFE_INTEGER
            if (thisCost < existingCost) { 
                // console.log('improved cost', nRow, nCol, thisCost, existingCost)
                cost[key(nRow, nCol)] = thisCost
            } else { 
                // console.log('not better cost', nRow, nCol, thisCost, existingCost)
            }
        })
    }

    // console.log('Djkstra finished', cost)

    
    // next, we now have the cost matrix.  iterate through each passable tile in the maze.
    // following the pattern outlined above, check for possible cheats and rate their improvement
    // acounting along the way how many would save at least 100 

    var cheatValues = {}
    const possibleCheats = (row, col) => { 
        const cheats = []

        // ds - all the other points within manhattan distance cheatDistance from here
        // https://stackoverflow.com/questions/75128474/how-to-generate-all-of-the-coordinates-that-are-within-a-manhattan-distance-r-of
        const ds = []
        for (var d = 2; d <= cheatDistance; d++) { 
            // console.log('what is love?', d)
            // all points that are exactly `d` away from here
            for (var offset = 0; offset < d; offset++) {
                const inverseOffset = d - offset
                ds.push({dRow: offset, dCol: inverseOffset})
                ds.push({dRow: inverseOffset, dCol: -offset})
                ds.push({dRow: -offset, dCol: -inverseOffset})
                ds.push({dRow: -inverseOffset, dCol: offset})
            }
        }
        // const ds = [
        //     {dRow: 0, dCol: -2, walls: [{dRow: 0, dCol: -1}]},
        //     {dRow: 0, dCol: 2, walls: [{dRow: 0, dCol: 1}]},
        //     {dRow: 2, dCol: 0, walls: [{dRow: 1, dCol: 0}]},
        //     {dRow: -2, dCol: 0, walls: [{dRow: -1, dCol: 0}]},
        //     {dRow: -1, dCol: -1, walls: [{dRow: 0, dCol: -1}, {dRow: -1, dCol: 0}]},
        //     {dRow: -1, dCol: 1, walls: [{dRow: -1, dCol: 0}, {dRow: 0, dCol: 1}]},
        //     {dRow: 1, dCol: 1, walls: [{dRow: 0, dCol: 1}, {dRow: 1, dCol: 0}]},
        //     {dRow: 1, dCol: -1, walls: [{dRow: 1, dCol: 0}, {dRow: 0, dCol: -1}]}
        // ]
        ds.forEach(({dRow, dCol}) => { 
            const nRow = row + dRow
            const nCol = col + dCol
            // if(nRow < 0 || nRow >= grid.rows || nCol < 0 || nCol >= grid.columns) { 
            //     return
            // }
            if(grid.at(nRow, nCol)?.passable) { 
                    // console.log('wallz', row, col, dwRow, dwCol, nRow, nCol)
                    // if (
                    //     grid.at(row + dwRow, col + dwCol)?.wall
                    // ) {
                const nCost = cost[key(nRow, nCol)]
                const cCost = cost[key(row, col)]
                const distance = Math.abs(nRow - row) + Math.abs(nCol - col)
                const cheatValue = nCost - cCost - distance
                // console.log('cheats:', row, col, nRow, nCol, nCost, cCost)
                if (cheatValue > 0) {
                    // console.log('cheat value found!', row, col, nRow, nCol, dwRow, dwCol, cheatValue)
                    cheatValues[cheatValue] = (cheatValues[cheatValue] || 0) + 1
                    cheats.push(cheatValue)
                }
                    // }
            }
        })
        return cheats
    }

    var cheatCount = 0
    grid.iterate((row, col, {passable}) => { 
        if(passable) { 
            cheatCount += possibleCheats(row, col).filter(cheatValue => cheatValue >= 100).length
        }
    })
    // console.log('found all cheatValues', cheatValues)
    return cheatCount;
}

const part2 = () => {
    return null;
}

const parse = (input) => { 
    var start;
    var end;
    const grid = new utils.Grid(
        input,
        '',
        (s, r, c) => {
            switch(s) { 
                case 'S':
                    start = [r,c]
                    return {passable: true}
                case 'E':
                    end = [r,c]
                    return {passable: true}
                case '#':
                    return {wall: true}
                case '.':
                    return {passable: true}
            }
        }
    )
    return {grid, start, end}
}

aoc.fetchDayCodes('2024', '20').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    // const sample1 = parse(codes[0])
    // const sample1P1 = part1({...sample1, cheatDistance: 20})
    // return
    // const p1Answer = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // const samplePart1Answer = part1(sample1);

    // if(samplePart1Answer != p1Answer) { 
    //     console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
    //     return;
    // }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '20'), aoc.fetchDayAnswers('2024', '20')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1({...list_of_ints, cheatDistance: 2});
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        // 562 is too low
        // looks like our cheat counts are all too low, and in particular we don't find the 64 value one :thinking:
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part1({...list_of_ints, cheatDistance: 20})
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
