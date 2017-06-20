<template>
  <article class="setting">
    <header class="mui-bar mui-bar-nav">
      <h1 class="mui-title">设置</h1>
    </header>

    <ul class="mui-table-view">
      <li class="mui-table-view-cell" @tap="checkUpdate">
        <span>自动更新</span>
        <div class="mui-switch mui-switch-mini" id="settingUpdate" :class="{ 'mui-active': isUpdate }">
          <div class="mui-switch-handle"></div>
        </div>
      </li>
      <li class="mui-table-view-cell">
        <span>震动</span>
        <div class="mui-switch mui-switch-mini" id="settingShock" :class="{ 'mui-active': isShock }">
          <div class="mui-switch-handle"></div>
        </div>
      </li>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" @tap="openChildrenPage( '铃声', 'ring' )">铃声</a>
      </li>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" @tap="openChildrenPage( '背景', 'background' )">背景</a>
      </li>
      <li class="mui-table-view-cell" @tap="score">评分</li>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" @tap="openChildrenPage( '关于', 'about' )">关于</a>
      </li>
    </ul>

    <article class="order-add-cache fixedFull" v-show="flag">
      <header class="order-cache-header mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backNextPage"></a>
        <h2 class="mui-title">{{ this.title }}</h2>
      </header>

      <transition name="routerFade">
        <router-view class="order-add-top" keep-alive></router-view>
      </transition>
    </article>
  </article>
</template>

<script>
import mui from 'mui';
import storage from '../../common/js/localStorage.js';
import checkUpdate from '../../common/js/update.js';
import router from '../../router/index.js';

export default {
  name: 'setting',
  data() {
    return {
      title: '评分',
      flag: false,
      isShock: false,
      isUpdate: false,
    };
  },
  created() {
    this.$nextTick( () => {
      this.isShock = storage.get( 'shock' );
      this.isUpdate = storage.get( 'update' );

      mui( '.mui-switch' ).switch();

      // 开关
      mui( '#settingShock' )[ 0 ].addEventListener( 'toggle', ( event ) => {
        storage.set( 'shock', event.detail.isActive );
        this.isShock = event.detail.isActive;
      } );
      mui( '#settingUpdate' )[ 0 ].addEventListener( 'toggle', ( event ) => {
        storage.set( 'update', event.detail.isActive );
        this.update = event.detail.isActive;
      } );
    } );

    window.onhashchange = ( e ) => {
      if ( document.location.hash === '#/setting' ) {
        this.flag = false;
      }
    };
  },
  methods: {
    // 返回上一个页面
    backNextPage() {
      this.flag = false;
      // router.go( -1 );
      window.history.back();
      // router.go( -1 );
    },

    // 打开子页面
    openChildrenPage( name, path ) {
      this.title = name;
      this.flag = true;
      router.push( `/setting/${path}` );
    },

    // 检查更新
    checkUpdate() {
      checkUpdate( true );
    },

    // 评分
    score() {
      if ( window.plus ) {
        window.plus.runtime.openURL( 'market://details?id=com.sam.dreamSail', e => {
          window.plus.runtime.openURL( 'market://details?id=com.sam.dreamSail', e => {
            mui.alert( '软件不在应用市场中，暂时无法评分，感谢支持！', '警告', '确定', null );
          }, 'com.qihoo.appstore' );
        }, 'com.tencent.android.qqdownloader' );
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.setting {
  z-index: 88;
  background-color: #fff;
}
.order-add-top {
  margin-top: 44px;
  overflow: hidden;
  overflow-y: auto;
}
.mui-table-view {
  margin-top: 44px;

  .mui-table-view-cell {
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 16px;
  }
}
.mui-switch {
  width: 36px;
  height: 22px;

  .mui-switch-handle {
    width: 20px;
    height: 20px;
  }
}
</style>
