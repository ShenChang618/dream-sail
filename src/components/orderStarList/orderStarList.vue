<template>
  <div class="mui-slider-item mui-control-content order-star-list" data-switch="Star">
    <ul class="mui-table-view" v-show="starList.length > 0">
      <li class="mui-table-view-cell" v-for="( item, index ) in starList" @tap="changeControlFlag">
        <h3 class="title mui-pull-left mui-ellipsis normalfont">{{ item.title }}</h3>
        <strong class="gold mui-pull-right mui-ellipsis numberfont">{{ item.gold }}</strong>

        <div class="order-star-control normalfont" v-show="false">
          <button class="star-control-item cancel" type="button" name="button" @tap="controlDelete( item )">删除</button>
          <button class="star-control-item complete" type="button" name="button" @tap="controlComplete( item )">完成</button>
        </div>
      </li>
    </ul>
    <p class="not-task normalfont" v-show="starList.length === 0">没有奖励哦!</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import Database from '../../common/js/indexedDB.js';
import { database, today } from '../../common/js/data.js';
import storage from '../../common/js/localStorage.js';

const dbStar = new Database( {
  name: database.DB_STAR_NAME,
  objectStore: database.DB_OBJECT_STORE_STAR,
} );
const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );
const btnValue = [ '确定', '取消' ];
let globalTapCahce = null;

export default {
  name: 'order-star-list',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: mapState( {
    starList: state => state.starList,
    totalGold: state => state.totalGold,
    isBuyPage: state => state.isBuyPage,
  } ),
  created() {
    this.$nextTick( () => {
      // 任务列表输出
      // const keyRange = IDBKeyRange.only( '2017-6-7-*' );

      this.changeList();
    } );
  },
  methods: {
    // 改变 DOM
    changeList() {
      if ( this.isBuyPage === true ) {
        // 小于总金币，可以获得奖励
        const range = IDBKeyRange.upperBound( this.totalGold, false );

        dbStar.query( 'index', 'gold', { range, direction: 'prev' }, data => {
          this.$store.commit( 'changeStarList', data );
        } );
      } else {
        dbStar.query( null, ( data ) => {
          this.$store.commit( 'changeStarList', data );
        }, { direction: 'prev' } );
      }
    },

    // 删除
    controlDelete( item ) {
      mui.confirm( '是否确认<span style="color:#f00;"> 删除 </span>这个奖励？', '警告', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          dbStar.delete( item.id );
          this.changeList();
        }
      }, 'div' );
    },

    // 完成
    controlComplete( item ) {
      mui.confirm( '是否确认<span style="color:#f00;"> 获得 </span>这个奖励？', '提醒', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          const totalGold = storage.get( 'totalGold' );
          const gold = item.gold;

          if ( gold > totalGold ) {
            mui.alert( `梦想金币不足，还差 <strong style="color:#f00;">${gold - totalGold}</strong>，快去努力吧！`, '提醒', '确定', null, 'div' );
            return;
          }

          storage.set( 'totalGold', totalGold - gold );
          this.$store.commit( 'changeTotalGold', storage.get( 'totalGold' ) );
          dbStar.delete( item.id );
          this.changeList();

          const historyStarData = {
            type: '奖励',
            date: today,
            gold: gold,
            value: item.title,
          };

          dbHistory.insert( historyStarData );
        }
      }, 'div' );
    },

    // 显示按钮和信息
    changeControlFlag( event ) {
      try {
        const e = event.target.children[ 2 ];

        try {
          globalTapCahce.className = globalTapCahce.className.replace( / show/g, '' );
        } catch ( e ) {}
        globalTapCahce = e;
        e.className += ' show';
      } catch ( e ) {}
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.order-star-control {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 1px;
  left: 0;
  display: flex;
  overflow: hidden;
  background: none;

  .cancel,
  .complete {
    flex: 1 1 auto;
    height: 100%;
    font-size: 30px;
    color: #fff;
    border: 0 none;
    border-radius: 0;
  }
  .cancel {
    background-color: rgba( 221, 82, 77, .8 );
  }
  .complete {
    background-color: rgba( 0, 122, 255, .8 );
  }
}
.mui-table-view-cell {
  background-color: #fff !important;

  .title,
  .gold {
    width: 50%;
  }
  .title {
    margin: 0;
    font-size: 24px;
    line-height: 40px;
  }
  .gold {
    display: block;
    height: 40px;
    text-align: right;
    line-height: 48px;
    letter-spacing: 4px;
    color: #f0ad4e;
  }
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
.show {
  display: flex !important;
}
.not-task {
  top: 34px;
}
</style>
