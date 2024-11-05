const numRegex = /\d+(\.\d+)?/;
const stringListToFirstInt = (strings) => (
  strings.map((s) => (
    s.match(numRegex).filter((m) => m !== null).map((m) => m[0]).map((s2) => parseInt(s2, 10))
  ))
);

export default {
  stringListToFirstInt,
};
