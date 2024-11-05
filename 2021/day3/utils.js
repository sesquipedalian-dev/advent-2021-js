const numRegex = /\d+(\.\d+)?/;
const stringListToFirstInt = (strings) => strings.map((s) => s.match(numRegex)).filter((m) => m !== null).map((m) => m[0]).map((s) => parseInt(s));

const stringToBinary = (string) => parseInt(string, 2);
// initialize an array with a callback function
// e.g.
// initArray(5, (index) => index)
// # [0,1,2,3,4]
const initArray = (size, cb) => [...Array(size)].map((_, i) => cb(i));
export default {
  stringListToFirstInt,
  stringToBinary,
  initArray,
};
