
const numRegex = /\d+(\.\d+)?/;
const stringListToFirstInt = (strings) => { 
    return strings.map(s => s.match(numRegex)).filter(m => m !== null).map(m => m[0]).map(s => parseInt(s));
}

const stringToBinary = (string) => { 
    return parseInt(string, 2);
}

// initialize an array with a callback function
// e.g. 
// initArray(5, (index) => index)
// # [0,1,2,3,4]
const initArray = (size, cb) => {
    return [...Array(size)].map((_, i) => cb(i));
}


// given a string field of white-space separated characters / strings,
// as a list of string lines
// e.g. 
//  1  2  3  4  5
//  6  7  8  9 10
// 11 12 13 14 15
// 
// some useful transformations of them

// e.g.
// 11  6  1
// 12  7  2
// 13  8  3
// 14  9  4
// 15 10  5
//
const rotateRight = (strings) => {
    const rows = strings.length;
    const columns = strings[0].split(/\s+/).filter(n => n != '').length;
    const rotated = initArray(columns, () => initArray(rows, () => ''));
    strings.forEach((s, row) => s.split(/\s+/).filter(n => n != '').forEach((c, col) => rotated[col][rows - row - 1] = c));
    return rotated.map(r => r.join(' '))
}

// tests
// const field = `
//  1  2  3  4  5
//  6  7  8  9 10
// 11 12 13 14 15
// `.split('\n').filter(n => n != '');

// console.log('rotateRight 1', rotateRight(field));
// console.log('rotateRight 2', rotateRight(rotateRight(field)));
// console.log('rotateRight 3', rotateRight(rotateRight(rotateRight(field))));

// `Answer` code blocks look like they're usually surrounded by <em> tags, e.g. <em>5</em> => 5
const parseAnswerFromEms = (string) =>  parseInt(string.split(/>|</)[2]);

// memoize (store map of inputs => outputs and refer to that map before calling f) a given function
const memoize = (f) => {
    const memo = {};
    return (...args) => {
        const memoKey = JSON.stringify(args);
        if (memo[memoKey]) { 
            return memo[memoKey]
        }

        const result = f.apply(this, args)
        memo[memoKey] = result
        return result
    }
}

export default {
    stringListToFirstInt,
    stringToBinary,
    initArray,
    rotateRight,
    parseAnswerFromEms,
    memoize,
};