import fs from 'node:fs/promises';
import axios from 'axios';
const codeBlocksRegex = /<code>(.*?)<\/code>/mgs;
const answersRegex = /<p>Your puzzle answer was <code>(.*?)<\/code>\.<\/p>/mgs;

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
    return axiosInstance.get(url, null, {headers: authHeader()}).then(({data}) => [...data.matchAll(codeBlocksRegex)].map(m => m[1]));
};

const fetchDayAnswers = (year, day) => { 
    const url = `https://adventofcode.com/${year}/day/${day}`;
    return axiosInstance.get(url, null, {headers: authHeader()}).then(({data}) => [...data.matchAll(answersRegex)].map(m => m[1]));
};

const fetchDayInput = (year, day) => { 
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    return axiosInstance.get(url, null,  {headers: authHeader()}).then(({data}) => data)
};

export default {
    fetchDayCodes, 
    fetchDayAnswers, 
    fetchDayInput
};

// // testing
// fetchDayAnswers(2021, 1).then(matches => {
//     // const m = matches.next();
//     // console.log('m2', m);
//     console.log('m', [...matches]);
// })

// fetchDayAnswers(2024, 1).then(matches => { 
//     console.log('oh, here are matches', matches);
// }).catch(err => {
//     console.log('not ready yet')
// })