
import aoc from '../../util/aoc.js';
import {stringListToFirstInt} from './utils.js';

const part1 = (list_of_directions) => {
    const [finalX, finalY] = list_of_directions.reduce(([posX, posY], nextDirection) => { 
        const [direction, magnitude] = nextDirection.split(/\s+/);
        const magnitudeInt = parseInt(magnitude);
        switch (direction) {
            case 'forward':
                return [posX + magnitudeInt, posY];
            case 'down':
                return [posX, posY + magnitudeInt];
            case 'up' :
                return [posX, posY - magnitudeInt];
            default:
                return [posX, posY];
        }
    }, [0, 0])
    return finalX * finalY;
}

const part2 = (list_of_directions) => {
    const [finalX, finalY] = list_of_directions.reduce(([posX, posY, aim], nextDirection) => { 
        const [direction, magnitude] = nextDirection.split(/\s+/);
        const magnitudeInt = parseInt(magnitude);
        switch (direction) {
            case 'forward':
                return [posX + magnitudeInt, posY + (aim * magnitudeInt), aim];
            case 'down':
                return [posX, posY, aim + magnitudeInt];
            case 'up' :
                return [posX, posY, aim - magnitudeInt];
            default:
                return [posX, posY, aim];
        }
    }, [0, 0, 0])
    return finalX * finalY;
}


aoc.fetchDayCodes('2021', '2').then(codes => { 
    // console.log('all the codes', codes.map((c, i) => [c, i]));
    // return;

    const sample1 = codes[11].split("\n");
    const p1Answer = parseInt(codes[33].split(/>|</)[2]);
    const samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    const part2Answer = part2(sample1);
    const part2Correct = parseInt(codes[71].split(/>|</)[2]);
    if (part2Answer != part2Correct) {
        console.log('failed on part 2 test case', part2Answer, part2Correct);
        return;
    }

    Promise.all([aoc.fetchDayInput('2021', '2'), aoc.fetchDayAnswers('2021', '2')]).then(([input, answers]) => {
        const list_of_ints = input.split("\n");
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
