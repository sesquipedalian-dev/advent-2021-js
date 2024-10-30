# Overview

[Advent of Code 2021](https://adventofcode.com/2021) as a vehicle for noodling with server-side javascript. 

# dependencies
[NPM](https://example.com)
[Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

In my case, I'm using [WSL2 and nvm](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl0).

# running
```
npm i
npm run day1
```

# structure

- dayX
  - dayX.js (impl of the day's puzzle)
  - utils.js (reusable functions copied from day to day)
- util
  - utils.js (consolidated reusable functions?)
  - aoc.js (scraper / fetch stuff from the aoc website)
- README.md (this file)
- LICENSE (This project is [MIT licensed](https://choosealicense.com/licenses/mit/))
- token.txt (store the cookie value from the advent of code site in this file for use in downloading inputs)
- package.json (npm)
- package-lock.json (npm)