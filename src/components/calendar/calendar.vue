<template>
  <article class="calendar-wrapper"></article>
</template>

<script>
import { mapState } from 'vuex';
import Calendar from '../../common/js/calendarToDOM.js';
import { getMonthDayCount } from '../../common/js/getCalendar.js';
import Database from '../../common/js/indexedDB.js';
import storage from '../../common/js/localStorage.js';
import formatDate from '../../common/js/date.js';
import { database, weekday } from '../../common/js/data.js';
import { touchLeft, touchRight } from '../../common/js/events.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );

let calendar;

function resetDatabaseState( inputDataList ) {
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
  }

  this.$store.commit( 'changeHomeUnfinishedList', inputDataList );
}

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: mapState( {
    homeUnfinishedList: state => state.homeUnfinishedList,
    homeHeader: state => state.homeHeader,
  } ),
  created() {
    const _self = this;

    this.$nextTick( () => {
      calendar = new Calendar( document.querySelector( '.calendar-wrapper' ) );

      // 多次一举的目的是为了在页面切换时刷新时间，不然在隔天时就会出错
      const tempDate = new Date();
      const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
      const today = todayDate;
      const calendarDOM = document.querySelector( '.calendar-wrapper' );
      const btn = document.createElement( 'button' );

      // 今天按钮
      btn.className = 'today-btn normalfont';
      btn.innerHTML = '今';
      btn.addEventListener( 'tap', event => {
        calendar.today();
        setHeaderDate( {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        } );
        this.queryData();
      } );

      // 初始化
      this.queryData();
      setHeaderDate( {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      } );
      calendar.init( null, ( value ) => {
        const text = `${value.year}-${value.month}-${value.day}`;

        toToday( text );
        setHeaderDate( value );
        this.queryData( text );
      } );

      function setHeaderDate( value ) {
        _self.homeHeader.year = value.year;
        _self.homeHeader.month = value.month;
        _self.homeHeader.day = value.day;
      }

      // 向上个月，向下个月
      setTimeout( () => {
        const calendarDOM = document.querySelector( '.calendar-wrapper' );

        touchLeft( calendarDOM, event => calendar.next( queryToday ) );
        touchRight( calendarDOM, event => {
          if ( this.homeHeader.year === today.getFullYear() && today.getMonth() + 1 === this.homeHeader.month ) {
            return;
          }
          calendar.prev( queryToday );
        } );

        function queryToday( result ) {
          const todayDay = today.getDate();
          const maxMonthDay = getMonthDayCount( `${result.year}-${result.month}` );

          _self.homeHeader.year = result.year;
          _self.homeHeader.month = result.month;
          _self.homeHeader.day = todayDay > maxMonthDay ? maxMonthDay : todayDay;

          const text = `${result.year}-${result.month}-${_self.homeHeader.day}`;
          _self.queryData( text );
          toToday( text );
        }
      }, 600 );

      // 显示今天
      function toToday( date ) {
        try {
          calendarDOM.removeChild( calendarDOM.childNodes[ 1 ] );
        } catch ( e ) {}

        if ( +new Date( date ) !== +todayDate ) {
          setTimeout( () => {
            calendarDOM.append( btn );
          }, 200 );
        }
      }
    } );
  },
  methods: {
    queryData( date ) {
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

      // 计数
      let dataCount = 10;
      // 数据重置完毕执行
      const dataResult = setInterval( () => {
        if ( inputDataList.length > 0 && dataCount < 6 || dataCount <= 0 ) {
          clearInterval( dataResult );

          this.$store.commit( 'changeIsHomeToday', false );
          if ( +dateData === +todayDate ) {
            this.$store.commit( 'changeIsHomeToday', true );
          }

          // 重置数据
          resetDatabaseState.call( this, inputDataList );
        }

        dataCount -= 1;
      }, 100 );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.calendar-wrapper {
  position: relative;
  width: 100%;
  height: 240px;

  &::after {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    right: 0;
    left: 0;
    display: block;
    height: 1px;
    content: '';
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
}
</style>
