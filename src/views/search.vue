<template>
    <div>
        <div class="fixedtop">
            <div class="flex row-center search-area">
                <img src="../assets/search-icon.png" alt class="icon40" />
                <input
                    type="text"
                    placeholder="ཉིད་ཀྱི་བལྟ་འདོད་པའི་སློབ་ཁྲིད་འཚོལ་བ།"
                    class="f26 c333 Qomolangma"
                    v-model="searchVal"
                    @keyup.enter="confirmInput"
                />
            </div>
            <van-dropdown-menu class="dropdown-meau" active-color="#FFA000">
                <van-dropdown-item class="dropdown-item" @open="openMeau(1)" @close="closeMeau">
                    <template #title>
                        <p class="f28 Qomolangma flex row-center">
                            <span>སློབ་ཁྲིད་ཀྱི་རྣམ་པ།</span>
                            <img
                                src="../assets/up-icon.png"
                                alt
                                class="icon32 marginL"
                                v-if="activeMeau != 1"
                            />
                            <img
                                src="../assets/down-icon.png"
                                alt
                                class="icon32 marginL"
                                v-if="activeMeau == 1"
                            />
                        </p>
                    </template>
                    <div
                        class="flex area-between meau-item"
                        v-for="(tag,index) in options1"
                        :key="index"
                        @click.stop="changeItem1(index)"
                    >
                        <p class="f30 c777 Qomolangma">{{ tag.text }}</p>
                        <img
                            src="../assets/right-yellow.png"
                            alt
                            class="icon44"
                            v-if="chooseOption1 == tag.value"
                        />
                    </div>
                </van-dropdown-item>
                <van-dropdown-item class="dropdown-item" @open="openMeau(2)" @close="closeMeau">
                    <template #title>
                        <p class="f28 Qomolangma flex row-center">
                            རིན་གོང་།
                            <img
                                src="../assets/up-icon.png"
                                alt
                                class="icon32 marginL"
                                v-if="activeMeau != 2"
                            />
                            <img
                                src="../assets/down-icon.png"
                                alt
                                class="icon32 marginL"
                                v-if="activeMeau == 2"
                            />
                        </p>
                    </template>
                    <div
                        class="flex area-between meau-item"
                        v-for="(tag,index) in options2"
                        :key="index"
                        @click.stop="changeItem2(index)"
                    >
                        <p class="f30 c777 Qomolangma">{{ tag.text }}</p>
                        <img
                            src="../assets/right-yellow.png"
                            alt
                            class="icon44"
                            v-if="chooseOption2 == tag.value"
                        />
                    </div>
                </van-dropdown-item>
            </van-dropdown-menu>
        </div>
        <div class="array">
            <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
                <listshow :list="listCourse"></listshow>
            </van-list>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance } from 'vue';
import { DropdownMenu, DropdownItem, List } from 'vant';
import listshow from "@/components/list.vue"
import { useRoute } from 'vue-router';
export default defineComponent({
    name: 'search',
    props: {
    },
    components: {
        vanDropdownMenu: DropdownMenu, vanDropdownItem: DropdownItem, listshow, vanList: List
    },
    setup() {
        const route = useRoute();
        const options1 = [
            // 全部、单次课程、系列课程
            { text: 'ཚང་མ།', value: '0' },
            { text: 'སློབ་ཁྲིད་རྐྱང་བ།', value: '1' },
            { text: 'སློབ་ཁྲིད་ཆ་ཚང་།', value: '2' },
        ];
        const options2 = [
            // 全部、付费、免费
            { text: 'ཚང་མ།', value: '0' },
            { text: 'རིན་ལྡན་སློབ་ཁྲིད།', value: '2' },
            { text: 'རིན་མེད་སློབ་ཁྲིད།', value: '1' },
        ];
        function changeItem1(index) {
            state.chooseOption1 = options1[index].value;
            state.pageNum = 1;
            onLoad();
        }
        function changeItem2(index) {
            state.chooseOption2 = options2[index].value;
            state.pageNum = 1;
            onLoad();
        }
        function openMeau(index) {
            state.activeMeau = index;
        }
        function closeMeau() {
            state.activeMeau = '';
        }
        const state = reactive({
            chooseOption1: '0',
            chooseOption2: '0',
            activeMeau: '',//1 2
            pageNum: 1,
            total: 0,
            searchVal: '',
            listCourse: [],
            loading: false,
            finished: false,
            typeMsg: route.query.typeMsg ? JSON.parse(route.query.typeMsg) : null
        })
        //2精选课程1免费课程 首页传输route.query.type
        if (route.query.type) {
            state.chooseOption2 = route.query.type;
        }
        function confirmInput() {
            state.pageNum = 1;
            onLoad();
        }
        const { proxy } = getCurrentInstance();
        function onLoad() {
            if (state.pageNum == 1) {
                state.listCourse = [];
            }
            proxy.$post(proxy.Apis.listCourse, {
                name: state.searchVal,
                typeId: state.typeMsg ? state.typeMsg.id : '',//课程类型id(点击首页分类时传该类型id)		
                courseForm: state.chooseOption1 != 0 ? state.chooseOption1 : '',//1单次课程，2系列课程
                mode: state.chooseOption2 != 0 ? state.chooseOption2 : '',//1免费，2付费		
                pageNum: state.pageNum,
                pageSize: 15
            }).then(res => {
                if (res.code == 0) {
                    state.total = res.data.total;
                    state.listCourse.push(...res.data.rows);
                    console.log(state.listCourse)
                    state.loading = false;
                    if (state.listCourse.length >= state.total) {
                        state.finished = true;
                    } else {
                        state.pageNum++
                    }
                }
            })
        };
        return {
            ...toRefs(state),
            onLoad,
            options1,
            options2,
            changeItem1,
            changeItem2,
            openMeau,
            closeMeau,
            confirmInput
        }
    },
})
</script>

<style scoped lang='scss'>
.ropdown-meau {
    .van-dropdown-menu__title {
        color: #777 !important;
    }
}
.meau-item {
    height: 57px;
    margin: 0 16px;
    border-bottom: 1px solid #f5f5f5;
}
.marginL {
    margin-left: 5px;
    margin-top: 4px;
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
        margin-left: 16px;
    }
}
.array {
    padding: 102px 24px 100px 16px;
}
</style>