<template>
    <div v-html="info" class="contentF f32 c333"></div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'asidePage',
    props: {
    },
    components: {

    },
    setup() {
        const {t,locale}=useI18n();
        //1 སྤྱོད་མཁན་གྱི་གྲོས་མཐུན། 用户协议  2 གསང་བའི་གྲོས་མཐུན།隐私协议 3关于我们ངེད་ཀྱི་སྐོར།
        const state = reactive({
            info: '',
        })
        console.log(locale.value)
        const route = useRoute();
        const { proxy } = getCurrentInstance();
        getData();
        function getData() {
            let url = '';
            if (route.params.type == 1) {
                document.title = t('login.useragree');
                url = proxy.Apis.getUserProtocol;
            } else if (route.params.type == 2) {
                document.title = t('login.yinsi');
                url = proxy.Apis.getPrivacyProtocol;
            } else if (route.params.type == 3) {
                document.title = t('users.about');
                url = proxy.Apis.getAboutUs;
            }
            proxy.$post(url).then(res => {
                if (res.code == 0) {
                    state.info = locale.value=='zh'?res.data.content:res.data.contentTibetan;
                }
            })
        }

        return {
            ...toRefs(state),
        }
    },
})
</script>

<style lang='scss'>
.contentF {
    line-height: 26px;
    padding:30px;
    >>> img {
        display: block;
        width: 100%;
        height: auto;
    }
}
</style>