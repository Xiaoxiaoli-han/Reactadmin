import React, { Component } from 'react'
import { Redirect, Route ,Switch} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import LeftNav from '../../components/LeftNav';
import Header from '../../components/Header';
import Home from '../Home/Home';
import Category from '../Category/Category';
import Product from '../Product/Product';
import Role from '../Role/Role';
import User from '../User/User';
import Pie from '../Charts/Pie';
import Line from '../Charts/Line';
import Bar from '../Charts/Bar';

const { Footer, Sider, Content } = Layout

/* 
    后台管理的主界面
*/
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if(!user._id){
            return <Redirect to = '/Login'/>
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor:'white',margin:30}}>
                       <Switch>
                       <Route path='/home' component={Home}/>
                        <Route path='/category' component={Category}/>
                        <Route path='/product' component={Product}/>
                        <Route path='/role' component={Role}/>
                        <Route path='/user' component={User}/>
                        <Route path='/charts/pie' component={Pie}/>
                        <Route path='/charts/line' component={Line}/>
                        <Route path='/charts/bar' component={Bar}/>
                        <Redirect to='/home'/>
                       </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器效果更佳</Footer>
                </Layout>
            </Layout>
        )
    }
}
