import React, { Component } from 'react'
import { Tree,Form,Input } from 'antd';
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

export default class SetAuthority extends Component {
  
  static propTypes = {
    role:PropTypes.object,
    getCheckedKeys:PropTypes.func
  }
  constructor(props){
    super(props)
    // 初始化选中权限
    const checkedKeys = props.role.menus
    console.log("checkedKeys",checkedKeys)
    this.state={
      checkedKeys
    }
  }

   onCheck = (checkedKeys, info) => {
    this.setState({checkedKeys})
    this.props.getCheckedKeys(checkedKeys)
  }

  render(){
    const {role} = this.props
    return (
      <>
        <Form.Item label="角色名称：">
          <Input value={role.name} disabled style={{width:200}}/>
          <br/>
          <Tree
            checkable
            defaultExpandAll
            defaultCheckedKeys={this.state.checkedKeys}
            onCheck={this.onCheck}
            treeData={menuList}
          />
        </Form.Item>
        </>
      )
  }
}
