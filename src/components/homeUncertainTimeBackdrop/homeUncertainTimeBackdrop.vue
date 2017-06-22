<template>
  <article class="home-backdrop" v-show="homeUncertainTimeBackdropFlag">
    <section class="home-time">
      <h2 class="home-time-title">{{ title }}</h2>
      <div class="home-time-show">
        <span class="home-time-hour">{{ hour }}</span>
        <span class="home-time-colon">:</span>
        <span class="home-time-minute">{{ minute }}</span>
        <span class="home-time-colon">:</span>
        <span class="home-time-second">{{ second }}</span>
      </div>
    </section>

    <h3 class="home-backdrop-title normalfont">{{ homeUncertainTimeBackdropData.title }}</h3>
    <p class="home-backdrop-text home-backdrop-task">{{ homeUncertainTimeBackdropData.task }}</p>

    <strong class="home-backdrop-text home-backdrop-dreamGold numberfont"> {{ gold }} </strong>

    <!-- <div class="home-backdrop-info">
      <p class="home-backdrop-text home-backdrop-tempCount">剩余执行 {{ residueCount }} 次</p>
      <p class="home-backdrop-text home-backdrop-time">总共 {{ switchTime( homeBackdropData.taskTime ) }} / {{ switchTime( homeBackdropData.execTime ) }} 每次</p>
    </div> -->

    <div class="home-backdrop-bottom">
      <button class="home-backdrop-btn home-backdrop-cancel mui-btn-danger" type="button" name="button" @tap="cancel">取消</button>
      <button class="home-backdrop-btn home-backdrop-complete mui-btn-primary" type="button" name="button" @tap="clickComplete">完成</button>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import addLeftZero from '../../common/js/addLeftZero.js';
// import minuteToHour from '../../common/js/minuteToHour.js';
import storage from '../../common/js/localStorage.js';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const btnValue = [ '确定', '取消' ];
let resultInstance = null;

export default {
  name: 'home-home-uncertain-time-backdrop',
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
      title: '执行',
      gold: 0,
    };
  },
  computed: mapState( {
    homeUncertainTimeBackdrop: state => state.homeUncertainTimeBackdrop,
    homeUncertainTimeBackdropData: state => state.homeUncertainTimeBackdrop.data,
    homeUncertainTimeBackdropFlag: state => state.homeUncertainTimeBackdrop.flag,
    homeUnfinishedList: state => state.homeUnfinishedList,
    todayGold: state => state.todayGold,
    totalGold: state => state.totalGold,
  } ),
  watch: {
    homeUncertainTimeBackdropFlag( newValue ) {
      if ( this.homeUncertainTimeBackdropFlag === true ) {
        this.gold = 0;
        this.hour = '00';
        this.minute = '00';
        this.second = '00';
        this.addTime();
      }
    },
  },
  methods: {
    // 增加
    addTime() {
      const nowDate = new Date();

      clearInterval( resultInstance );
      resultInstance = setInterval( () => {
        const diffTime = new Date() - nowDate;
        const minuteTotal = ( diffTime / 1000 ) / 60;

        this.hour = addLeftZero( parseInt( diffTime / 1000 / 60 / 60 % 24, 10 ) );
        this.minute = addLeftZero( parseInt( diffTime / 1000 / 60 % 60, 10 ) );
        this.second = addLeftZero( parseInt( diffTime / 1000 % 60, 10 ) );

        this.gold = parseInt( minuteTotal, 10 );

        if ( +this.hour === 24 && +this.minute === 0 ) {
          mui.alert( '已超过一整天时间，任务失败！', '警告', '确定', ( e ) => {
            this.stopCountDown();
          }, 'div' );
        }
      }, 1000 );
    },

    // 关闭
    cancel() {
      mui.confirm( '是否取消，<strong style="color:#f00;">不会保存</strong> 执行时间！', '警告', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          this.stopCountDown();
        }
      }, 'div' );
    },

    // 完成
    clickComplete() {
      mui.confirm( `是否确定 <strong style="color:#f00;">完成任务</strong>，已获得 ${this.gold}金币！`, '警告', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          this.completeSave();
          this.stopCountDown();
        }
      }, 'div' );
    },

    // 停止计时器
    stopCountDown() {
      clearInterval( resultInstance );
      setTimeout( () => this.$store.commit( 'changehomeUncertainTimeBackdropFlag', false ), 100 );
    },

    // 增加金币
    addGold() {
      const todayGold = storage.get( 'todayGold' );
      const totalGold = storage.get( 'totalGold' );

      storage.set( 'todayGold', todayGold + this.gold );
      storage.set( 'totalGold', totalGold + this.gold );

      this.$store.commit( 'changeTodayGold', storage.get( 'todayGold' ) );
    },

    // 完成保存到数据库
    completeSave() {
      const homeUncertainTimeBackdropData = this.homeUncertainTimeBackdropData;

      homeUncertainTimeBackdropData.state = 2;
      homeUncertainTimeBackdropData.dreamGold = this.gold;
      homeUncertainTimeBackdropData.completedDate += 1;
      homeUncertainTimeBackdropData.continuityDate += 1;
      this.$set( this.homeUnfinishedList, this.homeUncertainTimeBackdrop.index, homeUncertainTimeBackdropData );

      this.addGold();

      dbTask.update( homeUncertainTimeBackdropData );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home-backdrop {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #fff;
  background-color: #3b3b3b;
}
.home-time {
  width: 180px;
  height: 180px;
  margin: 30px auto;
  border: 2px solid #fff;
  border-radius: 50%;
}
.home-time-title {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 34px;
  font-weight: 400;
}
.home-time-hour,
.home-time-minute,
.home-time-second,
.home-time-colon {
  display: inline-block;
  vertical-align: top;
  font-size: 30px;
  line-height: 30px;
}
.home-time,
.home-backdrop-title,
.home-backdrop-text {
  text-align: center;
  color: #fff;
}
.home-backdrop-title,
.home-backdrop-text {
  padding: 0 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-backdrop-title {
  margin-bottom: 10px;
  font-size: 30px;
}
.home-time-colon {
  line-height: 26px;
}
.home-backdrop-info {
  position: absolute;
  bottom: 100px;
  width: 100%;
}
.home-backdrop-time {
  font-size: 12px;
}
.home-backdrop-tempCount {
  font-size: 18px;
}
.home-backdrop-dreamGold {
  display: block;
  margin-top: 10px;
  font-size: 40px;
  line-height: 80px;
  letter-spacing: 12px;
  color: #f0ad4e;
}
.home-backdrop-bottom {
  position: absolute;
  right: 10%;
  bottom: 25px;
  left: 10%;
  display: flex;
  justify-content: center;

  .home-backdrop-btn {
    flex: 1 0 auto;
    padding: 10px;
    font-size: 18px;
    border: 0 none;
    border-radius: 0;
    box-shadow: 0 0 1px #fff;
  }
  // .home-backdrop-cancel {
  //   border-top-left-radius: 3px;
  //   border-bottom-left-radius: 3px;
  // }
  // .home-backdrop-pause {
  //   border-top-right-radius: 3px;
  //   border-bottom-right-radius: 3px;
  // }
}
</style>
