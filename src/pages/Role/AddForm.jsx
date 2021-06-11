import React, { Component, createRef } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
const {Item} = Form
export default class AddForm extends Component {
    static propTypes ={
        setForm:PropTypes.func
    }
    formRef = React.createRef()
    componentDidMount(){
        this.props.setForm(this.formRef.current)
    }
    render() {
        return (
            <Form ref={this.formRef}>
                <Item
                    label='角色名称：'
                     name="roleName"
                     rules={[
                       { required: true, message: '名称必须输入' },
                     ]}
                >
                    <Input placeholder="角色名称" />
                </Item>
            </Form>
        )
    }
}
