<!--切换logo-->
<template>
	<el-dialog title="上传Logo" :close-on-click-modal="false" :visible.sync="propDialogShow" width="600px" :before-close="dialogClose">
		<el-form @submit.native.prevent ref="dialogForm" label-width="120px">
			<el-form-item label="上传Logo：" required class="uploadFile">
				<el-upload action="" :accept="`image/${ fileType[0] },image/${ fileType[2] }`" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
					<el-button slot="trigger" type="primary">选取文件</el-button>
					<span class="file-name">{{ fileName }}</span>
					<div class="el-c-danger">
						<p>注意：</p>
						<p>1. Logo图片仅支持 {{ fileType[0] }}、{{ fileType[1] }}；</p>
						<p>2. 图片大小限制为 {{ maxFileSize }} M。</p>
					</div>
					<div class="file-content">
						<img :src="fileSrc">
					</div>
				</el-upload>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogClose()">取 消</el-button>
			<el-button type="primary" @click="submit">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import { mapState } from 'vuex';
	import { formatCheck, fileCheck } from "@/utils/utils";
	import { airportInfo } from "@/service/api";
	export default {
		props: ['dialogShow', 'dialogData'],
		computed: {
			...mapState({
				maxFileSize: state => Number(state.globalParams.upload_logo_maxsize),
			}),
		},
		data() {
			return {
				//上传参数
				fileType: ['png', 'jpg', 'jpeg'],
				fileName: '',
				fileSrc: '',
				propDialogShow: false,
			};
		},
		methods: {
			init() {
				this.fileName = '';
				this.fileSrc = this.dialogData;
				this.propDialogShow = this.dialogShow;
			},

			/**
			 * 选择文件，检验文件大小
			 */
			handleChange(file, fileList) {
				if(file.status != 'ready'){
					return;
				}
				let flag = fileCheck(file, this.fileType, this.maxFileSize);
				if(!flag) return;
				this.fileName = file.name;
				this.fileSrc = file.url;
			},

			/**
			 * 确定
			 */
			async submit() {
				if(this.fileName == '') {
					this.$message.warning('上传文件不允许为空');
					return;
				}
				let file = document.querySelector('.el-upload__input[type="file"]').files[0];
				let res = await airportInfo.uploadLogo({ file });
				if(!res) return;
				
				if(res.status == this.$successCode) {
					this.$message.success('上传成功');
					this.dialogClose(true);
				}else {
					this.$message.error('上传失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			dialogClose(flag) {
				this.$emit("dialogClose", flag);
			}
		},
		watch: {
			dialogShow(val) {
				this.init();
			}
		}
	};
</script>
<style lang="less" scoped>
	.file-content{
		width: 250px;
	}
	
	.el-form-item {
		margin-bottom: 0;
	}
</style>