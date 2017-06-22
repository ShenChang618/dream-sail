import storage from '../../common/js/localStorage.js';

export default function isYesterday() {
  const tempDate = new Date();
  const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
  const todayTimeStamp = +todayDate;
  const cacheTime = storage.get( 'cacheTime' );

  return cacheTime !== todayTimeStamp;
}
