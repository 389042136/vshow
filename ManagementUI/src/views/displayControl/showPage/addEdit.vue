<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" ref="formData" label-width="120px" :disabled="propType == 3">
			<el-form-item label="设备名称(编号)：" prop="dvcNo">
				<el-input v-model.trim="deviceNo" disabled></el-input>
			</el-form-item>
			<el-form-item label="设备分组：" prop="groupName">
				<el-input v-model.trim="formData.groupName" disabled></el-input>
			</el-form-item>
			<el-form-item label="背景资源：" prop="backgroundFid">
				<el-select v-model="formData.backgroundFid" placeholder="请选择" clearable> 
					<el-option :label="item.fileDescription" :value="item.fileId" v-for="(item, key) in backgroundArr" :key="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="自定义页面：" prop="customFid">
				<el-select v-model="formData.customFid" placeholder="请选择" clearable> 
					<el-option :label="item.fileDescription" :value="item.fileId" v-for="(item, key) in DIYPageArr" :key="key"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { displayControlManagement, device } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		props: ['panleShow', 'panleData'],
		computed: {
			deviceNo() {
				return `${ this.formData.dvcName }(${ this.formData.dvcNo })`;
			}
		},
		data() {
			return {
				propShow: false,
				propType: 0,
				formData: {},
				backgroundArr: [],
				DIYPageArr: []
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},

			/**
			 * 获取背景资源，自定义页面
			 */
			async getStaticFiles() {
				let params = {
					queryData: {type: 1},
					currentPage: 1,
					pageSize: 1000,
				}
				let backgroundArr = await displayControlManagement.getStaticFiles(params);

				params.queryData.type = 2;
				let DIYPageArr = await displayControlManagement.getDIYPage(params);
				if(backgroundArr && DIYPageArr) {
					this.backgroundArr = backgroundArr.data.returnDatas;
					this.DIYPageArr = DIYPageArr.data.returnDatas;
				}
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				let res, tittle;
				if(this.propType == 1) {
					res = await device.addDevice(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await device.updateDevice(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.$message.success(tittle + '成功');
					this.panleClose(true);
				}else {
					this.$message.error(tittle + '失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
			},
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			}
		},
		created(){
			this.getStaticFiles();
		}
	}
</script>
<style lang="less">
	#account .infoPanle .el-form-item {
		margin-bottom: 32px;
	}
</style>