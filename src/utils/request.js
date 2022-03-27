import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant';
const instance = axios.create({
    baseURL: 'http://121.43.54.145:8080/jyspfull',
    timeout: 200000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});
const request = (url, options) => {
    let data = {};
    if (url == '/common/upload') {
        data = options.data;
    } else if (options.data) {
        data = qs.stringify(options.data);
    }
    return new Promise((resolve, reject) => {
        instance({
            method: options.method,
            url: `${url}`,
            data: data
        }).then(value => {
            if (value.status == 200) {
                if (value.data.code != 0) {
                    Toast.fail(value.data.msg);
                }
                resolve(value.data)
            } else {
                Toast.fail(value.statusText);
            }
        }).catch(error => {
            Toast.fail('网络错误，请稍后重试');
            reject(error)
        })
    })
}
export const get = (url, options = {}) => {
    if (typeof url == 'object') return;
    return request(url, {
        method: 'get',
        data: options
    })
}
export const post = (url, options = {}) => {
    if (typeof url == 'object') return;
    return request(url, {
        method: 'post',
        data: options
    })
}
export const put = (url, options = {}) => {
    if (typeof url == 'object') return;
    return request(url, {
        method: 'put',
        data: options
    })
}
export const remove = (url, options = {}) => {
    if (typeof url == 'object') return;
    return request(url, {
        method: 'delete',
        data: options
    })
}