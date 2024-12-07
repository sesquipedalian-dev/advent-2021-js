
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const NAVIGATION_RESULTS = {
    exited: 'exited',
    looped: 'looped'
}

const navigateMaze = (grid, startingRow, startingColumn, checkLoops) => { 
    // console.log('starting navigate maze', startingRow, startingColumn)
    // grid.print()
    let currentRow = startingRow
    let currentColumn = startingColumn
    let direction = utils.DIRECTIONS.N
    const max_iterations = 10_000
    let step = 0

    // keep the guy going until they would step out the edges of the map
    while(
        0 <= currentRow && 
        currentRow < grid.rows &&
        0 <= currentColumn && 
        currentColumn < grid.rows 
    ) {
        // console.log('iteration, visiting', 
        //     direction, currentRow, currentColumn, grid.at(currentRow, currentColumn), mapDirectionToVisitedValue[direction.name],
        //     grid.at(currentRow, currentColumn) === mapDirectionToVisitedValue[direction.name],
        // )
        if(checkLoops && ((step >= max_iterations) || (grid.at(currentRow, currentColumn) === mapDirectionToVisitedValue[direction.name]))) { 
            return NAVIGATION_RESULTS.looped
        }

        grid.set(currentRow, currentColumn, mapDirectionToVisitedValue[direction.name])
        const [newRow, newColumn] = utils.goDirection(currentRow, currentColumn, direction)
        if (grid.at(newRow, newColumn) === ITEMS.obstacle) { 
            direction = utils.turnDirectionRight90(direction)
        } else {
            currentRow = newRow
            currentColumn = newColumn
        }
        step += 1
    }

    return NAVIGATION_RESULTS.exited
}

const part1 = (grid) => {
    const origGrid = grid.duplicate()

    // find where the guy started
    // origGrid.print()
    let startingRow = 0
    let startingColumn = 0
    origGrid.iterate((row, column, i) => {
        if (i === ITEMS.guy) {
            startingRow = row
            startingColumn = column
        }
    })
    navigateMaze(origGrid, startingRow, startingColumn)

    // count all the 'visited' spots on the map
    let count = 0
    // origGrid.print()
    origGrid.iterate((_row, _column, i) => { 
        if (Object.values(mapDirectionToVisitedValue).includes(i)) { 
            count += 1
        }
    })

    return count
}

const part2 = (grid) => {
    const origGrid = grid.duplicate()

    // find where the guy started
    // grid.print()
    let startingRow = 0
    let startingColumn = 0
    grid.iterate((row, column, i) => {
        if (i === ITEMS.guy) {
            startingRow = row
            startingColumn = column
        }
    })

    navigateMaze(grid, startingRow, startingColumn)
    
    // now that we've found all the places we've visited, 
    // check if putting an obstacle in each of those places results in a loop
    let count = 0
    grid.iterate((row, column, i) => { 
        if (Object.values(mapDirectionToVisitedValue).includes(i)) { 
            console.log('is an obstruction at these coords loopy?', row, column)
            const newGrid = origGrid.duplicate()
            newGrid.set(row, column, ITEMS.obstacle)
            
            if(navigateMaze(newGrid, startingRow, startingColumn, true) == NAVIGATION_RESULTS.looped) { 
                console.log('yes')
                count += 1
            } else { 
                console.log('no')
            }
        }
    })

    return count
}

const ITEMS = {
    obstacle: '#',
    guy: '^',
    empty: '.',
    visitedN: 'N',
    visitedE: 'E',
    visitedS: 'S',
    visitedW: 'W',
}

const mapDirectionToVisitedValue = {
    [utils.DIRECTIONS.N.name]: ITEMS.visitedN,
    [utils.DIRECTIONS.E.name]: ITEMS.visitedE,
    [utils.DIRECTIONS.S.name]: ITEMS.visitedS,
    [utils.DIRECTIONS.W.name]: ITEMS.visitedW,
}

const parse = (input) => { 
    return new utils.Grid(
        input,
        '',
        (e) => Object.entries(ITEMS).find(([_, v]) => v === e)[1]
    )
}

aoc.fetchDayCodes('2024', '6').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[9]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[22]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '6'), aoc.fetchDayAnswers('2024', '6')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2(list_of_ints);
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
