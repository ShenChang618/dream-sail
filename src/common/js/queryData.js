import { database, weekday } from '../../common/js/data.js';
import Database from '../../common/js/indexedDB.js';
import { getMonthDayCount } from '../../common/js/getCalendar.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );

export default function queryData( date ) {
  const tempDate = new Date();
  const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
  const dateData = date ? new Date( date ) : todayDate;
  const dateYear = dateData.getFullYear();
  const dateMonth = dateData.getMonth() + 1;
  const dateDay = dateData.getDate();
  const dateWeekday = weekday[ dateData.getDay() ];
  const rangeList = [
    IDBKeyRange.only( `${dateYear}-${dateMonth}-${dateDay}-*` ),
    IDBKeyRange.only( `*-${dateMonth}-${dateDay}-*` ),
    IDBKeyRange.only( `*-${dateMonth}-*-*` ),
    IDBKeyRange.only( `*-*-${dateDay}-*` ),
    IDBKeyRange.only( `*-*-*-${dateWeekday}` ),
    IDBKeyRange.only( '*-*-*-*' ),
  ];
  const maxMonthDay = getMonthDayCount( date );
  let inputDataList = [];
  let tempRangeList = [];

  // 一月的最后一天把所有的溢出日期输出
  if ( maxMonthDay === dateDay ) {
    // 月份最大 31
    for ( let i = 31; i > maxMonthDay; i-- ) {
      tempRangeList.push( IDBKeyRange.only( `*-${dateMonth}-${i}-*` ) );
      tempRangeList.push( IDBKeyRange.only( `*-*-${i}-*` ) );
    }

    if ( tempRangeList.length > 0 ) {
      Array.prototype.unshift.apply( rangeList, tempRangeList );
    }
  }

  rangeList.forEach( ( item, index ) => {
    const obj = {
      range: item,
      direction: 'prev',
    };

    dbTask.query( 'index', 'execDate', obj, ( data ) => {
      Array.prototype.push.apply( inputDataList, data );
    } );
  } );

  return inputDataList;
}
