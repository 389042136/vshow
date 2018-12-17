export default {

    /**
     * 全局参数
     */
    globalParams: {},
    feedbackShow: true, 

    flightStatus: [
        // 出航状态
        {fsCode: "NST", fsClassify: "Y", fsDescC: "到下站",},
        {fsCode: "LBD", fsClassify: "Y", fsDescC: "催促登机"},
        {fsCode: "DEP", fsClassify: "Y", fsDescC: "航班起飞"}, 
        {fsCode: "CKO", fsClassify: "Y", fsDescC: "值机截止"},
        {fsCode: "CKI", fsClassify: "Y", fsDescC: "正在值机"},
        {fsCode: "BOR", fsClassify: "Y", fsDescC: "正在登机"},
        {fsCode: "POK", fsClassify: "Y", fsDescC: "登机结束"},
        {fsCode: "TBR", fsClassify: "Y", fsDescC: "过站登机"},
        // 进港状态
        {fsCode: "ARR", fsClassify: "Y", fsDescC: "航班到达"},
        {fsCode: "ONR", fsClassify: "Y", fsDescC: "前方起飞"},
        // 异常状态
        {fsCode: "ALT", fsClassify: "N", fsDescC: "航班备降"},
        {fsCode: "DLY", fsClassify: "N", fsDescC: "航班延误"},
        {fsCode: "CAN", fsClassify: "N", fsDescC: "航班取消"},
        {fsCode: "RTN", fsClassify: "N", fsDescC: "航班返航"},
        {fsCode: "BAK", fsClassify: "N", fsDescC: "航班滑回"},


    ]

}
