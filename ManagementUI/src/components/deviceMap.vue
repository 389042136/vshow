<!--设施地图组件-->
<template>
	<!-- 拖动， 缩放 -->
	<div id="map-move-con">
		<!-- 地图 main -->
		<div class="map-container" @click.left="leftClick" @click.right.prevent="rightClick" :class="{'cursor-move': isMoveDevPos}" :style="imgStyle">
			<img draggable="false" :src="mapUrl" :style="imgStyle">

			<!-- 设施坐标 -->
			<div class="point-con">
				<template v-for="item in mapData">
					<div class="ponit" :class="{normal: item.facStatus == 0, disable: item.facStatus == 1, break: item.facStatus == 2}"
						:key="item.facId"
						:id="item.facId"
						v-if="item.coordinateX"
						:postion="`${ item.coordinateX },${ item.coordinateY }`"
						:style="`left:${ item.coordinateX }%;top:${ item.coordinateY }%`" 
						@click.left.stop="clickSpot(item.facId)"
						@click.right.prevent.stop="clickSpot(item.facId)">
						<el-tooltip placement="top">
							<!-- 设施对应信息 -->
							<div slot="content" class="map-device-info">
								<el-row type="flex">
									<div>名称：</div>
									<div>{{ item.facName }}</div>
								</el-row>
								<el-row type="flex">
									<div>编号：</div>
									<div>{{ item.facNo }}</div>
								</el-row>
								<el-row type="flex">
									<div>类型：</div>
									<div>{{ item.typeName }}</div>
								</el-row>
							</div>
							<div class="device-icon">
								<img :src="item.typeIcon">
							</div>
						</el-tooltip>
					</div>
				</template>
			</div>

			<!-- 新增设施框 -->
			<div class="addDevice-con" :style="`left: ${ addDevice.x }%;top: ${ addDevice.y }%`" v-show="addDevice.show" v-if="type">
				<div @click="addEditDevice(1)">新增设施</div>
				<div @click="addEditDevice(4)">绑定设施</div>
			</div>
			
			<!-- 操作框 -->
			<div class="operation-con" :style="`left: ${ operation.x }%;top: ${ operation.y }%`" v-show="operation.show">
				<template v-if="type">
					<div @click="deleteDevice()">删除</div>
					<div @click.stop="moveDevice()">移动</div>
					<div @click="addEditDevice(2)">编辑</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery';
    import dragZoom from "@/assets/js/dragZoom";
	import { showPrompt } from "@/utils/utils";
	export default {
		props: ['mapData', 'service', 'mapUrl', 'devControl', 'type'],
		data() {
			return {
				mapContainer: null,
				imgStyle: '',

				pointObj : {},      //地图坐标
				operation: {},      //操作弹框
				addDevice: {},		//新增设施框
				isMoveDevPos: 0,    //是否移动设施位置
				currentObj: null,   //当前点击对象 DOM
				dvcIP: '',			//当前点击对象 ip
				facId: '',			//当前点击对象 id
			}
		},
		methods: {
			/**
			 * 获取地图宽高
			 */
			async getImg() {
				this.imgStyle = await this.imgWidthHeight(this.mapUrl, $('.deviceList-right-map'));
			},

			/**
			 * 获取图片宽高
			 */
			imgWidthHeight(url, el) {
				let img = new Image();
				img.src = url;

				//加载完成执行
				return new Promise(resolve => {
					img.onload = () => {
						/* let wh = img.width / img.height;
						let style = el.width() / el.height() < wh ? 
									'width:100%; height:' + el.width() * wh + 'px' :
									'height:100%; width:' + el.height() * wh + 'px'; */
						let style = el.width() / el.height() < img.width / img.height ? 'width:100%' : 'height:100%';
						resolve(style);
					}
				});
			},

			/**
			 * 初始化地图
			 */
            init() {
				this.mapContainer = $('.map-container');
				this.dragZoomObj = $('#map-move-con');

                //拖拽、缩放
				dragZoom.init(this.dragZoomObj);

				//隐藏弹框
				$(window).click(() => {
					this.dialogShow();
					this.isMoveDevPos = 0;
				});
			},

			/**
			 * 隐藏弹框
			 */
			dialogShow() {
				this.operation.show = false;
				this.addDevice.show = false;
			},

			/**
             * 点击设施，弹框位置
             * obj 点击对象的id
             */
            clickSpot(id){
				this.currentObj = $('#' + id);
				//$.cleanData([point[0]]);	//清空data缓存
				let pos = this.currentObj.attr('postion').split(',');
				this.operation = {
					x: pos[0], 
					y: pos[1],
					show: true
				};
				this.addDevice.show = false;
				this.isMoveDevPos = 0;
				this.facId = id;
				this.dvcIP = this.currentObj.data('ip');
			},

			/**
			 * 鼠标点击地图
			 */
			clickMap(e) {
				this.dialogShow();
				let x = this.percent(e.offsetX, this.mapContainer.width()),
					y = this.percent(e.offsetY, this.mapContainer.height());
				return {x, y};
			},

			/**
			 * 百分比转换
			 */
			percent(a, b) {
				return (a / b * 100).toFixed(2);
			},

			/**
			 * 左键: 移动设施位置
			 */
			async leftClick(event) {
                if(this.isMoveDevPos){
					let e = this.clickMap(event);
					let params = {
						facId: this.facId,
						coordinateX: e.x,
						coordinateY: e.y
					};
					let res = await this.service.updata(params);
					this.isMoveDevPos = 0;
					if(!res) return;

					if(res.status == this.$successCode) {
						this.$message.success('移动设施成功');
						this.currentObj.attr('postion', e.x + ',' + e.y).css({
							left: e.x + '%',
							top : e.y + '%'
						});
					}else {
						this.$message.error('移动设施失败');
					}
				}
			},

			/**
			 * 右键: 操作框
			 */
			rightClick(event) {
				let e = this.clickMap(event);
				this.addDevice = {
					x: e.x, 
					y: e.y,
					show: true
				};
			},

			/**
			 * 删除设施指令
			 */
			deleteDevice(){
				showPrompt( async () => {
					let res = await this.service.delete([this.facId]);
					if(!res) return;

					if(res.status == this.$successCode) {
						this.$message.success('删除设施成功');
						this.currentObj.remove();
						this.operation.show = false;
					}else {
						this.$message.error('删除设施失败');
					}
				}, '删除');
			},

			/**
             * 移动设施指令
             */
            moveDevice(){
               this.isMoveDevPos = 1;
               this.operation.show = false;
			},

			/**
			 * 1：新增、绑定	2：编辑
			 */
			addEditDevice(type) {
				let data;
				if(type == 1 || type == 4) {
					data = {
						coordinateX: this.addDevice.x,
						coordinateY: this.addDevice.y
					};
				}else{
					let pos = this.currentObj.attr('postion').split(',');
					data = this.mapData.find((val) => val.facId == this.facId);
					data.x = pos[0];
					data.y = pos[1];
				}
				this.$transfer.$emit('panleShow', {type, data});
			},

			/**
			 * 还原地图样式
			 */
			resetStyle(obj) {
				obj.animate({
					width: '100%',
					height: '100%',
					left: 0,
					top: 0,
				}, 500);
			},
		},
		watch: {
			mapUrl() {
				this.getImg();
				this.resetStyle(this.dragZoomObj);	//还原地图位置，大小
			}
		},
		mounted() {
			this.getImg();
			this.init();
		}
	}
</script>
<style lang="less" scoped>
	.device-icon {
		width: 30px;
		height: 30px;
		position: relative;
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			pointer-events: none;
			box-shadow: 0 3px 2px rgba(0, 0, 0, .6);
		}
		&:before {
			content: '';
			position: absolute;
			width: 14px;
			height: 14px;
			top: -2px;
			right: -3px;
			border-radius: 50%;
			animation-duration: .8s;
			animation-iteration-count: infinite;
			box-sizing: border-box;
		}
	}

	.disable .device-icon:before{
		animation-name: disable;
		background: rgb(230, 162, 60);
	}
	@keyframes disable {
		0% {
			opacity:.2;
			box-shadow:0 1px 2px rgba(255,255,255,.1);
		}
		70% {
			opacity:.5;
			box-shadow:0 1px 2px rgba(255,255,255,.1);
		}
		100% {
			opacity:1;
			border: 1px solid rgba(255,255,255,.6);
			box-shadow:0 1px 10px rgba(232,169,75,1);
		}
	}

	.break .device-icon:before{
		animation-name: break;
		background: red;
	}
	@keyframes break {
		0% {
			opacity:.2;
			box-shadow:0 1px 2px rgba(255,255,255,.1);
		}
		70% {
			opacity:.5;
			box-shadow:0 1px 2px rgba(255,255,255,.1);
		}
		100% {
			opacity:1;
			border: 1px solid rgba(255,255,255,.6);
			box-shadow:0 1px 10px rgba(255, 1, 1, 1);
		}
	}
</style>