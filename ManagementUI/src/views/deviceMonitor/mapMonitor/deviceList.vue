<!--设备监控: 设备列表-->
<template>
	<div class="mapMonitor-list tablePagination">
		<el-row type="flex" justify="space-between">
			<div class="operation">
				<!-- 自动刷新 -->
				<!-- <el-dropdown trigger="click" placement="bottom-start" @command="selectTime">
					<el-button :type="refresh.timing ? 'danger' : 'primary'" :icon="refresh.timing ? 'el-icon-loading' : 'el-icon-refresh'">
						{{ refresh.text }}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="stop" v-show="refresh.timing">停止自动刷新</el-dropdown-item>
						<el-dropdown-item v-for="(item, index) in refresh.timeArr" :key="index" :command="item">{{ item }}s</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown> -->

				<el-button type="primary" icon="fa fa-window-restore" @click="$parent.control(1)">重启</el-button>
				<el-button type="primary" icon="fa fa-power-off" @click="$parent.control(2)">关机</el-button>
				<el-button type="primary" icon="fa fa-power-off" @click="$parent.control(3)">开机</el-button>
				<!-- 亮度调节 -->
				<div class="light-btn">
					<div>
						<el-button type="primary" icon="fa fa-sliders">调节亮度</el-button>
						<el-slider v-model="lightValue" @change="setLight"></el-slider>
					</div>
				</div>
			</div>
			<div class="pagination flex-j-right flex-a-center">
				<p>共查询到<span class="pagination-text">{{ totalNum }}</span>条记录 </p>
				<p>共<span class="pagination-text">{{ totalPage }}</span>页</p>
				<el-pagination background 
					@size-change="sizeChange"
					@current-change="currentChange"
					:current-page="page.current" 
					:page-sizes="page.pageSizeArr" 
					:page-size="page.pageSize" 
					layout="prev, pager, next, jumper, sizes" 
					:total="totalNum">
				</el-pagination>
			</div>
		</el-row>
		<el-table class="multipleTable" :data="deviceList" ref="multipleTable" stripe highlight-current-row @selection-change="selectionChange">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" label="序号" width="60" align="center" :index="indexMethod"></el-table-column>
			<el-table-column prop="dvcNo" label="编号" min-width="70" show-overflow-tooltip></el-table-column>
			<el-table-column prop="dvcName" label="名称" min-width="70" show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="连接状态" width="90" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="0 == scope.row.status">未连接</span>
					<span v-else-if="1 == scope.row.status" class="el-c-success">已连接</span>
					<span v-else-if="2 == scope.row.status" class="el-c-danger">已离线</span>
				</template>
			</el-table-column>
			<el-table-column prop="zoneName" label="区域" min-width="80" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="groupName" label="分组" min-width="80" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="dvcIp" label="IP地址" min-width="70" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="dvcMac" label="MAC地址" min-width="80" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="groupFlag" label="组合屏" width="80" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="el-c-success" v-if="scope.row.groupFlag == '1'">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="groupIndex" label="组内序号" width="90" align="center">
				<template slot-scope="scope">
					{{ scope.row.groupFlag == '1' ? scope.row.groupIndex : '' }}
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { showPrompt } from "@/utils/utils";
	export default {
		props: ['tableData'],
		computed: {
			//设备列表
			deviceList() {
				let start = (this.page.current - 1) * this.page.pageSize;
				let end = this.page.current * this.page.pageSize;
				return this.tableData.slice(start, end);
			},

			//总页码
			totalPage() {
				return Math.ceil(this.totalNum / this.page.pageSize);
			},

			//总条数
			totalNum() {
				this.page.current = 1;
				return this.tableData.length;
			},

			//获取断开的设备
			...mapState(['breakDevice']),
		},
		data() {
			return {
				//分页
				page: {
					pageSize: 5,
					current: 1,
					pageSizeArr: [5, 10, 15],
				},

				/**
				 * 定时刷新
				 */
				refresh: {
					timeArr: [5, 10, 20, 30, 60],
					autoRefreshTimer: null,
					timing: false, 
					text: '自动刷新',
				},
				
				//默认亮度
				lightValue: 50,
			}
		},
		methods: {
			/**
			 * 批量操作
			 */
			selectionChange(val) {
				this.$parent.checkedVal = val.map((val) => val.dvcIp);
			},

			/**
			 * 序号
			 */
			indexMethod(index) {
				return index + 1 + (this.page.current - 1) * this.page.pageSize;
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.page.current = val;
			},

			/**
			 * 修改每页显示条数
			 */
			sizeChange(val){
				this.page.pageSize = val;
			},

			/**
			 * 定时刷新
			 */
			selectTime(time) {
				clearInterval(this.refresh.autoRefreshTimer);
				if(time == 'stop') {
					this.refresh.text = '自动刷新';
					this.refresh.timing = false;
				}else {
					this.refresh.text = time + 's';
					this.refresh.timing = true;
					this.refresh.autoRefreshTimer = setInterval(this.$parent.getDeviceList, time * 1000);
				}
			},

			/**
			 * 亮度滑块
			 */
			setLight(val){
				this.lightValue = val;
				this.$parent.control(4, null, val);
			},

			/**
			 * 改变断开设备状态
			 */
			breakStatus(arr) {
				arr.forEach(i => {
					this.tableData.forEach(j => {
						if(i.dvcIp == j.dvcIp) {
							j.status = i.status;
						}
					});
				});
			}
		},
		watch: {
			breakDevice(val) {
				this.breakStatus(val);
			}
		},
		beforeDestroy() {
			//clearInterval(this.refresh.autoRefreshTimer);
		}
	}
</script>
<style lang="less">
	.mapMonitor-list {
		min-width: 1120px;
		height: 100%;

		.el-row {
			padding: 10px 20px;
		}

		.el-dropdown {
			margin-right: 10px;
		}

		.pagination {
			height: 35px;
			padding: 0;
		}

		.light-btn {
			display: inline-block;
			margin-left: 10px;

			& > div {
				display: flex;
			}

			.el-slider {
				width: 100px;
				height: 32px;
				margin-left: 5px;
				display: none;
			}

			&:hover .el-slider {
				display: block;
			}
		}

		.multipleTable {
			height: calc(100% - 55px);
		}
	}
</style>