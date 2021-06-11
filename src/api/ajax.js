
import { message } from 'antd'
import axios from 'axios'
/* 
    ajax发送异步请求
    封装axios的函数
    1. 优化：统一处理请求出错
*/

export default function ajax(url,data={},type='GET'){

    return new Promise((reslove,reject)=>{
        let promise
        if(type === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }
        //如果请求成功
        promise.then(response =>{
            reslove(response.data)
        }).catch(error=>{  // 对所有 ajax 请求出错做统一处理, 外层就不用再处理错误了
            message.error('请求出错：'+ error.message)
        })
    })
    
}