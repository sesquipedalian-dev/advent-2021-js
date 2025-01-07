import 'core-js/actual/iterator/index.js';

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
const rotateRight = (strings, separator=/\s+/, joiner=' ') => {' '
    const rows = strings.length;
    const columns = strings[0].split(separator).filter(n => n != '').length;
    const rotated = initArray(columns, () => initArray(rows, () => ''));
    strings.forEach((s, row) => s.split(separator).filter(n => n != '').forEach((c, col) => rotated[col][rows - row - 1] = c));
    return rotated.map(r => r.join(joiner))
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

// given a string field of white-space separated characters / strings,
// as a list of string lines
// e.g. 
//  1  2  3  4  5
//  6  7  8  9 10
// 11 12 13 14 15
// 
// some useful transformations of them

// e.g.
// 1
// 6 2
// 11 7 3
// 12 8 4
// 13 9 5
// 14 10
// 5
//
// TODO TODO *** I think this is being too short in some cases 
const rotateRight45 = (strings, separator=/\s+/, joiner=' ') => {
    const columns = strings[0].split(separator).filter(n => n != '').length;
    const rows = columns + strings.length;
    const rotated = initArray(rows, () => []);
    const orig = strings.map((s) => s.split(separator).filter(n => n != ''))
    for (var row = 0; row < rows; row += 1) {
        for (var col = 0; col < columns; col += 1) {
            if(0 <= (row - col) && (row - col) < strings.length) {
                rotated[row].push(orig[row - col][col])
            }
        }
    }
    return rotated.map(r => r.join(joiner)).map(s => s.trim()).filter(s => s != '')
}
// tests
// const field2 = `
//  1  2  3  4  5
//  6  7  8  9 10
// 11 12 13 14 15
// `.split('\n').filter(n => n != '');

// console.log('rotateRight45 1', rotateRight45(field2));

// const field3 = `
// 1 2 3
// 4 5 6
// 7 8 9`.split('\n').filter(n => n != '');
// console.log('rotateRight45 2', rotateRight45(field3));

// const field4 = `
// 1 2
// 3 4
// 5 6
// 7 8`.split('\n').filter(n => n != '')
// console.log('rotateRight45 3', rotateRight45(field4));

// const field5 =`
// M M M S X X M A S M
// M S A M X M S M S A
// A M X S X M A A M M
// M S A M A S M S M X
// X M A S A M X A M M
// X X A M M X X A M A 
// S M S M S A S X S S
// S A X A M A S A A A
// M A M M M X M M M M
// M X M X A X M A S X
// `.split('\n').filter(n => n!= '')
// console.log('rotateRight45 4', rotateRight45(field5))


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

const DIRECTIONS = {
    N: {dRow: -1, dColumn: 0, name: 'N'},
    NE: {dRow: -1, dColumn: 1, name: 'NE'},
    E: {dRow: 0, dColumn: 1, name: 'E'},
    SE: {dRow: 1, dColumn: 1, name: 'SE'},
    S: {dRow: 1, dColumn: 0, name: 'S'},
    SW: {dRow: 1, dColumn: -1, name: 'SW'},
    W: {dRow: 0, dColumn: -1, name: 'W'},
    NW: {dRow: -1, dColumn: -1, name: 'NW'}
}

const goDirection = (row, column, direction) => {
    return [row + direction.dRow, column + direction.dColumn]
}

const turnDirectionRight90 = (direction) => {
    switch(direction.name) { 
        case DIRECTIONS.N.name:
            return DIRECTIONS.E
        case DIRECTIONS.NE.name:
            return DIRECTIONS.SE
        case DIRECTIONS.E.name:
            return DIRECTIONS.S
        case DIRECTIONS.SE.name:
            return DIRECTIONS.SW
        case DIRECTIONS.S.name:
            return DIRECTIONS.W
        case DIRECTIONS.SW.name:
            return DIRECTIONS.NW
        case DIRECTIONS.W.name:
            return DIRECTIONS.N
        case DIRECTIONS.NW.name:
            return DIRECTIONS.NE
    }
}

const turnDirectionLeft90 = (direction) => {
    switch(direction.name) { 
        case DIRECTIONS.N.name:
            return DIRECTIONS.W
        case DIRECTIONS.NE.name:
            return DIRECTIONS.NW
        case DIRECTIONS.E.name:
            return DIRECTIONS.N
        case DIRECTIONS.SE.name:
            return DIRECTIONS.NE
        case DIRECTIONS.S.name:
            return DIRECTIONS.E
        case DIRECTIONS.SW.name:
            return DIRECTIONS.SE
        case DIRECTIONS.W.name:
            return DIRECTIONS.S
        case DIRECTIONS.NW.name:
            return DIRECTIONS.SW
    }
}

// grid of items
// y on top
// x,y coord = y row, x column
class Grid {
    // construct from a single string, each line will be a row and each {separator}-separated character string will be an entry
    // lines - the string
    // separator - separator between entries within a row (e.g. '' to split on every char)
    // parse - parse individual entries, e.g. parseInt. May return multiple entries.
    constructor(lines, separator=/\s+/, parse=(e) => e, diagonalNeighbors=false) {
        this.items = lines.split('\n').filter(n => n != '').map((l, row) => stripEms(l).split(separator).filter(n => n != '').flatMap((s, column) => parse(s, row, column)))
        this.internalDiagonalNeighbors = diagonalNeighbors
    }

    duplicate() {
        const newGrid = new Grid('')
        newGrid.items = this.items.map(row => [...row])
        newGrid.internalDiagonalNeighbors = this.internalDiagonalNeighbors
        return newGrid
    }

    get diagonalNeighbors() { 
        return this.internalDiagonalNeighbors
    }

    set diagonalNeighbors(trueOrFalse) {
        this.internalDiagonalNeighbors = !!trueOrFalse
    }

    // item at row, column 
    at(row, column) {
        return (this.items[row] || [])[column]
    }

    // set row y, column x to item
    set(row, column, item) {
        this.items[row][column] = item
    }

    size() { 
        return this.rows * this.columns
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
        if(!this.cachedColumns) {
            this.cachedColumns = this.items.reduce((accum, row) => row.length > accum ? row.length : accum, 0)
        }
        
        return this.cachedColumns
    }

    // iterate through all entries in the grid.  callbacks for
    // - newRow - called when first stepping into a row with the row index?
    // - entry - called for each entry in the table, in order of row, then column.  called with x, y, and item.
    iterate(entry, newRow=() => {}, skipNull=true) {
        // console.log('about to iterate', this.rows, this.columns, this.items)
        const startingRows = this.rows;
        const startingCols = this.columns;
        for (let row = 0; row < startingRows; row += 1) {
            newRow(row)
            for (let column = 0; column < startingCols; column += 1) { 
                const item = this.at(row, column)
                if (!skipNull || (item !== undefined)) {
                    entry(row, column, this.at(row, column))
                }
            }
        }
    }

    size() { 
        return this.items.size
    }

    // print out the grid, space separated
    print(transformItem=(_r, _c, item) => item) {
        this.iterate((r, c, i) => process.stdout.write(`${transformItem(r, c, i)} `), () => process.stdout.write("\n"))
        process.stdout.write("\n")
    } 

    delete(row, column) {
        this.items.delete(JSON.stringify([row, column]))
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

// a grid class where most rows / columns aren't filled in. 
// stored as a set of coordinates rather than a 2d array
// this is easier to expand / contract, but some operations such as number of rows / columns are less performant.
//
class SparseGrid extends Grid { 
    constructor(diagonalNeighbors=false) {
        super('')
        this.diagonalNeighbors = diagonalNeighbors
        this.items = new Map()
    }

    // number of rows
    get rows() {
        // console.log("rows", this.items, this.items.keys())
        return ([...this.items.keys()].reduce((max, json) => {
            const [row, _] = JSON.parse(json)
            return row > max ? row : max
        }, -1)) + 1
    }

    // number of columns
    get columns() { 
        return ([...this.items.keys()].reduce((max, json) => {
            const [_, column] = JSON.parse(json)
            return column > max ? column : max
        }, -1)) + 1
    }

    
    // item at row, column 
    at(row, column) {
        return this.items.get(JSON.stringify([row, column]))
    }

    // set row y, column x to item
    set(row, column, item) {
        this.items.set(JSON.stringify([row, column]), item)
    }

    print() {
        this.iterate((r, c, i) => process.stdout.write(`${r}/${c}: ${i}\n`))
        process.stdout.write("\n")
    } 
}

// test sparse grid
// const testGrid = new SparseGrid()
// testGrid.set(0, 1, 5)
// testGrid.set(10, 0, 4)
// testGrid.set(0, 10, 6)
// testGrid.set(10, 10, 20)

// testGrid.iterate((r, c, i) => console.log("test grid", r, c, i))
// console.log('test grid rows', testGrid.rows)
// console.log('test grid cols', testGrid.columns)
// testGrid.set(100, 100, 20)
// console.log('test grid rows', testGrid.rows)
// console.log('test grid cols', testGrid.columns)


// parse an input, changing state of parsing at each blank line
// for example
// NNCB
// 
// CH -> B
// parseSeparatedSections({
//    parsers: [(l) => /* do something with NNCB */, (l) => /* do something with each line CH -> B etc */]
// })
// 
const parseSeparatedSections = ({
    input, 
    parsers, 
    sectionSeparator = (l) => l === "",
    lineSeparator = "\n",
}) => {
    let currentParser = 0
    const lines = input.split(lineSeparator)
    while (lines.length > 0) { 
        const line = lines.shift()
        if ( sectionSeparator(line)) { 
            currentParser += 1
        } else {
            parsers[currentParser](line)    
        }
    }
}

export default {
    stringListToFirstInt,
    stringToBinary,
    initArray,
    rotateRight,
    rotateRight45,
    parseAnswerFromEms,
    memoize,
    intersection,
    stripEms,
    Grid,
    SparseGrid,
    parseSeparatedSections,
    DIRECTIONS,
    turnDirectionRight90,
    goDirection,
    turnDirectionLeft90,
};