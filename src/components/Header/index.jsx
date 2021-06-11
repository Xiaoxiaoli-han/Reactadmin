import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Modal} from 'antd';
import { reqWeather } from '../../api'
import formatDate from '../../utils/dateUtils'
import memoryIfon from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import localInfon from '../../utils/storageUtils'
import './index.less'
const { confirm } = Modal;
 class Header extends Component {
    state ={
        curTime:formatDate(Date.now()),
        weather:'',
        temperature:''
    }
    getTime = ()=>{
        this.IntervalID = setInterval(()=>{
            const curTime = formatDate(Date.now())
            this.setState({curTime})
        },1000)
    }
    getWeather = async ()=>{
        const {weather,temperature} = await reqWeather()
        this.setState({weather,temperature})
    }

    getTitle = ()=>{
        //当前路径
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0)
            path = '/product'
        let title
        //遍历查找
        menuList.forEach(item=>{
            if(item.key === path){
                title = item.title
            }else if(item.children){
               const cItem = item.children.find(cItem => cItem.key === path)
               if(cItem) title = cItem.title
            }
        })
        return title
    }

    logOut = ()=>{
        const that = this
        confirm({
            title: '确定退出吗？',
            onOk() {
              //清除数据
              localInfon.removeUser()
              memoryIfon.user ={}
              //跳转到登录页面
              that.props.history.replace('/login')
            },
          });
    }

    //组件加载完后，获取数据
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    //组件将要卸载
    componentWillUnmount(){
        clearInterval(this.IntervalID)
    }
     render(){
         const userName = memoryIfon.user.username
         const {curTime,weather,temperature} = this.state
         const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎！{userName}</span>
                    <Button type="link" onClick={this.logOut}>退出</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left"><span>{title}</span></div>
                    <div className="header-bottom-right">
                        <span>{curTime}</span>
                        <span>{temperature}℃</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)