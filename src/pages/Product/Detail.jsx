import React, { Component } from 'react'
import { Card ,List,Button} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {reqOneCategory} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
const {Item} = List
export default class Detail extends Component {
    state = {
        cName1:'',//一级分类名
        cName2:'',//二级分类名
    }
    async componentDidMount(){
        const {pCategoryId,categoryId} = this.props.location.state
        //该商品为一级分类下的，只有一级分类名
        if(pCategoryId==="0"){
            //请求一级分类名
            const result = await reqOneCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }else{
            //分别请求一级二级名效率不高，await是同步的 会等到前一个请求响应才会执行下一个
            /* const result1 = await reqOneCategory(pCategoryId)
            const result2 = await reqOneCategory(categoryId) */

            //二级分类下的商品，需要请求一级、和二级分类名
            const results = await Promise.all([reqOneCategory(pCategoryId),reqOneCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    render() {
        const {name,desc,detail,price,imgs} = this.props.location.state
        const {cName1,cName2} = this.state
        console.log(this.props.location.state)
        const title = (
            <span>
                <Button 
                type="link" 
                icon={<ArrowLeftOutlined/>}
                onClick={()=>{this.props.history.goBack()}}
                ></Button>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格</span>
                        <span className='right'>{price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类</span>
                        <span className='right'>{cName1} {cName2? '-->'+cName2:''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片</span>
                        <span className='right'>
                            {imgs.map(img=>{
                                return (
                                    <img
                                    className='product-img'
                                    key={img}
                                    src={BASE_IMG_URL+img}
                                    />
                                )
                            })}
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情</span>
                        <span className='right' dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
