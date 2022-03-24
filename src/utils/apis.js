export const Apis = {
    selectJyspCarouselList: '/api/course/selectJyspCarouselList', //查询轮播图列表
    countUserUnReadMessage: '/api/user/countUserUnReadMessage', //获取用户未读消息条数
    selectJyspMessageList: '/api/user/selectJyspMessageList', //查询用户收到的消息列表
    readMessage: '/api/user/readMessage', //将用户消息状态改为已读
    accountNumberLogin: '/api/login/accountNumberLogin', //账号密码登陆
    sendLoginVerificationCode: '/api/login/sendLoginVerificationCode', //发送登陆验证码
    verificationCodeLogin: '/api/login/verificationCodeLogin',
    sendRegisterVerificationCode: '/api/login/sendRegisterVerificationCode',
    register: '/api/login/register',
    getUserProtocol: '/api/login/getUserProtocol',
    getPrivacyProtocol: '/api/login/getPrivacyProtocol',
    sendChangePasswordCode: '/api/login/sendChangePasswordCode',
    changePassword: '/api/login/changePassword',
    selectJyspCourseTypeList: '/api/course/selectJyspCourseTypeList', //课程类型列表
    listPayCourse: '/api/course/listPayCourse', //查询付费课程列表
    listNewstCourse: '/api/course/listNewstCourse', //查询付费课程列表
    listFreeCourse: '/api/course/listFreeCourse', //查询付费课程列表
    listCourse: '/api/course/listCourse', //查询课程列表
    notLoginSelectJyspCourseById: '/api/course/notLoginSelectJyspCourseById', //游客查询免费课程详情（未登录）
    getJyspCourseById: '/api/course/getJyspCourseById', //用户查询课程详情
    countByCourseId: '/api/course/countByCourseId', //当前课程被收藏数量
    listCatalogueByCourseId: '/api/course/listCatalogueByCourseId', //根据系列课程id查询目录列表
    comment: '/api/course/comment', //评论
    listCommentByCourseId: '/api/course/listCommentByCourseId', //查询课程的评论列表
    collectCourse: '/api/course/collectCourse', //收藏课程
    cancelCollect2: '/api/course/cancelCollect', //取消收藏
    buyCourse: '/api/course/buyCourse', //购买课程
    watchCourse: '/api/course/watchCourse', //观看课程（未登录游客观看免费视频不调用此接口。）
    getVipExplain: '/api/user/getVipExplain', //查询会员权益
    listVipCard: '/api/user/listVipCard', //查询会员卡列表
    buyVip: '/api/user/buyVip',
    getAboutUs: '/api/user/getAboutUs',
    upload: '/common/upload',
    updateJyspUser: '/api/user/updateJyspUser',
    sendChangeVerificationCode: '/api/user/sendChangeVerificationCode',
    changePhoneNumber: '/api/user/changePhoneNumber',
    listCollectByUserId: '/api/user/listCollectByUserId',
    cancelCollect: '/api/user/cancelCollect',
    listJyspLearnRecord: '/api/user/listJyspLearnRecord',
    bindWeChat: '/api/user/bindWeChat',
    selectJyspUserById: '/api/user/selectJyspUserById',
    getWxConfigInfo: '/api/user/getWxConfigInfo'
};