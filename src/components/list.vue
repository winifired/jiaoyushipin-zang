<template>
    <div class="list">
        <div
            class="flex row-center item"
            v-for="(item,index) in state.array"
            :key="index"
            @click="$router.push('/detail/'+item.id)"
        >
            <van-image radius="5" :src="item.cover" fit="cover" class="image" />
            <div class="content">
                <div class="f30 c333 title">{{state.lang=='zh'?item.name:item.nameTibetan}}</div>
                <!-- 公司名 -->
                <div class="f26 c777 companyName">{{t('appname')}}</div>
                <div class="flex area-between price">
                    <p class="fangzhenglantingF f24 c777 flex row-center" v-if="item.learnTime>=0">
                        <img src="../assets/eye-icon.png" alt class="icon30" />{{item.learnTime>999?'999+':item.learnTime}}
                    </p>
                    <p class="Qomolangma f32 cff5" v-if="item.mode == 1">{{t('tabbar.free')}}</p>
                    <p class="FZLTTHJWF f28 cff5" v-else>
                        <span class="f24">￥</span>{{item.price||0}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
const {t,locale}=useI18n();
const props = defineProps({
    type: [String, Number],
    list: Array,
})
const state=reactive({
    array:[],
    lang:locale.value
})
watch(() => locale.value, (newData) => {
    state.lang=newData;
})
watch(() => props.list, (newData) => {
    state.array=newData;
})
</script>

<style scoped lang='scss'>
.list {
    .item {
        .image {
            width: 120px;
            height: 80px;
            border-radius: 2px!important;
            margin-right: 16px;
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