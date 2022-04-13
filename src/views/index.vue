<template>
  <div class="index">
    <div class="swper-search">
      <div class="search flex area-between">
        <!-- <img src="../assets/logo.png" alt="" class="logo"> -->
        <p class="toggle" @click="toggleLang">{{ $t('lang.language') }}</p>
        <div class="flex row-center search-input" @click="$router.push('/search')">
          <img src="../assets/search-icon.png" alt class="icon40" />
          <input type="text" readonly :value="$t('home.sou')" class="f26 caaa Qomolangma" />
        </div>
        <Badge :content="state.unReadNum" max="99" :show-zero="false">
          <img
            src="../assets/msg-icon.png"
            alt
            class="icon44"
            @click="$store.state.userid ? $router.push('/systemMsg') : $router.push('/login')"
          />
        </Badge>
      </div>
      <Swipe class="my-swipe" :show-indicators="false" :loop="true" :autoplay="3000">
        <SwipeItem v-for="item in state.swiper" :key="item.id">
          <img :src="item.picture" alt />
        </SwipeItem>
      </Swipe>
      <div class="flex claassify">
        <div v-for="(item, index) in state.typeList" :key="index" @click="toSearch(item)">
          <img :src="item.icon" alt class="icon84" />
          <p class="f28 c333 Qomolangma">{{ state.lang == 'zh' ? item.name : item.nameTibetan }}</p>
        </div>
      </div>
    </div>
    <div class="index-list">
      <!-- 精选课程 -->
      <div class="navigator flex area-between">
        <p class="f34 c333 Qomolangma flex row-center">
          <span class="line"></span>
          {{ $t('home.selected') }}
        </p>
        <div
          class="flex row-center"
          @click="$router.push({ path: '/search', query: { type: '2' } })"
        >
          <p class="f26 c777 Qomolangma">{{ $t('home.see') }}</p>
          <img src="../assets/right-icon.png" alt class="icon40" />
        </div>
      </div>
      <listshow :list="state.listPayCourse"></listshow>
    </div>
    <div class="index-list">
      <!-- 最新课程 -->
      <div class="navigator flex area-between">
        <p class="f34 c333 Qomolangma flex row-center">
          <span class="line"></span>
          {{ $t('home.newest') }}
        </p>
        <div class="flex row-center" @click="$router.push({ path: '/search' })">
          <p class="f26 c777 Qomolangma">{{ $t('home.see') }}</p>
          <img src="../assets/right-icon.png" alt class="icon40" />
        </div>
      </div>
      <listshow :list="state.listNewstCourse"></listshow>
    </div>
    <div class="index-list">
      <!-- 免费课程 -->
      <div class="navigator flex area-between">
        <p class="f34 c333 Qomolangma flex row-center">
          <span class="line"></span>
          {{ $t('home.free') }}
        </p>
        <div
          class="flex row-center"
          @click="$router.push({ path: '/search', query: { type: '1' } })"
        >
          <p class="f26 c777 Qomolangma">{{ $t('home.see') }}</p>
          <img src="../assets/right-icon.png" alt class="icon40" />
        </div>
      </div>
      <listshow :list="state.listFreeCourse"></listshow>
    </div>
  </div>
</template>

<script setup>
import { Badge, Swipe, SwipeItem } from "vant";
import listshow from "@/components/list.vue";
import { getCurrentInstance, reactive, watch } from "vue";
import { useStore } from "vuex";
import { getwxConfig } from "../utils/wxJs.js";
import { useI18n } from "vue-i18n";
getwxConfig();
const { t, locale } = useI18n();
document.title = t("appname");
const { proxy } = getCurrentInstance();
const store = useStore();
// 消息未读数量
store.dispatch("getUnReadNum");
const state = reactive({
  swiper: [],
  unReadNum: store.state.UnReadNum,
  typeList: [],
  listPayCourse: [],
  listNewstCourse: [],
  listFreeCourse: [],
  lang: locale.value,
});
watch(
  () => locale.value,
  (newData) => {
    state.lang = newData;
  }
);
proxy.$post(proxy.Apis.selectJyspCarouselList).then((res) => {
  state.swiper = res.data;
});
proxy.$post(proxy.Apis.selectJyspCourseTypeList).then((res) => {
  state.typeList = res.data;
});
let data = {
  isRecommend: 1, //是否推荐：1推荐，0不推荐
  pageNum: 1,
  pageSize: 6,
};
proxy.$post(proxy.Apis.listPayCourse, data).then((res) => {
  state.listPayCourse = res.data.rows;
  console.log(state.listPayCourse);
});
proxy.$post(proxy.Apis.listNewstCourse, data).then((res) => {
  state.listNewstCourse = res.data;
});
proxy.$post(proxy.Apis.listFreeCourse, data).then((res) => {
  state.listFreeCourse = res.data.rows;
});
function toSearch(item) {
  proxy.$router.push({
    path: "/search",
    query: {
      typeMsg: JSON.stringify({ name: item.name, id: item.id }),
    },
  });
}
function toggleLang() {
  if (locale.value == "zh") {
    proxy.$i18n.locale = "zangwen";
  } else {
    proxy.$i18n.locale = "zh";
  }
  localStorage.setItem("lang", proxy.$i18n.locale);
}
</script>

<style scoped lang='scss'>
.logo {
  width: 18px;
  height: 26px;
  margin-right: 10px;
}
.index-list {
  background: #fff;
  padding: 16px;
  margin: 8px 0 0;
  .navigator {
    margin: 0 0 12px;
    .font34 {
      font-weight: 500;
    }
    .line {
      display: block;
      width: 4px;
      height: 12px;
      background: #f9dc39;
      margin-right: 12px;
    }
    > div {
      > p {
        margin-right: 4px;
      }
    }
  }
}
.claassify {
  position: relative;
  z-index: 2;
  padding: 12px 0 0.01px;
  > div {
    width: 25%;
    margin: 0 0 9px;
    > img {
      border-radius: 13px;
      margin: 0 auto 5px;
      width: 42px;
      height: 42px;
    }
    > p {
      text-align: center;
    }
  }
}
.index {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 0 0 24px;
}
.swper-search:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 141px;
  background: #fff;
  bottom: 0;
  left: 0;
  z-index: 1;
}
.swper-search {
  min-height: 160px;
  position: relative;
  background-color: #f8f8f8;
  z-index: 2;
  .my-swipe {
    position: relative;
    z-index: 2;
    .van-swipe-item {
      height: 148px;

      img {
        width: 343px;
        height: 148px;
        margin: 0 auto;
        border-radius: 4px;
      }
    }
  }
}
.search {
  padding: 8px 16px;
  position: relative;
  z-index: 2;
  &-input {
    flex: 1;
    margin-right: 16px;
    height: 32px;
    background: #ffffff;
    border-radius: 16px;
    padding: 0 12px;
    img {
      margin-right: 12px;
    }
    input {
      flex: 1;
    }
  }
}
.toggle {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background: #ffffff;
  font-size: 14px;
  text-align: center;
  border-radius: 50%;
  margin-right: 12px;
}
</style>