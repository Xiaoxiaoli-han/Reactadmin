import React, { Component } from 'react'
import { Card ,Table,Select,Input,Button,message} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons'
import { reqProducts,reqSearchProducts,reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const {Option} =Select
export default class Home extends Component {
    state = {
        products:[],
        loading:true,
        total:0, //商品总数据
        searchType:'productName',
        searchName:''
    }
    initColumns = ()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name', //显示对应属性名
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=> '￥' + price //当前指定了对应属性，初始纳入的是对应属性值
              },
              {
                title: '状态',
                width:150,
                //dataIndex: 'status',
                render: (product) =>{
                    const {_id,status} = product
                    console.log(_id)
                    const newStatus = status===1? 2:1
                    return (
                        <span>
                            <Button 
                            type="primary" 
                            style={{marginRight:10}} 
                            onClick={()=>{this.updateStatus(_id,newStatus)}}>{status===1? '下架':'上架'}</Button>
                            <span>{status===1? '在售':'已下架'}</span>
                        </span>
                    )
                }
              },
              {
                title: '操作',
                width:100,
                render:(product)=>{
                    return (
                        <span>
                            <Button type="link" onClick={()=>{this.props.history.push('/product/detail',product)}}>详情</Button>
                            <Button type="link" onClick={()=> this.props.history.push('/product/update',product)}>修改</Button>
                        </span>
                    )
                }
              },
          ]
    }

    //获取商品
    setProducts = async(pageNum) =>{
        this.pageNum = pageNum //存储当前页数，让其他方法可以看到 
        const {searchName,searchType} = this.state
        this.setState({loading:true})
        let result
        //显示搜索页
        if(searchName){
             result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{//显示普通页
             result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status === 0){
            const {list,total} = result.data
            this.setState({
                products:list,
                total
                })
            }
    }
    //更新商品状态
    updateStatus = async (productId,status)=>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0){
            this.setProducts(this.pageNum)
            message.success('状态更新成功！')
        }
    }
    componentDidMount(){
        this.initColumns()
        this.setProducts(1)
    }
    render() {
        const {products,loading,total,searchType} = this.state
        const columns = this.columns
        const title = (
            <span>
            <Select 
                value={searchType} 
                style={{width:150}} 
                onChange={(value)=>{ this.setState({searchType:value})}}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按内容搜索</Option>
            </Select>
            <Input 
            placeholder="关键字" 
            style={{width:150,margin:'0 15px'}}
            onChange={(event)=>{this.setState({searchName:event.target.value})}}
            />
            <Button type="primary" onClick={()=>{this.setProducts(1)}}>搜索</Button>
            </span>
        )
        const extra = (
        <Button 
        type="primary" 
        icon={<PlusOutlined/>}
        onClick={()=>{this.props.history.push('/product/update')}}
        >添加商品</Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                <Table 
                dataSource={products} 
                columns={columns} 
                bordered
                rowKey='_id'
                loading={loading}
                pagination= {{
                    defaultPageSize:PAGE_SIZE,
                    total,
                    onChange:(pageNum)=>{this.setProducts(pageNum)} // 页码改变的回调，参数是页码数和每页条数
                }}

                />
                </Card>
            </div>
        )
    }
}
