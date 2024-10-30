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
        .catch(err => fs.readFile('../token.txt',{encoding: 'utf8'}))
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

fetchDayInput('2021', '1').then(y2021d1Input => {
    // console.log('2021 day 1 input', y2021d1Input);
});

fetchDayCodes('2021', '1').then(codes => { 
    // console.log('all the codes', [...codes].map(m => m[1]));

    sample1 = codes.next().value[1].split("\n").map(n => parseInt(n)).filter(n => n > 0);
    console.log('sample case', sample1);
})