<!--留言板编辑、新增、详情-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" >
		<el-form  :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="内容：" prop="adviceContent">
				<el-input v-model.trim="formData.adviceContent" placeholder="请输入内容" maxlength="50" ></el-input>
			</el-form-item>
            <el-form-item label="日期：" prop="adviceCreateTime">
				<el-input v-model.trim="formData.adviceCreateTime" placeholder="请输入日期" maxlength="50" ></el-input>
			</el-form-item>
            <!-- <el-form-item label="来源：" prop="deviceSource">
				<el-input v-model.trim="formData.deviceSource" placeholder="请输入来源" maxlength="50" ></el-input>
			</el-form-item> -->
            <el-form-item label="联系方式：" prop="adviceContact">
                <el-input type="textarea" :rows="6" v-model.trim="formData.adviceContact" placeholder="请输入联系方式" maxlength="50" ></el-input>
            </el-form-item>
			<el-form-item prop="advicePicOne"  label="图片一：" v-if="formData.advicePicOne">
				<el-upload
					class="avatar-uploader"
					action=""		
					:show-file-list="false"
					:auto-upload="false">
					<img v-if="formData.advicePicOne" :src="formData.advicePicOne" class="avatar">
				</el-upload>
			</el-form-item>
			<el-form-item prop="advicePicTwo"  label="图片二：" v-if="formData.advicePicTwo">
				<el-upload
					class="avatar-uploader"
					action=""		
					:show-file-list="false"
					:auto-upload="false">
					<img v-if="formData.advicePicTwo" :src="formData.advicePicTwo" class="avatar">
				</el-upload>
			</el-form-item>
			<el-form-item prop="advicePicThree"  label="图片三：" v-if="formData.advicePicThree">
				<el-upload
					class="avatar-uploader"
					action=""		
					:show-file-list="false"
					:auto-upload="false">
					<img v-if="formData.advicePicThree" :src="formData.advicePicThree" class="avatar">
					
				</el-upload>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { advice } from "@/service/api";
	import { formatCheck } from '@/utils/utils';
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
					
				}

			}
		},
		methods: {
			init() {
				// this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
				this.getAdviceInfo(this.panleData.data.adviceId)

			},

			//详情
			async getAdviceInfo(params) {
				let res = await advice.getAdviceInfo(params);
				if(!res) return;
				this.formData = Object.assign({}, res.data);
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
	#account .infoPanle .el-form-item {
		margin-bottom: 32px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}	
	i.icon-distant {
		font-style: normal;
	}
</style>