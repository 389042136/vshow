import http from './http';

//微信页面注入的参数
export const wxGetParams = (params) => http.get('/wxQueryParamsOfWX?foreURL=' + params);
//天气接口
export const getWeather = (data) => http.get('/weather?cityIata=' + data);
//首页菜单
export const getMainmenu = () => http.get('/mainMenu');

//获取二级菜单列表 
export const getMenulist = (params) => http.post('/enumList',params);

//获取查询酒店列表
export const getQueryHotelList = () =>  http.get('/queryHotelList');

//根据酒店查询房型列表
export const getQueryHotelRoomList = (hotelId) =>  http.get('/queryHotelRoomList?hotelId=' + hotelId);

//根据房型查询房型信息
export const getQueryHotelRoomInfo = (params) =>  http.post('/queryHotelRoomInfo',params);

//获取查询景点列表
export const getQueryScenicList = () =>  http.get('/queryScenicList');

//获取查询景点详情 
export const getQueryScenicInfo = (id) =>  http.get('/queryScenicInfo?id='+id);
//查询覆盖商家的区域
export const getQueryBusinessArea  = () =>  http.get('/queryBusinessArea');

//根据区域id，查找所辖商家
export const getQueryBusinessGroup = (params) => http.post('/queryBusinessGroup ',params);

//根据商家id，查找商家详情
export const getQueryBusinessInfo = (businessId) =>  http.get('/queryBusinessInfo?businessId=' + businessId);

// 获取推荐商家列表
export const getBusinessRecommandList = () => http.get('/wxQueryBusinessRecommandGroup');

//获取推荐景点列表
export const getScenicRecommandList = () => http.get('/wxQueryScenicRecommandList');

// 获取值机柜台信息
export const getCheckInCounterList = (params) => http.post('/wxQueryCheckInCounterList',params);

// 意见反馈
export const addFeedback = params => http.post('/insertOneAdvice', params);

//关于设施位置
export const facilities = {

    getDevices: () => http.get('/wxQueryDevicesList'),
    getMap: () => http.get('/wxQueryMapsList'),
    getDevicesType: () => http.get('/wxQueryTypsOfDeviceList'),

    add: params => http.post('/leadPoint', params),

    update: params => http.put('/leadPoint', params),

    delete: params => http.post('/leadPointDelete', params)
};

// 关于航班查询
export const flights = {
    //查询国内机场和国内热门机场
    getDomesticAirport: () => http.get('/wxQueryDomesticAirport'),

    // 查询国际机场和国际热门机场
    getInternationalAirport: () => http.get('/wxQueryInternationalAirport'),

    //根据城市三字码查询航班列表
    getFlightListByCity: (params) => http.post('/wxQueryFlightListByCity',params),

    //根据航班号查询航班列表
    getFlightListByFlightNo: (params) => http.post('/wxQueryFlightListByFlightNo',params),

    //根据航班id获取航班详情
    getFlightInfo: (params) => http.post('/wxQueryFlightInfoById',params),
}



