import { Card,Button,Table ,Modal, message, Form} from 'antd'
import React, { Component } from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import { reqGetUsers,reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import formatDate from '../../utils/dateUtils'
import AddOrUpdateForm from '../User/AddOrUpdateForm'
export default class User extends Component {
    state = {
        loading:false,
        isModalVisible:0,
        users:[],
        roles:[],
        updateUser:{} //当前点击修改的user
    }
    
    initColumns = ()=>{
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:(create_time)=>{
                   return  formatDate(create_time) 
                }
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id)=>{
                    //效率太低
                    //return (this.state.roles.find( role => role._id === role_id) || {}).name
                    console.log(this.roleName)
                    return this.roleName[role_id]
                }
            },
            {
                title:'操作',
                width:150,
                render:(user)=>(
                    <span>
                    <Button type="link" onClick={()=>{this.setState({isModalVisible:2,updateUser:user})}}>修改</Button>
                    <Button type="link" onClick = {()=>{this.deleteUser(user)}}>删除</Button>
                    </span>
                    )
            }
        ]
    }

    initRolesName =(roles)=>{
        const roleName =  roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        this.roleName = roleName
    }
    getUsers = async ()=>{
        const result = await reqGetUsers()
        if(result.status === 0){
            const {roles,users} = result.data
            //将role_id作为属性，role_name作为值保存为对象
            this.initRolesName(roles)
            this.setState({
                roles,
                users
            })
        }
    }
    deleteUser = (user)=>{
        Modal.confirm({
            title: `你真的要删除${user.username}吗?`,
            icon: <ExclamationCircleOutlined />,
            onOk:async ()=> {
                const result = await reqDeleteUser(user._id)
                if(result.status === 0){
                    message.success('删除用户成功啦！')
                    this.getUsers()
                }else
                    message.success('删除用户失败啦！')
            }
          })
        
    }
    //创建或修改用户
    addOrUpdateUser = ()=>{
        const {updateUser} = this.state
        this.formData.validateFields().then(async user=>{
            console.log('user:',user)
            if(updateUser._id){
                user._id = updateUser._id
            }
            const result = await reqAddOrUpdateUser(user)
            if(result.status === 0){
                this.getUsers()
                this.setState({isModalVisible:0})
                message.success(`${updateUser._id? '修改':'创建'}用户成功！`)
            }else if(result.status === 1)
                message.error(`${updateUser._id? '修改':'创建'}的用户同名啦！`)
        })
        .catch(error=>{
            message.error(`输入不正确`)
        })
    }
    componentDidMount(){
        this.initColumns()
        this.getUsers()
        console.log(this.form)
    }
    render() {
        const {loading,users,isModalVisible,roles,updateUser} = this.state
        const title = <Button type='primary' onClick={()=>{this.setState({isModalVisible:1,updateUser:{}})}}>创建用户</Button>
        return (
            <>
            <Card title={title}>
                <Table 
                dataSource={users} 
                columns={this.columns} 
                bordered
                rowKey='_id'
                pagination= {{defaultPageSize:5}}
                loading={loading}
                />
            </Card>
            <Modal title={updateUser._id? '修改角色':'创建角色'} 
                visible={isModalVisible} 
                onOk={this.addOrUpdateUser} 
                onCancel={()=>{this.setState({isModalVisible:0})}}
                destroyOnClose={true}
                >
                <AddOrUpdateForm 
                roles ={roles} 
                getFormData = {(formData) => this.formData = formData} 
                updateUser={updateUser}/>
            </Modal>
            </>
        )
    }
}
