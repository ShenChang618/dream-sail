<template>
  <article class="home-backdrop" v-show="homeBackdropFlag">
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

    <h3 class="home-backdrop-title normalfont">{{ homeBackdropData.title }}</h3>
    <p class="home-backdrop-text home-backdrop-task">{{ homeBackdropData.task }}</p>

    <strong class="home-backdrop-text home-backdrop-dreamGold numberfont"> {{ homeBackdropData.dreamGold }} </strong>

    <div class="home-backdrop-info">
      <p class="home-backdrop-text home-backdrop-tempCount">剩余执行 {{ residueCount < 0 ? 0 : residueCount }} 次</p>
      <p class="home-backdrop-text home-backdrop-time">总共 {{ switchTime( homeBackdropData.taskTime ) }} / {{ switchTime( homeBackdropData.execTime ) }} 每次</p>
    </div>

    <div class="home-backdrop-bottom">
      <button class="home-backdrop-btn home-backdrop-cancel mui-btn-danger" type="button" name="button" @tap="clickCancel" v-show="flag.cancel">取消</button>
      <button class="home-backdrop-btn home-backdrop-pause mui-btn-primary" type="button" name="button" @tap="pauseAlarmClock" v-show="flag.pause">暂停</button>
      <button class="home-backdrop-btn home-backdrop-exec mui-btn-primary" type="button" name="button" @tap="clickExec" v-show="flag.exec">执行</button>
      <button class="home-backdrop-btn home-backdrop-rest mui-btn-primary" type="button" name="button" @tap="clickRest" v-show="flag.rest">休息</button>
      <button class="home-backdrop-btn home-backdrop-complete mui-btn-primary" type="button" name="button" @tap="clickComplete" v-show="flag.complete">完成</button>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import minuteToHour from '../../common/js/minuteToHour.js';
// import addLeftZero from '../../common/js/addLeftZero.js';
import setCountDown from '../../common/js/setCountDown.js';
import alarmClock from '../../common/js/alarmClock.js';
import storage from '../../common/js/localStorage.js';
import audioControl from '../../common/js/audioControl.js';
import Database from '../../common/js/indexedDB.js';
// import router from '../../router';
import { database } from '../../common/js/data.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const btnValue = [ '确定', '取消' ];
// let plus = null;
let resultInstance = null;
let resultInstanceAudio = null;

export default {
  name: 'home-backdrop',
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
      title: '执行',
      residueCount: 0,
      flag: {
        cancel: true,
        pause: true,
        exec: false,
        rest: false,
        complete: false,
      },
      isPause: false,
      pauseTime: null,
    };
  },
  computed: mapState( {
    homeBackdrop: state => state.homeBackdrop,
    homeBackdropData: state => state.homeBackdrop.data,
    homeBackdropFlag: state => state.homeBackdrop.flag,
    homeUnfinishedList: state => state.homeUnfinishedList,
    todayGold: state => state.todayGold,
    totalGold: state => state.totalGold,
  } ),
  watch: {
    homeBackdropFlag( newValue ) {
      if ( this.homeBackdropFlag === true ) {
        this.isPause = false;
        this.clickExec();
      }
    },
  },
  created() {
    // mui.plusReady( function () {
    //   plus = window.plus;

      // plus.push.addEventListener( 'click', function ( msg ) {
      //   plus.ui.alert( msg.content );
      // }，  );
    // } );
  },
  methods: {
    // 暂停闹钟
    pauseAlarmClock() {
      // // 第一步，清除计时器
      // clearInterval( resultInstance );
      //
      // // 第二步，清除闹钟
      // alarmClock.cancelAlarmClock();

      this.title = '暂停';

      this.cancelAlarmClock();

      // 第三步，重新设置时间
      this.isPause = true;
      // 0.008 是为了修正暂停后，再执行会直接减少两秒的无奈之举
      this.pauseTime = parseInt( +this.hour, 10 ) * 60 + parseInt( +this.minute ) + +this.second / 60 + 0.008;

      this.clearAllFlag();
      this.flag.cancel = true;
      this.flag.exec = true;
    },

    // 剩余次数
    // calResidueCount( count ) {
    //   if ( count === this.homeBackdropData.execCount ) {
    //     return count - 1;
    //   }
    //
    //   return count;
    // },

    // 清除所有 flag
    clearAllFlag() {
      for ( let key in this.flag ) {
        this.flag[ key ] = false;
      }
    },

    // 设置倒计时函数
    setTime( time, fn ) {
      const timeResult = minuteToHour( time, true );
      const tempSecond = ( timeResult.hour * 60 + timeResult.minute ) * 60;
      const reviseSecond = tempSecond < 1 ? 0 : tempSecond - 1;
      const nextTime = +new Date() + tempSecond * 1000;

      timeResult.second = parseInt( reviseSecond % 60, 10 );
      timeResult.minute = parseInt( reviseSecond / 60 % 60 );
      this.setAlarmClock( timeResult );

      resultInstance = setCountDown( nextTime, ( value, result ) => {
        this.hour = value.hours < 0 ? '00' : value.hours;
        this.minute = value.minutes < 0 ? '00' : value.minutes;
        this.second = value.seconds < 0 ? '00' : value.seconds;
      }, fn );
    },

    // 增加金币
    addGold() {
      const todayGold = storage.get( 'todayGold' );
      const totalGold = storage.get( 'totalGold' );
      const homeBackdropData = this.homeBackdropData;

      storage.set( 'todayGold', todayGold + +homeBackdropData.dreamGold );
      storage.set( 'totalGold', totalGold + +homeBackdropData.dreamGold );
      this.$store.commit( 'changeTodayGold', storage.get( 'todayGold' ) );
    },

    // 完成保存到数据库
    completeSave() {
      const homeBackdropData = this.homeBackdropData;

      homeBackdropData.state = 2;
      homeBackdropData.completedDate += 1;
      homeBackdropData.continuityDate += 1;

      this.addGold();
      this.saveToDB();
    },

    // 保存到数据库
    saveToDB() {
      const homeBackdropData = this.homeBackdropData;

      this.$set( this.homeUnfinishedList, this.homeBackdrop.index, homeBackdropData );
      dbTask.update( homeBackdropData );
    },

    // 完成
    clickComplete() {
      this.cancelAlarmClock();
      setTimeout( () => this.$store.commit( 'changeHomeBackdropFlag', false ), 100 );
    },

    // 执行
    clickExec() {
      const homeBackdropData = this.homeBackdropData;
      let tempTime = homeBackdropData.execTime;
      let tempCount = homeBackdropData.tempCount;

      this.cancelAlarmClock();
      // alarmClock.cancelAlarmClock();

      if ( this.isPause === true ) {
        this.isPause = false;

        tempTime = this.pauseTime;
      } else {
        this.residueCount = tempCount - 1;
      }

      this.title = '执行';

      this.clearAllFlag();
      this.flag.cancel = true;
      this.flag.pause = true;

      // console.log( tempCount );
      // 函数为执行完毕之后运行
      this.setTime( tempTime, () => {
        this.clearAllFlag();

        tempCount -= 1;
        homeBackdropData.tempCount = tempCount;

        // console.log( tempCount );
        // 执行次数为 0，或者执行时间为 0，这样就表示没有休息时间，直接运行后显示完成按钮
        if ( tempCount <= 0 ) {
          if ( +homeBackdropData.restTime === 0 ) {
            this.flag.complete = true;
          } else {
            this.flag.rest = true;
          }

          this.completeSave();
        } else {
          if ( +homeBackdropData.restTime === 0 ) {
            this.flag.exec = true;
          } else {
            this.flag.rest = true;
          }

          homeBackdropData.state = 1;
          this.saveToDB();
        }
      } );
    },

    // 休息
    clickRest() {
      const homeBackdropData = this.homeBackdropData;
      const restTime = +homeBackdropData.restTime;
      const tempCount = homeBackdropData.tempCount;

      this.title = '休息';

      this.clearAllFlag();
      this.flag.cancel = true;

      if ( tempCount <= 0 ) {
        this.flag.complete = true;
        // this.completeSave();
        // this.addGold();
      } else {
        this.flag.exec = true;
      }

      this.cancelAlarmClock();
      this.setTime( restTime, () => {
        this.clearAllFlag();

        if ( tempCount <= 0 ) {
          this.flag.complete = true;
        } else {
          this.flag.exec = true;
        }
      } );
    },

    // 输出正确时间
    switchTime( value ) {
      return minuteToHour( value );
    },

    // 关闭音乐
    cancelAudio() {
      audioControl.stop();
      clearInterval( resultInstance );
      clearInterval( resultInstanceAudio );
    },

    // 关闭
    cancelAlarmClock() {
      this.cancelAudio();
      alarmClock.cancelAlarmClock();
    },

    // 闹钟
    setAlarmClock( opt ) {
      alarmClock.setAlarmClock( opt, () => {
        // plus.push.createMessage( '时间到啦，快打开应用查看吧！', '时间到啦，快打开应用查看吧！', {
        //   title: '梦想启航',
        //   cover: true,
        //   when: new Date(),
        // } );

        // 重新清零，不然会出现响铃但是秒数不正确的情况
        this.hour = this.minute = this.second = '00';

        // _self.lightUp();
        function loopPlay() {
          console.log( '循环' );
          audioControl.play( function () {
            console.log( '完成一次' );
            loopPlay();
          } );
        }
        loopPlay();

        // 设置闹钟为 10 分钟
        const tempSecond = 10 * 60;
        const nextTime = +new Date() + tempSecond * 1000;
        const fn = storage.get( 'shock' ) === true ? () => window.plus.device.vibrate() : null;

        resultInstanceAudio = setCountDown( nextTime, fn, () => {
          console.log( '彻底完成' );
          this.cancelAlarmClock();
        } );
      } );
    },

    // 关闭闹钟
    clickCancel() {
      mui.confirm( '是否取消，<strong style="color:#f00;">不会保存</strong> 执行时间！', '警告', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          // const homeBackdropData = this.homeBackdropData;
          //
          // // 在没来的急点击取消却已完成，原先会有 BUG，不变成完成状态
          // if ( homeBackdropData.tempCount <= 0 && homeBackdropData.state === 2 ) {
          //   // this.addGold();
          //   this.completeSave();
          // }

          this.cancelAlarmClock();
          this.$store.commit( 'changeHomeBackdropFlag', false );
        }
      }, 'div' );
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
