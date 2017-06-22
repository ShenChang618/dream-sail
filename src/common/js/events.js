function touchRight( dom, fn ) {
  let startX = 0;
  let endX = 0;

  dom.addEventListener( 'touchstart', touchstart );
  dom.addEventListener( 'touchmove', touchmove );

  function touchstart( event ) {
    startX = event.changedTouches[0].pageX;
  }
  function touchmove( event ) {
    endX = event.changedTouches[0].pageX;

    const diff = endX - startX;

    if ( diff > 50 ) {
      fn && fn( event );
    }
  }
}

function touchLeft( dom, fn ) {
  let startX = 0;
  let endX = 0;

  dom.addEventListener( 'touchstart', touchstart );
  dom.addEventListener( 'touchmove', touchmove );

  function touchstart( event ) {
    startX = event.changedTouches[0].pageX;
  }
  function touchmove( event ) {
    endX = event.changedTouches[0].pageX;

    const diff = endX - startX;

    if ( diff < -50 ) {
      fn && fn( event );
    }
  }
}

export { touchLeft, touchRight };
