<template>
  <div class="tabbar-fixed" v-if="showTabar">
    <div class="tabbar flex area-around" ref="tabbarref">
      <div @click="$router.push('/')">
        <img src="../assets/index.png" alt v-if="currentPage != 1" />
        <img src="../assets/index_act.png" alt v-else />
        <p>{{$t('tabbar.index')}}</p>
      </div>
      <div @click="$router.push('/vip')">
        <img src="../assets/vip.png" alt v-if="currentPage != 2" />
        <img src="../assets/vip_act.png" alt v-else />
        <p>{{$t('tabbar.vip')}}</p>
      </div>
      <div @click="$router.push('/freeClass')">
        <img src="../assets/free.png" alt v-if="currentPage != 3" />
        <img src="../assets/free_act.png" alt v-else />
        <p>{{$t('tabbar.free')}}</p>
      </div>
      <div @click="$router.push('/user')">
        <img src="../assets/use.png" alt v-if="currentPage != 4" />
        <img src="../assets/use_act.png" alt v-else />
        <p>{{$t('tabbar.user')}}</p>
      </div>
    </div>
    <div class="fixedHeight" :style="{ height: fixedHeight }"></div>
  </div>
</template>

<script setup>
import { defineProps, getCurrentInstance, onUnmounted, ref } from "vue";
const props=defineProps({
  currentPage: {
    type: [String, Number],
    default: 1
  },
  showTabar: {
    type: Boolean,
    default: false
  },
});
const tabbarref = ref(null);
const fixedHeight = ref(0);
const {proxy}=getCurrentInstance();
console.log(proxy)
// console.log(proxy.i18n)
let timer = setTimeout(() => {
  console.log(tabbarref.value)
  if (props.showTabar&&fixedHeight.value == 0) {
    fixedHeight.value = tabbarref.value.clientHeight + 'px';
    sessionStorage.setItem('tabbarHeight', fixedHeight.value);
  }
}, 1000)
onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped lang='scss'>
.tabbar {
  position: fixed;
  bottom: 0;
  z-index: 99;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.06);
  padding-top: 4px;
  padding-bottom: calc(4px + constant(safe-area-inset-bottom));
  padding-bottom: calc(4px + env(safe-area-inset-bottom));
  img {
    width: 22px;
    height: 22px;
    margin: 0 auto 1px;
  }
  p {
    text-align: center;
    font-size: 11px;
    font-weight: normal;
    color: #333333;
  }
}
</style>
