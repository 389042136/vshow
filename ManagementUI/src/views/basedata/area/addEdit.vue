<!--区域编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="100px" :disabled="propType == 3">
			<el-form-item label="区域名称：" prop="zoneName">
				<el-input v-model.trim="formData.zoneName" placeholder="请输入区域名称" maxlength="50" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注：" prop="zoneDesc">
				<el-input type="textarea" :rows="6" placeholder="请输入内容，最多100个字符" maxlength="100" v-model.trim="formData.zoneDesc"></el-input>
			</el-form-item>
			<el-form-item label="选择地图：" prop="mapId" class="uploadFile">
				<el-select v-model="formData.mapId" placeholder="请选择" clearable @change="previewMap"> 
					<el-option :label="value.mapName" :value="Number(key)" v-for="(value, key) in selectMap" :key="key"></el-option>
				</el-select>
				<div class="file-content" v-show="mapUrl">
					<img :src="mapUrl">
				</div>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { airBasedata } from "@/service/api";
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
				selectMap: {},
				mapUrl: '',
				rules: {
					zoneName: [
						{
							required: true,
							message: '请输入区域名称',
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.previewMap(this.formData.mapId);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},
			
			/**
			 * 获取地图下拉框
			 */
			async getMapArr(){
				let res = await airBasedata.getMapList();
				if(res) {
					this.selectMap = res.data;
				}
			},

			/**
			 * 预览地图
			 */
			previewMap(val){
				this.mapUrl = val ? this.selectMap[val] && this.selectMap[val].mapUrl : '';
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				let res, tittle;
				if(this.propType == 1) {
					res = await airBasedata.addArea(this.formData);
					tittle = '新增';
				}else {
					res = await airBasedata.updateArea(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '区域成功');
				}else {
					this.$message.error(tittle + '区域失败');
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
			this.getMapArr();
		}
	}
</script>

<style lang="less" scoped>
	.file-content {
		margin-top: 20px;
	}
</style>