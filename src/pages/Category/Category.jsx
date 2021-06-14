import React, { Component } from 'react'
import {Card,Button,Table, message,Modal,Pagination} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons'
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from '../../api'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'
export default class Category extends Component {
    state = {
        isLoading:true,
        category:[],
        parentID:'0', // 一级商品对应的Id  默认为0时显示的就是一级分类 
        subCategory:[],//二级分类列表
        parentName:'',
        isModalVisible:0,// 0不可见，1显示添加modal,2显示更新modal
    }

    //初始化列
    inintColumns=()=>{
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name', //显示对应属性名
            },
            {
              title: '操作',
              width:300,
              render:(category)=>( //接收的参数为当前这个行所对应的数据
                  <span>
                    <Button type="link" onClick={()=>{this.showUpdateCategory(category)}}>修改分类</Button>
                    {this.state.parentID==='0'? <Button type="link" onClick={()=> {this.showSubcategory(category)}}>查看子分类</Button> : null}
                  </span>
              )
            },
          ]
    }

    //获取Category数据
    setCategory = async (parentId)=>{
        parentId = parentId || this.state.parentID
        this.setState({
            loading:true
        })
        const result = await reqCategoryList(parentId)
        if(result.status === 0){
            const category = result.data
            if(parentId === '0'){
                this.setState({
                    category
                })
            }else{
                this.setState({
                    subCategory:category
                })
            }
            this.setState({
                loading:false
            })
        }else{
            message.error('获取列表失败啦！')
        }
       
    }

    //显示一级列表
    showCategory = ()=>{
        this.setState({
            parentID:'0',
            parentName:'',
            subCategory:[]
        })
    }
    //显示二级列表
    showSubcategory = (category)=>{
        this.setState({
            parentID:category._id,
            parentName:category.name,
        },()=>{
            this.setCategory()
        })
    }
    //添加Category数据
    addCategory = ()=>{
        this.addForm.validateFields().then(async (values) =>{
            this.setState({
                isModalVisible: 0,
              })
              const {parentId,categoryName} = values
              console.log('parentId:',parentId,'this.state.parentID:',this.state.parentID)
              //在二级分类下不能添加其他分类列表
              //在一级分类下可以添加其他分类
              if(parentId === this.state.parentID || (parentId !=='0'&& this.state.parentID ==='0')){ 
                const result = await reqAddCategory(parentId,categoryName)
                if(result.status === 0){
                      this.setCategory()
                      message.success(`添加${categoryName}成功！`)
                }
            }else if(parentId === '0'){ 
                //如果在二级分类列表下添加一级，重新获取一级分类，但不需要显示
                const result = await reqAddCategory(parentId,categoryName)
                if(result.status === 0){
                    this.setCategory('0')
                    message.success('添加一级分类成功')
                }
            }else {
                message.error('不能这样添加哦！')
            }
        }).catch(err=>{
            console.log(err)
            message.info('输入不正确哦')
        })
    }
    //控制modal取消键
    handleCancel = ()=>{
        //清空输入框
        //this.form.resetFields()
        this.setState({isModalVisible:0})
    }
    //显示添加modal
    showAddCategory = ()=>{
        this.setState({
            isModalVisible:1
        })
    }
    //显示更新modal
    showUpdateCategory = (category)=>{
        this.category = category 
        this.setState({
            isModalVisible:2
        })
       // console.log('@@@',category)
    }
    //修改、更新分类
    updateCategory = ()=>{
        const categoryId = this.category._id
        //表单验证：通过后才处理
        this.form.validateFields()
        .then(async (values) =>{
            //隐藏确认框
            this.setState({
                isModalVisible: 0,
              })
          const {categoryName} = values
          //清空输入框
          //this.form.resetFields()
          const result = await reqUpdateCategory(categoryId,categoryName)
          if(result.status === 0){
              //重新展示类别列表
              message.success('修改成功')
              this.setCategory()
                
          }
        })
        .catch((err)=>{
            message.info('请输入分类名称')
        })
            
    }



    componentDidMount(){
        this.inintColumns()
        this.setCategory()
    }
    render() {
        const {category,parentID,subCategory,parentName,isModalVisible,loading} = this.state
        const columns = this.columns
        const {name} = this.category || {name:'占位'}// 避免category还没有加载时报错
        //console.log('名字：',name)
        const title = parentID ==='0'? "商品总类" :(
            <span>
                <Button type='link' onClick={this.showCategory} style={{fontSize:18}}>商品总类</Button>
                <Button  type='link' icon={<ArrowRightOutlined/>} style={{color:'#ccc'}}></Button>
                <span>{parentName}</span>
            </span>
        )
        return (
            <>
                <Card title={title} extra={<Button type='primary' icon={<PlusOutlined/>} onClick={this.showAddCategory} >添加</Button>}>
                <Table 
                dataSource={parentID==='0'? category:subCategory} 
                columns={columns} 
                bordered
                rowKey='_id'
                pagination= {{defaultPageSize:5}}
                loading={loading}
                />
            </Card>
             <Modal title="添加" 
                visible={isModalVisible===1? true:false} 
                onOk={this.addCategory} 
                onCancel={this.handleCancel}
                destroyOnClose={true}
                >
                <AddForm category={category} parentID={parentID} setForm={(form)=>{this.addForm = form}}/>
            </Modal>
            <Modal title="更新" 
                visible={isModalVisible===2? true:false} 
                onOk={this.updateCategory} 
                onCancel={this.handleCancel}
                destroyOnClose={true}
                >
                <UpdateForm categoryName={name} setForm = {(form)=>{this.form = form}}/>
            </Modal>
            </>
        )
    }
}
