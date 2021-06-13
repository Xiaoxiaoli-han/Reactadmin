import React, { Component } from 'react'
import {Button,Card,Table,Modal, message} from 'antd'
import { reqAddRole, reqGetRoles, reqUpdateRole } from '../../api'
import AddForm from './AddForm'
import formatDate from '../../utils/dateUtils'
import SetAuthority from './SetAuthority'
export default class Role extends Component {
    state = {
        loading:false,
        roles:[],
        role:{}, //当前选择角色
        isModalVisible:0,
    }
    initColumns = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time'
            },
            {
                title:'授权时间',
                dataIndex:'auth_time'
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    }
    //获取角色
    getRoles = async ()=>{
        const result = await reqGetRoles()
        if(result.status === 0){
            let roles = result.data
            // 时间格式化
            roles = roles.map(role =>{
                role.create_time = formatDate(role.create_time) 
                role.auth_time = formatDate(role.auth_time) 
                return role
            })
            this.setState({roles})
        }
    }
    //点击行回调函数
    onRow = (role) =>{
        //role:当前对应点击行的对象数据
        return {
            onClick:event=>{
                this.setState({role})
            }
        }
    }
    // 添加角色
    addRole = ()=>{
        this.form.validateFields()
        .then( async (values)=>{
            const {roleName} = values
            const result = await reqAddRole(roleName)
            if(result.status === 0){
                this.setState({isModalVisible:0})
                this.getRoles()
                message.success('创建成功啦！')
            }else
            message.error('创建角色出了点问题')
        })
        .catch(err=>{
            message.error('请输入正确名称！')
        })
    }
    // 更新角色权限
    updateRole = async ()=>{
        /* const roleUpdate ={
            menus:this.checkedKeys,
            _id:this.state.role._id,
            auth_time : Date.now(),
            auth_name:'管理员'
        } */
        this.setState({isModalVisible:0})
        const {role} = this.state
        const menus = this.checkedKeys
        console.log(menus)
        role.menus = menus
        console.log(role)
        const result = await reqUpdateRole(role)
        
        if(result.status === 0){
            //this.getRoles()
            this.setState({
                roles:[...this.state.roles]
            })
            message.success('权限设置成功')
        }else
            message.error('权限设置失败')

    }
    componentDidMount(){
        this.initColumns()
        this.getRoles()
    }
    render() {
        const {roles,loading,role,isModalVisible} = this.state
        const title = (
            <span>
                <Button 
                type='primary' 
                onClick={()=>{this.setState({isModalVisible:1})}}
                >创建角色</Button>&nbsp;&nbsp;
                <Button 
                type='primary' 
                disabled={!role._id}
                onClick={()=>{this.setState({isModalVisible:2})}}
                >设置角色权限</Button>
            </span>)
        return (
            <>
            <Card title={title}>
                <Table 
                dataSource={roles} 
                columns={this.columns} 
                bordered
                rowKey='_id'
                pagination= {{defaultPageSize:5}}
                loading={loading}
                rowSelection={{
                    type:'radio',
                    selectedRowKeys:[role._id],
                    onSelect:(role)=> { // 选择当前radio时的回调
                        this.setState({role})
                    }
                }}
                onRow={this.onRow}
                />
            </Card>
            <Modal title="创建角色" 
                visible={isModalVisible ===1? true:false} 
                onOk={this.addRole} 
                onCancel={()=>{this.setState({isModalVisible:0})}}
                destroyOnClose={true} 
                >
                <AddForm setForm ={(form)=>{this.form = form }}/>
            </Modal>
            <Modal title="设置角色权限" 
                visible={isModalVisible ===2? true:false} 
                onOk={this.updateRole} 
                onCancel={()=>{this.setState({isModalVisible:0})}}
                destroyOnClose={true} 
                >
                <SetAuthority role={role} getCheckedKeys={(checkedKeys)=>{this.checkedKeys = checkedKeys}}/>
            </Modal>
            </>
        )
    }
}
