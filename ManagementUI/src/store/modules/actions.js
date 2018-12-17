import { globalParams } from "@/service/api";
export default {
 
    /**
     * 获取全局参数
     */
    async get_globalparams({ commit, state }) {
        let res = await globalParams.get();
        if(!res) return false;
        commit('SET_GLOBALPARAMS', res.data);
        return true;
    },

    /**
    * 清除所有缓存
    */
    clearAll({ commit }) {
        commit('SET_GLOBALPARAMS', {});
        commit('SET_BREAD', []);
    },
}

