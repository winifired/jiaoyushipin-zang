<template>
    <div class="evas">
        <van-list v-model:loading="loading" :finished="finished" @load="getComment">
            <div class="item" v-for="(item,index) in comment" :key="index">
                <div class="flex area-between">
                    <div class="flex row-center name">
                        <img :src="item.avatar" alt class="avatar" v-if="item.avatar" />
                                        <img src="../assets/avatar.png" alt="" class="avatar" v-else />
                        <p class="c777 f28 Qomolangma nickname">{{ item.nickName }}</p>
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
                    <p class="f24 c777" v-if="item.createTime">{{ item.createTime.slice(0,10).replace(/-/g,'.') }}</p>
                </div>
                <div
                    class="c333 f28 Qomolangma content"
                >{{ item.content }}</div>
            </div>
        </van-list>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { Rate,List } from 'vant';
import { useRoute } from 'vue-router';
export default defineComponent({
    name: 'evalist',
    props: {
    },
    components: {
        vanList: List,vanRate: Rate
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const route=useRoute();
        const state = reactive({
            pageNum: 1,
            total: 0,
            loading: false,
            finished: false,
            comment:[]
        })
        function getComment() {
            // 获取评论列表
            proxy.$post(proxy.Apis.listCommentByCourseId, {
                courseId: route.query.courseId,
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                if (res.code == 0 && res.data.total > 0) {
                    state.total = res.data.total;
                    state.comment.push(...res.data.rows);
                    state.loading = false;
                    if (state.comment.length >= state.total) {
                        state.finished = true;
                    } else {
                        state.pageNum++;
                    }
                }
            });
        }
        return {
            ...toRefs(state),
            getComment,
        }
    },
})
</script>

<style scoped lang='scss'>
.evas {
    padding: 26px;
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
            margin: 10px 0 0;
        }
    }
    .item:not(:last-child) {
        border-bottom: 1px solid #f5f5f5;
    }
}
</style>