import axios from 'axios';
import Vue from 'vue'; // 确保已正确引入Vue
const instance = new Vue();

// const baseUrl='https://127.0.0.1:9999'
const baseUrl='https://wx.wlsx.fun:9999'
const service = axios.create({
    // baseURL: 'https://lmbp.longmeigongying.com:8090',
    baseURL: baseUrl,
    timeout: 30000,
    // headers: {
    //     Authorization: localStorage.getItem("Token")
    // }
});

service.interceptors.request.use(
    config => {
        if (config.url!=="/adminLogin/Login"){
            config.headers.Authorization=localStorage.getItem("Token")
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject();
        }
    },
    error => {
        console.log(error);
        if (error.response.status&&error.response.status===401){
            localStorage.removeItem("Token")
            instance.$alert('用户登录状态失效，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback:action => {
                    window.location.href='https://helloworld.wlsx.fun';
                }
            });
        }
        else {
            instance.$message.error("网络请求异常")
        }
        return Promise.reject(error.response.code);
    }
);

export default service;
