### setState({},callback)
    1.this.setState({})是异步更新
    2.如果需要在state更新后才完成某个事件需要使用  setState({},callback)


### setState() 两种使用方式：
    1.this.setState({a:3})  传对象，在不依赖原有状态情况下
    2.this.setState(state=>{ a:state.a + 1})  传函数，依赖原有状态情况下

### setState() 是同步还是异步？
    1.在React相关回调 (React回调 生命周期)
    2.在其他异步回调 (定时器，promise await，原生DOM事件回调)

### 一个回调中多次执行setState()
    1.render都只执行一次
    2.setState({}):合并只更新一次状态
    3.setState(fn):更新多次状态
### 函数在组件中传递
    1.父组件传子组件：props
    2.子组件传父组件：
            1）子组件this上绑定该函数
            2）父组件通过ref获取子组件dom并拿到子组件this上的方法调用