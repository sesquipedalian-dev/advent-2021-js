console.log('hello world!');
const fs = require('node:fs/promises');
const axios = require('axios');
const codeBlocksRegex = /<code>(.*?)<\/code>/mgs;

const axiosInstance = axios.create({
    withCredentials: true // Ensure credentials are sent with every request
   });

// Add a request interceptor to include the cookie in the headers
axiosInstance.interceptors.request.use(async config => {
    // Set the cookie in the header
    config.headers['Cookie'] = await authHeader();
    return config;
   }, error => {
    // Do something with request error
    return Promise.reject(error);
   });

let authHeaderMemo;
const authHeader = async () => {
    if (authHeaderMemo === undefined) {
      const token = await fs.readFile('./token.txt', {encoding: 'utf8'})
        .catch(() => fs.readFile('../token.txt',{encoding: 'utf8'}))
      authHeaderMemo = `session=${token}`
    }
    return authHeaderMemo;
}

const fetchDayCodes = (year, day) => {
    const url = `https://adventofcode.com/${year}/day/${day}`;
    return axiosInstance.get(url, null, {headers: authHeader()}).then(({data}) => data.matchAll(codeBlocksRegex));
};

const fetchDayInput = (year, day) => { 
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    return axiosInstance.get(url, null,  {headers: authHeader()}).then(({data}) => data)
}

const part1 = (list_of_ints) => {
    var count = 0;
    for(var i = 0; i < list_of_ints.length - 1; i++) { 
        if (list_of_ints[i] < list_of_ints[i + 1]) {
            count++;
        }
    }
    return count;
}

const part2 = (list_of_ints) => {
    var count = 0;
    var previousSum = Number.MAX_SAFE_INTEGER;
    for(var i = 0; i < list_of_ints.length - 2; i++) { 
        const sum = list_of_ints[i] + list_of_ints[i + 1] + list_of_ints[i + 2];
        if (previousSum < sum) {
            count++;
        }
        previousSum = sum;
    }
    return count;
}

const numRegex = /\d+(\.\d+)?/;
const stringListToFirstInt = (strings) => { 
    return strings.map(s => s.match(numRegex)).filter(m => m !== null).map(m => m[0]).map(s => parseInt(s));
}

// fetchDayInput('2021', '1').then(y2021d1Input => {
//     console.log('2021 day 1 input', y2021d1Input);
// });

fetchDayCodes('2021', '1').then(codes => { 
    // console.log('all the codes', [...codes].map((m, i) => [m[0], i]));

    sample1 = codes.next().value[1].split("\n").map(n => parseInt(n)).filter(n => n > 0);
    answer = [...codes].map(m => m[1]);
    p1Answer = answer[5];
    samplePart1Answer = part1(sample1);

    if(samplePart1Answer != p1Answer) { 
        console.log('failed on part 1 test case', samplePart1Answer, p1Answer);
        return;
    }

    part2Answer = part2(sample1);
    if (part2Answer != answer[25]) {
        console.log('failed on part 2 test case', part2Answer, answer[25]);
        return;
    }

    fetchDayInput('2021', '1').then(input => {
        const list_of_ints = stringListToFirstInt(input.split("\n"));
        answer = part1(list_of_ints);
        console.log('part 1 answer', answer);

        answer = part2(list_of_ints);
        console.log('part 2 answer', answer);
    });
})

// note: can only submit once since the submit input disappears 