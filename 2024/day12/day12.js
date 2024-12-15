
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
    // so basically I'm thinking - a side is like a row / column and a direction
    // for example - AAAA  has N 0, W 0, E 3, and S 0
    // C
    // CC
    //  C
    // has W0, N0, N1, E0, E1, S2, S1, and W1
    // so we can again annotate the regions in the grid, but instead of a count of perimeter, 
    // we want to generate which sides are part of that region (a set)
    // a node in the region adds all its sides that are NOT same letter neighbors to the region's set.
    //
    // Hmm, these are not working properly unique in the OX example case.

    // representing direction as [dRow, dColumn]
    // 1, 1 => 1, 2  direction = 0, -1 E
    // 1, 1 => 2, 1 direction = -1, 0 S
    // 1, 1 => 1, 0 direction = 0, 1 W
    // 1, 1 => 0, 1 direction = 1, 0 N
    //
    // console.log('starting part2')
    // grid.print()

    // ["[1,0]0","[0,1]0","[-1,0]0","[-1,0]1","[-1,0]2","[0,-1]3","[-1,0]3"]} 
    // ["[1,0]0","[0,1]0","[-1,0]0","[-1,0]1","[-1,0]2","[0,-1]3","[-1,0]3"]

    // oh, I guess my assumption that we're traveling W to E, N to S was wrong
    
    const sidesLength = (sides) => {
        console.log('sidesLength called with', JSON.stringify(sides))
        let sum = 0
        for(var dirRow = -1; dirRow <= 1; dirRow++) {
            for (var dirCol = -1; dirCol <= 1; dirCol++) {
                for (var rowOrCol = 0; rowOrCol < grid.rows; rowOrCol++) {
                    console.log('counting', dirRow, dirCol, rowOrCol, sides[dirRow + 1][dirCol + 1][rowOrCol].length)
                    sum += sides[dirRow + 1][dirCol + 1][rowOrCol].length
                }
            }
        }
        return sum
    }

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
        const sides = utils.initArray(3, () => utils.initArray(3, () => utils.initArray(grid.rows, () => utils.initArray(0))))
        const addSide = (dRow, dColumn, rowOrCol, cRow, cColumn) => {
            if(grid.at(cRow, cColumn).value != 'B') { 
                return 
            }
            console.log('trying to access grid bat', dRow, dColumn, rowOrCol, cRow, cColumn)
            const currentSides = sides[dRow + 1][dColumn + 1][rowOrCol]
            // console.log('current sides / length?')
            if (currentSides.length == 0){
                currentSides.push(true)
                return
            }

            // if there's already an entry for the same direction / rowOrCol,
            // we want to add a new side iff our neighbor to the left / up 
            // is NOT the same value as us
            let nRow = cRow
            let nCol = cColumn - 1
            if (dColumn != 0) { 
                nRow = cRow - 1
                nCol = cColumn 
            }

            console.log('trying to access grid at', nRow, nCol, cRow, cColumn, grid.at(nRow, nCol).value, grid.at(cRow, cColumn).value,
                grid.at(nRow, nCol).value == grid.at(cRow, cColumn).value
            )
            if (grid.at(nRow, nCol).value != grid.at(cRow, cColumn).value) { 
                console.log('yes')
                currentSides.push(true)
            } else {
                console.log('no')
            }
        }

        while(visit.length > 0) { 
            const [cRow, cColumn] = visit.pop()
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), regionId})

            // assign this one's perimeter while we're iterating through neighbors
            if (cRow == 0) { 
                // sides.add(`[1,0]${cRow}`)
                addSide(1, 0, cRow, cRow, cColumn)
            }
            if (cRow == grid.rows - 1) { 
                // sides.add(`[-1,0]${cRow}`)
                addSide(-1, 0, cRow, cRow, cColumn)
            }
            if (cColumn == 0) { 
                addSide(0, 1, cColumn, cRow, cColumn)
                // sides.add(`[0,1]${cColumn}`)
            }
            if (cColumn == grid.columns - 1) { 
                addSide(0, -1, cColumn, cRow, cColumn)
                // sides.add(`[0,-1]${cColumn}`)
            }

            grid.neighboringIndexes(cRow, cColumn).forEach(([nRow, nColumn]) => {
                const direction = [cRow - nRow, cColumn - nColumn]
                // neighbors that are our same value we will add to the region
                // and diminsh our perimeter
                const {value: nValue, regionId: nRegionId} = grid.at(nRow, nColumn)
                if (nValue == value) {   
                    if (nRegionId == null ) { 
                        visit.push([nRow, nColumn])
                    }
                } else {
                    console.log('neighbor adding side', )
                    addSide(direction[0], direction[1], nRow != cRow ? cRow : cColumn, cRow, cColumn)
                    // sides.add(`${direction}${nRow != cRow ? cRow : cColumn}`)
                }
            })
            grid.set(cRow, cColumn, {...grid.at(cRow, cColumn), sides: [...sides]})
        }
    })

    grid.print()

    // now iterate through the regions, finding the items in the grid that 
    // are registered in that region, and adding up the area and perimeter
    let sum = 0
    for (var region = 0; region< nextRegionId; region++) { 
        let area = 0
        let sides = 0
        grid.iterate((_row, _column, {sides: cSides, value: _value, regionId}) => {
            if(regionId == region) { 
                area += 1
                if (cSides) { 
                    sides = sidesLength(cSides) > sides ? sidesLength(cSides) : sides
                }
            }
        })
        console.log('and the winning sides are', sides)
        console.log('summing region', region, area, sides, sum)
        sum += (area * sides)
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
    // console.log('all the codes', codes.slice(0).map((c, i) => [c, i]));
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
    const p2Real3 = utils.parserAnswerFromEms(codes[104])
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
    const p2Real5 = utils.parseAnswerFromEms(codes[137])
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

        // const answer3 = part2(list_of_ints);
        // let answer3Right;
        // if (answers.length > 1) { 
        //     answer3Right = answers[1] == answer3.toString();
        // }
        // console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
