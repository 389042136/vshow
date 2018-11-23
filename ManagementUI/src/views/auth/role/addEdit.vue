<!--角色编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="100px" :disabled="propType == 3">
			<el-form-item label="角色名称：" prop="roleName">
				<el-input v-model.trim="formData.roleName" placeholder="请输入角色名称" maxlength="50" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述：" prop="describe">
				<el-input type="textarea" :rows="6" placeholder="请输入描述信息，最多100个字符" maxlength="100" v-model.trim="formData.describe"></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { authManagement } from "@/service/api";
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
				formData: {},
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				let res, tittle;
				if(this.propType == 1) {
					res = await authManagement.addRole(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await authManagement.updateRole(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '角色成功');
				}else {
					this.$message.error(tittle + '角色失败');
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
		}
	}
</script>
<style lang="less">
	
</style>