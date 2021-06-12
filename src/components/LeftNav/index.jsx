import React, { Component } from 'react'
import { Menu } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import { Link, withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
const { SubMenu } = Menu;
/* 左侧导航栏 */
 class LeftNav extends Component {

    getMenuNodes = (menuList)=>{
        //得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.map(item =>{
            if(!item.children){
                return <Menu.Item key={item.key} icon={item.icon}><Link to={item.key}>{item.title}</Link></Menu.Item>
            }else{
               const cItem =  item.children.find(cItem=> cItem.key === path)
               if(cItem){
                   //找到当前请求path路径的父item.key
                   this.openKey = item.key
               }
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {/* 递归实现 */}
                        {this.getMenuNodes(item.children)} 
                    </SubMenu>
                )
            }
        })
    }
    //只获取一次menuNodes（必须是同步）
    UNSAFE_componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if(path.indexOf('/product')=== 0){  //当点击商品详情页时：'/product/detail',让选中路径为'/product'
            //indexOf在字符串：返回某个指定的字符串值在字符串中首次出现的位置
            path = '/product'
        }
        return (
            <div className="leftNav">
                <Link to='/home' className="leftNav-header">
                    <img src={logo} alt="" />
                    <h1>商品后台管理</h1>
                </Link>
                <Menu
                defaultSelectedKeys={path}
                defaultOpenKeys={[this.openKey]}
                selectedKeys={path}
                mode="inline"
                theme="dark"
                >
                    {/* <Menu.Item key="1" icon={<PieChartOutlined />}><Link to='/Home'>首页</Link></Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                    <Menu.Item key="5" icon={<MailOutlined />}><Link to='/Category'>品类管理</Link></Menu.Item>
                    <Menu.Item key="6" icon={<MailOutlined />}><Link to='/Product'>商品管理</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/User" icon={<PieChartOutlined />}><Link to='/User'>用户管理</Link></Menu.Item>
                    <Menu.Item key="/Role" icon={<PieChartOutlined />}><Link to='/Role'>角色管理</Link></Menu.Item> */}

                    {
                        this.menuNodes
                    }
                </Menu>

            </div>
        )
    }
}

export default withRouter(LeftNav)
/* 
非路由组件拥有路由组件的属性：withRouter
*/