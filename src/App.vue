<template>
  <!-- mui-draggable mui-off-canvas-wrap class="mui-slide-in" -->
  <div id="app">
    <div class="mui-inner-wrap">
      <v-tabbar></v-tabbar>
      <transition name="routerFade">
        <router-view class="custom-body" keep-alive></router-view>
      </transition>
    </div>
    <!-- <v-audio></v-audio> -->
    <v-home-backdrop></v-home-backdrop>
    <v-home-uncertain-time-backdrop></v-home-uncertain-time-backdrop>
  </div>
</template>

<script>
import mui from 'mui';
import Tabbar from './components/tabbar/tabbar';
// import Audio from './components/audio/audio';
import HomeBackdrop from './components/homeBackdrop/homeBackdrop';
import HomeUncertainTimeBackdrop from './components/homeUncertainTimeBackdrop/homeUncertainTimeBackdrop';
import checkUpdate from './common/js/update.js';
import storage from './common/js/localStorage.js';
import listenResume from './common/js/listenResume.js';
import listenPause from './common/js/listenPause.js';

// mui.init();

export default {
  name: 'app',
  created() {
    // 如果是自动更新
    mui.plusReady( () => {
      if ( storage.get( 'update' ) === true ) {
        checkUpdate();
      }

      listenResume( () => {
        this.$store.commit( 'changeScreenState', 'resume' );
      } );

      listenPause( () => {
        this.$store.commit( 'changeScreenState', 'pause' );
      } );
    } );
  },
  components: {
    'v-tabbar': Tabbar,
    'v-home-backdrop': HomeBackdrop,
    'v-home-uncertain-time-backdrop': HomeUncertainTimeBackdrop,
    // 'v-audio': Audio,
  },
};
</script>

<style scoped>
@import './common/css/public.scss';
@import './common/css/iconfont.scss';

.custom-body {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 50px;
  left: 0;
}
</style>
