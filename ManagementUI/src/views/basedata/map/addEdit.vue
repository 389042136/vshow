<!--地图编辑，新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit" class="uploadMap">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="地图名称：" prop="mapName">
				<el-input v-model.trim="formData.mapName" placeholder="请输入地图名称" clearable maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="备注：" prop="remark">
				<el-input type="textarea" :rows="6" placeholder="请输入内容，最多100个字符" v-model.trim="formData.remark" maxlength="100"></el-input>
			</el-form-item>
			<el-form-item label="上传地图：" ref="mapUrl" prop="mapUrl" class="uploadFile">
				<el-upload action="" :accept="`image/${ fileType[0] },image/${ fileType[2] }`" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
					<el-button slot="trigger" type="primary">选取文件</el-button>
					<span class="file-name">{{ formData.fileName }}</span>
					<div class="el-c-danger">
						<p>注意：</p>
						<p>1. 图片仅支持 {{ fileType[0] }}、{{ fileType[1] }}；</p>
						<p>2. 图片大小限制为 {{ maxFileSize }} M。</p>
					</div>
					<div class="file-content" v-show="formData.mapUrl">
						<img :src="formData.mapUrl">
					</div>
				</el-upload>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { mapState } from 'vuex';
	import { airBasedata } from "@/service/api";
	import { formatCheck, fileCheck } from "@/utils/utils";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		computed: {
			...mapState({
				maxFileSize: state => Number(state.globalParams.upload_map_maxsize),
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
					mapName: [{
						required: true,
						message: '请输入地图名称',
						trigger: 'blur'
					}],
					mapUrl: [{
						required: true,
						message: '请选择上传的地图文件',
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
			 * 选择文件，检验文件名、大小
			 */
			handleChange(file, fileList) {
				if(file.status != 'ready'){
					return;
				}

				let flag = fileCheck(file, this.fileType, this.maxFileSize);
				if(!flag) return;

				this.$refs.mapUrl.clearValidate();
				this.$set(this.formData, 'fileName', file.name);
				this.formData.mapUrl = file.url;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				let res, tittle;
				let file = document.querySelector('.el-upload__input[type="file"]').files[0];
				let params = {
					mapName: this.formData.mapName,
					remark: this.formData.remark || '',
					file: file,
				};

				if(this.propType == 1) {
					res = await airBasedata.addMap(params);
					tittle = '新增';
				}else {
					params.mapId = this.formData.mapId;
					res = await airBasedata.updateMap(params);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '地图成功');
				}else {
					this.$message.error(tittle + '地图失败');
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