<template>
    <div class="detail safeBottom120" v-if="info">
        <div class="video-img">
            <van-swipe
                class="my-swipe"
                :show-indicators="true"
                :loop="true"
                :autoplay="3000"
                v-if="info.courseForm == 2 && !isPlay"
                indicator-color="#f9dc39"
            >
                <van-swipe-item v-for="(item,index) in info.carousel" :key="index">
                    <img :src="item" alt />
                </van-swipe-item>
            </van-swipe>
            <img :src="info.cover" alt v-if="info.courseForm == 1 && !isPlay" />
            <div
                class="tip flex area-center"
                v-if="info.courseForm == 1 && checkPlay2(2) && !isPlay"
            >
                <!--免费课程也可以直接观看，购买后可观看 -->
                <img src="../assets/play.png" alt class="play" @click="togglePlay()" />
            </div>
            <div class="tip flex area-center" v-if="!checkPlay2(2) && !isPlay">
                <!--免费课程也可以直接观看，购买后可观看 -->
                <p class="f26">{{$t('freesaw')}}</p>
            </div>
            <video :src="videoUrl" v-if="isPlay" autoplay controls></video>
        </div>
        <div class="class-content">
            <div class="flex column-bwn">
                <p class="f32 c333 name">{{ lang=='zh'?info.name:info.nameTibetan }}</p>
                <div class="collectStatus" @click="toggleCollect">
                    <img
                        src="../assets/star-act.png"
                        alt
                        class="icon44"
                        v-if="userid && info.isCollect == 1"
                    />
                    <img
                        src="../assets/star.png"
                        alt
                        class="icon44"
                        v-if="!userid || info.isCollect != 1"
                    />
                    <p class="f26 c777"> <span>{{$t('sc')}}</span> {{ collectNum }}</p>
                </div>
            </div>
            <div class="f28 c777">{{$t('appname')}}</div>
            <div class="flex area-between num">
                <p class="flex row-center f24 c777 fangzhenglantingF">
                    <img src="../assets/eye-icon.png" alt class="icon30" />
                    {{ info.learnTime }}
                </p>
                <p class="cff5 FZLTTHJWF" v-if="info.mode == 2">
                    <span class="f24">￥</span>
                    <span class="f28">{{ info.price }}</span>
                </p>
                <p class="cff5" v-else>
                    <span class="f32">{{$t('tabbar.free')}}</span>
                </p>
                <!-- རིན་མེད། 免费 -->
            </div>
        </div>
        <van-sticky>
            <div class="class-msg">
                <div class="class-nav flex area-around">
                    <p
                        :class="actived == 1 ? 'actived' : ''"
                        class="c777 f32"
                        @click="actived = 1"
                    >{{$t('detailname')}}</p>
                    <p
                        :class="actived == 2 ? 'actived' : ''"
                        class="c777 f32"
                        @click="actived = 2"
                        v-if="info.courseForm == 2"
                    >{{$t('detailmulu')}}</p>
                    <p
                        :class="actived == 3 ? 'actived' : ''"
                        class="c777 f32"
                        @click="actived = 3"
                    >{{$t('detaileva')}}</p>
                </div>
                <div class="class-detail" v-if="actived == 1">
                    <div class="detail-content c333 f28" v-if="lang=='zh'" v-html="info.detail"></div>
                    <div class="detail-content c333 f28" v-else v-html="info.detailTibetan"></div>
                </div>
                <div class="class-detail" v-if="actived == 2">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        @load="getlistCatalogueByCourseId"
                    >
                        <div
                            class="detail-directory flex area-between"
                            v-for="(item,index) in Catalogue"
                            :key="index"
                            @click.stop="toggelVideo(item)"
                        >
                            <!-- 播放中显示#FF5242 -->
                            <p
                                class="c333 f30"
                                :style="{ color: isPlay && nowPlayid == item.id ? '#FF5242' : '#333' }"
                            >{{ lang='zh'?item.name:item.nameTibetan }}</p>
                            <img src="../assets/play-icon.png" alt class="icon44" />
                        </div>
                    </van-list>
                </div>
                <div class="class-detail" v-if="actived == 3">
                    <div class="detail-eva">
                        <div
                            class="flex column-end"
                            v-if="info.mode == 1 || (info.mode == 2 && ((userinfo&&userinfo.level == 1) || info.isBuy == 1))"
                        >
                            <div
                                @click="toEva"
                                class="f26 c333 bgf9d toLook"
                            >{{$t('woyaopingjia')}}</div>
                        </div>
                        <div class="evas">
                            <div class="item" v-for="(item,index) in comment" :key="index">
                                <div class="flex area-between">
                                    <div class="flex row-center name">
                                        <img
                                            :src="item.avatar"
                                            alt
                                            class="avatar"
                                            v-if="item.avatar"
                                        />
                                        <img src="../assets/avatar.png" alt class="avatar" v-else />
                                        <p class="c777 f28 nickname">{{ item.nickName }}</p>
                                        <van-rate
                                            v-model="item.score"
                                            color="#FFA000"
                                            void-color="#CCCCCC"
                                            void-icon="star"
                                            size="12"
                                            gutter="2"
                                            readonly
                                        />
                                    </div>
                                    <p
                                        class="f24 c777"
                                        v-if="item.createTime"
                                    >{{ item.createTime.slice(0, 10).replace(/-/g, '.') }}</p>
                                </div>
                                <div class="c333 f28 content">{{ item.content }}</div>
                            </div>
                            <router-link
                                :to="{ path: '/evalist', query: { courseId: $route.params.id } }"
                                class="item flex area-center f26 caaa"
                                style="padding-top:15px;"
                                v-if="comment.length > 0"
                            >
                                {{$t('chakangengduo')}}
                                <img
                                    src="../assets/right-gray-icon.png"
                                    alt
                                    class="icon40"
                                    style="margin-left:4px;"
                                />
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </van-sticky>
    </div>
    <div class="fixedbottom flex area-center safeBottom" v-if="info&&userinfo">
        <!-- 免费可直接观看 -->
        <!-- 未购买 -->
        <div
            class="button-bottom bgf9d"
            @click="openpay"
            v-if="info.mode == 2 && (info.isBuy != 1 && userinfo.level != 1)"
        >
            <span class="c333 f30 FZLTTHJWF marginr">¥{{ info.price }}</span>
            <span class="c333 f32">{{$t('lijidingyue')}}</span>
            <!-- 立即订阅加入学习 -->
        </div>
        <div class="button-bottom bgf9d" @click="openpay" v-if="info.mode == 1||(info.mode == 2 && userinfo.level == 1)">
            <span class="c333 f32">{{$t('jiaruxuexi')}}</span>
            <!-- མུ་མཐུད་དུ་སློབ་སྦྱོང་བྱེད་པ། 免费且登录或者已购买会员 加入学习 -->
        </div>
        <div class="button-bottom bgeee" v-if="info.mode == 2 && info.isBuy == 1">
            <!-- 付费课程  已购买 -->
            <span class="caaa f32">{{$t('yigoumai')}}</span>
        </div>
    </div>
    <div class="fixedbottom flex area-center safeBottom" v-if="info&&!userinfo">
        <!-- 免费可直接观看 -->
        <!-- 未购买 -->
        <div
            class="button-bottom bgf9d"
            @click="openpay"
            v-if="info.mode == 2 && info.isBuy != 1"
        >
            <span class="c333 f30 FZLTTHJWF marginr">¥{{ info.price }}</span>
            <span class="c333 f32">{{$t('lijidingyue')}}</span>
            <!-- 立即订阅加入学习 -->
        </div>
        <div class="button-bottom bgf9d" @click="openpay" v-if="info.mode == 1">
            <span class="c333 f32">{{$t('jiaruxuexi')}}</span>
            <!-- མུ་མཐུད་དུ་སློབ་སྦྱོང་བྱེད་པ། 免费且登录或者已购买会员 加入学习 -->
        </div>
    </div>
    <paytype
        :showModel="showModel"
        :noClick="noClick"
        @buyCourse="buyCourse"
        @closeModel="oncloseModel"
    ></paytype>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { Rate, Sticky, List, Swipe, SwipeItem } from 'vant';
import paytype from '../components/paytype.vue'
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { getwxConfig, bindwx, getConfig, getCode } from "../utils/wxJs.js";
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'detail',
    props: {
    },
    components: {
        vanSwipe: Swipe, vanSwipeItem: SwipeItem, vanRate: Rate, paytype, vanSticky: Sticky, vanList: List
    },
    setup() {
        const {t,locale}=useI18n();
        // 免费课程都可以看  付费课程会员可以看  用户购买付费课程后可以一直观看   
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const state = reactive({
            lang:locale.value,
            userid: store.state.userid,
            userinfo: store.state.userinfo,
            actived: 1,
            noClick: false,
            showModel: false,
            info: null,
            collectNum: 0,
            isPlay: false,
            Catalogue: [],//目录列表
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            nowPlayid: '',//正在播放的目录id
            videoUrl: '',//正在播放的video
            comment: [],//评论列表
        });
        document.title = t('kcxiangqing');
        const { proxy } = getCurrentInstance();
        function openpay() {
            if (!state.userid) {
                router.push('/login');
                return;
            }
            if (state.info.mode == 2 && state.info.isBuy != 1) {
                //付费
                state.showModel = true;
            }
            if (state.info.mode == 1) {
                // 加入学习列表
                proxy.$post(proxy.Apis.watchCourse, {
                    courseId: route.params.id,
                    userId: state.userid,
                }).then(res => {
                    if (res.code == 0) {
                        console.log(res);
                        proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan)
                    }
                });
            }
        }
        // if (store.state.userid) {
        getCode();
        // }
        getData();
        getComment();
        function getData() {
            let url = '', data = {
                id: route.params.id
            };
            if (!state.userid) {
                url = proxy.Apis.notLoginSelectJyspCourseById;
            } else {
                url = proxy.Apis.getJyspCourseById;
                data['userId'] = state.userid;
            }
            proxy.$post(url, data).then(res => {
                if (res.code == 0) {
                    res.data.carousel = res.data.carousel ? res.data.carousel.split(',') : []
                    state.info = res.data;
                    state.videoUrl = res.data.video;
                    if (res.data.courseForm == 2) {
                        getlistCatalogueByCourseId();
                    }
                    console.log(state.lang)
                    let name=state.lang=='zh'?res.data.name:res.data.nameTibetan;
                    getwxConfig(res.data.cover,name);
                }
            });
            // 收藏数量
            proxy.$post(proxy.Apis.countByCourseId, {
                courseId: route.params.id
            }).then(res => {
                state.collectNum = res.data || 0;
            })
        }
        function getlistCatalogueByCourseId() {
            // 获取系列课程的目录
            proxy.$post(proxy.Apis.listCatalogueByCourseId, {
                courseId: route.params.id,
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                if (res.code == 0 && res.data.total > 0) {
                    state.total = res.data.total;
                    state.Catalogue.push(...res.data.rows);
                    state.videoUrl = res.data.rows[0].video;
                    state.nowPlayid = state.isPlay ? res.data.rows[0].id : '';
                    state.loading = false;
                    if (state.Catalogue.length >= state.total) {
                        state.finished = true;
                    } else {
                        state.pageNum++;
                    }
                }
            });
        }
        function getComment() {
            // 获取评论列表
            proxy.$post(proxy.Apis.listCommentByCourseId, {
                courseId: route.params.id,
                pageNum: 1,
                pageSize: 5
            }).then(res => {
                if (res.code == 0 && res.data.total > 0) {
                    state.comment = res.data.rows;
                }
            });
        }
        function checkPlay2(type) {
            // 判断是否可观看
            if (state.info.mode == 1) {
                return true;
            } else {
                if (type != 2) return;
                if (!state.userid) {
                    return false;
                }
                if (state.info.isBuy == 1 || state.userinfo.level == 1) {
                    // 付费课程  用户是会员或者已购买改课程可以观看
                    return true;
                } else {
                    return false;
                }
            }
        }
        function checkPlay(type) {
            // 判断是否可观看
            if (state.info.mode == 1) {
                return true;
            } else {
                if (type != 2) return;
                if (!state.userid) {
                    router.push('/login');
                    return;
                }
                if (state.info.isBuy == 1 || state.userinfo.level == 1) {
                    // 付费课程  用户是会员或者已购买改课程可以观看
                    return true;
                } else {
                    return false;
                }
            }
        }
        function toggelVideo(item) {
            if (checkPlay(2)) {
                state.videoUrl = item.video;
                state.nowPlayid = item.id;
                togglePlay();
            } else {
                proxy.$toast(t('zhifuhoukekan'))
            }
            // 切换目录// 免费课程都可以看  付费课程会员可以看  用户购买付费课程后可以一直观看
        }
        function togglePlay() {
            if (checkPlay(2)) {
                if (state.userid) {
                    proxy.$post(proxy.Apis.watchCourse, {
                        courseId: route.params.id,
                        userId: state.userid,
                    }).then(res => {
                        if (res.code == 0) {
                            console.log(res);
                        }
                    });
                }
                state.isPlay = true;
            } else {
                proxy.$toast(t('zhifuhoukekan'))
            }
        }
        function toEva() {
            if (!state.userid) {
                router.push('/login')
            } else {
                if (state.info.mode == 1 || (state.info.mode == 2 && (state.userinfo.level == 1 || state.info.isBuy == 1))) {
                    router.push({
                        path: '/eva_use',
                        query: {
                            courseId: route.params.id,
                        }
                    })
                }

            }
        }
        function toggleCollect() {
            if (!state.userid) {
                router.push('/login');
                return;
            }
            // 切换收藏
            let url;
            if (state.info.isCollect != 1) {
                // 是否收藏：1已收藏，0未收藏
                url = proxy.Apis.collectCourse
            } else {
                url = proxy.Apis.cancelCollect2
            }
            proxy.$post(url, {
                courseId: route.params.id,
                userId: state.userid
            }).then(res => {
                if (res.code == 0) {
                    proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
                    getData()
                }
            });
        }
        function buyCourse(data) {
            // 购买课程
            console.log(data)
            console.log(store.state.userinfo.openid)
            if (data == 1 && !store.state.userinfo.openid) {
                //判断是否已绑定微信
                bindwx();
            } else {
                buyCoursePost(data)
            }
        }
        function buyCoursePost(data) {
            state.noClick = true;
            proxy.$post(proxy.Apis.buyCourse, {
                courseId: route.params.id,
                userId: state.userid,
                money: state.info.price,
                payMethod: data,//支付方式：1微信，2支付宝
            }).then(res => {
                if (res.code == 0) {
                    console.log(res)
                    if (data == 2) {
                        //支付宝支付
                        let htmls = res.orderString; //打开新页面
                        const div = document.createElement("div");
                        div.innerHTML = htmls;
                        document.body.appendChild(div);
                        document.forms[0].submit();
                    } else {
                        // 微信支付
                        getConfig(res.orderString).then(res => {
                            console.log(res)
                            proxy.$toast(t('zhifuchengg'))
                            getData();
                        }).catch(err => {
                            console.log(err)
                            proxy.$toast(t('zhifushibai'))
                        });
                    }
                } else {
                    state.showModel = false;
                    state.noClick = false;
                }
            });
        }
        function oncloseModel() {
            state.showModel = false;
            state.noClick = false;
        }
        return {
            oncloseModel,
            buyCourse,
            toggleCollect,
            toEva,
            togglePlay,
            ...toRefs(state),
            openpay,
            getlistCatalogueByCourseId,
            toggelVideo,
            checkPlay,
            checkPlay2
        }
    },
})
</script>

<style scoped lang='scss'>
.play {
    width: 50px !important;
    height: 50px !important;
}
.marginr {
    margin-right: 12px;
}
.detail {
    min-height: 100vh;
    background: #f8f8f8;
}
.class-msg {
    margin: 8px 0 0;
    background: #fff;
    .class-nav {
        padding: 16px 0 0;
        p {
            position: relative;
            padding: 0 0 8px;
        }
        p::after {
            position: absolute;
            content: "";
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 4px;
        }
        .actived {
            color: #333 !important;
        }
        .actived::after {
            background: #f9dc39;
        }
    }
    .detail-content {
        padding-top: 24px;
    }
    .detail-directory {
        padding: 22px 0;
        margin: 0 16px;
        border-top: 1px solid #f5f5f5;
    }
    .detail-eva {
        border-top: 1px solid #f5f5f5;
        padding: 23px 16px 0;
        .toLook {
            padding: 5px 16px;
            height: 28px;
            text-align: center;
            border-radius: 14px;
            margin: 0 0 9px;
        }
        .evas {
            .item {
                padding: 7px 0 16px;
                .name {
                    .avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                    }
                    .nickname {
                        margin: 0 13px 0 12px;
                    }
                }
                .content {
                    word-break:break-all;
                    margin: 10px 0 0;
                }
            }
            .item:not(:last-child) {
                border-bottom: 1px solid #f5f5f5;
            }
        }
    }
}
.class-content {
    background: #fff;
    padding: 16px;
    .name {
        flex: 1;
    }
    .collectStatus {
        width: 50px;
        img {
            margin: 0 auto 2px;
        }
        p {
            text-align: center;
        }
    }
    .num {
        margin: 5px 0 0;
        .icon30 {
            margin-right: 6px;
        }
    }
}
.my-swipe {
    height: 210px;
    img {
        width: 100%;
        height: 100%;
    }
}
.video-img,
.swipers {
    width: 100%;
    height: 210px;
    position: relative;
    .tip {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        > p {
            color: #f9dc39;
            padding:0 24px;
            // max-width: 278px;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            border: 1px solid #f9dc39;
            text-align: center;
        }
    }
    video,
    img {
        width: 100%;
        height: 100%;
    }
}
</style>