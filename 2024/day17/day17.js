
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const MAX_OPS = 1000
const part1 = ({registers, program}) => {
    // console.log('part1 inputs', registers, program)

    let ip = 0
    let ops = 0
    const outputs = []
    while(ip < program.length) {
        if(ops > MAX_OPS) { 
            console.log('bailing due to max operations!')
            return ''
        }
        ops += 1

        const [instruction, operand] = program.slice(ip, ip+2)

        let comboOperandValue
        switch(operand) { 
            case 0:
            case 1:
            case 2:
            case 3:
                comboOperandValue = operand
                break
            case 4:
                comboOperandValue = registers['A']
                break
            case 5:
                comboOperandValue = registers['B']
                break
            case 6:
                comboOperandValue = registers['C']
                break
            case 7:
                // reserved, not in valid programs?
        }

        // console.log('visiting instruction', ip, instruction, operand, comboOperandValue)
        switch(instruction) {
            case 0:
                registers['A'] = Math.floor(registers['A'] / Math.pow(2, comboOperandValue))
                break
            case 1:
                registers['B'] = registers['B'] ^ operand
                break
            case 2:
                registers['B'] = comboOperandValue % 8
                break
            case 3:
                if(registers['A'] != 0) { 
                    ip = operand - 2
                }
                break
            case 4:
                registers['B'] = registers['B'] ^ registers['C']
                break
            case 5:
                outputs.push(comboOperandValue % 8)
                break
            case 6:
                registers['B'] = Math.floor(registers['A'] / Math.pow(2, comboOperandValue))
                break
            case 7:
                registers['C'] = Math.floor(registers['A'] / Math.pow(2, comboOperandValue))
                break
        }

        ip += 2
    }
    // console.log('we got outputs', outputs)
    return outputs.join(',');
}

const part2 = ({registers, program}) => {
    for(var testA = 10_000_000; testA < 100_000_000; testA += 1) {
        // console.log('visiting testA', testA)
        const outputsForTestA = part1({
            registers: {
                ...registers,
                ['A']: testA
            }, program
        })
        if(outputsForTestA == program.join(',')) {
            return testA
        }
    }
}

const registerRegex = /Register ([^:]+): (\d+)/
const parse = (input) => { 
    const registers = {}
    let program = []
    utils.parseSeparatedSections({
        input, 
        parsers: [
            (l) => {
                const [_a, regName, value] = l.match(registerRegex)
                // console.log('regex parts', regName, value, l.match(registerRegex))
                registers[regName] = parseInt(value)
            },
            (l) => {
                const [_, progPart] = l.split(' ')
                const prog = progPart.split(',').filter(n => n != '').map(n => parseInt(n))
                // console.log('program parts', l, progPart, prog)
                program = prog
            }
        ]
    }) 
            
    return {registers, program}
}

aoc.fetchDayCodes('2024', '17').then(codes => { 
    // console.log('all the codes', codes.slice(50).map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[92])
    const p1Answer = codes[95].split(/>|</)[2];
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(parse(codes[99]));
    const part2Correct = utils.parseAnswerFromEms(codes[101]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '17'), aoc.fetchDayAnswers('2024', '17')]).then(([input, answers]) => {

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
