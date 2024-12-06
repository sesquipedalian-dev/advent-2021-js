
import aoc from '../../util/aoc.js';
import utils from './utils.js';

const part1 = ({orderingRules, updates}) => {
    // console.log('part1 inputs', JSON.stringify(orderingRules, null, 2), JSON.stringify(updates, null, 2))
    return updates.reduce((accum, update) => { 
        const sorted = [...update].sort((a, b) => {
            if (a == b) { 
                return 0
            }
            const orderingRule = orderingRules.find(({before, after}) => (before == a && after == b) || (before == b && after == a))
            if (!orderingRule) { 
                return 0
            }
            return (orderingRule.before == a && orderingRule.after == b) ? -1 : 1
        })
        // console.log('iteration', JSON.stringify(sorted), JSON.stringify(update))
        if (JSON.stringify(sorted) === JSON.stringify(update)) {
            return accum + update[Math.floor(update.length / 2)]
        }

        return accum
    }, 0)
}

const part2 = ({orderingRules, updates}) => {
    // console.log('part1 inputs', JSON.stringify(orderingRules, null, 2), JSON.stringify(updates, null, 2))
    return updates.reduce((accum, update) => { 
        const sorted = [...update].sort((a, b) => {
            if (a == b) { 
                return 0
            }
            const orderingRule = orderingRules.find(({before, after}) => (before == a && after == b) || (before == b && after == a))
            if (!orderingRule) { 
                return 0
            }
            return (orderingRule.before == a && orderingRule.after == b) ? -1 : 1
        })
        // console.log('iteration', JSON.stringify(sorted), JSON.stringify(update))
        if (JSON.stringify(sorted) !== JSON.stringify(update)) {
            return accum + sorted[Math.floor(update.length / 2)]
        }

        return accum
    }, 0)
}

const parse = (input) => {
    const orderingRules = []
    const updates = []

    utils.parseSeparatedSections({
        input, 
        parsers: [
            (l) => {
                const [before, after] = l.split('|').filter(s => s != '').map(i => parseInt(i, 10))
                orderingRules.push({before, after})
            },
            (l) => { 
                updates.push(l.split(',').filter(s => s != '').map(i => parseInt(i)))
            }
        ]
    })

    return {orderingRules, updates}
}
aoc.fetchDayCodes('2024', '5').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = parse(codes[5])
    const p1Answer = utils.parseAnswerFromEms(codes[36]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = utils.parseAnswerFromEms(codes[47]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2024', '5'), aoc.fetchDayAnswers('2024', '5')]).then(([input, answers]) => {
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
