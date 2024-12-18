
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    // console.log('starting part1')
    // grid.print()

    let nextRegionId = 0
    grid.iterate((row, column, {regionId: skipMe, value}) => { 
        if(skipMe !== null) { 
            return
        }

        // this one doesn't have a region, do a BFS for like `value`
        // add add them to the region too
        const visit = [[row, column]]
        const regionId = nextRegionId
        nextRegionId++
        while(visit.length > 0) { 
            const [cRow, cColumn] = visit.pop()
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), regionId})

            // assign this one's perimeter while we're iterating through neighbors
            let perimeter = 4
            grid.neighboringIndexes(cRow, cColumn).forEach(([nRow, nColumn]) => {
                // neighbors that are our same value we will add to the region
                // and diminsh our perimeter
                const {value: nValue, regionId: nRegionId} = grid.at(nRow, nColumn)
                if (nValue == value) {
                    perimeter -= 1
                    if (nRegionId == null ) { 
                        visit.push([nRow, nColumn])
                    }
                }
            })
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), perimeter})
        }
    })

    // grid.print()

    // now iterate through the regions, finding the items in the grid that 
    // are registered in that region, and adding up the area and perimeter
    let sum = 0
    for (var region = 0; region< nextRegionId; region++) { 
        let area = 0
        let perimeter = 0
        grid.iterate((_row, _column, {perimeter: cPerimeter, value: _value, regionId}) => {
            if(regionId == region) { 
                area += 1
                perimeter += cPerimeter
            }
        })
        // console.log('summing region', region, area, perimeter, sum)
        sum += (area * perimeter)
    }
    return sum;
}

const part2 = (grid) => {
    // console.log('starting part1')
    // grid.print()

    let nextRegionId = 0
    grid.iterate((row, column, {regionId: skipMe, value}) => { 
        if(skipMe !== null) { 
            return
        }

        // this one doesn't have a region, do a BFS for like `value`
        // add add them to the region too
        const visit = [[row, column]]
        const regionId = nextRegionId
        nextRegionId++
        while(visit.length > 0) { 
            const [cRow, cColumn] = visit.pop()
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), regionId})

            // assign this one's perimeter while we're iterating through neighbors
            let perimeter = 4
            grid.neighboringIndexes(cRow, cColumn).forEach(([nRow, nColumn]) => {
                // neighbors that are our same value we will add to the region
                // and diminsh our perimeter
                const {value: nValue, regionId: nRegionId} = grid.at(nRow, nColumn)
                if (nValue == value) {
                    perimeter -= 1
                    if (nRegionId == null ) { 
                        visit.push([nRow, nColumn])
                    }
                }
            })
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), perimeter})
        }
    })

    // grid.print()

    // now iterate through the regions, finding the items in the grid that 
    // are registered in that region, and adding up the area and perimeter
    const gridAt = (row, column) => {
        const gridItem = grid.at(row, column)
        if(gridItem) { 
            return gridItem.value || '.'
        }
        return '.'
    }

    let sum = 0
    for (var region = 0; region < nextRegionId; region++) { 
        let area = 0
        let perimeter = 0
        grid.iterate((row, column, {perimeter: cPerimeter, value: _value, regionId}) => {
            if(regionId == region) { 
                area += 1
                // so we want to look at all pairs of adjacent orthogonal directions (e.g. N+E, E+S, S+w, N+w)
                // two cases
                // .A - interior corner
                // AA
                //
                // .. - exterior corner
                // A.
                //
                // with credit to https://www.reddit.com/r/adventofcode/comments/1hcdnk0/comment/m1nkmol/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
                perimeter += [0,2,4,6].map(d1 => [
                    Object.values(utils.DIRECTIONS)[d1], Object.values(utils.DIRECTIONS)[(d1 + 2) % 8]
                ])
                    .map(([d1, d2]) => {
                        // console.log('checking directions', Object.values(utils.DIRECTIONS), d1, d2, row, column)
                        return [
                        [row, column], 
                        [row + d1.dRow, column + d1.dColumn],
                        [row + d2.dRow, column + d2.dColumn],
                        [row + d1.dRow + d2.dRow, column + d1.dColumn + d2.dColumn]
                        ]})
                    .filter(([plant, lhs, rhs, between]) => { 
                        // console.log('checking direction 2', plant, lhs, rhs, between)
                        // exterior corner
                        return (gridAt(...plant) != gridAt(...lhs) && gridAt(...plant) != gridAt(...rhs)) ||
                        // interior corner
                        (gridAt(...plant) == gridAt(...lhs) && gridAt(...plant) == gridAt(...rhs) && gridAt(...plant) != gridAt(...between))
                    }).length
            }
        })
        // console.log('summing region', region, area, perimeter, sum)
        sum += (area * perimeter)
    }
    return sum;
}

const parse = (input) => { 
    return new utils.Grid(
        input,
        '',
        (e) => ({regionId: null, value: e}),
    )
}

aoc.fetchDayCodes('2024', '12').then(codes => { 
    // console.log('all the codes', codes.slice(100).map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[47]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const sample2 = parse(codes[54])
    const p1Answer2 = part1(sample2)
    const p1Real2 = utils.parseAnswerFromEms(codes[77])
    if (p1Answer2 != p1Real2) { 
        console.log('failed on part 1 test case 2', p1Answer2, p1Real2)
        return
    }

    const sample3 = parse(codes[25])
    const p1Answer3 = part1(sample3)
    const p1Real3 = utils.parseAnswerFromEms(codes[52])
    if(p1Answer3 != p1Real3) { 
        console.log('failed on part 1 test case 3', p1Answer3, p1Real3) 
        return
    }

    const part2Answer = part2(parse(codes[0]));
    const part2Correct = utils.parseAnswerFromEms(codes[94]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case 1', part2Answer, part2Correct);
        return;
    }

    const p2Real2 = utils.parseAnswerFromEms(codes[97])
    const p2Answer2 = part2(parse(codes[25]))
    if (p2Answer2 != p2Real2) { 
        console.log('failed on part 2 test case 2', p2Real2, p2Answer2)
        return
    }

    const sample4 = parse(codes[99])
    const p2Answer3 = part2(sample4)
    const p2Real3 = utils.parseAnswerFromEms(codes[104])
    if (p2Answer3 != p2Real3) { 
        console.log('failed on part 2 test case 3', p2Answer3, p2Real3)
        return
    }

    const sample5 = parse(codes[106 ])
    const p2Answer4 = part2(sample5)
    const p2Real4 = utils.parseAnswerFromEms(codes[105])
    if (p2Answer4 != p2Real4) { 
        console.log('failed on part 2 test case 4', p2Answer4, p2Real4)
        return
    }

    const p2Answer5 = part2(parse(codes[25]))
    const p2Real5 = utils.parseAnswerFromEms(codes[97])
    if (p2Answer5 != p2Real5) { 
        console.log('failed on part 2 test case 5', p2Answer5, p2Real5)
        return
    }

    Promise.all([aoc.fetchDayInput('2024', '12'), aoc.fetchDayAnswers('2024', '12')]).then(([input, answers]) => {
        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2(parse(input));
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
