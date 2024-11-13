
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ([adjacency, isBig]) => {
    // console.log('isBig', isBig)
    // console.log('*******************************')
    let count = 0
    const toVisit = [['start', []]]
    // const visited = new Set()
    while(toVisit.length > 0) { 
        const [nextVisit, visited] = toVisit.pop()
        if(nextVisit === 'end') { 
            // console.log('found end', visited, nextVisit)
            count += 1
            continue;
        }
        if(visited.indexOf(nextVisit) >= 0 && !isBig.has(nextVisit)) {
            continue;
        }
 
        // console.log('visiting and looking up neighbors', nextVisit, visited)
        const neighbors = adjacency[nextVisit]
        if (neighbors) { 
            neighbors.forEach(neighbor => toVisit.push([neighbor, [...visited, nextVisit]]))
        }
    }
    // console.log('*****************************')
    return count;
}

const part2 = () => {
    return null;
}

const parse = (lines) => { 
    const adjacency = {}
    const isBig = new Set()
    lines.forEach(l => {
        if (l === '') { 
            return
        }
        const [from, to] = l.split(/\W/)
        // console.log('parsing l', l, from, to)
        if('A' <= from[0] && from[0] <= 'Z') { 
            isBig.add(from)
        }
        if('A' <= to[0] && to[0] <= 'Z') {
            isBig.add(to)
        }
        adjacency[from] = [...(adjacency[from] || []), to]
        adjacency[to] = [...(adjacency[to] || []), from]
    })

    return [adjacency, isBig]
}

aoc.fetchDayCodes('2021', '12').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample3 = codes[0].split("\n").filter(n => n != "")
    const p1Answer3 = utils.parseAnswerFromEms(codes[11])
    const p1Answ3 = part1(parse(sample3))
    if (p1Answer3 != p1Answ3) { 
        console.log('failed on part 1 test case 3', p1Answ3, p1Answer3)
        return
    }

    const sample2 = codes[18].split("\n").filter(n => n != "")
    const p1Answer2 = parseInt(codes[19])
    const p1Answ2 = part1(parse(sample2))
    if (p1Answer2 != p1Answ2) { 
        console.log('failed on part 1 test case 2', p1Answ2, p1Answer2)
        return
    }

    const sample1 = parse(codes[22].split("\n").filter(n => n != ""))
    const p1Answer = parseInt(codes[21]);
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

    Promise.all([aoc.fetchDayInput('2021', '12'), aoc.fetchDayAnswers('2021', '12')]).then(([input, answers]) => {

        const list_of_ints = parse(input.split("\n"));
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
