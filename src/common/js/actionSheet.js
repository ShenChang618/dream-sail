import mui from 'mui';

let plus = null;

export function actionSheetNative( title, buttons, fn ) {
  plus = window.plus;

  if ( plus ) {
    plus.nativeUI.actionSheet( {
      title,
      buttons,
      cancel: '取消',
    }, e => fn( e ) );
  }
};

export function actionSheetH5( name, fn, close ) {
  mui( name ).popover( 'show' );

  mui( '.mui-backdrop' )[ 0 ].addEventListener( 'tap', function ( e ) {
    close && close( e );
    remove();
  } );

  mui( '#actionSheet' ).on( 'tap', 'a', function ( e ) {
    fn && fn( e );

    remove();
    mui( '#actionSheet' ).popover( 'hide' );

    setTimeout( () => mui( '#actionSheet' ).off( 'tap' ), 0 );
  } );

  function remove() {
    try {
      mui( name )[ 0 ].parentNode.removeChild( mui( '.mui-backdrop' )[ 0 ] );
    } catch ( e ) {}
  }
}
