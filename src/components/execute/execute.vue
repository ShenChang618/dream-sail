<template>
  <div class="execute">
    <button class="mui-btn mui-btn-primary mui-pull-right" type="button" name="button" @click="setAlarmClock">执行</button>

    <div class="alarm-show" v-show="flag">
      <button class="mui-btn mui-btn-primary mui-btn-block" type="button" name="button" @click="cancelAlarmClock">取消</button>
    </div>
  </div>
</template>

<script>
import mui from 'mui';
import audioControl from '../../common/js/audioControl.js';
import windowControl from '../../common/js/windowControl.js';

// let plus = null;
// let flagCancelCurrent = null;

export default {
  name: 'execute',
  props: {
    taskItem: {
      type: Object,
    },
  },
  data() {
    return {
      // flag: false,
    };
  },
  // created() {
  //   // plus 会在 DOM 加载完毕后存在
  //   plus = window.plus;
  // },
  // methods: {
  //   // 设置闹钟
  //   setAlarmClock( event ) {
  //     this.flag = true;
  //     console.log( this.flag );
  //
  //     if ( plus ) {
  //       const main = plus.android.runtimeMainActivity();
  //       // const _self = this;
  //
  //       // 到点回调执行任务
  //       const receiver = plus.android.implements( 'io.dcloud.android.content.BroadcastReceiver', {
  //         onReceive( context, intent ) {
  //           plus.android.importClass( intent );
  //           // console.log( intent.getAction() );
  //           plus.push.createMessage( intent.getAction(), 'alarm', { title: '闹铃提醒' } );
  //
  //           audioControl.play( function () {
  //             console.log( '播放音乐' );
  //           } );
  //           windowControl.show();
  //
  //           main.unregisterReceiver( receiver );
  //         },
  //       } );
  //
  //       // 注册监听
  //       const IntentFilter = plus.android.importClass( 'android.content.IntentFilter' );
  //       const filter = new IntentFilter( ALARM_RECEIVER );
  //
  //       main.registerReceiver( receiver, filter );
  //
  //       // 设置时间
  //       const Calendar = plus.android.importClass( 'java.util.Calendar' );
  //       const calendar = Calendar.getInstance();
  //       calendar.setTimeInMillis( Date.parse( new Date() ) );
  //       // calendar.set( Calendar.HOUR_OF_DAY, 9 );
  //       // calendar.set( Calendar.MINUTE, 10 );
  //       // calendar.set( Calendar.SECOND, 0 );
  //       calendar.add( Calendar.SECOND, 30 );
  //
  //       // 设置闹钟
  //       const Intent = plus.android.importClass( 'android.content.Intent' );
  //       const intent = new Intent( ALARM_RECEIVER );
  //       const PendingIntent = plus.android.importClass( 'android.app.PendingIntent' );
  //       // PendingIntent.FLAG_UPDATE_CURRENT
  //       // console.log( PendingIntent.FLAG_UPDATE_CURRENT );
  //       const sender = PendingIntent.getBroadcast( main, 0, intent, flagCancelCurrent = PendingIntent.FLAG_CANCEL_CURRENT );
  //       const AlarmManager = plus.android.importClass( 'android.app.AlarmManager' );
  //       const Context = plus.android.importClass( 'android.content.Context' );
  //       const alarm = main.getSystemService( Context.ALARM_SERVICE );
  //
  //       alarm.set( AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), sender );
  //       mui.toast( '闹钟设置成功' );
  //     }
  //   },
  //
  //   // 关闭闹钟
  //   cancelAlarmClock() {
  //     this.flag = false;
  //
  //     if ( plus ) {
  //       const main = plus.android.runtimeMainActivity();
  //       const Intent = plus.android.importClass( 'android.content.Intent' );
  //       const intent = new Intent( ALARM_RECEIVER );
  //       const PendingIntent = plus.android.importClass( 'android.app.PendingIntent' );
  //       const sender = PendingIntent.getBroadcast( main, 0, intent, flagCancelCurrent );
  //       const Context = plus.android.importClass( 'android.content.Context' );
  //       const alarm = main.getSystemService( Context.ALARM_SERVICE );
  //
  //       alarm.cancel( sender );
  //     }
  //   },
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mui-btn {
  border-radius: 0;
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
</style>
