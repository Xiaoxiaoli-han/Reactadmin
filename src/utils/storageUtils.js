/* 
    用于将数据存储到本地
*/
import store from 'store'
const USER_KEY = 'user_key'

const localInfon = {
    saveUser(user){
        // localStroage 只能保存 string, 如果传递是对象, 会自动调用对象的 toString()并保存
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY)
    },
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
export default localInfon