/* 
    所有类型的请求接口函数
    每个函数返回值都是promise
*/

import { message } from "antd"
import jsonp from "jsonp"
import ajax from "./ajax"
//const BASE = 'http://localhost:5000'
const BASE =''
//登录
export const reqLogin = (username,password) => ajax(BASE+'/Login',{username,password},'POST')
//添加用户
export const reqAddUser = (user) => ajax(BASE+ '/manage/user/add',user,'POST')
//查询天气 jsonp
export const reqWeather = ()=>{
    return new Promise((resolve,reject)=>{
        const url =`https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=423493b54ef611c9247c8378e2e02ca5`
        jsonp(url,{},(err,data)=>{
            if(!err && data.status === '1'){
                const {weather,temperature} = data.lives[0]
                resolve({weather,temperature})
            }else{
                message.error('请求天气失败啦')
            }
        })
    })
}

//获取分类列表
export const reqCategoryList = (parentId)=> ajax('/manage/category/list',{parentId})
//添加分类列表
export const reqAddCategory = (parentId,categoryName)=> ajax('/manage/category/add',{parentId,categoryName},'POST')
//更新分类列表
export const reqUpdateCategory = (categoryId,categoryName)=> ajax('/manage/category/update',{categoryId,categoryName},'POST')

//获取商品列表     (后台分页获取)
export const reqProducts = (pageNum,pageSize)=> ajax('/manage/product/list',{pageNum,pageSize})

//搜索商品 (productName/productDesc)
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
    })

//根据ID获取商品
export const reqOneCategory = (categoryId) => ajax('/manage/category/info',{categoryId})

//操作商品上架/下架
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//添加/更新商品
export const reqAddOrUpdate  = (product)=> ajax('/manage/product/'+(product._id? 'update':'add'),product,'POST')

// 获取角色
export const reqGetRoles = ()=> ajax('/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

//更新角色
export const reqUpdateRole = ({_id,menus,auth_time,auth_name})=> ajax('/manage/role/update',{_id,menus,auth_time,auth_name},'POST')

//获取所有用户列表
export const reqGetUsers = ()=> ajax('/manage/user/list')

//删除用户
export const reqDeleteUser = (userId)=> ajax('/manage/user/delete',{userId},'POST')

// 添加或修改用户
export const reqAddOrUpdateUser  = (user)=> ajax('/manage/user/'+(user._id? 'update':'add'),user,'POST')
