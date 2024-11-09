
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

// return new array of all values in all provided arrays
// e.g. intersection([1,2,3,4,5], [2,3,4,5,6], [3,4,5,6,7]) === [3,4,5]
const intersection = (...args) => {
    const [head, ...rest] = [...args];
    return rest.reduce((prev, next) => prev.filter(v => next.includes(v)), head)
}

// test
// console.log('array intersection?', intersection([1,2,3,4,5], [2,3,4,5,6], [3,4,5,6,7]))
// strip any <em></em> tags from the string
const stripEms = (string) => string.replaceAll('<em>', '').replaceAll('</em>', '')

// grid of items
// y on top
// x,y coord = y row, x column
class Grid {
    // construct from a single string, each line will be a row and each {separator}-separated character string will be an entry
    // lines - the string
    // separator - separator between entries within a row (e.g. '' to split on every char)
    // parse - parse individual entries, e.g. parseInt
    constructor(lines, separator=/\s+/, parse=(e) => e, diagonalNeighbors=false) {
        this.items = lines.split('\n').filter(n => n != '').map(l => stripEms(l).split(separator).filter(n => n != '').map(s => parse(s)))
        this.internalDiagonalNeighbors = diagonalNeighbors
    }

    get diagonalNeighbors() { 
        return this.internalDiagonalNeighbors
    }

    set diagonalNeighbors(trueOrFalse) {
        this.internalDiagonalNeighbors = !!trueOrFalse
    }

    // item at row, column 
    at(row, column) {
        return this.items[row][column]
    }

    // set row y, column x to item
    set(row, column, item) {
        this.items[row][column] = item
    }

    // get all adjacent indices to the given index, 
    // excluding things that are out of bounds
    // in N (NE) E (SE) S (SW) W (NW) order
    // neighbors in () only count when this.diagonalNeighbors is true
    neighboringIndexes(row, column) {
        const neighbors = []
        if (row > 0) { 
            neighbors.push([row - 1, column])
            if(this.diagonalNeighbors && column > 0) {
                neighbors.push([row - 1, column -1 ])
            }
            if(this.diagonalNeighbors && column < this.columns - 1) {
                neighbors.push([row - 1, column + 1])
            }
        }
        if (column < this.columns - 1) {
            neighbors.push([row, column + 1])
        }
        if (row < this.rows - 1) {
            neighbors.push([row + 1, column])
            if(this.diagonalNeighbors && column > 0) {
                neighbors.push([row + 1, column - 1])
            }
            if(this.diagonalNeighbors && column < this.columns - 1) {
                neighbors.push([row + 1, column + 1])
            }
        }
        if (column > 0) {
            neighbors.push([row, column - 1])
        }
        return neighbors
    }

    // number of rows
    get rows() {
        return this.items.length
    }

    // number of columns
    get columns() { 
        return this.items[0].length
    }

    // iterate through all entries in the grid.  callbacks for
    // - newRow - called when first stepping into a row with the row index?
    // - entry - called for each entry in the table, in order of row, then column.  called with x, y, and item.
    iterate(entry, newRow=() => {}) {
        // console.log('about to iterate', this.rows, this.columns, this.items)
        for (let row = 0; row < this.rows; row += 1) {
            newRow(row)
            for (let column = 0; column < this.columns; column += 1) { 
                entry(row, column, this.at(row, column))
            }
        }
    }

    // print out the grid, space separated
    print() {
        this.iterate((_r, _c, i) => process.stdout.write(`${i} `), () => process.stdout.write("\n"))
        process.stdout.write("\n")
    } 
}

// test grid
// const testGrid = new Grid(`
//     1   2  3  4  5
//     6   7  8  9 10
//     11 12 13 14 15
// `)
// console.log('neighbors', testGrid.neighboringIndexes(0, 0))
// console.log('neighbors', testGrid.neighboringIndexes(2, 5))
// console.log('neighbors', testGrid.neighboringIndexes(2, 0))
// console.log('neighbors', testGrid.neighboringIndexes(0, 5))

// testGrid.diagonalNeighbors = true
// console.log('neighbors', testGrid.neighboringIndexes(0, 0))
// console.log('neighbors', testGrid.neighboringIndexes(2, 5))
// console.log('neighbors', testGrid.neighboringIndexes(2, 0))
// console.log('neighbors', testGrid.neighboringIndexes(0, 5))

export default {
    stringListToFirstInt,
    stringToBinary,
    initArray,
    rotateRight,
    parseAnswerFromEms,
    memoize,
    intersection,
    stripEms,
    Grid,
};