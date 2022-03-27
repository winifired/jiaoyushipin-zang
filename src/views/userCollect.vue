<template>
    <div class="list safeBottom120">
        <van-list v-model:loading="loading" :finished="finished" @load="getData">
            <div
                class="flex row-center item"
                v-for="(item,index) in listCourse"
                :key="item.id"
                @click="$router.push('/detail/' + item.courseId)"
            >
                <img
                    src="../assets/choosed.png"
                    alt
                    class="icon48"
                    v-if="item.checked"
                    @click.stop="toggle(index)"
                />
                <img
                    src="../assets/choose.png"
                    alt
                    class="icon48"
                    v-else
                    @click.stop="toggle(index)"
                />
                <van-image radius="5" :src="item.cover" class="image" />
                <div class="content">
                    <div class="f30 c333 Qomolangma title">{{ lang=='zh'?item.name:item.nameTibetan }}</div>
                    <!-- 公司名 -->
                    <div class="f26 c777 Qomolangma companyName">{{$t('appname')}}</div>
                    <div class="flex area-between price">
                        <p class="FZLTTHJW f24 c777 flex row-center">
                            <img src="../assets/eye-icon.png" alt class="icon30" />
                            {{ item.learnTime }}
                        </p>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
    <div class="fixed-bottom flex area-between safeBottom">
        <p class="Qomolangma f24 c333 flex row-center">
            <img
                src="../assets/choosed.png"
                alt
                class="icon48"
                v-if="checkedAll"
                @click.stop="toggleAll"
            />
            <img src="../assets/choose.png" alt class="icon48" v-else @click.stop="toggleAll" />
            {{$t('all')}}
        </p>
        <div
            class="confirm Qomolangma f32 c333"
            :class="{ 'noClick': noClick }"
            @click="confirm"
        >{{$t('quxiaoshoucang')}}</div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex';
import { List } from 'vant';
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'userCollect',
    props: {
    },
    components: {
        vanList: List
    },
    setup() {
        const {t,locale}=useI18n();
        document.title=t('users.mycollection');
        console.log(window.innerHeight)
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const state = reactive({
            pageNum: 1,
            total: 0,
            listCourse: [],
            loading: false,
            finished: false,
            checkedAll: false,
            noClick: true,
            lang:locale.value
        });
        watch(() => state.listCourse, (newData) => {
            let isChecked = newData.find((item) => !item.checked);
            let isChecked2 = newData.find((item) => item.checked);
            if (!isChecked) {
                state.checkedAll = true;
            } else {
                state.checkedAll = false;
            }
            if (isChecked2) {
                state.noClick = false;
            } else {
                state.noClick = true;
            }
        }, { deep: true })
        const getData = () => {
            if(state.pageNum==1)state.listCourse=[];
            proxy.$post(proxy.Apis.listCollectByUserId, {
                userId: store.state.userid,
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                if (res.code == 0) {
                    state.total = res.data.total;
                    res.data.rows.map(item => {
                        item.checked = false;
                        state.listCourse.push(item)
                    })
                    state.loading = false;
                    if (state.listCourse.length >= state.total) {
                        state.finished = true;
                    } else {
                        state.pageNum++
                    }
                }
            })
        }
        const toggle = (index) => {
            state.listCourse[index].checked = !state.listCourse[index].checked;
        }
        const toggleAll = () => {
            state.checkedAll = !state.checkedAll;
            if (state.checkedAll) {
                state.listCourse.map(item => {
                    item.checked = true;
                })
            } else {
                state.listCourse.map(item => {
                    item.checked = false;
                })
            }
        }
        const confirm = () => {
            let arr = [];
            state.listCourse.map(item => {
                if (item.checked) {
                    arr.push(item.id)
                }
            });
            if(arr.length==0)return;
            proxy.$post(proxy.Apis.cancelCollect, {
                userId: store.state.userid,
                collectIds: arr.join(','),
            }).then(res => {
                if (res.code == 0) {
                    proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
                    state.pageNum=1;
                    getData();
                    state.checkedAll=false;
                }
            })
        }
        return {
            ...toRefs(state),
            getData,
            toggle,
            toggleAll,
            confirm
        }
    },
})
</script>

<style scoped lang='scss'>
.fixed-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.06);
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    > p {
        img {
            margin-right: 8px;
        }
    }
    .confirm {
        width: 162px;
        height: 40px;
        line-height: 40px;
        background: #f9dc39;
        border-radius: 20px;
        text-align: center;
    }
}
.list {
    padding: 16px;
    .item {
        .image {
            width: 120px;
            height: 80px;
            border-radius: 5px;
            margin: 0 16px;
        }
        .content {
            flex: 1;
            .companyName {
                margin: 8px 0 0;
            }
            .price {
                margin: 4px 0 0;
                img {
                    margin-right: 4px;
                }
            }
        }
    }
    .item:not(:last-child) {
        margin-bottom: 12px;
    }
}
</style>