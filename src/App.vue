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

// mui.init();
// let plus;

export default {
  name: 'app',
  created() {
    // 如果是自动更新
    mui.plusReady( () => {
      if ( storage.get( 'update' ) === true ) {
        checkUpdate();
      }
    } );
    // const _self = this;
    //
    // mui.plusReady( function () {
    //   // plus 会在 DOM 加载完毕后存在
    //   plus = window.plus;
    //
    //   // 引入安卓
    //   const main = plus.android.runtimeMainActivity();
    //   const Intent = plus.android.importClass( 'android.content.Intent' );
    //   const IntentFilter = plus.android.importClass( 'android.content.IntentFilter' );
    //   const Context = plus.android.importClass( 'android.content.Context' );
    //
    //   // const PowerManager = plus.android.importClass( 'android.os.PowerManager' );
    //   const receiver = plus.android.implements( 'io.dcloud.android.content.BroadcastReceiver', {
    //     onReceive( context, intent ) {
    //       // const intentInstance = new Intent( 'test' );
    //
    //       plus.android.importClass( intent );
    //
    //       // console.log( intentInstance.ACTION_SCREEN_ON );
    //       // if ( intentInstance.ACTION_SCREEN_ON.equals( intent.getAction() ) ) {
    //       //   _self.onScreenOn( 'bbb' );
    //       // }
    //       _self.onScreenOn( '屏幕点亮' );
    //     },
    //   } );
    //
    //   // 广播接收
    //   const filter = new IntentFilter( 'test1' );
    //
    //   filter.addAction( Intent.ACTION_SCREEN_ON );
    //   main.registerReceiver( receiver, filter );
    //
    //   // 获取屏幕状态
    //   const power = main.getSystemService( Context.POWER_SERVICE );
    //   console.log( power );
    //
    //   // if ( power.isScreenOn() ) {
    //   //   console.log( 'aaa' );
    //   // }
    //   _self.onScreenOn( '开始监听屏幕' );
    // } );
  },
  methods: {
    // onScreenOn( data ) {
    //   console.log( `${data} --- test` );
    //   // mui( '.mui-off-canvas-wrap' ).offCanvas( 'show' );
    // },
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
