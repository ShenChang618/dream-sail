<template>
  <article class="order" id="orderTarget">
    <header class="mui-bar mui-bar-nav">
      <button class="order-header-btn mui-icon iconfont icon-lishi4 mui-pull-left" type="button" name="button" @click="switchHistory"></button>
      <h1 class="mui-title">制定</h1>
      <button class="order-header-btn iconfont icon-jia1 mui-pull-right" type="button" name="button" @click="switchOrder"></button>
    </header>

    <article class="order-content" id="orderContentTarget">
      <div class="order-banner" :class="`order-banner-${banner}`">
        <p class="order-banner-inner">
          <strong class="order-banner-number numberfont">{{ totalGold }}</strong>
          <span class="order-banner-img">梦想金币</span>
        </p>
      </div>

      <div class="mui-slider" id="orderSlider">
        <div class="order-slider mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
            <a class="mui-control-item mui-active" href="#item1Mobile" data-switch="Task" @tap="active">任务</a>
            <a class="mui-control-item" href="#item2Mobile" data-switch="Star" @tap="active">奖励</a>
        </div>

        <div class="mui-slider-progress-bar mui-col-xs-6" id="orderSliderProgressBar"></div>

        <div class="order-slider-list mui-slider-group" id="orderSliderGroup">
          <v-order-task-list id="item1Mobile"></v-order-task-list>
          <v-order-star-list id="item2Mobile"></v-order-star-list>
        </div>
      </div>
    </article>

    <transition name="routerFade">
      <router-view class="order-add fixedFull" keep-alive></router-view>
    </transition>

    <div class="mui-popover" id="switchExecDatePopover">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell" v-for="item in orderTaskDateList">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import OrderTaskList from '../../components/orderTaskList/orderTaskList';
import OrderStarList from '../../components/orderStarList/orderStarList';
import mui from 'mui';
// import reverse from '../../common/js/reverse.js';
// import minuteToHour from '../../common/js/minuteToHour.js';
// import Database from '../../common/js/indexedDB.js';
// import { getSwitchId, switchExecDateArray } from '../../common/js/switchExecDate.js';
// import { database } from '../../common/js/data.js';
import router from '../../router/index.js';
import storage from '../../common/js/localStorage.js';

// const db = new Database( {
//   name: database.DB_NAME,
//   objectStore: database.DB_OBJECT_STORE_TASK,
// } );

export default {
  name: 'order',
  data() {
    return {
      switch: 'Task',
      banner: storage.get( 'background' ),
    };
  },
  computed: mapState( {
    totalGold: state => state.totalGold,
    orderTaskDateList: state => state.orderTaskDateList,
  } ),
  created() {
    this.$nextTick( () => {
      this.$store.commit( 'changeTotalGold', storage.get( 'totalGold' ) );
      this.$store.commit( 'changeIsBuyPage', false );

      mui( '.mui-slider' ).slider();
      // 监听滚动
      mui( '#orderContentTarget' )[ 0 ].addEventListener( 'scroll', ( e ) => {
        // 测算出滚动距离
        // const top = Math.abs( parseInt( e.target.style.transform.split( ',' )[ 1 ] );
        const orderContent = mui( '#orderContentTarget' )[ 0 ];
        const sliderItems = mui( '.mui-slider-item' );

        // 当前列表
        setTimeout( () => {
          try {
            e.target.childNodes.forEach( ( value ) => {
              const className = value.className || '';

              if ( className.indexOf( 'mui-active' ) !== -1 ) {
                this.switch = value.dataset.switch;
              }
            } );
          } catch ( e ) {}
        }, 600 );

        // 滚动
        if ( orderContent.scrollTop >= 168 ) {
          if ( sliderItems[ 0 ].style.overflowY !== 'auto' ) {
            sliderItems.each( function ( index, value ) {
              value.style.overflowY = 'auto';
            } );
          }
        } else if ( orderContent.scrollTop >= 0 && orderContent.scrollTop < 168 ) {
          if ( sliderItems[ 0 ].style.overflowY !== 'hidden' ) {
            sliderItems.each( function ( index, value ) {
              value.style.overflowY = 'hidden';
            } );
          }
        }
      } );
    } );
  },
  methods: {
    // 增加
    switchOrder() {
      router.push( `/order/order${this.switch}` );
    },

    // 历史页
    switchHistory() {
      router.push( `/order/history` );
    },

    // 点击
    active( e ) {
      this.switch = e.target.dataset.switch;
    },
  },
  components: {
    'v-order-task-list': OrderTaskList,
    'v-order-star-list': OrderStarList,
  },
};
</script>

<style lang="scss" scoped>
.order {
  position: relative;
  z-index: 12;
}
.order-header-btn {
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 36px;
  border: 0 none;
  background: none;
}
.mui-title,
.order-header-btn {
  color: #333;
}
.mui-title {
  line-height: 46px;
}

.order-banner {
  display: table;
  width: 100%;
  height: 168px;
  // margin-bottom: 10px;
}
.order-banner-inner {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  background-color: rgba( 0, 0, 0, .1 );
}
.order-banner-number,
.order-banner-text {
  display: block;
}
.order-banner-number {
  position: relative;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 3rem;
  letter-spacing: 8px;
  color: #fff;
}
.order-banner-img {
  height: 48px;
  padding: 6px 16px;
  font-family: normalfont;
  font-size: 32px;
  color: #f0ad4e;
  border-top: 2px solid #f0ad4e;
  background-color: rgba( 255, 255, 255, .3 );
}
.order-content {
  position: fixed;
  z-index: 2;
  top: 44px;
  right: 0;
  bottom: 50px;
  left: 0;
  overflow-y: auto;
}
.order-slider {
  background-color: #fff;
}
.mui-slider {
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.icon-lishi4 {
  padding-top: 10px;
  padding-bottom: 8px;
  font-size: 26px;
  color: #444;
}
.icon-jia1 {
  padding-top: 11px;
  padding-bottom: 8px;
  padding-left: 13px;
  margin-right: -10px;
  font-size: 18px;
}
// 删除列表不会动
.order-slider-list {
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;

  .mui-table-view::after {
    height: 1px !important;
  }
}
.order-add {
  overflow-y: auto;
}
.mui-popover {
  .mui-table-view-cell {
    text-align: center;
  }
}
</style>
