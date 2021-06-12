import React, { Component } from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'
export default class App extends Component {
   
        render() {
            return (
            <BrowserRouter> 
                <Switch>
                    <Route path='/login' component={Login} />
                    {/*path='/' 表示根路径  */}
                    <Route path='/' component={Admin} />
                </Switch>
            </BrowserRouter>
            )
        }
    }
