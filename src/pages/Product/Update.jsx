import React, { Component } from 'react'
import{Button, Card,Form,Input,Cascader, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { reqAddOrUpdate, reqCategoryList } from '../../api'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
const {Item} = Form
export default class Update extends Component {

    state ={
        options:[] //收集一级分类数据到级联中
    }
    picWall = React.createRef()  // 收集带ref为picWall的节点
    richText = React.createRef() // 收集带ref为richText的节点
    //初始化options
    inintOptions = async (results)=>{
        const options = results.map(obj =>({
            value:obj._id,
            label:obj.name,
            isLeaf:false
        }))
        const {product,isUpdate} = this
        const {pCategoryId,categoryId} = product || {}
        //如果点击的是修改，那么需要初始化options的children
        //如果存在二级分类
        if(isUpdate && pCategoryId !== '0'){
            const option = options.find( obj => obj.value === pCategoryId)
            const subCategories = await this.getCategoryList(pCategoryId)
            option.children = subCategories.map(obj =>(
                    {
                        label:obj.name,
                        value:obj._id,
                        isLeaf:true
                    }
                ))
        }
        this.setState({
            options
        })
    }

    onFinish = async (values)=>{
        console.log(values)
        const {name,desc,price,productCategoryIds} = values
        const imgs = this.picWall.current.getImgs()
        const detail = this.richText.current.getDetail()
        let pCategoryId
        let categoryId
        if(productCategoryIds.length === 1){
             pCategoryId = '0'
             categoryId = productCategoryIds[0]
        }else{
             pCategoryId = productCategoryIds[0]
             categoryId = productCategoryIds[1]
        }
        const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
       
        if(this.isUpdate){
            product._id = this.product._id
        }

        const result = await reqAddOrUpdate(product)
        console.log(product)
        if(result.status === 0){
            message.success(`商品${this.isUpdate? '修改':'添加'}成功啦！`)
            this.props.history.goBack()
        }else 
            message.error(`商品${this.isUpdate? '修改':'添加'}失败啦！`)  
    }
    //获取Cascader 一级options
    //带有async关键字函数 如果有返回值会返回一个该函数返回值的promise对象 
    getCategoryList = async (parentId)=>{
        const categories = await reqCategoryList(parentId)
        if(categories.status === 0){
            if(parentId === '0') 
                this.inintOptions(categories.data)
            else 
                return categories.data // 返回的是二级列表的promise
        }
    }
    //动态加载二级列表
    loadData = async (selectedOptions) => {
        //loadData默认传值：当前一级selectedOptions
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const subCategories = await this.getCategoryList(targetOption.value)
        targetOption.loading = false
        if(subCategories.length > 0){
            targetOption.children = subCategories.map(obj =>(
                {
                    label:obj.name,
                    value:obj._id,
                    isLeaf:true
                }
            ))
        }else{
            targetOption.isLeaf = true
        }
        const {options} = this.state
        this.setState({
            //为了更新状态时检测到options值有变化。
            //因为options是个数组，地址是一直没有改变的，解构的方式相当于重新赋值，options地址也就相应改变
            options:[...options]
        })
    }
    componentDidMount(){
        this.getCategoryList('0')
    }
    UNSAFE_componentWillMount(){
        const product = this.props.location.state // 点击修改传过来的对应数据
        this.product = product
        this.isUpdate = !!product // 隐式转换，isUpdate为布尔值（判断是修改还是添加）
    }
    render() {
       const {options} = this.state
       const {name,price,desc,pCategoryId,categoryId,imgs,detail} = this.product || {}
       const categoryIds = [] // 用来做Cascader的默认值
       if(this.isUpdate){
           if(pCategoryId === '0'){
            categoryIds.push(categoryId)
           }else{
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
           }
       }
       const title = (
       <span>
           <Button type="link" icon={<ArrowLeftOutlined/>} onClick={()=> this.props.history.goBack()}></Button>
           <span>{this.isUpdate? "修改商品" :"添加商品"}</span>
       </span>) 
        return (
            <div>
                <Card title={title}>
                    <Form onFinish={this.onFinish}>
                        <Item 
                        label="商品名称" 
                        name="name"
                        initialValue={name}
                        rules={[
                            { required: true,message: '请输入商品名称'}
                        ]}
                        >
                            <Input style={{width:300}}/>
                        </Item>
                        <Item 
                        label="商品描述" 
                        name="desc"
                        initialValue={desc}
                        rules={[
                            { required: true,message: '请输入商品描述'}
                        ]}
                        >
                            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{width:300}}/>
                        </Item>
                        <Item 
                        label="商品价格" 
                        name="price"
                        initialValue={price}
                        rules={[
                            { required: true,message: '请输入商品价格'}
                        ]}
                        >
                            <Input prefix="￥" suffix="RMB" style={{width:300}} />
                        </Item>
                        <Item 
                        label="商品分类" 
                        initialValue={categoryIds}
                        name="productCategoryIds"
                        >
                            <Cascader
                            style={{width:300}}
                            options={options}
                            loadData={this.loadData}
                            expandTrigger="hover"
                            placeholder='请选择分类'
                            />
                        </Item>
                        <Item
                        label="商品图片" >
                            <PicturesWall ref={this.picWall} imgs={imgs}/>
                        </Item>
                        <Item
                        label="商品详情"
                        style={{width:700}} >
                            <RichTextEditor ref={this.richText} detail={detail}/>
                        </Item>
                        <Item>
                            <Button htmlType="submit">提交</Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        )
    }
}
