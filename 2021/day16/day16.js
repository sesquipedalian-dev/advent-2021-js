
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = (packets) => {
    return packets.map(l => factory(parse(l))[0])
        .reduce((s, p) => {
            // console.log('iteration', typeof p, p, s, p.versionSum, p.toString())
            return s + p.versionSum
        }, 0)
}

const part2 = () => {
    return null;
}

const parse = (hexString) => [...hexString].map(l => parseInt(l, 16).toString(2).padStart(4, '0')).reduce((s, n) => s + n, '')

const factory = (binaryString, packetLimit=Number.MAX_SAFE_INTEGER) => { 
    if (packetLimit <= 0) {
        return []
    }
    if(typeof binaryString != 'string') { 
        throw new Error(`invalid input ${binaryString}`)
    }
    if(binaryString.length < 1) { 
        return []
    }
    // console.log('binary string', binaryString)
    const version = parseInt(binaryString.slice(0, 3), 2)
    const idType = parseInt(binaryString.slice(3, 6), 2)
    // console.log(`parse version=${version} && idType=${idType}`)

    if (idType == 4) { 
        // literal type
        // console.log('literal type')
        // consume chunks of 5 while first digit is not 0
        let i = 1
        let literalValueBinary = ''
        let j = 0
        do { 
            i += 5
            // console.log('consuming next chunk', binaryString.slice(i + 1, i + 5))
            j += 1
            literalValueBinary += binaryString.slice(i + 1, i + 5)
        } while (binaryString[i] == '1' && i < binaryString.length)
        const literalValue = parseInt(literalValueBinary, 2)
        const rest = binaryString.slice(i + 5)
        // console.log(`assigning literal value v=${literalValue} rest=${rest}`)
        if (rest.replaceAll('0', '').length > 0) {
            return [new LiteralPacket({version, idType, literalValue, length: 6 + (j*5)}), ...factory(rest, packetLimit - 1)]
        } 

        // 110100 10111 11110 00101 000
        // 
        // 1010010001001000000000
        // 0101001000100100
        // console.log('consuming rest?', j, rest, binaryString)
        return [new LiteralPacket({version, idType, literalValue, length: 6 + (j * 5) + rest.length})]
    }

    // operator type
    // VVVIIILX
    let subPackets;
    let length;
    const lengthTypeId = binaryString[6]
    if (lengthTypeId == '0') { 
        // next 15 bits represents total length in bits of sub-packets
        length = 15
        const subPacketLength = parseInt(binaryString.slice(8, 22), 2)
        // console.log(`lengthtype 0, subPacketLength ${binaryString.slice(8, 22)} ${subPacketLength} ${parseInt(binaryString.slice(22, 22 + subPacketLength), 2).toString(16)}`)
        subPackets = factory(binaryString.slice(22, 22 + subPacketLength))
    } else { 
        // next 11 bits represent number of sub-packets contained in this packet
        length = 11
        const numSubPackets = parseInt(binaryString.slice(8, 18), 2)
        // console.log('length type 1 calc', numSubPackets)
        // TODO is there a reason for only the numSubPackets??
        subPackets = factory(binaryString.slice(18), numSubPackets)
    }

    // length value + version + idType + lengthTypeId + subPackets' lengths
    length = length + 3 + 3 + 1 + subPackets.reduce((s, p) => {
        // console.log("why is everything never the right type", s, typeof p, p)
        return s + p.length
    }, 0)

    if(length < binaryString.length) {
        const rest = binaryString.slice(length)
        // console.log('more binary string!', rest)
        if (rest.replaceAll('0', '').length < 1) {
            length += rest.length
            return [new OperatorPacket({version, idType, subPackets, length})]
        }
        return [new OperatorPacket({version, idType, subPackets, length}), ...factory(rest)]
    }

    return [new OperatorPacket({version, idType, subPackets, length})]
}

class Packet {
    constructor({version, idType, length}) {
        this.version = version
        this.idType = idType
        this.length = length
    }

    toString() {
        return `version=${this.version};versionSum=${this.versionSum};length=${this.length}`
    }

    get versionSum() { 
        return this.version
    }
}

class LiteralPacket extends Packet {
    constructor({version, idType, literalValue, length}) {
        super({version, idType, length})
        this.literalValue = literalValue
    }

    toString() {
        return `${super.toString()};literalValue=${this.literalValue}`
    }
}

class OperatorPacket extends Packet { 
    constructor({version, idType, subPackets, length}) { 
        super({version, idType, length})
        this.subPackets = subPackets
    }

    toString() {
        // return ''
        // console.log('my subpackets? ', this, this.subPackets)
        return `${super.toString()};subPackets=[${this.subPackets.map(p => p.toString())}]`
    }

    get versionSum() { 
        return super.versionSum + this.subPackets.reduce((s, p) => s + p.versionSum, 0)
    }
}

aoc.fetchDayCodes('2021', '16').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = factory(parse(codes[7]))[0]
    const answer1 = parseInt(codes[29], 10)
    const version1 = parseInt(codes[11], 10)

    // 1101 0010 1111 1110 0010 1000
    // D    2    F    E    2    8
    // so length should be 24
    if(sample1.version !== version1 || sample1.literalValue !== answer1 || sample1.length != (codes[7].length * 4)) { 
        console.log('failed on part 1 test case', sample1.length, codes[7].length * 4, sample1.toString(), answer1);
        return;
    }

    const sample2 = factory(parse(codes[33]))[0]
    const version2 = parseInt(codes[38], 10)

    if(sample2.version !== version2 || 
        (sample2.length != codes[33].length * 4) || 
        sample2.subPackets[0].literalValue !== 10 || 
        sample2.subPackets[1].literalValue !== 20
    ) { 
        console.log('failed on part1 case 2', sample2.length, codes[33].length * 4, sample2.toString(), version2)
        return
    }

    const sample3 = factory(parse(codes[52]))[0]
    const version3 = parseInt(codes[57], 10)

    if(sample3.version !== version3 || sample3.subPackets[0].literalValue != 1 || sample3.subPackets[1].literalValue != 2 || sample3.subPackets[2].literalValue != 3) { 
        console.log('failed on part1 case 3', sample3.toString(), version3)
        return
    }

    // const sample4 = factory(parse('8A004A801A8002F478'))[0]
    // console.log('sample 4 1', sample4.toString())

    // const sample5 = factory(parse('A0016C880162017C3686B18A3D4780'))[0]
    // console.log(`sample 4 2: ${sample5.toString()}`)

    // const part2Answer = part2(sample1);
    // const part2Correct = utils.parseAnswerFromEms(codes[codes.length - 1]);
    // if (part2Answer != part2Correct) {
    //     console.log('failed on part 2 test case', part2Answer, part2Correct);
    //     return;
    // }

    Promise.all([aoc.fetchDayInput('2021', '16'), aoc.fetchDayAnswers('2021', '16')]).then(([input, answers]) => {
        // console.log('******************* starting main **********************')
        const list_of_ints = input.split("\n").filter(n => n.length > 0)
        const answer2 = part1(list_of_ints);
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        // console.log('*********************** end main ***************')
        // 25 is incorrect
        // 805 is too low
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
