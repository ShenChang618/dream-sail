import mui from 'mui';

const ALARM_RECEIVER = 'alarm_receiver';
let plus, main, Intent, PendingIntent, Context, sender, alarm, receiver;

mui.plusReady( function () {
  plus = window.plus;
} );

// 设置闹钟
const setAlarmClock = function ( opt, fn ) {
  if ( plus ) {
    main = plus.android.runtimeMainActivity();

    const Calendar = plus.android.importClass( 'java.util.Calendar' );
    const calendar = Calendar.getInstance();
    const IntentFilter = plus.android.importClass( 'android.content.IntentFilter' );
    const filter = new IntentFilter( ALARM_RECEIVER );
    const AlarmManager = plus.android.importClass( 'android.app.AlarmManager' );
    // const _self = this;

    // 到点回调执行任务
    receiver = plus.android.implements( 'io.dcloud.android.content.BroadcastReceiver', {
      onReceive( context, intent ) {
        fn( intent );

        main.unregisterReceiver( receiver );
      },
    } );

    // 注册监听
    main.registerReceiver( receiver, filter );

    // 设置时间
    calendar.setTimeInMillis( Date.parse( new Date() ) );
    // calendar.set( Calendar.HOUR_OF_DAY, 9 );
    // calendar.set( Calendar.MINUTE, 10 );
    // calendar.set( Calendar.SECOND, 0 );
    calendar.add( Calendar.HOUR_OF_DAY, opt.hour );
    calendar.add( Calendar.MINUTE, opt.minute );
    calendar.add( Calendar.SECOND, opt.second );

    // 设置闹钟
    Intent = plus.android.importClass( 'android.content.Intent' );

    const intent = new Intent( ALARM_RECEIVER );

    PendingIntent = plus.android.importClass( 'android.app.PendingIntent' );
    sender = PendingIntent.getBroadcast( main, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT );
    Context = plus.android.importClass( 'android.content.Context' );
    alarm = main.getSystemService( Context.ALARM_SERVICE );

    alarm.set( AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), sender );
    // mui.toast( '闹钟设置成功' );
  }
};

// 关闭闹钟
const cancelAlarmClock = function ( fn ) {
  if ( plus ) {
    if ( alarm === undefined ) {
      return;
    }

    alarm.cancel( sender );
    // 要对应取消注册，不然会多次监听广播
    main.unregisterReceiver( receiver );
    fn && fn();
  }
};

export default {
  setAlarmClock: setAlarmClock,
  cancelAlarmClock: cancelAlarmClock,
};
