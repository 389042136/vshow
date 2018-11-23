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
 * 机场信息管理
 */
export const airportInfo = {

    /**
     * 查看机场信息
     */
    getInfo: () => http.post('/airport'),

    //上传logo
    uploadLogo: param => http.uploadFile('/modifyLogo', param),


    /**
     * 机场配置参数
     */
    getConfig: () => http.post('/config'),

    //修改参数
    setConfig: param => http.put('/config', param),
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
 * 显示设备管理
 */
export const device = {

    /**
     * 设备管理
     */
    getGroup: () => http.get('/deviceGroupTree'),

    //新增分组
    addGroup: param => http.post('/deviceGroup', param),

    //修改分组
    updateGroup: param => http.put('/deviceGroup', param),

    //删除分组
    deleteGroup: param => http.post('/deviceGroupDelete', param),


    //获取设备列表
    getDeviceList: param => http.post('/deviceList', param),

    //获取设备详情
    getDeviceInfo: param => http.get('/device', param),

    //新增设备
    addDevice: param => http.post('/device', param),

    //修改设备
    updateDevice: param => http.put('/device', param),

    //删除设备
    deleteDevice: param => http.post('/deviceDelete', param),

    //获取初始化数据
    getSelect: () => http.get('/deviceSelect'),


    //获取区域地图
    getZoneMap: param => http.get('/zone', param),
};

/**
 * 设备显示控制管理
 */
export const displayControlManagement = {
    /**
     * 获取设备树
     */
    getDeviceTree: () => http.get('/deviceTree'),

    /**
     * 自由文本管理
     */
    queryFreeTexts: param => http.post('/freeText/queryDatas', param),

    //新增
    addFreeText: param => http.post('/freeText/save', param),

    //获取单条
    getFreeText: param => http.post('/freeText/getInfo', param),

    //修改
    updateFreeText: param => http.post('/freeText/update', param),

    //删除
    deleteFreeText: param => http.post('/freeText/delete', param),

    /**
     * 显示页面控制
     */
    getShowPageList: param => http.post('/deviceStaticPageList', param),

    /**
     * 静态资源
     */
    getStaticFiles: param => http.post('/staticPageList', param),

    //删除
    deleteStaticFile: param => http.post('/staticPageDelete', param),

    //新增
    addStatciFile: param => http.uploadFile('/staticPage', param),

    //修改
    updateStatciFile: param => http.uploadFile('/staticPage', param, 0),

    /**
     * 自定义页面
     */
    getDIYPage: param => http.post('/customPageList', param),

    //删除
    deleteDIYPage: param => http.post('/customPageDelete', param),
};

/**
 * 显示设备监控
 */
export const deviceMonitor = {

    /**
     * 地图监控
     */
    getDevice: param => http.post('/monitor/findAll', param),

    //重启
    restart: param => http.post('/computer/restart', param),

    //关机
    colse: param => http.post('/computer/colse', param),

    //开机
    open: param => http.post('/computer/open', param),

    //亮度
    setLight: param => http.post('/computer/brightness', param),
};

/**
 * 日志管理
 */
export const logManagement = {

    /**
     * 登录日志
     */
    loginLog: param => http.post('/logLoginList', param),

    /**
     * 操作日志
     */
    operationlog: param => http.post('/logList', param),
};