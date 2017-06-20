import addLeftZero from './addLeftZero.js';

export default function setCountDown( date, fn1, fn2 ) {
  const nextTime = +date;
  const result = setInterval( () => setRTime( fn1, fn2 ), 1000 );

  function setRTime( fn1, fn2 ) {
    const nowTime = +new Date();
    const diffTime = nextTime - nowTime;
    let value = {
      days: addLeftZero( parseInt( diffTime / 1000 / 60 / 60 / 24, 10 ) ),
      hours: addLeftZero( parseInt( diffTime / 1000 / 60 / 60 % 24, 10 ) ),
      minutes: addLeftZero( parseInt( diffTime / 1000 / 60 % 60, 10 ) ),
      seconds: addLeftZero( parseInt( diffTime / 1000 % 60, 10 ) ),
    };

    if ( diffTime <= 0 ) {
      fn2 && fn2();
      clearInterval( result );
    }

    fn1 && fn1( value, result );
  }

  // 先执行一次
  setRTime( fn1 );

  return result;
}
