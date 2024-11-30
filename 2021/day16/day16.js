
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = () => {
    return null;
}

const part2 = () => {
    return null;
}

const factory = (hexString) => { 
    const headerPart = parseInt(hexString.slice(0, 2), 16)
    const version = headerPart >> 5
    const idType = (headerPart >> 2) & 7

    if (idType == 4) { 
        // literal type
        return new LiteralPacket({version, idType})
    }

    // operator type
    // VVVIIILX
    const lengthTypeId = (headerPart >> 1) & 1
    if (lengthTypeId == 0) { 
        // next 15 bits represents total length in bits of sub-packets
        const subPacketLength = ((headerPart & 1) << 14) & (parseInt(hexString.slice(2, 6), 16) >> 2)
        
    } else { 
        // next 11 bits represent number of sub-packets contained in this packet
    }
    return new OperatorPacket({version, idType})
}

class Packet {
    constructor({version, idType}) {
        this.version = version
        this.idType = idType
    }

    toString() {
        `version=${this.version}`
    }
}

class LiteralPacket extends Packet {
    constructor({version, idType}) {
        super({version, idType})
        this.literalValue = 0
    }

    toString() {
        `${super.toString()};literalValue=${this.literalValue}`
    }
}

class OperatorPacket extends Packet { 
    constructor({version, idType}) { 
        super({version, idType})
    }
}

aoc.fetchDayCodes('2021', '16').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = factory(codes[7])
    // const answer1 = parseInt(codes[8].split("\n")[0], 2)
    const version1 = parseInt(codes[11], 10)

    if(sample1.version !== version1 /*|| sample1.literalValue !== answer1 */) { 
        console.log('failed on part 1 test case', sample1.toString(), answer1);
        return;
    }

    const sample2 = factory(codes[33])
    const version2 = parseInt(codes[38], 10)

    if(sample2.version !== version2) { 
        console.log('failed on part1 case 2', sample2.toString(), version2)
    }

    const sample3 = factory(codes[52])
    const version3 = parseInt(codes[57], 10)

    if(sample3.version !== version3) { 
        console.log('failed on part1 case 3', sample3.toString(), version3)
    }

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2021', '16'), aoc.fetchDayAnswers('2021', '16')]).then(([input, answers]) => {

        const list_of_ints = utils.stringListToFirstInt(input.split("\n"));
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
