
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({grid, folds}) => {
    const fold = folds[0]
    grid.iterate((row, column) => {
        if (fold.direction === 'y') { 
            const dy = row - fold.magnitude
            if (dy > 0) { 
                grid.set(fold.magnitude - dy, column, true)
                grid.delete(row, column)
            }
        } else {
            const dx = column - fold.magnitude
            if (dx > 0) {
                grid.set(row, fold.magnitude - dx, true)
                grid.delete(row, column)
            }
        }
    })
    return grid.size();
}

const part2 = ({grid, folds}) => {
    folds.forEach(fold => { 
        grid.iterate((row, column) => {
            if (fold.direction === 'y') { 
                const dy = row - fold.magnitude
                if (dy > 0) { 
                    grid.set(fold.magnitude - dy, column, true)
                    grid.delete(row, column)
                }
            } else {
                const dx = column - fold.magnitude
                if (dx > 0) {
                    grid.set(row, fold.magnitude - dx, true)
                    grid.delete(row, column)
                }
            }
        })
    })

    // print it so we can read the letters
    grid.iterate((row, column, i) => {
        const c = i ? '#' : '.'
        process.stdout.write(c)
    }, () => process.stdout.write("\n"), false)
    process.stdout.write("\n")
    return
}

const parse = (lines) => { 
    const grid = new utils.SparseGrid();
    const folds = []
    utils.parseSeparatedSections({
        input: lines,
        parsers: [
            (nextLine) => {
                const [column, row] = nextLine.split(',').map(s => parseInt(s))
                grid.set(row, column, true)
            },
            (nextLine) => { 
                const [_1, _2, direction, magnitude] = nextLine.split(/\s+|=/)
                folds.push({direction, magnitude})
            }
        ]
    })
    // let readyForFolds = false
    // while(lines.length > 0) { 
    //     const nextLine = lines.shift()
    //     if (readyForFolds) { 
    //         if (nextLine === "") { 
    //             continue
    //         }
    //         const [_1, _2, direction, magnitude] = nextLine.split(/\s+|=/)
    //         folds.push({direction, magnitude})
    //     } else if (nextLine === "") {
    //         readyForFolds = true
    //     } else { 
    //         const [column, row] = nextLine.split(',').map(s => parseInt(s))
    //         grid.set(row, column, true)
    //     }
    // }
    // console.log('made stuff', folds)
    // grid.print()
    return {grid, folds}
}

aoc.fetchDayCodes('2021', '13').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[1])
    const p1Answer = utils.parseAnswerFromEms(codes[27]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '13'), aoc.fetchDayAnswers('2021', '13')]).then(([input, answers]) => {

        const list_of_ints = parse(input);
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        // part 2 answer is not easily checked since it is visual
        console.log('part 2 display')
        part2(list_of_ints);
    });
})

// note: can only submit once since the submit input disappears 
