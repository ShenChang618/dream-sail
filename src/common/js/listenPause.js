import getSingle from './getSingle.js';

// 监听后台
export default getSingle( function ( fn ) {
  document.addEventListener( 'pause', () => {
    fn();
  }, false );

  return true;
} );
