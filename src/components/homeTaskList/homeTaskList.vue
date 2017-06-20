<template>
  <article class="home-task-list">
    <!-- <transition-group name="listFade" tag="ul" class="mui-table-view"> -->
    <ul class="mui-table-view">
      <li class="mui-table-view-cell" v-for="( item, index ) in homeUnfinishedList" :key="item" @tap="changeControlFlag">
        <i class="mui-media-object mui-pull-left home-item-icon iconfont" :class="`icon-${item.classify}`"></i>

        <section class="mui-media-body">
          <h3 class="home-item-title mui-ellipsis">{{ item.title }}</h3>
          <p class="mui-ellipsis">{{ item.task }}</p>
        </section>

        <div class="home-item-show">
          <strong class="home-item-taskTime normalfont mui-ellipsis">{{ switchTime( item.taskTime ) }}</strong>
          <span class="home-item-dreamGold numberfont mui-ellipsis">{{ item.dreamGold }}</span>
        </div>

        <div class="home-control" v-show="isShowHomeControl( item.state )">
          <button class="execute home-control-item" type="button" name="button" v-show="item.state === 0" @tap="execute( item, index )">执行</button>
          <button class="underway home-control-item" type="button" name="button" v-show="item.state === 1" @tap="execute( item, index )">继续</button>
          <span class="unfinished home-control-item" v-show="item.state === 2">已完成</span>
        </div>
      </li>
    </ul>
    <!-- </transition-group> -->

    <p class="not-task normalfont" v-show="homeUnfinishedList.length === 0">没有任务哦!</p>
  </article>
</template>

<script>
// import $ from 'jquery';
import mui from 'mui';
import { mapState } from 'vuex';
import minuteToHour from '../../common/js/minuteToHour.js';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';
import storage from '../../common/js/localStorage.js';
// import alarmClock from '../../common/js/alarmClock.js';
// import audioControl from '../../common/js/audioControl.js';
// import windowControl from '../../common/js/windowControl.js';

// let plus = null;

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );

const btnValue = [ '确定', '取消' ];
let globalTapCahce = null;

function executeUncertainTime( value, index ) {
  this.homeUncertainTimeBackdrop.flag = true;
  this.homeUncertainTimeBackdrop.index = index;
  Object.assign( this.homeUncertainTimeBackdrop.data, value );
}
function executeTimeless( value, index ) {
  mui.confirm( '是否确认任务已完成？', '提醒', btnValue, ( e ) => {
    if ( e.index === 0 ) {
      this.completeSave( value, index );
    }
  }, 'div' );
}
function executeNormalTask( value, index ) {
  this.homeBackdrop.flag = true;
  this.homeBackdrop.index = index;
  Object.assign( this.homeBackdrop.data, value );
}

export default {
  name: 'home-flag-list',
  data() {
    return {
      flag: false,
    };
  },
  computed: mapState( {
    homeUnfinishedList: state => state.homeUnfinishedList,
    homeUncertainTimeBackdrop: state => state.homeUncertainTimeBackdrop,
    homeUncertainTimeBackdropData: state => state.homeUncertainTimeBackdrop.data,
    homeUncertainTimeBackdropFlag: state => state.homeUncertainTimeBackdrop.flag,
    isHomeToday: state => state.isHomeToday,
    homeBackdrop: state => state.homeBackdrop,
  } ),
  methods: {
    // 增加金币
    addGold( value ) {
      const todayGold = storage.get( 'todayGold' );
      const totalGold = storage.get( 'totalGold' );

      storage.set( 'todayGold', todayGold + +value.dreamGold );
      storage.set( 'totalGold', totalGold + +value.dreamGold );
      this.$store.commit( 'changeTodayGold', storage.get( 'todayGold' ) );
    },

    // 完成保存到数据库
    completeSave( value, index ) {
      value.state = 2;
      value.completedDate += 1;
      value.continuityDate += 1;
      this.$set( this.homeUnfinishedList, index, value );

      this.addGold( value );

      dbTask.update( value );
    },

    // 显示按钮和信息
    changeControlFlag( event ) {
      if ( !this.isHomeToday ) {
        return;
      }

      try {
        const e = event.target.children[ 3 ];

        try {
          globalTapCahce.className = globalTapCahce.className.replace( / show/g, '' );
        } catch ( e ) {}
        globalTapCahce = e;
        e.className += ' show';
      } catch ( e ) {}
    },

    execute( item, index ) {
      if ( +item.taskTime === 0 ) {
        executeUncertainTime.call( this, item, index );
      } else if ( item.taskTime === '*' ) {
        executeTimeless.call( this, item );
      } else {
        executeNormalTask.call( this, item, index );
      }
    },

    continueExec( item ) {

    },

    // 点击任务判断
    isShowHomeControl( state ) {
      if ( this.isHomeToday ) {
        if ( state === 2 || state === 1 ) {
          return true;
        }
      }

      return false;
    },

    // 转换时间
    switchTime( value ) {
      if ( +value === 0 ) {
        return '不确定';
      }

      if ( value === '*' ) {
        return '无限制';
      }

      return minuteToHour( value );
    },
    //
    // // 点亮屏幕
    // lightUp() {
    //   // const main = plus.android.runtimeMainActivity();
    //   // const Context = plus.android.importClass( 'android.content.Context' );
    //   // const power = main.getSystemService( Context.POWER_SERVICE );
    //   const PowerManager = plus.android.importClass( 'android.os.PowerManager' );
    //   const powerManager = new PowerManager();
    //
    //   // console.log( Context.POWER_SERVICE );
    //   console.log( powerManager );
    //   const wakeLock = powerManager.newWakeLock( powerManager.ACQUIRE_CAUSES_WAKEUP | powerManager.SCREEN_DIM_WAKE_LOCK, 'lightUp' );
    //
    //   console.log( wakeLock );
    //   wakeLock.acquire();
    // },
  },
  // components: {
  //   'v-calendar': Calendar,
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.listFade-enter-active, .listFade-leave-active {
  transition: all 1s;
}
.listFade-enter, .listFade-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.mui-table-view-cell::before {
  content: '';
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  height: 100%;
}
.mui-media-body {
  padding-left: 10px;
  line-height: 33px;
}
.task-gold {
  display: inline-block;
  margin: 0 10px;
  font-size: 1rem;
}
.task-title {
  font-size: 1rem;
  line-height: 23px;
}
.alarm-show {
  position: fixed;
  z-index: 10000;
  top: 0;
  right: 0;
  bottom: 50px;
  left: 0;
  box-sizing: content-box;
  background: #333;
  -webkit-overflow-scrolling: touch;
}
.home-item-icon {
  width: 55px;
  height: 55px;
  margin-top: 11px;
  margin-right: 15px !important;
  font-size: 55px;
}
.home-item-title {
  font-family: normalfont;
}
.home-task-list {
  position: fixed;
  top: 280px;
  right: 0;
  bottom: 50px;
  left: 0;
  overflow-y: auto;
}
.mui-media-body {
  padding-right: 75px;
}
.home-item-show {
  position: absolute;
  top: 12px;
  right: 15px;
  bottom: 18px;
  width: 75px;

  .home-item-dreamGold,
  .home-item-taskTime {
    display: block;
    height: 50%;
    line-height: 30px;
    text-align: center;
  }
  .home-item-dreamGold {
    font-size: 20px;
    font-weight: 700;
    line-height: 35px;
    letter-spacing: 4px;
    color: #f0ad4e;
    border-top: 1px solid #c8c7cc;
  }
  .home-item-taskTime {
    color: #007aff;
  }
}
.home-control {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: none;

  .home-control-item {
    box-sizing: content-box;
    display: block;
    width: 100%;
    height: 40px;
    padding: 24px 0;
    line-height: 40px;
    font-family: normalfont;
    font-size: 32px;
    color: #fff;
    background-color: rgba( 0, 0, 0, .6 );
    border: 0 none;
    border-radius: 0;
  }

  .underway {
    color: #007aff;
  }
  .unfinished {
    color: #dd504b;
  }
}
.show {
  display: block !important;
}
</style>
