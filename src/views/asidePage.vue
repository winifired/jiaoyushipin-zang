<template>
    <div v-html="info" class="contentF f32 Qomolangma c333"></div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
    name: 'asidePage',
    props: {
    },
    components: {

    },
    setup() {
        //1 སྤྱོད་མཁན་གྱི་གྲོས་མཐུན། 用户协议  2 གསང་བའི་གྲོས་མཐུན།隐私协议 3关于我们ངེད་ཀྱི་སྐོར།
        const state = reactive({
            info: ''
        })
        const route = useRoute();
        const { proxy } = getCurrentInstance();
        getData();
        function getData() {
            let url = '';
            if (route.params.type == 1) {
                document.title = 'སྤྱོད་མཁན་གྱི་གྲོས་མཐུན།';
                url = proxy.Apis.getUserProtocol;
            } else if (route.params.type == 2) {
                document.title = 'གསང་བའི་གྲོས་མཐུན།';
                url = proxy.Apis.getPrivacyProtocol;
            } else if (route.params.type == 3) {
                document.title = 'ངེད་ཀྱི་སྐོར།';
                url = proxy.Apis.getAboutUs;
            }
            proxy.$post(url).then(res => {
                if (res.code == 0) {
                    state.info = res.data.content;
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