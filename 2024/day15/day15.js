
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const moveGridItem = ({grid, row, column, direction}) => { 
    // console.log('moveGridItem start', row, column, direction)
    const source = grid.at(row, column)
    const tRow = row + direction.dRow
    const tColumn = column + direction.dColumn
    const target = grid.at(tRow, tColumn)
    // console.log('target', JSON.stringify(target))
    // cases: 
    // - the target space is empty - move us to there
    if(target.empty) { 
        grid.set(tRow, tColumn, {...source})
        grid.set(row, column, {empty: true})
        return true
    }
    // - the target space has a wall - we can't move
    if(target.wall) { 
        return false
    }
    // - the target space has a box - recursively attempt to move the box, then move us if that was successful
    if(target.box) {
        const movedTheBox = moveGridItem({grid, row: tRow, column: tColumn, direction})
        if (movedTheBox) { 
            grid.set(tRow, tColumn, {...source})
            grid.set(row, column, {empty: true})
            return true
        } else {
            return false
        }
    }
    // - the target space has a robot - can't happen? 

    // return whether we moved
    return false
}


const moveGridItem2 = ({grid, row, column, direction}) => { 
    // console.log('moveGridItem start', row, column, direction)
    const source = grid.at(row, column)
    const tRow = row + direction.dRow
    const tColumn = column + direction.dColumn
    const target = grid.at(tRow, tColumn)
    // console.log('target', JSON.stringify(target))
    // cases: 
    // - the target space is empty - move us to there
    if(target.empty) { 
        grid.set(tRow, tColumn, {...source})
        grid.set(row, column, {empty: true})
        return true
    }
    // - the target space has a wall - we can't move
    if(target.wall) { 
        return false
    }

    // - the target space has a box - recursively attempt to move the box, then move us if that was successful
    if(target.boxLeft || target.boxRight) {
        // ok if we have to move a box - are both 
        let movedTheBox
        if(target.boxLeft) { 
            movedTheBox = moveBox2({grid, row: tRow, column: tColumn, direction})
        } else { 
            movedTheBox = moveBox2({grid, row: tRow, column: tColumn - 1, direction})
        }
        if (movedTheBox) { 
            grid.set(tRow, tColumn, {...source})
            grid.set(row, column, {empty: true})
            return true
        } else {
            return false
        }
    }
    // - the target space has a robot - can't happen? 

    // return whether we moved
    return false
}

// we are attempting to move the box with left side row, column
const moveBox2 = ({grid, row, column, direction, test}) => { 
    const source = grid.at(row, column)
    const tRow = row + direction.dRow
    const tColumn = column + direction.dColumn

    // if direction is W or E, we need to check the appropriate side
    if(direction.name == utils.DIRECTIONS.W.name) { 
        const target = grid.at(row, column - 1)
        if(target.wall) { 
            return false
        } 
        let canMove
        if(target.boxRight) { 
            // need to recursively move that box out of the way
            canMove = moveBox2({grid, row, column: column - 2, direction})
        } else if (target.empty) { 
            canMove = true
        }

        if(!canMove) { 
            return false
        }

        if(test) { 
            return canMove
        }

        grid.set(row, column - 1, {boxLeft: true})
        grid.set(row, column, {boxRight: true})
        grid.set(row, column + 1, {empty: true})
        return true
    } 

    if (direction.name == utils.DIRECTIONS.E.name) { 
        const target = grid.at(row, column + 2)
        if(target.wall) { 
            return false
        } 
        let canMove
        if(target.boxLeft) { 
            // need to recursively move that box out of the way
            canMove = moveBox2({grid, row, column: column + 2, direction})
        } else if (target.empty) { 
            canMove = true
        }

        if(!canMove) { 
            return false
        }

        if(test) { 
            return canMove
        }

        grid.set(row, column, {empty: true})
        grid.set(row, column + 1, {boxLeft: true})
        grid.set(row, column + 2, {boxRight: true})
        return true
    }

    // if direction is N or S, we need to be able to move both sides (then move them, then move us)
    const targetLeft = grid.at(tRow, tColumn)
    const targetRight = grid.at(tRow, tColumn + 1)

    const moveNorthOrSouth = () => {
        // move me into the spot (unless we're testing)
        grid.set(tRow, tColumn, {boxLeft: true})
        grid.set(tRow, tColumn + 1, {boxRight: true})
        grid.set(row, column, {empty: true})
        grid.set(row, column + 1, {empty: true})
    }

    // the special case is if the targetLeft and targetRight are part of 2 different boxes
    // [][]
    // .[].
    // in this case, we need to CHECK if we can move them before actually moving them to avoid
    // messing with the state of the puzzle
    if(targetLeft.boxRight && targetRight.boxLeft) { 
        const canMoveLeft = moveBox2({grid, row: tRow, column: tColumn - 1, direction, test: true})
        const canMoveRight = moveBox2({grid, row: tRow, column: tColumn + 1, direction, test: true })

        if(!(canMoveLeft && canMoveRight)) { 
            return false
        }

        if(test){
            return true
        }

        // move the targets out of the way
        moveBox2({grid, row: tRow, column: tColumn - 1, direction})
        moveBox2({grid, row: tRow, column: tColumn + 1, direction})
        // move me into the spot
        moveNorthOrSouth()

        return true
    }

    // if either target location is a wall, false
    if(targetLeft.wall || targetRight.wall) {
        return false
    }

    // if BOTH target locations are empty, true
    if(targetLeft.empty && targetRight.empty) { 
        if(!test) { 
            moveNorthOrSouth()
        }
        return true
    }

    // final case is that we just have to move 1 other box out of the way, so we
    // can just do that directly without the 'test' step, then move us
    let needsToMove = [tRow, tColumn]
    if(targetLeft.boxRight) { 
        needsToMove = [tRow, tColumn - 1]
    } else if (targetRight.boxLeft) { 
        needsToMove = [tRow, tColumn + 1]
    }
    if(moveBox2({grid, row: needsToMove[0], column: needsToMove[1], direction, test})){
        if(!test) { 
            moveNorthOrSouth()
        }
        return true
    }

    return false
}

const printGrid = (grid) => { 

    grid.print((_r, _c, i) => {
        if(i.wall) { 
            return '#'
        }
        if(i.empty) { 
            return '.'
        }
        if(i.bot) { 
            return '@'
        }
        if(i.box) { 
            return 'O'
        }
        if(i.boxLeft) { 
            return '['
        }
        if(i.boxRight) { 
            return ']'
        }
    })
}
const part1 = ({grid, moves, botRow, botColumn}) => {
    // console.log('part 1 inputs', grid.at(botRow, botColumn), botRow, botColumn, JSON.stringify(grid), JSON.stringify(moves))

    // printGrid(grid)
    // do all the moves
    moves.forEach(direction => {
        if(moveGridItem({grid, row: botRow, column: botColumn, direction})) {
            botRow += direction.dRow
            botColumn += direction.dColumn
        }
        // printGrid(grid)
    })


    // sum up all the GPS coordinates
    let sum = 0
    grid.iterate((row, column, e) => {
        if (e.box) { 
            sum += (100 * row) + column
        }
    })
    return sum;
}

const part2 = ({grid, moves, botRow, botColumn}) => {
     // console.log('part 2 inputs', grid.at(botRow, botColumn), botRow, botColumn, JSON.stringify(grid), JSON.stringify(moves))

    // printGrid(grid)
    // do all the moves
    moves.forEach(direction => {
        if(moveGridItem2({grid, row: botRow, column: botColumn, direction})) {
            botRow += direction.dRow
            botColumn += direction.dColumn
        }
        // printGrid(grid)
    })


    // sum up all the GPS coordinates
    let sum = 0
    grid.iterate((row, column, e) => {
        if (e.boxLeft) { 
            sum += (100 * row) + column
        }
    })
    return sum;
}

const parse = (input) => { 
    const moves = []
    const gridLines = []

    // console.log(input)
    utils.parseSeparatedSections({input, parsers: [
        (l) => gridLines.push(l),
        (l) => l.replaceAll('&lt;', '<').replaceAll('&gt;', '>').split('').forEach(s => { 
            switch(s) {
                case '^':
                    moves.push(utils.DIRECTIONS.N)
                    break;
                case '<':
                case '<':
                    moves.push(utils.DIRECTIONS.W)
                    break;
                case '>':
                case '>':
                    moves.push(utils.DIRECTIONS.E)
                    break;
                case 'v': 
                    moves.push(utils.DIRECTIONS.S)
                    break;
            }
        }),
    ]})

    let botRow
    let botColumn
    const grid = new utils.Grid(gridLines.join('\n'), '', (e, row, column) => {
        switch(e) {
            case '#':
                return {wall: true}
            case '.':
                return {empty: true}
            case 'O':
                return {box: true}
            case '@':
                botRow = row
                botColumn = column
                return {bot: true}
        }
    })
    return {grid, moves, botRow, botColumn}
}


const parse2 = (input) => { 
    const moves = []
    const gridLines = []

    // console.log(input)
    utils.parseSeparatedSections({input, parsers: [
        (l) => gridLines.push(l),
        (l) => l.replaceAll('&lt;', '<').replaceAll('&gt;', '>').split('').forEach(s => { 
            switch(s) {
                case '^':
                    moves.push(utils.DIRECTIONS.N)
                    break;
                case '<':
                case '<':
                    moves.push(utils.DIRECTIONS.W)
                    break;
                case '>':
                case '>':
                    moves.push(utils.DIRECTIONS.E)
                    break;
                case 'v': 
                    moves.push(utils.DIRECTIONS.S)
                    break;
            }
        }),
    ]})

    let botRow
    let botColumn
    const grid = new utils.Grid(gridLines.join('\n'), '', (e, row, column) => {
        switch(e) {
            case '#':
                return [{wall: true}, {wall:true}]
            case '.':
                return [{empty: true},{empty: true}]
            case 'O':
                return [{boxLeft: true}, {boxRight: true}]
            case '@':
                botRow = row
                botColumn = column * 2
                return [{bot: true}, {empty: true}]
        }
    })
    return {grid, moves, botRow, botColumn}
}

aoc.fetchDayCodes('2024', '15').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample2 = parse(codes[8])
    const p1Answer2 = part1(sample2)
    const p1Real2 = utils.parseAnswerFromEms(codes[16])
    if (p1Answer2 != p1Real2) { 
        console.log('failed on part 1 test case 2', p1Answer2, p1Real2)
        return
    }

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[15]);
    const samplePart1Answer = part1(sample1);
    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Sample1 = parse2(codes[28])
    const part2Answer2 = part2(part2Sample1)
    const part2Real2 = 618
    if(part2Real2 != part2Answer2) { 
        console.log('failed on part 2 test case 2', part2Real2, part2Answer2)
        return
    }

    const part2Answer = part2(parse2(codes[0]));
    const part2Correct = utils.parseAnswerFromEms(codes[35]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '15'), aoc.fetchDayAnswers('2024', '15')]).then(([input, answers]) => {

        const list_of_ints = parse(input)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        const answer3 = part2(parse2(input));
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
