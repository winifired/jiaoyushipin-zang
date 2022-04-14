<template>
    <div>
        <Overlay :show="state.showModel" @click.stop="closemodel" z-index="100">
            <div class="payType">
                <p class="f30 c333 title">{{$t('zfxz')}}</p>
                <div class="item flex area-between borderb" @click.stop="state.choosed = 1">
                    <div class="flex row-center f28 c333">
                        <img src="../assets/wx.png" alt class="icontype" />{{$t('wxzf')}}
                    </div>
                    <img
                        src="../assets/checked-icon.png"
                        alt
                        class="icon48"
                        v-if="state.choosed == 1"
                    />
                    <img src="../assets/check-icon.png" alt class="icon48" v-else />
                </div>
                <div class="item flex area-between" @click.stop="state.choosed = 2">
                    <div class="flex row-center f28 c333">
                        <img src="../assets/zfb.png" alt class="icontype" />{{$t('zfbzf')}}
                    </div>
                    <img
                        src="../assets/checked-icon.png"
                        alt
                        class="icon48"
                        v-if="state.choosed == 2"
                    />
                    <img src="../assets/check-icon.png" alt class="icon48" v-else />
                </div>
                <div class="button-bottom bgf9d" :class="{'noClick':state.noClick}" @click="emit('buyCourse',state.choosed)">
                    <span class="c333 f32">{{$t('qr')}}</span>
                </div>
            </div>
        </Overlay>
    </div>
</template>

<script setup>
import { Overlay } from 'vant';
import { reactive, defineProps, watch } from 'vue'
const props = defineProps({
    showModel: {
        type: Boolean,
        default: false
    },
    noClick:{
        type: Boolean,
        default: false
    }
})
const state = reactive({
    choosed: 1,//1微信，2支付宝复制
    showModel: props.showModel,
    noClick:props.noClick,
})
watch(props, (newData) => {
    state.showModel = newData.showModel;
    state.noClick = newData.noClick;
})
const emit=defineEmits(['buyCourse','closeModel']);
const closemodel=()=>{
    state.showModel = false;
    emit('closeModel',false);
}
</script>

<style scoped lang='scss'>
.payType {
    padding: 24px 0 51px;
    background: #fff;
    position: absolute;
    bottom: 0;
    width: 100%;
    .title {
        text-align: center;
    }
    .item {
        padding: 24px;
        .icontype {
            width: 28px;
            height: 28px;
            margin-right: 16px;
        }
    }
    .borderb {
        border-bottom: 1px solid #f6f6f6;
    }
    .button-bottom {
        width: 327px !important;
        margin: 0 auto;
    }
}
</style>