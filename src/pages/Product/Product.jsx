import React, { Component } from 'react'
import {Switch,Route, Redirect} from 'react-router-dom'
import Detail from './Detail'
import Home from './Home'
import Update from './Update'
import  './product.less'
export default class Product extends Component {
    render() {
        return (
            <div>
            <Switch>
                <Route exact path='/product' component={Home}></Route>
                <Route path='/product/update' component={Update}></Route>
                <Route path='/product/detail' component={Detail}></Route>
                <Redirect to='/produc'></Redirect>
            </Switch>
            </div>
        )
    }
}
