import React, { Component, createRef } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
const {Item} = Form
const {Option} = Select
export default class AddForm extends Component {
    static propTypes ={
        category:PropTypes.array.isRequired,
        parentID:PropTypes.string.isRequired
    }
    formRef = React.createRef()
    componentDidMount(){
        this.props.setForm(this.formRef.current)
    }
    render() {
        const {category,parentID} =this.props
        return (
            <Form ref={this.formRef}>
                <p>所属分类</p>
                <Item
                    name="parentId"
                    initialValue={parentID}
                >
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            category.map(item=>{
                                return (<Option value={item._id} key={item._id}>{item.name}</Option>)
                            })
                        }
                    </Select>
                </Item>
                <p>分类名称</p>
                <Item
                     name="categoryName"
                     rules={[
                       { required: true, message: '分类名称必须输入' },
                     ]}
                >
                    <Input placeholder="输入分类的名字" />
                </Item>
            </Form>
        )
    }
}
