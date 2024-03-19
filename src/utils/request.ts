//对Axios进行二次封装，目的是？
//代码复用，利用axios的请求和响应拦截器功能
//请求拦截器一般可以在请求头中携带公共的参数：token
//响应拦截器可以简化服务器返回的数据，处理http网络错误
//便于更换网络库，例如axios停止维护，可以方便的更换。

import router from "@/router";
import axios from "axios";

export const serverError = 'server-error'

//创建自定义的axios对象
const request = axios.create({
    baseURL: '/api',//请求的基本路径，所有请求都会带上
    timeout: 6000//超时时间
})

//请求拦截器
request.interceptors.request.use((config) => {
    //config是一个配置对象，可以用来配置重要的headers属性

    return config
})

//响应拦截器
request.interceptors.response.use((response) => {
    //通过两个data就可以拆包，直接拿数据
    if (response.data.status.code == '200') {
        return response.data.data
    } else if (response.data.status.code == '401') {
        router.push('/login')
    }
    ElMessage({
        type: 'error',
        message: response.data.status.msg
    })
    return serverError
}, (error) => {
    console.log(error);

    ElMessage({
        type: 'error',
        message: '服务器访问错误，请检查网络连接'
    })
})

//导出自定义的axios
export default request;