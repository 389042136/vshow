<!--设施类型编辑，新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit" class="uploadMap">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="地图名称:" prop="mapName">
				<el-input v-model.trim="formData.mapName" placeholder="请输入标题" clearable maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="预览地图：" prop="mapPreview">
				<el-input type="textarea" v-model.trim="formData.mapPreview" :rows="3" placeholder="最多100个字符"  maxlength="100"></el-input>
			</el-form-item>
			<el-form-item label="备注:" prop="remark">
				<el-input v-model.trim="formData.remark" placeholder="请输入图标" clearable maxlength="30"></el-input>
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
				formData: {},
				propShow: false,
				propType: 0,
				rules: {
					mapName: [{
						required: true,
						message: '请输入地图名称',
						trigger: 'blur'
					}],
					mapPreview: [{
						required: true,
						message: '请输入预览地图',
						trigger: 'blur'
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
					menuType: this.formData.menuType,
					name: this.formData.name || '',
					eName:  this.formData.eName || '',
					icon: this.formData.icon,
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