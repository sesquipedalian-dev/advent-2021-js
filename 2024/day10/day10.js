
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (grid) => {
    // grid.print()

    // keep a tally of 9s accessible at each position
    // find all the 9s as the starting point
    // dfs from there to a 0, only taking 1 magnitude steps 
    // during this DFS only visit each coord once (hold onto a visited collection)
    grid.iterate((row, column, i) => { 
        if (!i.blank && i.height == 9) { 
            const visited = {}
            const toVisit = [[row, column]]
            while(toVisit.length > 0) { 
                const [vRow, vColumn] = toVisit.pop()
                if (visited[`${vRow},${vColumn}`]) { 
                    continue
                }
                visited[`${vRow},${vColumn}`] = true

                grid.at(vRow, vColumn).tally += 1
                grid.neighboringIndexes(vRow, vColumn)
                    .filter(([nRow, nColumn]) => {
                        const n = grid.at(nRow, nColumn)
                        return !n.blank && n.height == (grid.at(vRow, vColumn).height - 1 )
                    })
                    .forEach(p => toVisit.push(p))
            }
        }
    })

    // after, find each 0 and count up their tallies 
    let sum = 0
    grid.iterate((row, column, {blank, height, tally}) => !blank && height == 0 && (sum += tally))
    return sum;
}

const part2 = () => {
    return null;
}

const parse = (input) => { 
    return new utils.Grid(
        input,
        '',
        (n) => n == '.' ? {blank: true} : {height: parseInt(n), tally: 0}
    )
}

aoc.fetchDayCodes('2024', '10').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[2])
    const p1Answer = parseInt(codes[7]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part1Sample2 = parse(codes[10])
    const part1Real2 = parseInt(codes[9])
    const part1Answer2 = part1(part1Sample2)
    if (part1Real2 != part1Answer2) { 
        console.log('failed on part 1 test case 2', part1Real2, part1Answer2)
        return
    } 

    const part1Sample3 = parse(codes[18])
    const part1Real3 = utils.parseAnswerFromEms(codes[28])
    const part1Answer3 = part1(part1Sample3)
    if (part1Real3 != part1Answer3) { 
        console.log('failed on part 1 test case 3', part1Real3, part1Answer3)
        return
    }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2024', '10'), aoc.fetchDayAnswers('2024', '10')]).then(([input, answers]) => {

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
