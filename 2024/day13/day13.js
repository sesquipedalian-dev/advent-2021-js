
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (machines) => {
    // so these are pairs of linear equations
    // if X is the count of A button presses and Y is the count of B button presses
    // we want to find X and Y such that e.g.
    // 94x + 22y = 8400
    // 34x + 67y = 5400
    // solve the first for X
    // x = 8400/94 - 22y/94
    // plugin that in to the second
    // 34*8400/94 - 34*22y/94 + 67y = 5400
    // y(67 - 34*22/94) = 5400 - 34*8400/94
    // y = (5400 - 34*8400/94) / (67 - 22*34/94)
    // and then you can solve the origin al X
    // due to the vagaries of floating point, we should Math.round
    // we check if the results work out to the expect numbers as well.
    // if not, the prize is not solvable.

    let sum = 0
    machines.forEach(machine => { 
        if (!machine.a) { 
            return
        }

        const y = Math.round((machine.prize.y - machine.a.y*machine.prize.x / machine.a.x) / (machine.b.y - machine.b.x*machine.a.y/machine.a.x))
        const x = Math.round((machine.prize.x / machine.a.x) - (machine.b.x * y / machine.a.x))
        // console.log('system of equations', JSON.stringify(machine), x, y)
        if(
            Math.round(x * machine.a.x + y * machine.b.x) == machine.prize.x &&
            Math.round(x * machine.a.y + y * machine.b.y) == machine.prize.y
        ) {
            sum += x * 3 + y
        }

    })
    return sum
}

const part2 = (machines) => {
    // same as part 1, but increase the prize points
    let sum = 0
    machines.forEach(machine => { 
        if (!machine.a) { 
            return
        }

        machine.prize.x += 10000000000000
        machine.prize.y += 10000000000000
        const y = Math.round((machine.prize.y - machine.a.y*machine.prize.x / machine.a.x) / (machine.b.y - machine.b.x*machine.a.y/machine.a.x))
        const x = Math.round((machine.prize.x / machine.a.x) - (machine.b.x * y / machine.a.x))
        // console.log('system of equations', JSON.stringify(machine), x, y)
        if(
            Math.round(x * machine.a.x + y * machine.b.x) == machine.prize.x &&
            Math.round(x * machine.a.y + y * machine.b.y) == machine.prize.y
        ) {
            sum += x * 3 + y
        }

    })
    return sum
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
