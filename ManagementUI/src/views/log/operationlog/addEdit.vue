<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()">
		<el-form @submit.native.prevent :model="formData" label-width="100px">
			<el-form-item label="操作者账号：">
				<el-input v-model.trim="formData.userName" :readonly="propType == 3"></el-input>
			</el-form-item>
			<el-form-item label="操作时间：">
				<el-input v-model.trim="formData.operatorTime" :readonly="propType == 3"></el-input>
			</el-form-item>
			<el-form-item label="类型：">
				<el-input v-model.trim="formData.targetType" :readonly="propType == 3"></el-input>
			</el-form-item>
			<el-form-item label="模块：">
				<el-input v-model.trim="formData.action" :readonly="propType == 3"></el-input>
			</el-form-item>
			<el-form-item label="IP来源：">
				<el-input v-model.trim="formData.ip" :readonly="propType == 3"></el-input>
			</el-form-item>
			<!-- <el-form-item label="执行sql：">
				<el-input v-model.trim="formData.sql" :title="formData.sql" :readonly="propType == 3"></el-input>
			</el-form-item> -->
			<el-form-item label="传入参数：">
				<el-input v-model.trim="formData.param" :title="formData.param" :readonly="propType == 3"></el-input>
			</el-form-item>
			<el-form-item label="说明：">
				<el-input v-model.trim="formData.remark" :title="formData.remark" :readonly="propType == 3"></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
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
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},

			/**
			 * 关闭弹框
			 */
			panleClose() {
				this.$emit('panleClose');
				this.propShow = false;
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