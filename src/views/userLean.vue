<template>
    <div>
        <div class="fixedtop">
            <div class="class-nav flex area-around">
                <p
                    :class="actived == 1 ? 'actived' : ''"
                    class="c777 f32 Qomolangma"
                    @click="actived = 1"
                >{{$t('home.free')}}</p>
                <p
                    :class="actived == 2 ? 'actived' : ''"
                    class="c777 f32 Qomolangma"
                    @click="actived = 2"
                >{{$t('huiyuankecheng')}}</p>
            </div>
        </div>
        <div class="list">
            <van-list v-model:loading="loading" :finished="finished" @load="getData">
                <div
                    class="flex row-center item"
                    v-for="(item,index) in listCourse"
                    :key="index"
                    @click="$router.push('/detail/' + item.courseId)"
                >
                    <van-image radius="5" :src="item.cover" class="image" />
                    <div class="content">
                        <div class="f30 c333 Qomolangma title">{{item.name}}</div>
                        <div class="f22 c777 Qomolangma companyName" v-if="item.createTime">
                            {{$t('shangcixuexi')}}
                            <span>{{item.createTime.slice(0,10).replace(/-/g,'.')}}</span>
                        </div>
                        <div class="flex area-between price">
                            <p class="Qomolangma f22 c777 flex row-center">{{$t('appname')}}</p>
                            <div class="confirm f24 c333 Qomolangma">{{$t('jixuxuexi')}}</div>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from 'vue';
import { List } from 'vant';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'userLean',
    props: {
    },
    components: {
        vanList: List
    },
    setup() {
        const {t,locale}=useI18n();
        document.title=t('xxjl');
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const state = reactive({
            pageNum: 1,
            total: 0,
            listCourse: [],
            loading: false,
            finished: false,
            actived: 1
        });
        watch(() => state.actived, (newData) => {
            state.pageNum = 1;
            getData();
        })
        const getData = () => {
            if (state.pageNum == 1) state.listCourse = [];
            proxy.$post(proxy.Apis.listJyspLearnRecord, {
                userId: store.state.userid,
                type: state.actived,
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                if (res.code == 0) {
                    state.total = res.data.total;
                    state.listCourse.push(...res.data.rows)
                    state.loading = false;
                    if (state.listCourse.length >= state.total) {
                        state.finished = true;
                    } else {
                        state.pageNum++
                    }
                }
            })
        }
        return {
            ...toRefs(state),
            getData,
        }
    },
})
</script>

<style scoped lang='scss'>
.list {
    padding: 68.3px 16px 50px;
    .item {
        .image {
            width: 120px;
            height: 80px;
            border-radius: 5px;
            margin-right: 16px;
        }
        .content {
            flex: 1;
            .companyName {
                margin: 6px 0 0;
                span {
                    margin-left: 6px;
                }
            }
            .price {
                margin: 3px 0 0;
                .confirm {
                    width: 86px;
                    height: 28px;
                    line-height: 28px;
                    text-align: center;
                    background: #f9dc39;
                    border-radius: 16px;
                }
            }
        }
    }
    .item:not(:last-child) {
        margin-bottom: 12px;
    }
}
.class-nav {
    padding: 16px 0 8px;
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
.fixedtop {
    padding: 6px 16px 0;
    background: #fff;
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100%;
}
</style>