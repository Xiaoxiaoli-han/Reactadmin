import React, { Component, createRef } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'
const {Item} = Form
export default class UpdateForm extends Component {

    formRef = React.createRef()
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentDidMount(){
        this.props.setForm(this.formRef.current)
    }
    render() {
        const {categoryName} = this.props
        //console.log(categoryName)
        return (
            <Form ref={this.formRef}>
                <Item
                     name="categoryName"
                     initialValue={categoryName}
                     rules={[
                       { required: true, message: '分类名称必须输入' },
                     ]}
                >
                    {/* ----注意 <Form.Item /> 只会对它的直接子元素绑定表单功能 */}
                    <Input placeholder="输入分类的名字" />
                </Item>
            </Form>
        )
    }
}
