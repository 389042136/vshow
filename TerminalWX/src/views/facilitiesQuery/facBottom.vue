<template>
    <div>
        <div class="mapNavigation-mask" v-show="show"></div>
        <div class="fac-bottom flex" :class="{showMore: show}" @click.stop>
            <template v-for="(item, index) in devicesType">
                <div class="child flex flex-column flex-center" :key="index"
                    :class="{active: active == item.enum_id}"
                    v-show="index < (devicesType.length > 5 ? 4 : 5) || show"
                    @click="navigationTo(item.enum_id)">
                    <img :src="require (`../../assets/images/map/${trim(item.enum_english_name)}_${active == item.enum_id ? 'blue' : 'dark'}.png`)" alt="">
                    <div class="ch">{{ item.enum_name }}</div>
                </div>
            </template>
            <div class="child" id="showMore-btn" @click="typeShow()" v-show="!show" v-if="devicesType.length > 5">
                <img src="@/assets/images/map/map_more_gray.png" alt="">
                <div class="ch">更多</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { allTrim } from "@/utils/utils.js";
    import { facilities } from "@/service/api";
    export default {
        props: ['typeHide'],
        data() {
            return {
                devicesType: [],
                active: '',
                show: false,
            }
        },
        methods: {
            /**
             * 获取设施类型
             */
            getDeviceType() {
                facilities.getDevicesType().then(data => this.devicesType = data.data);
            },

            navigationTo(to) {
                this.active = to;
                this.show = false;
                this.$transfer.$emit('navigationTo', to);
                this.$emit('typeShow');
            },

            typeShow() {
                this.show = true;
                this.$emit('typeShow');
            },

            /**
             * 去空格，转小写
             */
            trim(str) {
                return allTrim(str);
            }
        },
        mounted() {
            this.getDeviceType();
        },
        watch: {
            typeHide(val) {
                if(!val) {
                    this.show = val;
                }
            }
        }
    }
</script>

<style lang="less">
    @import '../../style/definition.less';
    .mapNavigation-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 4;
    }
    .fac-bottom {
        position: fixed;
        z-index: 10;
        box-sizing: border-box;
        flex-wrap: wrap;
        transition: height 0.5s ease-in-out;
        height: 1.2rem;
        background: #fff;
        left: 0.3rem;
        right: 0.3rem;
        bottom: 0.3rem;
        border-radius: 0.24rem;
        padding: 0.1rem 0.2rem;
        overflow: hidden;
        &.showMore {
            height: 2.4rem;
        }
        
        .child {
            width: 20%;
            font-size: 0.26rem;
            color: #323234;
            text-align: center;
            padding: 0.1rem;
            box-sizing: border-box;
            white-space: nowrap;
            .en {
                font-size: 0.24rem;
            }
            &.active {
                color: #43A1E9;
            }
        }
        img {
            width: 0.5rem;
            height: 0.5rem;
            margin: 0 auto;
        }
        #showMore-btn {
            display: block;
        }
    }
</style>


