import storage from '../../common/js/localStorage.js';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';
import formatDate from '../../common/js/date.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );

export default function resetDatabaseState( inputDataList, flag = false ) {
  const tempDate = new Date();
  const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
  const todayTimeStamp = +todayDate;
  const cacheTime = storage.get( 'cacheTime' );

  if ( cacheTime !== todayTimeStamp ) {
    const yesterday = new Date( cacheTime );
    const yesterdayRange = IDBKeyRange.only( `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}-*` );

    // 重置成今天的日期
    storage.set( 'cacheTime', todayTimeStamp );
    storage.set( 'todayGold', 0 );

    // 重置今天数据的状态
    inputDataList.forEach( ( item, index ) => {
      item.unique = todayTimeStamp;

      // 如果昨天的任务完成，不清零连续日期
      if ( item.state !== 2 ) {
        item.continuityDate = 0;
      }
      item.state = 0;
      item.tempCount = item.execCount;

      dbTask.update( item );
    } );

    // 删除一次性的过期任务，并把已完成的放入数据库
    dbTask.query( 'index', 'execDate', { range: yesterdayRange }, ( data ) => {
      data.forEach( ( item ) => {
        let isExpire = true;

        item.execDate.forEach( ( date ) => {
          const dateTimeStamp = +new Date( date.substr( 0, date.length - 2 ) );

          if ( dateTimeStamp >= todayTimeStamp ) {
            isExpire = false;

            return;
          }
        } );

        if ( isExpire === true ) {
          dbTask.delete( item.id );

          if ( item.state === 2 ) {
            const historyData = {
              type: '任务',
              date: formatDate( yesterday, 'yyyy-MM-dd' ),
              gold: item.dreamGold * item.completedDate,
              value: item.title,
            };

            dbHistory.insert( historyData );

            if ( item.task !== '并没有什么目标哦！' ) {
              const historyTaskData = {
                type: '目标',
                date: formatDate( yesterday, 'yyyy-MM-dd' ),
                gold: null,
                value: item.task,
              };

              dbHistory.insert( historyTaskData );
            }
          }
        }
      } );
    } );

    if ( flag ) {
      return true;
    }
  }

  return inputDataList;
}
