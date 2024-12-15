
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (machines) => {
    const maxPress = 100
    // console.log('part1 start', JSON.stringify(machines))

    // so for each machine we're going to develop a 2d matrix, 
    // where X is the times A is pressed and Y is the times B is pressed
    // and m[x][y] = [A.x * x + B.x * y, A.y * y + B.y * y]
    // we'll calculate this through the max button presses (100)
    // and keep track of the minimum cost of places that exactly reach
    // the prize X/Y
    // I guess we don't really need the matrix though

    let sum = 0
    machines.forEach(machine => { 
        if(!machine.a) { 
            return 
        }
        // const locations = utils.initArray(maxPress, () => initArray(maxPress))
        let minCost = Number.MAX_SAFE_INTEGER
        for(var x = 0; x < maxPress; x++) {
            for (var y = 0; y < maxPress; y++) { 
                // console.log('machine', machine, machine.a, machine['a'])
                if(
                    (x*machine.a.x + y*machine.b.x) == machine.prize.x && 
                    (x*machine.a.y + y*machine.b.y) == machine.prize.y
                ) {
                    // console.log('candidate', x, y, machine, minCost, cost)
                    const cost = (x * 3) + y
                    minCost = cost < minCost ? cost : minCost
                }
            }
        }
        sum += minCost != Number.MAX_SAFE_INTEGER ? minCost : 0
    })
    return sum;
}

const part2 = (machines) => {
    // so for this one, can we establish a MIN bound on A & B presses to get near the number?
    // for whichever prize level (x or y) is higher, and whichever button press 
    // increases that number faster, that would be a min bound
    // no this doesn't really make sense because the minPress is only one of the buttons, not both 
    
    const maxPress = 500000000000
    const modifier = 10000000000000
    let sum = 0
    machines.forEach(machine => { 
        if(!machine.a) { 
            return 
        }
        
        // min bound?
        let minPress
        let isAMin = true
        if(machine.prize.x > machine.prize.y) {
            if(machine.a.x > machine.b.x) { 
                minPress = Math.ceil((machine.prize.x + modifier) / machine.a.x)
            } else { 
                minPress = Math.ceil((machine.prize.x  +modifier) / machine.b.x)
                isAMin = false
            }
        } else { 
            if(machine.a.y > machine.b.y) {
                minPress = Math.ceil((machine.prize.y + modifier) / machine.a.y)
            } else { 
                minPress = Math.ceil((machine.prize.y + modifier) / machine.b.y)
                isAMin = false
            }
        }
        console.log('minPress', minPress)
        let minCost = Number.MAX_SAFE_INTEGER
        for(var x = isAMin ? minPress : 0; x < isAMin ? minPress+100 : 100; x++) {
            for (var y = isAMin ? 0 : minPress; y < isAMin ? 100 : minPress+100; y++) { 
                // console.log('machine', machine, machine.a, machine['a'])
                const tX = x*machine.a.x + y*machine.b.x
                const tY = x*machine.a.y + y*machine.b.y
                // abandon branches that exceed the target
                if(tX > machine.prize.x+modifier || tY > machine.prize.y+modifier) {
                    break
                }
                if(tX == machine.prize.x + modifier && tY == machine.prize.y + modifier) {
                    console.log('candidate', x, y, machine, minCost, cost)
                    const cost = (x * 3) + y
                    minCost = cost < minCost ? cost : minCost
                }
            }
        }
        sum += minCost != Number.MAX_SAFE_INTEGER ? minCost : 0
    })
    return sum;
}

const buttonRegex = /Button (A|B): X\+(\d+), Y\+(\d+)/
const prizeRegex = /Prize: X=(\d+), Y=(\d+)/

const parse = (input) => { 
    const machines = []
    let currentMachine = {}

    input.split("\n").forEach(line => { 
        if (line == '') { 
            machines.push(currentMachine)
            currentMachine = {}
        } else if (line.match(buttonRegex)) { 
            const [_, label, x, y] = line.match(buttonRegex)
            if(currentMachine.a) {
                currentMachine.b = {x: parseInt(x), y: parseInt(y)}
            } else { 
                currentMachine.a = {x: parseInt(x), y: parseInt(y)}
            }
        } else if (line.match(prizeRegex)) { 
            const [_, x, y] = line.match(prizeRegex)
            currentMachine.prize = {x: parseInt(x), y: parseInt(y)}
        }
    })
    return [...machines]
}

aoc.fetchDayCodes('2024', '13').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[8] + "\n")
    const p1Answer = utils.parseAnswerFromEms(codes[43]);
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

    Promise.all([aoc.fetchDayInput('2024', '13'), aoc.fetchDayAnswers('2024', '13')]).then(([input, answers]) => {

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
