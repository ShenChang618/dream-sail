import mui from 'mui';
import getSingle from './getSingle.js';

let plus;

export default getSingle( screenOn );

function screenOn( fn ) {
  mui.plusReady( function () {
    // plus 会在 DOM 加载完毕后存在
    plus = window.plus;

    // 引入安卓
    const main = plus.android.runtimeMainActivity();
    const Intent = plus.android.importClass( 'android.content.Intent' );
    const IntentFilter = plus.android.importClass( 'android.content.IntentFilter' );
    // const Context = plus.android.importClass( 'android.content.Context' );

    // const PowerManager = plus.android.importClass( 'android.os.PowerManager' );
    const receiver = plus.android.implements( 'io.dcloud.android.content.BroadcastReceiver', {
      onReceive( context, intent ) {
        fn( context, intent );
      },
    } );

    // 广播接收
    const filter = new IntentFilter();

    filter.addAction( Intent.ACTION_SCREEN_ON );
    main.registerReceiver( receiver, filter );
  } );

  return true;
}
