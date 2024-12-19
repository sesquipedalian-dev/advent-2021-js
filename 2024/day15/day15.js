
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

const part2 = () => {
    return null;
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

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '15'), aoc.fetchDayAnswers('2024', '15')]).then(([input, answers]) => {

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
