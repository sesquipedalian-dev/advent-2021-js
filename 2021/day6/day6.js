
import aoc from '../../util/aoc.js';
import utils from './utils.js';

// state: [{current, max}]
// days: int
const part1 = utils.memoize(function p1({state, days}) {
    // console.log('p1 called', state, days)
    const objectCount = state.length;
    // base case - if no fishes then we can return 0 
    if (objectCount < 1) {
        return 0
    }
    // base case - if this was the last day great, we just need a number of current fish
    if (days == 0) { 
        return objectCount
    }
    // recursion case - if more than one fish, sum each of the fish in the current state
    if (objectCount > 1) {
        return state.reduce((accum, fish) => accum + p1({state: [fish], days: days}), 0)
    }

    // recursion case - if we're down to one fish, iterate one day
    const newState = [...state]
    switch(newState[0].current) {
        case 0:
            newState[0].current = newState[0].max - 1;
            newState.push({current: newState[0].max + 1, max: newState[0].max });
            break;
        default:
            newState[0].current = newState[0].current - 1;
    }
    return p1({state: newState, days: days - 1});
});

// so state = array, each index is the acount of fish with that timer remaining for a given day
// e.g. [0, 1, 1, 2, 1, 0, 0, 0, 0]
const part2 = ({state: initialState, days}) => {
    let state = Array(9)
    initialState.forEach(({current}) => state[current] = (state[current] || 0) + 1)
    // console.log('part 2 starting with state', initialState, state, Number.MAX_SAFE_INTEGER);
    for(var day = 0; day < days; day += 1) {
        // console.log('part 2 iteration', day, state)
        const newState = Array(9)
        // fish at 0 reset to 6 and make a new fish
        newState[6] = state[0]
        newState[8] = state[0]
        for (var i = 1; i <= 8; i += 1) {
            newState[i - 1] = (newState[i - 1] || 0) + (state[i] || 0)
        }
        state = newState;
    }
    return state.reduce((sum, count) => sum + count, 0);
}

aoc.fetchDayCodes('2021', '6').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    let sample1 = codes[12].split(",").map(n => parseInt(n)).filter(n => n > 0).map(n => ({current: n, max: 7}));

    const p12Answer = parseInt(codes[20]);
    const sampleP12Answer = part1({state: sample1, days: 18});
    if (sampleP12Answer != p12Answer) {
        console.log('failed on part 1-2 test case', sampleP12Answer, p12Answer);
    }

    sample1 = codes[12].split(",").map(n => parseInt(n)).filter(n => n > 0).map(n => ({current: n, max: 7}));
    const p1Answer = utils.parseAnswerFromEms(codes[21]);
    const samplePart1Answer = part1({state: sample1, days: 80});

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    sample1 = codes[12].split(",").map(n => parseInt(n)).filter(n => n > 0).map(n => ({current: n, max: 7}));
    const part2Answer = part2({state: sample1, days: 256});
    const part2Correct = utils.parseAnswerFromEms(codes[23]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '6'), aoc.fetchDayAnswers('2021', '6')]).then(([input, answers]) => {
        let list_of_ints = input.split(',').map(n => parseInt(n)).filter(n => n > 0).map(n => ({current: n, max: 7}));
        const answer2 = part1({state: list_of_ints, days: 80});
        let answer2Right;
        if (answers.length > 0) { 
            answer2Right = answers[0] == answer2.toString();
        }
        console.log('part 1 answer', answer2, answer2Right);

        list_of_ints = input.split(',').map(n => parseInt(n)).filter(n => n > 0).map(n => ({current: n, max: 7}));
        const answer3 = part2({state: list_of_ints, days: 256});
        let answer3Right;
        if (answers.length > 1) { 
            answer3Right = answers[1] == answer3.toString();
        }
        console.log('part 2 answer', answer3, answer3Right);
    });
})

// note: can only submit once since the submit input disappears 
