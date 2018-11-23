<template>
	<div class="mian">
		<x-header class="x-header" title="在线留言" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main suggestions">
			<div class="introduce">
				<div>留言内容</div>
				<x-textarea :max="200" placeholder="请输入您想对我们说的话，最多200个字符" v-model="introduceCon"></x-textarea>
			</div>
			<div class="phone">
				<div>联系方式</div>
				<x-input placeholder="请输入您的手机号/QQ号" v-model="tel" :show-clear="false"></x-input>
			</div>
			<div class="addImg">
				<div>添加图片</div>
				<div class="img-container">
					<div v-for="(value, key) in imgData" :key="key" @click="previewImage(key)">
						<div class="img-parent">
							<img :src="value.src" v-imgReactive/>
						</div>
						<x-icon class="del-icon" type="ios-close" @click.stop="deleteImage(key)"></x-icon>
					</div>
					<!-- <div>
						<div class="img-parent">
							<img src="../../assets/images/banner1.png" v-imgReactive/>
						</div>
						<x-icon class="del-icon" type="ios-close" @click.stop="deleteImage(item.id)"></x-icon>
					</div> -->
					<div class="add-btn flex" @click="addImg()" v-show="previewImageArr.length < imgMaxMum">
						<x-icon class="add-icon" type="ios-plus-empty"></x-icon>
					</div>
				</div>
			</div>
			<div class="submit-btn" @click="submit()">提交</div>
		</div>
	</div>
</template>

<script>
	import { XTextarea } from 'vux';
	import { browser } from '@/utils/utils';
	import { addFeedback } from '@/service/api';
	import { load } from '@/utils/utils';
	export default {
		components: {
			XTextarea,
		},
		data() {
			return {
				introduceCon: '',
				tel: '',
				imgData: {},
				imgMaxMum: 3
			}
		},
		computed: {
			previewImageArr() {
				return Object.keys(this.imgData);
			},
		},
		methods: {
            callback(){
                this.$router.back(-1);
			},

			init(){
				//this.$wechat.ready(() => this.downloadImage('6VRw6i_EcDFRmiLIZzoLT4ED_7_SO6VTwmbD-qcQbJM4Ys3Vl0HypRa5JmpCLn2S'))
			},

			/**
			 * 添加图片
			 */
			addImg() {
				let _this = this,
					imgNum = this.imgMaxMum - this.previewImageArr.length;
				this.$wechat.chooseImage({
					count: imgNum, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						res.localIds.forEach(id => {
							// 判断终端
							if(browser().ios) {
								_this.getLocalImgData(id); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							}else {
								_this.$set(_this.imgData, id, {src: id});
							}
						});
						load.open('上传中...');
						_this.uploadImage(res.localIds);
					}
				});
			},

			/**
			 * 获取本地图片数据
			 */
			getLocalImgData(id) {
				let _this = this;
				this.$wechat.getLocalImgData({
					localId: id, // 图片的localID
					success(res) {
						let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
						if (!localData.includes('data:image')) {
							//判断是否有这样的头部
							localData = 'data:image/jpeg;base64,' +  localData
						}
						localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg');
						_this.$set(_this.imgData, id, {src: localData});
					}
				});
			},

			/**
			 * 预览图片
			 */
			previewImage(id) {
				let _this = this;
				this.$wechat.previewImage({
					current : id, // 当前显示图片的http链接
					urls : _this.previewImageArr // 需要预览的图片http链接列表
				});
			},

			/**
			 * 递归上传图片至微信服务器
			 */
			uploadImage(arr) {
				let _this = this,
					localId = arr.shift();
				this.$wechat.uploadImage({
					localId: localId,
					isShowProgressTips: 0, // 默认为1，显示进度提示
					success(res) {
						_this.imgData[localId].serverId = res.serverId;
						if(arr.length > 0) { 
							_this.uploadImage(arr);
						}else {
							load.close();
						}
					}
				});
			},

			/**
			 * 从微信服务器下载图片
			 */
			downloadImage(localId) {
				let _this = this;
				this.$wechat.downloadImage({
					serverId: localId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success(res) {
						let id = res.localId; // 返回图片下载后的本地ID
						if(_this.phoneType() == 'ios') {
							_this.getLocalImgData(id); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						}else {
							_this.imgData.push({id, src: id});
						}
					}
				});
			},

			/**
			 * 删除图片
			 */
			deleteImage(id) {
				this.$delete(this.imgData, id);
			},

			/**
			 * 提交数据
			 */
			submit() {
				let flag = this.formCheck();
				if(!flag) return;
				
				let mediaId = [];
				for(let i in this.imgData) {
					mediaId.push(this.imgData[i].serverId);
				}
				let sourceType = this.$route.query ? 1 : 0,
					parmas = {
						content: this.introduceCon,
						contact: this.tel,
						mediaId: mediaId,
						sourceType: sourceType
					};
				addFeedback(parmas).then(data => this.submitLast(data.status == this.$successCode));
			},

			/**
			 * 表单验证
			 */
			formCheck() {
				let result = true;
				if(!this.introduceCon) {
					this.$vux.toast.show({
						text: '请输入留言内容哦~',
						type: 'text',
						width: 'auto'
					})
					result = false;
				}
				return result;
			},

			/**
			 * 提交成功后处理
			 */
			submitLast(flag) {
				if(flag){
					this.$vux.toast.show({
						text: '留言成功',
						type: 'success',
					})
					this.callback();
				}else{
					this.$vux.toast.show({
						text: '留言失败',
						type: 'warn',
					})
				}
			}
		},
		created(){
			this.init();
		},
	}
</script>

<style lang='less'>
@import '../../style/definition.less';
.notice-main.suggestions {
	padding: 1.4rem 0.32rem 0;
	box-sizing: border-box;
	background-color: #fff;
	font-size: 0.28rem;
	min-height: 100vh;
	.weui-cell:before {
		border: none;
	}
	.vux-x-textarea, .vux-x-input {
		margin-top: 0.24rem;
		padding: 0;
	}
	.introduce{
		textarea{
			width: 100%;
			height: 2.4rem;
			padding: 0.32rem;
			box-sizing: border-box;
			border-radius: 0.16rem;
			background-color: #EDEFF5;
		}
	}
	.phone{
		input{
			box-sizing: border-box;
			height: 0.72rem;
			padding: 0 0.32rem;
			border-radius: 0.16rem;
			background-color: #EDEFF5;
		}
	}
	.weui-cell__ft {
		position: absolute;
		right: 0.1rem;
	}
	.addImg{
		width: 100%;
		height: 100%;
		margin-top: 0.24rem;
	}
	.img-container {
		padding-top: 0.2rem;
		overflow: hidden;
		> div {
			width: 1.6rem;
			height: 1.6rem;
			background-color: #EDEFF5;
			float: left;
			margin-right: 0.8rem;
			margin-bottom: 0.3rem;
			border-radius: 0.16rem;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
		}
		.img-parent {
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: 0.16rem;
			position: relative;
		}
		img {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		.add-icon {
			width: 0.5rem;
			height: 0.5rem;
			margin: auto;
		}
		.del-icon {
			width: 0.5rem;
			height: 0.5rem;
			border-radius: 50%;
			position: absolute;
			right: 0;
			top: 0;
			transform: translate(30%, -40%);
			fill: red;
		}
	}
	.submit-btn{
		width: 100%;
		line-height: 0.8rem;
		color: #fff;
		box-sizing: border-box;
		text-align: center;
		border-radius: 0.16rem;
		font-size: 0.32rem;
		margin-top: 0.34rem;
		background: @linear-gradient-primary;
		&:active {
			color: rgba(255, 255, 255, 0.6);
			background: #3d8ff3;
		}
	}
}
</style>