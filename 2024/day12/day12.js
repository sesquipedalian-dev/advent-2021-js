
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

const part2 = () => {
    return null;
}

const parse = (input) => { 
    return new utils.Grid(
        input,
        '',
        (e) => ({regionId: null, value: e}),
    )
}

aoc.fetchDayCodes('2024', '12').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
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
    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

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
