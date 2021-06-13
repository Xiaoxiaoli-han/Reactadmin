import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
export default class AddOrUpdateForm extends Component {
    static propTypes ={
        roles:PropTypes.array.isRequired,
        getFormData:PropTypes.func,
        updateUser:PropTypes.object
    }
    form = React.createRef()
    // 收集表单数据
    onValuesChange = (changedValues,values)=>{
        this.props.getFormData(values)
    }
    render() {
        const {roles,updateUser} = this.props
        const {username,password,phone,role_id,email} = updateUser || {}
        console.log(updateUser,username)
        return (
            <div>
                <Form style={{marginLeft:20}} onValuesChange={this.onValuesChange} ref = {this.form}>
                    <Form.Item 
                    label='用户名'
                    name="username"
                    rules={[
                       { required: true, message: '名称必须输入' },
                       { max:12,message:'用户名最多为12位'},
                       { min:4,message:'用户名至少为4位'},
                     ]}
                     initialValue={username}
                    >
                        <Input  placeholder='输入用户名'/>
                    </Form.Item>
                    { username? null:<Form.Item 
                    label='密码'
                    name="password"
                    initialValue={password}
                    rules={[
                       { required: true, message: '密码必须输入' },
                       { min:4,message:'密码至少为4位'},
                     ]}
                    >
                        <Input placeholder='输入'/>
                    </Form.Item>}
                    <Form.Item label='电话' name="phone" initialValue={phone}>
                        <Input  placeholder='输入'/>
                    </Form.Item>
                    <Form.Item label='邮箱' name="email" initialValue={email}>
                        <Input  placeholder='输入'/>
                    </Form.Item>
                    <Form.Item label='所属角色' name="role_id" initialValue= {role_id}>
                        <Select  style={{width:200}}>
                            {
                                roles.map(role=>{
                                    return (
                                        <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
