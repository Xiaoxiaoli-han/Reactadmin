import React, { Component } from 'react'
import { Form, 
        Input, 
        Button,
        message,} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
/* 
    登陆的路由组件
*/
export default class Login extends Component {
    onFinish = async (values)=>{
        const {username,password} = values
        const response = await reqLogin(username,password)
        const result = response.data
        if(response.status === 0){
            //登录成功
            message.success("登录成功")
            //存储用户信息
            storageUtils.saveUser(result)
            memoryUtils.user = result
            //跳转到管理界面, 不需要退回到登录
            this.props.history.replace('/')
        }else if(response.status === 1){
            message.error(result.msg)
        }
      
    }
    
    render() {

        // 在登录界面判断用户是否已经登录
        const user = memoryUtils.user
        if(user._id){
            return <Redirect to='/'/>
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="" />
                    <h1>商品后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h3>用户登录</h3>
                    <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    >
                    <Form.Item
                        name="username"
                        rules={[
                        { required: true,message: 'Please input your Username!'},
                        { max:12,message:'用户名最多为12位'},
                        { min:4,message:'用户名至少为4位'},
                        { pattern:/^[a-zA-Z0-9_]+$/,message:'必须是英文数字下划线组成'}
                        ]}
                    >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true,message: 'Please input your Username!'},
                        { min:4,message:'密码至少为4位'},
                        { pattern:/^[a-zA-Z0-9_]+$/,message:'必须是英文、数字或下划线组成'}
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                     />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                    </Button>
                </Form.Item>
            </Form>
                </section>
            </div>
        )
    }
}
