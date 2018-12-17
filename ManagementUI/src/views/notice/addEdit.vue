<!--设施类型编辑，新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit" class="uploadMap">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="问题分类：" prop="questionType">
			   <!-- <el-input v-model.trim="formData.questionType" placeholder="请输入问题分类" clearable maxlength="30"></el-input> -->
			   <el-select v-model.trim="formData.questionType" label="问题分类：" >
				 <el-option	value="证件相关问题"> </el-option>
			   </el-select>
			</el-form-item>
			<el-form-item label="标题：" prop="headline">
				<el-input v-model.trim="formData.headline" placeholder="请输入标题" clearable maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="内容：" prop="content">
				<el-input type="textarea" :rows="3" placeholder="请输入描述信息，最多100个字符" v-model.trim="formData.content" maxlength="100"></el-input>
			</el-form-item>
			<el-form-item label="备注：" prop="remark">
				<el-input v-model.trim="formData.remark" placeholder="请输入备注" clearable maxlength="30"></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { mapState } from 'vuex';
	import { device } from "@/service/api";
	import { formatCheck, suffix } from "@/utils/utils";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		computed: {
			...mapState({
				maxFileSize: state => Number(state.globalParams.upload_type_icon_maxsize),
			}),
		},
		props: ['panleShow', 'panleData'],
		data() {
			return {
				//上传参数
				fileType: ['png', 'jpg', 'jpeg'],
				formData: {},

				propShow: false,
				propType: 0,
				rules: {
					typeName: [{
						required: true,
						message: '请输入类型名称',
						trigger: 'blur'
					}],
					typeIcon: [{
						required: true,
						message: '请选择上传的图标文件',
					}],
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
				let params = {
					questionType: this.formData.questionType,
					headline: this.formData.headline || '',
					content:  this.formData.content || '',
					remark: this.formData.remark,
				};

				if(this.propType == 1) {
					// res = await device.addType(params);
					tittle = '新增';
				}else {
					params.facTypeId = this.formData.facTypeId;
					// res = await device.updateTypee(params);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '设施类型成功');
				}else {
					this.$message.error(tittle + '设施类型失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
				document.querySelector('.el-upload__input[type="file"]').value = '';
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
	.uploadMap {
		.uploadFile {
			.el-form-item__content {
				position: relative;
			}
			.el-form-item__error{
				position: absolute;
				top: 9px;
				left: 92px;
			}
		}
	}
</style>