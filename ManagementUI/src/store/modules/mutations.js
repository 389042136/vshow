export default {

    /**
     * 面包屑
     */
    ['SET_BREAD']: (state, obj) => state.breadArr = obj,
    ['PUSH_BREAD']: (state, obj) => state.breadArr.push(obj),
    ['POP_BREAD']: (state) =>  state.breadArr.pop(),

    /**
     * 全局参数
     */
    ['SET_GLOBALPARAMS']: (state, obj) =>  state.globalParams = obj,

    /**
     * 角色权限
     */
    ['SET_ALLAUTH']: (state, obj) =>  state.allAuth = obj,

    /**
     * 接收到断开设备
     */
    ['SET_BREAKDEVICE']: (state, obj) =>  state.breakDevice = obj,
}

