<!--角色编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="酒店名称(中文)：" prop="hotelNameCh">
				<el-select v-model="formData.hotelNameCh"  size="small"  placeholder="请选择酒店中文名称" filterable :disabled="propType == 2">
                    <el-option v-for="(item,index) in hotelNameChList" :key="index" :label="item.hotelNameCh" :value="item.hotelNameCh"></el-option>
                </el-select>
			</el-form-item>
            <el-form-item label="客房名称(中文)：" prop="roomNameCh">
				<el-input  v-model.trim="formData.roomNameCh" placeholder="请输入客房中文名称" maxlength="20"  @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="客房名称(英文)：" prop="roomNameEn">
				<el-input v-model.trim="formData.roomNameEn" placeholder="请输入客房英文名称" maxlength="100" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="价格：" prop="roomPrice">
				<el-input v-model.trim="formData.roomPrice" placeholder="请输入价格" maxlength="20" @keydown.enter.native="submit" clearable>
					<i slot="suffix" class="icon-distant">元/晚</i>
				</el-input>
			</el-form-item>
            <el-form-item label="床位数：" prop="roomNumOfBed">
				<el-input v-model.trim="formData.roomNumOfBed" placeholder="请输入提供的床位数" maxlength="10" @keydown.enter.native="submit" clearable>
					<i slot="suffix" class="icon-distant">个</i>
				</el-input>
			</el-form-item>
            <el-form-item label="住宿人数：" prop="roomNumOfPerson">
				<el-input v-model.trim="formData.roomNumOfPerson" placeholder="请输入可以住宿的人数" maxlength="10" @keydown.enter.native="submit" clearable>
					<i slot="suffix" class="icon-distant">人</i>
				</el-input>
			</el-form-item>
            <!-- <el-form-item label="联系电话：" prop="roomMobile">
				<el-input v-model.trim="formData.roomMobile" placeholder="请输入联系电话" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item> -->
            <el-form-item label="是否含早餐：" prop="roomBreakfast">
				<el-select v-model="formData.roomBreakfast" placeholder="请选择">
					<el-option label="含早餐" :value="'1'"></el-option>
                	<el-option label="不含早餐" :value="'0'"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="配套设施：" prop="roomDev">
				<el-checkbox-group  v-model="formData.roomDev" @change="handleCheckedFacilityChange">
			      	<el-checkbox v-for="item in roomDevList" :label="item" :key="item">{{item}}</el-checkbox>
			    </el-checkbox-group>
			</el-form-item>
			<!-- logo -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomLogo"  label="logo：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomLogo && imageUrl.length>1" :src="imageUrl" class="avatar"  @click="getName('roomLogo')">
							<i v-else @click="getName('roomLogo')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomLogo','imageUrl')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片1 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicOne"  label="图片一：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"	
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicOne && imageUrl1.length>1" :src="imageUrl1" class="avatar" @click="getName('roomPicOne')">
							<i v-else @click="getName('roomPicOne')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicOne','imageUrl1')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片2 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicTwo"  label="图片二：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"		
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicTwo && imageUrl2.length>1" :src="imageUrl2" class="avatar" @click="getName('roomPicTwo')">
							<i v-else @click="getName('roomPicTwo')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicTwo','imageUrl2')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片3 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicThree"  label="图片三：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"		
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicThree && imageUrl3.length>1" :src="imageUrl3" class="avatar" @click="getName('roomPicThree')">
							<i v-else @click="getName('roomPicThree')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicThree','imageUrl3')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片4 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicFour"  label="图片四：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"	
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicFour && imageUrl4.length>1" :src="imageUrl4" class="avatar" @click="getName('roomPicFour')">
							<i v-else @click="getName('roomPicFour')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicFour','imageUrl4')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片5 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicFive"  label="图片五：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"	
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicFive && imageUrl5.length>1" :src="imageUrl5" class="avatar" @click="getName('roomPicFive')">
							<i v-else @click="getName('roomPicFive')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicFive','imageUrl5')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片6 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="roomPicSix"  label="图片六：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"	
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="formData.roomPicSix && imageUrl6.length>1" :src="imageUrl6" class="avatar" @click="getName('roomPicSix')">
							<i  v-else @click="getName('roomPicSix')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('roomPicSix','imageUrl6')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</InfoPanle>
</template>

<script>
    import { mapState } from 'vuex';
	import { formatCheck, suffix } from '@/utils/utils';
	import { hotel } from "@/service/api";
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
		props: ['panleShow', 'panleData','devArr','hotelArr'],
		data() {
			//手机号校验
			let checkTel = (rule, value, callback) => {
				let reg = formatCheck.isTel(value);
				if(value && !reg) {
					callback(new Error("手机号格式不正确"));
				} else {
					callback();
				}
			};
			//价格校验
			let checkPrice= (rule, value, callback) => {
				if(value) {
					if(!(/^[0-9]+(.[0-9]{2})?$/).test(value)){
						return callback(new Error("请输入整数或带两位小数的正实数"));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			//数字校验
			let checkNumber= (rule, value, callback) => {
				if(value) {
					if(!(/^[0-9]+$/).test(value)){
						return callback(new Error("请输入整数"));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			//logo 图片一校验
			let checkPic= (rule, value, callback) => {
				if(value) {
					if(value == "0"){
						return callback(new Error("请上传图片"));
					} else {
						callback();
					}
				} else {
					callback();
				}
			};
			//英文名称校验
			let isEnglishName = (rule, value, callback) => {
				let reg = formatCheck.isEnglish(value);
				if(value && !reg) {
					callback(new Error("请输入英文名称"));
				} else {
					callback();
				}
			};
			return {
				propShow: false,
				propType: 0,
				formData: {},
				// 酒店名称
				hotelNameChList: [],   
				roomDevList: [],
				rules: {
					hotelNameCh: [
						{required: true, message: '请输入酒店名称', trigger: 'change'}
					],
                    roomNameCh: [
						{required: true, message: '请输入客房名称', trigger: 'blur'}
					],
					roomNameEn: [
						{required: true, message: '请输入英文名称', trigger: 'blur'},
						{validator: isEnglishName,  trigger: 'blur'},
					],
					roomPrice: [
						{required: true, message: '请输入价格', trigger: 'blur'},
						{validator: checkPrice,  trigger: 'blur'},
					],
					roomNumOfBed: [
						{required: true, message: '请输入提供的床位数量', trigger: 'blur'},
						{validator: checkNumber,  trigger: 'blur'},			
					],
					roomNumOfPerson: [
						{required: true, message: '请输入可以住宿的人数', trigger: 'blur'},
						{validator: checkNumber,  trigger: 'blur'},
					],
					roomBreakfast: [
						{required: true, message: '此项为必选', trigger: 'change'},
					],
					roomDev: [
						{type: 'array', required: true, message: '请至少选择一个', trigger: 'change'},
					],
					roomLogo: [
						{required: true, message: '请上传图片', trigger: 'blur'},
						{validator: checkPic, message: '请上传图片', trigger: 'blur'},	
					],
					roomPicOne: [
						{required: true, message: '请上传图片', trigger: 'change'},
						{validator: checkPic, message: '请上传图片', trigger: 'change'},	
					],

				},
				/**
				 * 设施
				 */
				roomDevList: [],
                /*
                上传图片
                */ 
				imgIndex:0,
				imageUrl: '',
				imgName: '',
				arr:{},
				imageUrl1: '',
				imageUrl2: '',
				imageUrl3: '',
				imageUrl4: '',
				imageUrl5: '',
				imageUrl6: '',
				dialogVisible: false,
			}
		},
		methods: {
			init() {
				this.$refs.formData.resetFields();
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
				this.roomDevList = this.devArr;
				this.hotelNameChList = this.hotelArr;

				//编辑 图片回显
				if(this.panleData.type == 2 || this.panleData.type == 3){
					this.imageUrl = this.panleData.data.roomLogo;
					this.imageUrl1 = this.panleData.data.roomPicOne;
					this.imageUrl2 = this.panleData.data.roomPicTwo;
					this.imageUrl3 = this.panleData.data.roomPicThree;
					this.imageUrl4 = this.panleData.data.roomPicFour;
					this.imageUrl5 = this.panleData.data.roomPicFive;
					this.imageUrl6 = this.panleData.data.roomPicSix;
				}

				/**
				 * 处理设施数据
				 */
				let list = [];
				if(this.panleData.data && this.panleData.data.roomDev && this.panleData.data.roomDev.length){
					this.panleData.data.roomDev.forEach((item,index)=>{
						if(item === "1"){
							list.push(this.roomDevList[index])
						}
					})
					this.formData.roomDev = list;
				} else {
					this.formData = Object.assign({},this.formData,{roomDev:[]})

				}
			},

			/**
			 * 设施选择
			 */
			handleCheckedFacilityChange(value) {
			},
			
            /**
			 * 选择文件，检验文件名、大小
			 */
			getName(name){
				this.imgName=name;
			},
			
			/**
			 * 删除方法
			 */
			removeContent (val,name) {
				this.formData[val]="0";
				if(name == 'imageUrl'){
					this.imageUrl = ''
					// return;
				}
				for(let i = 1; i< 7 ;i++){
					if(name.indexOf(i) != -1){
						this[name] ='';
					}
					// return;
				}
				this.$forceUpdate();			
			},

			/**
			 * 添加方法
			 */
			handleChange(file,fileList ) {
				if(file.status != 'ready'){
					return;
				}
				if(!this.beforeAvatarUpload(file.raw)) {
					return;
				}
				switch (this.imgName) {
					case 'roomLogo':
					this.formData.roomLogo=file.raw;
					this.imageUrl=file.url;
					break;
					case 'roomPicOne':
					this.formData.roomPicOne=file.raw;
					this.imageUrl1=file.url;
					break;
					case 'roomPicTwo':
					this.formData.roomPicTwo=file.raw;
					this.imageUrl2=file.url;
					break;
					case 'roomPicThree':
					this.formData.roomPicThree=file.raw;
					this.imageUrl3=file.url;
					break;
					case 'roomPicFour':
					this.formData.roomPicFour=file.raw;
					this.imageUrl4=file.url;
					break;
					case 'roomPicFive':
					this.formData.roomPicFive=file.raw;
					this.imageUrl5=file.url;
					break;
					case 'roomPicSix':
					this.formData.roomPicSix=file.raw;
					this.imageUrl6=file.url;
					break;
				}
				this.$forceUpdate();
			},

			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg' || 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			/**
			 * 确定 提交
			 */
			 async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				/**
				 * 转码id
				 */
				this.hotelNameChList.forEach(item=>{
					if(this.formData.hotelNameCh == item.hotelNameCh) {
						this.formData.hotelId = item.hotelId;
					}
				})

				/**
				 * 设施转码
				 */
				let arr = [];
				this.roomDevList.forEach((item,index)=>{
					if(this.formData.roomDev.includes(item)){
						arr.push("1")
					} else {
						arr.push("0")
					}
				});
				this.formData.roomDev = arr;
				
				/**
				 * 没有图片的转为'0',有图片没有修改的转为null
				 */
				let tempFormData = null;
				tempFormData = Object.assign({}, this.formData);
				for (let key in this.formData) {
					if(key.indexOf("roomPic") != -1){
						if(typeof(this.formData[key]) === "string" && this.formData[key].length > 2){
							tempFormData[key] = null;
						} else if(this.formData[key] == null){
							tempFormData[key] = "0";
						}
					}
				}
				if(typeof(this.formData.roomLogo)=== "string" && this.formData.roomLogo.length > 2){
					tempFormData.roomLogo = null;
				}
                let res, tittle;
				if(this.propType == 1) {
					res = await hotel.addRoom(tempFormData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await hotel.updateRoom(tempFormData);
					tittle = '编辑';
				}
				if(!res) return;
				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '客房成功');
				}else {
					this.$message.error(res.message);
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
		created() {
		},
		mounted() {
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			},
		}
	}
</script>
<style lang="less">
	#account .infoPanle .el-form-item {
		margin-bottom: 32px;
		
	}
	.panleMain {
		.el-checkbox+.el-checkbox {
			margin-left: 0!important;
			margin-right: 30px;
		}
		.el-checkbox {
			width: 60px;
		}
	}
	.avatar-uploader {
		.el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.el-upload:hover {
			border-color: #409EFF;
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 100px;
			height: 100px;
			line-height: 100px;
			text-align: center;
		}
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