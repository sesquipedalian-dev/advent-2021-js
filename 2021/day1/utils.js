const numRegex = /\d+(\.\d+)?/;
export const stringListToFirstInt = (strings) => strings.map((s) => s.match(numRegex)).filter((m) => m !== null).map((m) => m[0]).map((s) => parseInt(s));
