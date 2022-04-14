<template>
    <div class="eva_use" :style="{ height: focusStatus ? innerHeight : '100vh' }">
        <div class="rate">
            <p class="f28 c333 class-eva">{{$t('kechengpingjia')}}</p>
            <van-rate
                v-model="RATEvalue"
                color="#FFA000"
                void-color="#CCCCCC"
                size="28"
                gutter="19"
            />
        </div>
        <div class="content">
            <p class="f28 c333 class-eva">{{$t('pinjianeirong')}}</p>
            <textarea
                :placeholder="$t('pingjiaplace')"
                v-model="text"
                @focus="getFocus"
                @blur="getBlur"
            ></textarea>
        </div>
        <div class="fixedbottom flex area-center safeBottom">
            <div class="button-bottom bgf9d" :class="{ 'noClick': noClick }" @click="confirm">
                <span class="c333 f32">{{$t('lijitijiao')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs} from 'vue';
import { Rate } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'eva_use',
    props: {
    },
    components: {
        vanRate: Rate
    },
    setup() {
        const { t,locale } = useI18n();
        document.title=t('kechengpingjia');
        const route = useRoute();
        const router = useRouter();
        const store = useStore();
        console.log(route.query);
        const innerHeight = sessionStorage.getItem('innerHeight') + 'px';
        const { proxy } = getCurrentInstance();
        const state = reactive({
            RATEvalue: 0,
            text: '',
            noClick: false,
            focusStatus:false
        })
        function confirm() {
            if (!store.state.userid) {
                router.push('/login');
                return;
            }
            state.noClick = true;
            proxy.$post(proxy.Apis.comment, {
                courseId: route.query.courseId,
                userId: store.state.userid,
                score: state.RATEvalue,
                content: state.text,
            }).then(res => {
                if (res.code == 0) {
                    proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
                    setTimeout(() => {
                        router.go(-1)
                    }, 1000)
                } else {
                    state.noClick = false;
                }
            });
        }
        function getFocus() {
            state.focusStatus = true;
        }
        function getBlur() {
            state.focusStatus = false;
        }
        return {
            ...toRefs(state),
            confirm,
            getFocus,
            getBlur,
            innerHeight
        }
    },
})
</script>

<style scoped lang='scss'>
.content {
    padding: 16px;
    border-top: 12px solid #f8f8f8;
    textarea {
        display: block;
        width: 100%;
        padding: 12px 16px;
        height: 148px;
        background: #f8f8f8;
        border-radius: 4px;
        margin: 12px 0 0;
    }
}
.rate {
    padding: 16px 16px 32px;
    border-bottom: 12px solid #f8f8ff;
    .class-eva {
        margin: 0 0 24px;
    }
}
</style>