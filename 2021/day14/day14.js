
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const countOfCharacters = (state, step) => { 
    let newState = state
    let min = Number.MAX_SAFE_INTEGER
    let max = 0

    console.log(`count at ${step}`)
    while(newState.length > 0) { 
        const newestState = newState.replaceAll(newState[0], '')
        
        // console.log('checking counts', state, newState)
        const currentCount = newState.length - newestState.length
        if ( currentCount > max) { 
            max = currentCount
        }
        if ( currentCount < min) { 
            min = currentCount
        }
        console.log(`${newState[0]}\t${currentCount}`)
        newState = newestState
    }
}

const part1 = ({start, rules}) => {
    // console.log('starting p1', start, rules)
    // return
    let state = start
    for (var step = 0; step < 10; step += 1) {
        // console.log('getting stuck in here somehow', state)
        let bState = ''
        for (var i = 0; i < state.length - 1; i += 1) { 
            // console.log('in this loop', bState)
            bState = bState + state[i] + rules.get(state.slice(i, i + 2))
        }
        bState += state[state.length - 1]
        state = bState
        // countOfCharacters(state, step + 1)
    }

    let min = Number.MAX_SAFE_INTEGER
    let max = 0
    while(state.length > 0) { 
        const newState = state.replaceAll(state[0], '')
        
        // console.log('checking counts', state, newState)
        const currentCount = state.length - newState.length
        if ( currentCount > max) { 
            max = currentCount
        }
        if ( currentCount < min) { 
            min = currentCount
        }
        state = newState
    }

    return max - min
}

const part2 = ({start, rules}) => {
    // console.log('starting p2', start, rules)
    // return
    let state = new Map() // map pair to count
    const letterCount = new Map()
    letterCount.set(start[0], 1)
    for (var i = 0; i < start.length - 1; i += 1) { 
        letterCount.set(start[i + 1], (letterCount.get(start[i + 1]) || 0) + 1)
        state.set(start.slice(i, i+ 2), (state.get(start.slice(i, i+ 2)) || 0) + 1)
    }

    for (var step = 0; step < 40; step += 1) {
        // console.log('getting stuck in here somehow', step, letterCount, state)
        let bState = new Map()
        
        // NNCB NCNBCHB
        // NN -> C
        // NC, CN
        // NC -> B
        // NB, BC
        // CB -> H
        // CH, HB
        rules.forEach((to, from) => {
            // console.log('checking rules', from, to, state.get(from))
            letterCount.set(to, (letterCount.get(to) || 0) + (state.get(from) || 0))
            bState.set(from[0] + to, (bState.get(from[0] + to) || 0) + (state.get(from) || 0))
            bState.set(to + from[1], (bState.get(to + from[1]) || 0) + (state.get(from) || 0))
        })

        state = bState
    }

    // console.log('ok lets check counts', state, state.entries())
    let [min, max] = letterCount.entries().reduce(([min, max], [_l, count]) => { 
        // console.log('reducing map 2', min, max, _l, count)

        if (count < min) { 
            return [count, max]
        } else if (count > max) { 
            return [min, count]
        } else { 
            return [min, max]
        }
    }, [Number.MAX_SAFE_INTEGER, 0])

    // console.log('max min calculated', min, max)
    return max - min
}

const parse = (input, realInput=false) => { 
    let start
    const rules = new Map()
    utils.parseSeparatedSections({
        input,
        parsers: [
            (line) => start = line,
            (line) => {
                const [from, to] = line.split(realInput ? ' -> ' : ' -&gt; ')
                rules.set(from, to)
            }
        ]
    })

    return {start, rules}
}
aoc.fetchDayCodes('2021', '14').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[0])
    const p1Answer = utils.parseAnswerFromEms(codes[29]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[35]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '14'), aoc.fetchDayAnswers('2021', '14')]).then(([input, answers]) => {

        const list_of_ints = parse(input, true)
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
