<template>
    <div class="freeClass">
        <div class="fixedtop" :style="{ height: focusStatus ? innerHeight : 'auto' }">
            <div class="flex row-center search-area">
                <img src="../assets/search-icon.png" alt class="icon40" />
                <input
                    type="text"
                    placeholder="ཉིད་ཀྱི་བལྟ་འདོད་པའི་སློབ་ཁྲིད་འཚོལ་བ།"
                    class="f26 c333 Qomolangma"
                    v-model="searchVal"
                    @keyup.enter="confirmInput"
                    @focus="getFocus"
                @blur="getBlur"
                />
            </div>
            <div class="class-nav flex area-around">
                <p
                    :class="actived == 0 ? 'actived' : ''"
                    class="c777 f32 Qomolangma"
                    @click="actived = 0"
                >ཚང་མ།</p>
                <p
                    :class="actived == 1 ? 'actived' : ''"
                    class="c777 f32 Qomolangma"
                    @click="actived = 1"
                >སློབ་ཁྲིད་རྐྱང་བ།</p>
                <p
                    :class="actived == 2 ? 'actived' : ''"
                    class="c777 f32 Qomolangma"
                    @click="actived = 2"
                >སློབ་ཁྲིད་ཆ་ཚང་།</p>
            </div>
        </div>
        <div class="array">
            <van-list v-model:loading="loading" :finished="finished" @load="getData">
                <listshow :list="listCourse"></listshow>
            </van-list>
        </div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch} from 'vue';
import listshow from "@/components/list.vue";
import { List } from 'vant';
export default defineComponent({
    name: 'freeClass',
    props: {
    },
    components: {
        listshow, vanList: List
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const innerHeight = sessionStorage.getItem('innerHeight') + 'px';
        const state = reactive({
            actived: 0,
            pageNum: 1,
            total: 0,
            searchVal: '',
            listCourse: [],
            loading: false,
            finished: false,
            focusStatus:false
        });
        watch(() => state.actived, (newDate, oldDate) => {
            if (newDate != oldDate) {
                state.pageNum = 1;
                getData();
            }
        })
        function getData() {
            if (state.pageNum == 1) {
                state.listCourse = [];
            }
            proxy.$post(proxy.Apis.listFreeCourse, {
                name: state.searchVal,
                courseForm: state.actived==0?'':state.actived,//课程形式：1单次课程，2系列课程
                isRecommend:0,//是否推荐：1推荐，0不推荐（首页显示免费课程时传值：1推荐）	
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                state.total = res.data.total;
                state.listCourse.push(...res.data.rows);
                console.log(state.listCourse)
                state.loading = false;
                if (state.listCourse.length >= state.total) {
                    state.finished = true;
                } else {
                    state.pageNum++
                }
            })
        }
        function confirmInput() {
            state.pageNum = 1;
            getData();
        }
        function getFocus() {
            state.focusStatus = true;
        }
        function getBlur() {
            state.focusStatus = false;
        }
        return {
            ...toRefs(state),
            getData,
            confirmInput,
            getFocus,
            getBlur,
            innerHeight
        }
    },
})
</script>

<style scoped lang='scss'>
.array {
    padding: 109px 16px 50px;
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
.search-area {
    height: 32px;
    background: #f6f6f6;
    border-radius: 16px;
    padding: 0 16px;
    margin: 0 0 6px;
    input {
        flex: 1;
        margin-left: 12px;
    }
}
</style>