// import mui from 'mui';
import storage from './localStorage.js';
let audio = null;

// mui.plusReady( function () {
//   audio = window.plus.audio.createPlayer( '/static/audio/alarm.mp3' );
// } );

export default {
  play( fn ) {
    audio = window.plus.audio.createPlayer( `/static/audio/${storage.get( 'audio' )}` );
    audio.play( fn, function ( e ) {
      console.log( `audio error: ${e}` );
    } );
  },
  stop() {
    if ( audio !== null ) {
      audio.stop();
    }
  },
};
