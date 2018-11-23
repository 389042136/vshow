<template>
    <el-tree ref="deviceTree"
        show-checkbox
        node-key="id" 
        :props="deviceGroup.defaultProps"
        :data="deviceGroup.data" 
        :default-expanded-keys="deviceGroup.expandedArr">
    </el-tree>
</template>

<script>
    import { displayControlManagement } from "@/service/api";
    export default {
        props:['checked'],
        data() {
            return {
                //设备分组
                deviceGroup: {
                    data: [{
                        id: 0,
                        name: '全部',
                        children: []
                    }],
                    expandedArr: [0],
                    defaultProps: {
                        label: 'name'
                    }
                },
            }
        },
        methods: {
            /**
			 * 获取设备树
			 */
			async getDeviceTree() {
				let res = await displayControlManagement.getDeviceTree();
				if(!res) return;
				this.deviceGroup.data[0].children = res.data;
            }
        },
        watch: {
            checked(val) {
                this.$refs.deviceTree.setCheckedKeys(val || []);
            }
        },
        created() {
			this.getDeviceTree();
		}
    }
</script>

<style lang="less">

</style>


