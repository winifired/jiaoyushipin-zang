<template>
    <div>
        <List v-model:loading="loading" :finished="finished" @load="onLoad">
            <SwipeCell
                v-for="(item,index) in list"
                :key="item.id"
                right-width="80"
                @click="redStatus(item.id)"
            >
                <div class="flex item">
                    <img src="../assets/system-icon.png" alt class="icon80" />
                    <div class="content">
                        <div class="flex area-between">
                            <!-- 系统通知 -->
                            <p class="c333 f30 Qomolangma">{{ item.title }}</p>
                            <p class="caaa f26">{{ $filters.gettime(item.createTime) }}</p>
                        </div>
                        <div class="c777 f24 Qomolangma content-msg">{{ item.content }}</div>
                    </div>
                </div>
                <template #right>
                    <p
                        class="cfff f30 Qomolangma right-btn flex area-center"
                        @click.stop="delate(index)"
                    >འདོར་བ།</p>
                </template>
            </SwipeCell>
        </List>
    </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs } from 'vue';
import { SwipeCell, List } from 'vant';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
export default {
    name:'systemMsg',
    components: {
        SwipeCell, List
    },
    setup() {
        const {t,locale}=useI18n();
        document.title=t('xx');
        const list = ref([]);
        const loading = ref(false);
        const finished = ref(false);
        const { proxy } = getCurrentInstance();
        const store = useStore();
        let state = reactive({
            pageSize: 15,
            pageNum: 1,
            total: 0,
            lang:locale.value
        })
        const onLoad = () => {
            proxy.$post(proxy.Apis.selectJyspMessageList, {
                userId: store.state.userid,
                pageNum: state.pageNum,
                pageSize: state.pageSize
            }).then(res => {
                state.total = res.data.total;
                list.value.push(...res.data.rows);
                console.log(list.value)
                loading.value = false;
                if (list.value.length >= state.total) {
                    finished.value = true;
                }
            })
        };
        function delate(index) {
            console.log(index)
        }
        function redStatus(id) {
            // 更改消息阅读状态
            proxy.$post(proxy.Apis.readMessage, {
                userId: store.state.userid,
                messageId: id
            }).then(res => {
                if (res.code == 0) {
                    // 消息未读数量
                    store.dispatch('getUnReadNum');
                }
            })
        }
        return {
            list,
            onLoad,
            loading,
            finished,
            delate,
            ...toRefs(state),
            redStatus
        };
    }
}
</script>

<style scoped lang='scss'>
.item {
    padding: 16px 0;
    margin: 0 16px;
    border-bottom: 1px solid #f5f5f5;
    > img {
        margin-right: 16px;
    }
    .content {
        flex: 1;
        &-msg {
            margin: 2px 0 0;
        }
    }
}
.right-btn {
    width: 80px;
    height: 100%;
    background: #ff5242;
}
</style>