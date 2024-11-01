import fs from 'node:fs/promises';
import axios from 'axios';
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


export const fetchDayCodes = (year, day) => {
    const url = `https://adventofcode.com/${year}/day/${day}`;
    return axiosInstance.get(url, null, {headers: authHeader()}).then(({data}) => data.matchAll(codeBlocksRegex));
};

export const fetchDayInput = (year, day) => { 
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    return axiosInstance.get(url, null,  {headers: authHeader()}).then(({data}) => data)
};
