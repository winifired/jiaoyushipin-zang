<template>
  <!-- <router-view /> -->
  <div class="pageContent">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['login', 'loginCode']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <tabbar :currentPage="$route.meta.currentPage || ''" :showTabar="$route.meta.showTabar"></tabbar>
  </div>
</template>
<script>
import tabbar from "@/components/tabbar.vue";
import { onMounted, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
export default {
  components: { tabbar },
  setup() {
    const store = useStore();
    onMounted(() => {
      console.log(store)
      window.addEventListener('unload', saveState);
      sessionStorage.setItem('innerHeight', document.documentElement.clientHeight);
      if (!store.state.userinfo && localStorage.getItem('state')) {
        store.commit('setState', localStorage.getItem('state'))
      }
    });
    watch(()=>store.state,(newDate)=>{
      saveState()
    },{
      deep:true
    })
    const saveState = () => {
      localStorage.setItem('state', JSON.stringify(store.state))
    };
    // function isWeiXin() {
    //   var ua = window.navigator.userAgent.toLowerCase();
    //   console.log(ua);
    //   if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  },
}
</script>
<style lang="scss">
@import "@/common/public.scss";
* {
  margin: 0;
  padding: 0;
}
.pageContent {
  min-height: 100vh;
  background: #fff;
}
.detail-content {
  video,
  img {
    display: block!important;
    width: 100%!important;
  }
}
@font-face {
  font-family: "Qomolangma-Subtitle";
  src: url("./common/Qomolangma-Subtitle.ttf") format("truetype");
}

@font-face {
  font-family: "FZLTTHJW";
  src: url("./common/方正兰亭纤黑简体.TTF") format("truetype");
}

@font-face {
  font-family: "FZLTTHJWBOLD";
  src: url("./common/FZLTTHJW.TTF") format("truetype");
}

.Qomolangma {
  font-family: "Qomolangma-Subtitle";
}

.FZLTTHJW {
  font-family: "FZLTTHJW";
}

.FZLTTHJWBOLD {
  font-family: "FZLTTHJWBOLD";
}
.detail-content {
  img {
    width: 100%;
  }
}
.fixedbottom {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
}
.button-bottom {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  text-align: center;
}
.bgeee {
  background: #eee;
}
.bgf9d {
  background: #f9dc39;
}
.bglinear {
  background: linear-gradient(90deg, #fde9c3 0%, #e8c087 100%);
}
</style>
