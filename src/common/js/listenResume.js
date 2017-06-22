import getSingle from './getSingle.js';

// 监听前台
export default getSingle( function ( fn ) {
  document.addEventListener( 'resume', () => {
    fn();
  }, false );

  return true;
} );
