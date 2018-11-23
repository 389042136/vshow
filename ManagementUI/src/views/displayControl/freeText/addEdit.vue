<!--自由文本编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="110px" :disabled="propType == 3">			
			<el-form-item label="文本内容：" prop="contentCn">
				<el-input type="textarea" :rows="6" placeholder="请输入文本内容，最多200个字符" maxlength="200" v-model.trim="formData.contentCn"></el-input>
			</el-form-item>
			<el-form-item label="显示时间：" required class="datetime-inline">
				<el-date-picker v-model="formData.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
				<span class="time-line">--</span>
				<el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
			</el-form-item>
			<el-form-item label="描述：" prop="remark">
				<el-input type="textarea" :rows="6" placeholder="请输入备注，最多100个字符" maxlength="100" v-model.trim="formData.remark"></el-input>
			</el-form-item>
			<el-form-item label="选择显示设备：">
				<DeviceTree ref="deviceTree" :checked="formData.dvcIds"></DeviceTree>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { displayControlManagement } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	import DeviceTree from "../deviceTree";
	export default {
		components: {
			InfoPanle,
			DeviceTree
		},
		props: ['panleShow', 'panleData'],
		data() {
			return {
				propShow: false,
				propType: 0,

				formData: {},
				rules: {
					contentCn: [
						{
							required: true,
							message: '请输入文本内容',
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			init() {
				let id = this.panleData.data && this.panleData.data.id;
				if(id) this.getFreeText(id);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},

			/**
			 * 编辑，获取当前自由文本信息
			 */
			async getFreeText(id) {
				let res = await displayControlManagement.getFreeText(id);
				if(!res) return;
				this.formData = res.data; 
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				if(!this.formData.startTime || !this.formData.endTime) {
					this.$message.warning('请选择显示的开始和结束时间');
					return;
				}

				if(this.formData.startTime > this.formData.endTime){
					this.$message.error('开始时间不能大于结束时间');
					return;
				}
				
				this.formData.dvcIds = this.$refs.deviceTree.$refs.deviceTree.getCheckedKeys(true).filter((val) => val >= 20000);

				let res, tittle;
				if(this.propType == 1) {
					res = await displayControlManagement.addFreeText(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await displayControlManagement.updateFreeText(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.$message.success(tittle + '自由文本成功');
					this.panleClose(true);
				}else {
					this.$message.error(tittle + '自由文本失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.formData = {};
			},
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			}
		}
	}
</script>
<style lang="less">

</style>