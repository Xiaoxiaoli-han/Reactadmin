import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

// 如果local 保存了user
const user = storageUtils.getUser()
if(user && user._id){
    memoryUtils.user = user
}

ReactDom.render(<App/>, document.getElementById('root'))