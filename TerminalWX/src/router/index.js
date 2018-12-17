/**
 * 路由配置
 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Index = r => require.ensure([], () => r(require('@/views/index.vue')));
const Notice = r => require.ensure([], () => r(require('@/views/notice/notice.vue')));
const Hotel = r => require.ensure([], () => r(require('@/views/hotel/hotel.vue')));
const HotelInfo = r => require.ensure([], () => r(require('@/views/hotel/hotelInfo.vue')));
const RoomInfo = r => require.ensure([], () => r(require('@/views/hotel/roomInfo.vue')));
const Flights = r => require.ensure([], () => r(require('@/views/flights/flights.vue')));
const AirportList = r => require.ensure([], () => r(require('@/views/flights/airportList.vue')));
const Transportation = r => require.ensure([], () => r(require('@/views/transportation/transportation.vue')));
const TransportationBus = r => require.ensure([], () => r(require('@/views/transportation/transportationBus.vue')));
const TransportationCoach = r => require.ensure([], () => r(require('@/views/transportation/transportationCoach.vue')));
const TransportationTaxi = r => require.ensure([], () => r(require('@/views/transportation/transportationTaxi.vue')));
const TransportationParking = r => require.ensure([], () => r(require('@/views/transportation/transportationParking.vue')));
const TransportationRail = r => require.ensure([], () => r(require('@/views/transportation/transportationRail.vue')));
const Airport = r => require.ensure([], () => r(require('@/views/airport/airport.vue')));
const AirportInfo = r => require.ensure([], () => r(require('@/views/airport/airportInfo.vue')));
const Tradingarea = r => require.ensure([], () => r(require('@/views/tradingarea/tradingarea.vue')));
const TradingShopInfo = r => require.ensure([], () => r(require('@/views/tradingarea/tradingShopInfo.vue')));
const Suggestions = r => require.ensure([], () => r(require('@/views/suggestions/suggestions.vue')));
const Spotquery = r => require.ensure([], () => r(require('@/views/spotquery/spotquery.vue')));
const SpotqueryInfo = r => require.ensure([], () => r(require('@/views/spotquery/spotqueryInfo.vue')));
const NoticeInfo = r => require.ensure([], () => r(require('@/views/notice/noticeInfo.vue')));
const NoticeInfoBoarding = r => require.ensure([], () => r(require('@/views/notice/noticeInfoBoarding.vue')));
const NoticeInfoCheckin = r => require.ensure([], () => r(require('@/views/notice/noticeInfoCheckin.vue')));
const NoticeInfoHand = r => require.ensure([], () => r(require('@/views/notice/noticeInfoHand.vue')));
const NoticeInfoLuggage = r => require.ensure([], () => r(require('@/views/notice/noticeInfoLuggage.vue')));
const NoticeInfoCard= r => require.ensure([], () => r(require('@/views/notice/noticeInfoCard.vue')));
const NoticeMinute = r => require.ensure([], () => r(require('@/views/notice/noticeMinute.vue')));
const FacilitiesQuery = r => require.ensure([], () => r(require('@/views/facilitiesQuery/facilitiesQuery.vue')));
const TradingareaMap = r => require.ensure([], () => r(require('@/views/tradingarea/tradingareaMap.vue')));
const WXError = r => require.ensure([], () => r(require('@/views/other/WXError.vue')));
const Parking = r => require.ensure([], () => r(require('@/views/parking/parking.vue')));

export default new Router({
	routes: [
		{
			path: '/',
			name: 'index',
			component: Index,
		},
		{
			path: '/hotel',
			name: 'hotel',
			component: Hotel,
			children: [
				
			]
		},
		{
			path: '/hotelInfo',
			name: 'hotelInfo',
			component: HotelInfo,
		},
		{
			path: '/roomInfo',
			name: 'roomInfo',
			component: RoomInfo,
		},
		{
			path: '/notice',
			name: 'notice',
			component: Notice,
		},
		{
			path: '/noticeInfo',
			name: 'noticeInfo',
			component: NoticeInfo,
		},
		{
			path: '/noticeInfoBoarding',
			name: 'noticeInfoBoarding',
			component: NoticeInfoBoarding,
		},
		{
			path: '/noticeInfoCheckin',
			name: 'noticeInfoCheckin',
			component: NoticeInfoCheckin,
		},
		{
			path: '/noticeInfoHand',
			name: 'noticeInfoHand',
			component: NoticeInfoHand,
		},
		{
			path: '/noticeInfoLuggage',
			name: 'noticeInfoLuggage',
			component: NoticeInfoLuggage,
		},
		{
			path: '/noticeInfoCard',
			name: 'noticeInfoCard',
			component: NoticeInfoCard,
		},
		{
			path: '/noticeMinute',
			name: 'noticeMinute',
			component: NoticeMinute,
		}, 
		{
			path: '/flights',
			name: 'flights',
			component: Flights,
		},
		{
			path: '/airportList',
			name: 'airportList',
			component: AirportList,
		},
		{
			path: '/transportation',
			name: 'transportation',
			component: Transportation,
		},
		{
			path: '/transportationBus',
			name: 'transportationBus',
			component: TransportationBus,
		},
		{
			path: '/transportationCoach',
			name: 'transportationCoach',
			component: TransportationCoach,
		},
		{
			path: '/transportationTaxi',
			name: 'transportationTaxi',
			component: TransportationTaxi,
		},
		{
			path: '/transportationParking',
			name: 'transportationParking',
			component: TransportationParking,
		},
		{
			path: '/transportationRail',
			name: 'transportationRail',
			component: TransportationRail,
		},
		{
			path: '/parking',
			name: 'parking',
			component: Parking,
		},
		{
			path: '/airport',
			name: 'airport',
			component: Airport,
		},
		{
			path: '/airportInfo/:count',
			name: 'airportInfo',
			component: AirportInfo,
		},
		{
			path: '/tradingarea',
			name: 'tradingarea',
			component: Tradingarea,
		},
		{
			path: '/tradingShopInfo',
			name: 'tradingShopInfo',
			component: TradingShopInfo,
		},
		{
			path: '/suggestions',
			name: 'suggestions',
			component: Suggestions,
		},
		{
			path: '/spotquery',
			name: 'spotquery',
			component: Spotquery,
		},
		{
			path: '/spotqueryInfo',
			name: 'spotqueryInfo',
			component: SpotqueryInfo,
		},
		{
			path: '/facilitiesQuery',
			name: 'facilitiesQuery',
			component: FacilitiesQuery,
		},
		{
			path: '/tradingareaMap',
			name: 'tradingareaMap',
			component: TradingareaMap,
		},
		{
			path: '/WXError',
			name: 'WXError',
			component: WXError,
		},
		{
			path: '*',
			redirect: '/',
		},
	]
})