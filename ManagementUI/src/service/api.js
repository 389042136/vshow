import http from './http';


//全局参数
export const globalParams = {

    get: () => http.get('/configDatas'),
  
};

/**
 * 登录、退出、修改密码
 */
export const indexFn = {

    login: param => http.post('/login', param),

    logout: () => http.post('/logout'),

    updatePassword: param => http.put('/modifyPassword', param),
};

/**
 * 左侧导航栏
 */
export const menuAside = {

};

/**
 * 景点管理
 */
export const scenicManagement = {

    //查询景点
    getScenicList: param => http.post('/mpSelectScenicListByPage',param),
    
    //查询景点下拉框
    getSelectScenicList: () => http.get('/mpSelectScenicList?scenicNameCh='),

    //删除景点
    deleteOneScenic: param => http.post('/mpDeleteOneScenic',param),

    //增加景点
    insertScenic: param => http.uploadFile('/mpInsertOneScenic', param),

    //编辑景点
    updateScenic: param => http.uploadFile('/mpUpdateOneScenic', param),

};
/**
 * 商家管理
 */
export const businessManagement = {

    //查询商家
    getBusinessList: param => http.post('/mpSelectBusinessListByPage',param),

     //查询商家下拉框
    getSelectBusinessList: () => http.get('/mpSelectBusinessList?businessNameCh='),

    //查询商家区域
    getBusinessArea: () => http.get('/mpSelectBusinessArea'),

    //查询商家类型
    getBusinessType: () => http.get('/mpSelectBusinessType'),

    //删除商家
    deleteOneBusiness: param => http.post('/mpDeleteOneBusiness',param),

    //增加商家
    insertBusiness: param => http.uploadFile('/mpInsertOneBusiness', param),

    //编辑商家
    updateBusiness: param => http.uploadFile('/mpUpdateOneBusiness', param),

};

/**
 * 柜台管理
 */
export const checkManagement = {

    //查询柜台
    getCheckInList: param => http.post('/mpSelectCheckInListByPage',param),
    
    // 查询已有柜台模式
    getCheckModel: () => http.get('/mpSelectDirectionAndModel'),

   // 查询已有柜台模式
   updateCheckInModel: (param) => http.get('/mpUpdateCheckInModel?checkinModelCounter='+param),

    //删除柜台
    deleteOneCheckIn: param => http.post('/mpDeleteOneCheckIn',param),

    //新增柜台
    insertCheckIn: param => http.post('/mpInsertOneCheckIn', param),

    //编辑柜台
    updateCheckIn: param => http.post('/mpUpdateOneCheckIn', param),

};
/**
 * 权限管理
 */
export const authManagement = {

    /**
     * 角色列表查询
     */
    getRole: param => http.post('/roleList', param),

    //角色新增
    addRole: param => http.post('/role', param),

    //角色修改
    updateRole: param => http.put('/role', param),

    //角色删除
    deleteRole: param => http.post('/roleDelete', param),

    //获取全部模块
    getModules: () => http.post('/resource'),

    //角色授权
    setAuth: param => http.post('/role/assignResource', param),


    /**
     * 帐号列表查询
     */
    getAccount: param => http.post('/accountList', param),

    //账号新增
    addAccount: param => http.post('/account', param),

    //账号修改、状态修改、 密码重置
    updateAccount: param => http.put('/account', param),

    //账号删除
    deleteAccount: param => http.post('/accountDelete', param),

    //获取全部角色
    getAllRole: () => http.get('/account/findAllRole'),


    /**
     * 查询资源列表
     */
    getResource: () => http.get('/resourceList'),
};


/**
 * 基础数据管理
 */
export const airBasedata = {

    /**
     * 地图管理
     */
    getMap: param => http.post('/mapList', param),

    //新增地图
    addMap: param => http.uploadFile('/map', param),

    //修改地图
    updateMap: param => http.uploadFile('/mapUpdate', param),

    //删除地图
    deleteMap: param => http.post('/mapDelete', param),


    /**
     * 区域管理
     */
    getArea: param => http.post('/zoneList', param),

    //新增区域
    addArea: param => http.post('/zone', param),

    //修改区域
    updateArea: param => http.put('/zone', param),

    //删除区域
    deleteArea: param => http.post('/zoneDelete', param),

    //获取地图下拉框
    getMapList: param => http.post('/mapSelect', param),
};

/**
 * 应急设施管理
 */
export const device = {
    /**
     * 设施类型管理
     */
    getTypeList: param => http.post('/facilitiesTypeList', param),

    //新增设施类型
    addType: param => http.uploadFile('/facilitiesTypeInsert', param),

    //修改设施类型
    updateTypee: param => http.uploadFile('/facilitiesTypeUpdate', param),

    //删除设施类型
    deleteType: param => http.post('/facilitiesTypeDelete', param),



    /**
     * 设施管理
     */

    //获取设施列表
    getDeviceList: param => http.post('/facilitiesList', param),

    //新增设施
    addDevice: param => http.post('/facilitiesInsert', param),

    //修改设施
    updateDevice: param => http.post('/facilitiesUpdate', param),

    //删除设施
    deleteDevice: param => http.post('/facilitiesDelete', param),
};


/**
 * 酒店管理
 */
export const hotel = {

    /**
     * 酒店管理
     */
    // 获取酒店分页列表
    getHotelList: params => http.post('/mpSelectHotelListByPage', params),

    //获取所有的酒店信息
    getAllHotelDatas: () => http.get('/mpSelectHotelList?hotelNameCh='),

    // 新增酒店
    addHotel: params => http.uploadFile('/mpInsertOneHotel', params),

    // 修改酒店
    updateHotel: params => http.uploadFile('/mpUpdateOneHotel', params),

    // 删除酒店
    deleteHotel: params => http.get('/mpDeleteOneHotel?hotelId=' + params),

    /**
     * 酒店管理
     */
    // 获取客房分页列表
    getRoomList: params => http.post('/mpSelectRoomListByPage', params),

    // 新增客房
    addRoom: params => http.uploadFile('/mpInsertOneRoom', params),

    // 修改客房
    updateRoom: params => http.uploadFile('/mpUpdateOneRoom', params),

    // 删除客房
    deleteRoom: params => http.post('/mpDeleteOneRoom', params),

    // 查询客房设施类型
    getAllRoomDevs: () => http.get('/mpSelectTypeOfRoomDev'),

}


/**
 * 留言板管理
 */
export const advice = {

    // 带查询的留言板分页列表
    getAdviceList: params => http.post('/mpSelectAdviceForDateByPage', params),

    // 删除留言
    deleteAdvice: params => http.post('/mpDeleteOneAdvice', params),

    //获取留言详情
    getAdviceInfo: params => http.get('/queryAdviceInfo?id=' + params),

}

