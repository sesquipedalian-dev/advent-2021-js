
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({grid, startRow, startColumn, targetRow, targetColumn}) => {
    // console.log('part1 inputs', startRow, startColumn, targetRow, targetColumn)
    let toVisit = [[startRow, startColumn, utils.DIRECTIONS.E]]
    const cost = {[JSON.stringify(toVisit[0])]: 0}
    const visited = {}
    while(toVisit.length > 0) { 
        // find empty vertex with smallest cost to get to it and not yet visited
        const nextBest = toVisit.reduce((best, next, i) => {
            const nextKey = JSON.stringify(next)
            // console.log('**', best, toVisit[best], cost[JSON.stringify(toVisit[best])] ||Number.MAX_SAFE_INTEGER, cost[nextKey] || Number.MAX_SAFE_INTEGER) 
            if ((cost[JSON.stringify(toVisit[best])] ||Number.MAX_SAFE_INTEGER) > (cost[nextKey] || Number.MAX_SAFE_INTEGER)) { 
                return i
            }
            return best
        }, 0)
        // console.log('next best', nextBest, toVisit.length, JSON.stringify(toVisit))
        const [row, column, direction] = toVisit[nextBest]
        const nextKey = JSON.stringify(toVisit[nextBest])
        toVisit =[... toVisit.slice(0, nextBest), ...toVisit.slice(nextBest + 1)]
        if(visited[nextKey]) { 
            continue
        }
        // console.log('visiting', nextKey, cost[nextKey])

        // terminate if v == target
        // if (row == targetRow && column == targetColumn) { 
        //     break
        // }
        
        // mark it as visited
        visited[nextKey] = true

        // for each neighbor of v not visited and blank
        // - OK, our neighbors are either - going in the direction we're going if it's empty,
        // or turning left or right 90 degrees and staying in the same column and row
        
        const n1 = [row + direction.dRow, column + direction.dColumn, direction, 1]
        const n2 = [row, column, utils.turnDirectionRight90(direction), 1_000]
        const n3 = [row, column, utils.turnDirectionLeft90(direction), 1_000]
        // console.log('items', n1, n2, n3)
        function foo([nRow, nColumn, nDirection, dCost])  { 
            // console.log('neighbors', nRow, nColumn, direction, dCost, grid.at(nRow, nColumn))
         
            const nKey = JSON.stringify([nRow, nColumn, nDirection])
            if(!grid.at(nRow, nColumn)?.['empty'] || visited[nKey]) {
                return
            }
            toVisit.push([nRow, nColumn, nDirection])
            const nCost = cost[nKey] || Number.MAX_SAFE_INTEGER
            // alternative cost = n.cost + cost of going from v to n
            const altCost = cost[nextKey] + dCost
            // if alt < v.cost, replace it
            if (altCost < nCost) { 
                cost[nKey] = altCost
            }
        }
        [n1, n2, n3].forEach(foo)
    }

    return [
        [targetRow, targetColumn, utils.DIRECTIONS.N],
        [targetRow, targetColumn, utils.DIRECTIONS.E],
        [targetRow, targetColumn, utils.DIRECTIONS.S],
        [targetRow, targetColumn, utils.DIRECTIONS.W]
    ].reduce((best, next) => { 
        const nCost = cost[JSON.stringify(next)]
        if (nCost < best) { 
            return nCost
        } 

        return best
    }, Number.MAX_SAFE_INTEGER)
}

const part2 = ({grid, startRow, startColumn, targetRow, targetColumn}) => {
    // console.log('part1 inputs', startRow, startColumn, targetRow, targetColumn)
    let toVisit = [[startRow, startColumn, utils.DIRECTIONS.E]]
    const cost = {[JSON.stringify(toVisit[0])]: 0}
    const visited = {}
    const prev = {}
    while(toVisit.length > 0) { 
        // find empty vertex with smallest cost to get to it and not yet visited
        const nextBest = toVisit.reduce((best, next, i) => {
            const nextKey = JSON.stringify(next)
            // console.log('**', best, toVisit[best], cost[JSON.stringify(toVisit[best])] ||Number.MAX_SAFE_INTEGER, cost[nextKey] || Number.MAX_SAFE_INTEGER) 
            if ((cost[JSON.stringify(toVisit[best])] ||Number.MAX_SAFE_INTEGER) > (cost[nextKey] || Number.MAX_SAFE_INTEGER)) { 
                return i
            }
            return best
        }, 0)
        // console.log('next best', nextBest, toVisit.length, JSON.stringify(toVisit))
        const [row, column, direction] = toVisit[nextBest]
        const nextKey = JSON.stringify(toVisit[nextBest])
        toVisit =[... toVisit.slice(0, nextBest), ...toVisit.slice(nextBest + 1)]
        if(visited[nextKey]) { 
            continue
        }
        // console.log('visiting', nextKey, cost[nextKey])

        // terminate if v == target
        // if (row == targetRow && column == targetColumn) { 
        //     break
        // }
        
        // mark it as visited
        visited[nextKey] = true

        // for each neighbor of v not visited and blank
        // - OK, our neighbors are either - going in the direction we're going if it's empty,
        // or turning left or right 90 degrees and staying in the same column and row
        
        const n1 = [row + direction.dRow, column + direction.dColumn, direction, 1]
        const n2 = [row, column, utils.turnDirectionRight90(direction), 1_000]
        const n3 = [row, column, utils.turnDirectionLeft90(direction), 1_000]
        // console.log('items', n1, n2, n3)
        function foo([nRow, nColumn, nDirection, dCost])  { 
            // console.log('neighbors', nRow, nColumn, direction, dCost, grid.at(nRow, nColumn))
            
            const nKey = JSON.stringify([nRow, nColumn, nDirection])
            if(!grid.at(nRow, nColumn)?.['empty'] || visited[nKey]) {
                return
            }
            toVisit.push([nRow, nColumn, nDirection])
            const nCost = cost[nKey] || Number.MAX_SAFE_INTEGER
            // alternative cost = n.cost + cost of going from v to n
            const altCost = cost[nextKey] + dCost
            // if alt < v.cost, replace it
            if (altCost <= nCost) { 
                cost[nKey] = altCost
                prev[nKey] = [...(prev[nKey] || []), nextKey]
            }
        }
        [n1, n2, n3].forEach(foo)
    }

    const [_, bestKey] = [
        [targetRow, targetColumn, utils.DIRECTIONS.N],
        [targetRow, targetColumn, utils.DIRECTIONS.E],
        [targetRow, targetColumn, utils.DIRECTIONS.S],
        [targetRow, targetColumn, utils.DIRECTIONS.W]
    ].reduce(([best, bestKey], next) => { 
        const nCost = cost[JSON.stringify(next)]
        if (nCost < best) { 
            return [nCost, JSON.stringify(next)]
        } 

        return [best, bestKey]
    }, [Number.MAX_SAFE_INTEGER, null])

    // console.log('generated prev graph', JSON.stringify(prev))
    let seen = {[JSON.stringify([targetRow, targetColumn])]: 1}
    let visit = [...prev[bestKey]]
    while(visit.length > 0) { 
        const visitMe = visit.pop()
        seen[JSON.stringify(JSON.parse(visitMe).slice(0, 2))] = 1
        // console.log('visiting prevs', visitMe, prev[visitMe])
        prev[visitMe]?.forEach(p => visit.push(p))
    }
    return Object.keys(seen).length
}

const parse = (input) => { 
    let startRow
    let startColumn
    let targetRow
    let targetColumn
    const grid = new utils.Grid(input, '', (e, row, column) => { 
        switch(e) {
            case '#':
                return {wall: true}
            case 'S': 
                startRow = row
                startColumn = column
            case '.': 
                return {empty: true}
            case 'E':
                targetRow = row
                targetColumn = column
                return {empty: true}
        }
    })
    return {grid, startRow, startColumn, targetRow, targetColumn}
}

aoc.fetchDayCodes('2024', '16').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[5])
    const p1Answer = utils.parseAnswerFromEms(codes[6]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case 1', samplePart1Answer, p1Answer);
        return;
    }

    const sample2 = parse(codes[10])
    const p1Answer2 = part1(sample2)
    const p1Real2 = utils.parseAnswerFromEms(codes[11])
    if(p1Answer2 != p1Real2) { 
        console.log('failed on part 1 test case 2', p1Answer2, p1Real2)
        return
    }

    const part2Answer = part2(parse(codes[5]));
    const part2Correct = utils.parseAnswerFromEms(codes[19]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct)
        return
    }

    const part2Answer2 = part2(parse(codes[10]))
    const part2Correct2 = utils.parseAnswerFromEms(codes[22])
    if(part2Answer2 != part2Correct2) { 
        console.log('failed on part 2 test case 2', part2Answer2, part2Correct2)
        return
    }

    Promise.all([aoc.fetchDayInput('2024', '16'), aoc.fetchDayAnswers('2024', '16')]).then(([input, answers]) => {
        // console.log('***************** starting part 1 on real input *********************')
        // const list_of_ints = parse(input)
        // const answer2 = part1(list_of_ints);
        // let answer2Right;
        // if (answers.length > 0) { 
        //     answer2Right = answers[0] == answer2.toString();
        // }
        // console.log('part 1 answer', answer2, answer2Right);

        console.log('*********************** starting part 2 **********************')
        const answer3 = part2(parse(input));
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
