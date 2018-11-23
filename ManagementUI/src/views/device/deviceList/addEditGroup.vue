<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="110px" :disabled="propType == 3">
			<el-form-item label="分组名称：" prop="groupName">
				<el-input v-model.trim="formData.groupName" placeholder="请输入分组名称" maxlength="30" clearable></el-input>
			</el-form-item>
			<el-form-item label="父级分组名称：" prop="parentName">
				<el-input v-model.trim="formData.parentName" disabled></el-input>
			</el-form-item>
			<el-form-item label="区域：" prop="area">
				<el-input v-model.trim="formData.area" disabled></el-input>
			</el-form-item>
			<el-form-item label="分组描述：" prop="groupDesc">
				<el-input  type="textarea" :rows="6" v-model.trim="formData.groupDesc" maxlength="100" placeholder="请输入分组描述信息"></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { device } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		props: ['panleShow', 'panleData'],
		data() {
			return {
				propShow: false,
				propType: 0,
				formData: {
					groupName: '',
					parentName: '',
					area: '',
					groupDesc: '',
				},
				
				rules: {
					groupName: [{
						required: true,
						message: '请输入分组名称',
						trigger: 'blur'
					}],
				},
			}
		},
		methods: {
			init() {
				this.propType = this.panleData.type;
				this.disabled = this.propType == 2 ? true : false;
				this.propShow = this.panleShow;
				this.showData();
			},

			/**
			 * 根据type类型显示不同内容
			 */
			showData(){
				let node = Object.assign({}, this.panleData.node);
				this.formData.area = node.data.area;
				if(this.propType == 1){
					this.formData.groupName = '';
					this.formData.parentName = node.data.name;
					this.formData.groupDesc = '';
					
					this.formData.groupId = null;
					this.formData.zoneId = node.data.zId;
					this.formData.parentId = node.data.id;
				}else{
					this.formData.groupName = node.data.name;
					this.formData.parentName = node.parent.data.name;
					this.formData.groupDesc = node.data.describe;

					this.formData.groupId = node.data.id;
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
					res = await device.addGroup(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await device.updateGroup(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.$message.success(tittle + '设备分组成功');
					this.panleClose(res.data || this.formData);
				}else {
					this.$message.error(tittle + '设备分组失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(data) {
				this.propShow = false;
				this.$emit('panleClose', data);
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
	}
</script>
<style lang="less">
</style>